'use server';

import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import { Langfuse } from 'langfuse';
import { api } from 'lib/trpc';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createExpedienteWithoutData } from './classification/create-expediente-without-data';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { db } from '~/db';
import type { CustomGlossTabContextTypes } from '~/db/schema';
import {
  CustomGloss,
  CustomGlossFile,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStep,
  CustomGlossTabValidationStepActionToTake,
} from '~/db/schema';
import {
  type Classification,
  classifyDocuments,
} from './classification/classification';
import { extractAndStructure } from './extract-and-structure';
import { glosaExpo } from './glosa/expo';
import { glosaImpo } from './glosa/impo';
import { uploadFiles } from './upload-files';
import type { DocumentType } from './utils';

config();

const langfuse = new Langfuse();

/**
 * Maps Classification types to DocumentType
 */
function mapClassificationToDocumentType(
  classification: Classification
): DocumentType {
  switch (classification) {
    case 'Pedimento':
      return 'pedimento';
    case 'Bill of Lading':
    case 'Air Waybill':
      return 'documentoDeTransporte';
    case 'Factura':
      return 'factura';
    case 'Carta Regla 3.1.8':
      return 'carta318';
    case 'Cove':
      return 'cove';
    case 'Packing List':
      return 'listaDeEmpaque';
    case 'CFDI':
      return 'cfdi';
    default:
      return 'otros';
  }
}

/**
 * Updates a tab with the provided data
 */
async function updateTabWithCustomGlossId({
  id,
  data,
  customGlossId,
}: {
  id: string;
  customGlossId: string;
  data: Partial<typeof CustomGlossTab.$inferInsert>;
}) {
  return await db
    .update(CustomGlossTab)
    .set(data)
    .where(
      and(
        eq(CustomGlossTab.id, id),
        eq(CustomGlossTab.customGlossId, customGlossId)
      )
    )
    .returning();
}

export const analysis = api
  .input(
    zfd.formData({
      files: z.array(z.instanceof(File)),
    })
  )
  .mutation(async ({ input: { files }, ctx: { userId } }) => {
    const trace = langfuse.trace({
      name: 'Glosa de Pedimento',
    });
    try {
      langfuse.event({
        traceId: trace.id,
        name: 'Classification',
      });
      const classifications = await classifyDocuments(
        files,
        trace.id
      );
      const expedienteWithoutDataResult = await createExpedienteWithoutData(classifications);
      if (expedienteWithoutDataResult.isErr()) {
        const { error } = expedienteWithoutDataResult;
        return {
          success: false,
          message: error,
        };
      }
      const { value: expedienteWithoutData } = expedienteWithoutDataResult;

      langfuse.event({
        traceId: trace.id,
        name: 'Extract and Structure',
      });
      const expediente = await extractAndStructure(
        expedienteWithoutData,
        trace.id
      );

      langfuse.event({
        traceId: trace.id,
        name: 'Validation Steps',
      });
      const operationType =
        pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
      const importerName =
        pedimento.encabezadoPrincipalDelPedimento.datosImportador.razonSocial;
      const gloss = await (operationType === 'IMP'
        ? glosaImpo({ ...documents.value, traceId: trace.id })
        : glosaExpo({ ...documents.value, traceId: trace.id }));
      
      const uploadedFiles = await uploadFiles(files);
      if (uploadedFiles.isErr()) {
        return {
          success: false,
          message: uploadedFiles.error,
        };
      }

      const [newCustomGloss] = await db
        .insert(CustomGloss)
        .values({
          userId,
          summary: '',
          timeSaved: 20,
          moneySaved: 1000,
          importerName:
            importerName ?? 'No se encontro la razon social del importador',
          cove,
          pedimento,
        })
        .returning();
      if (!newCustomGloss) {
        throw new Error('Should never happen');
      }

      // Batch insert files
      await db.insert(CustomGlossFile).values(
        classifications.map((result) => {
          const classification = typeof result.classification === 'string' 
            ? result.classification 
            : result.classification[0]?.classification || 'Otro';
          
          return {
            name: result.file.name,
            url: result.file.name, // Replace with actual URL from upload
            documentType: mapClassificationToDocumentType(classification),
            customGlossId: newCustomGloss.id,
          };
        })
      );

      await Promise.all(
        gloss.map(async ({ sectionName, validations }) => {
          const data = {
            name: sectionName,
            isCorrect: validations.every(
              ({ validation: { isValid } }) => isValid
            ),
            fullContext: true,
            isVerified: false,
            customGlossId: newCustomGloss.id,
          };
          const [insertedTab] = await db
            .insert(CustomGlossTab)
            .values(data)
            .returning();
          if (!insertedTab) {
            throw new Error('Should never happen');
          }
          await Promise.all(
            validations.map(async ({ contexts, validation }) => {
              // Remove null bytes from objects before inserting into the database
              function removeNullBytes<T>(obj: T): T {
                const json = JSON.stringify(obj);
                const cleaned = json.replace(/\\u0000/g, '');
                return JSON.parse(cleaned) as T;
              }
              const cleanedValidation = removeNullBytes(validation);
              const cleanedTabId = removeNullBytes(insertedTab.id);
              const [insertedValidationStep] = await db
                .insert(CustomGlossTabValidationStep)
                .values({
                  name: cleanedValidation.name,
                  description: cleanedValidation.description,
                  llmAnalysis: cleanedValidation.llmAnalysis,
                  isCorrect: cleanedValidation.isValid,
                  customGlossTabId: cleanedTabId,
                })
                .returning();
              if (!insertedValidationStep) {
                throw new Error('Should never happen');
              }
              await Promise.all([
                ...cleanedValidation.actionsToTake.map((action) =>
                  db.insert(CustomGlossTabValidationStepActionToTake).values({
                    description: action,
                    customGlossTabValidationStepId: insertedValidationStep.id,
                  })
                ),
                ...Object.entries(contexts).flatMap(([contextType, origins]) =>
                  Object.entries(origins).map(
                    async ([origin, contextValue]) => {
                      const [insertedContext] = await db
                        .insert(CustomGlossTabContext)
                        .values({
                          type: contextType as CustomGlossTabContextTypes,
                          origin,
                          customGlossTabId: insertedTab.id,
                          url: '#',
                        })
                        .returning();
                      if (!insertedContext) {
                        throw new Error('Should never happen');
                      }
                      await Promise.all(
                        contextValue.data.map(({ name, value }) =>
                          db.insert(CustomGlossTabContextData).values({
                            name,
                            value:
                              value === undefined
                                ? 'N/A'
                                : JSON.stringify(value),
                            customGlossTabContextId: insertedContext.id,
                          })
                        )
                      );
                    }
                  )
                ),
              ]);
            })
          );
        })
      );

      return {
        success: true,
        glossId: newCustomGloss.id,
      };
    } catch {
      return {
        success: false,
        message: 'Ocurrió un error interno',
      };
    }
  });

export const markTabAsVerifiedByTabIdNCustomGlossID = api
  .input(
    z.object({
      tabId: z.string(),
      customGlossId: z.string(),
    })
  )
  .mutation(async ({ input: { tabId, customGlossId }, ctx: { userId } }) => {
    const customGloss = await db.query.CustomGloss.findFirst({
      where: (gloss, { eq, and }) =>
        and(eq(gloss.id, customGlossId), eq(gloss.userId, userId)),
      with: {
        files: true,
        alerts: true,
        tabs: {
          with: {
            context: {
              with: {
                data: true,
              },
            },
            validations: {
              with: {
                resources: true,
                actionsToTake: true,
              },
            },
          },
        },
      },
    });

    if (!customGloss) {
      throw new Error('Should never happen');
    }

    await updateTabWithCustomGlossId({
      id: tabId,
      customGlossId,
      data: {
        isVerified: true,
      },
    });

    // We keep these outside the try-catch to maintain original behavior
    revalidatePath(`/gloss/${customGlossId}/analysis`);
    redirect(`/gloss/${customGlossId}/analysis`);
  });
