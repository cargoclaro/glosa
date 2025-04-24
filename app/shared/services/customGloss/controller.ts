'use server';

import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import { Langfuse } from 'langfuse';
import { api } from 'lib/trpc';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { UploadedFileData } from 'uploadthing/types';
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
import { type Classification, classifyDocuments } from './classification/classification';
import { extractTextFromPDFs } from './data-extraction';
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

interface IRead {
  id?: string;
  userId?: string;
  recent?: boolean;
}

/**
 * Reads CustomGloss data based on provided parameters
 */
async function read({ id, userId, recent }: IRead) {
  if (id && userId) {
    return await db.query.CustomGloss.findFirst({
      where: (gloss, { eq, and }) =>
        and(eq(gloss.id, id), eq(gloss.userId, userId)),
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
  }

  if (userId && recent) {
    return await db.query.CustomGloss.findMany({
      where: (gloss, { eq }) => eq(gloss.userId, userId),
      orderBy: (gloss, { desc }) => [desc(gloss.createdAt)],
      limit: 3,
    });
  }

  if (userId) {
    return await db.query.CustomGloss.findMany({
      where: (gloss, { eq }) => eq(gloss.userId, userId),
    });
  }

  throw new Error('Should never happen');
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
    try {
      const trace = langfuse.trace({
        name: 'Glosa de Pedimento',
      });
      const successfulUploads = await uploadFiles(files);
      langfuse.event({
        traceId: trace.id,
        name: 'Classification',
      });
      const classificationResults = await classifyDocuments(
        successfulUploads,
        trace.id
      );

      // Transform classification results to include documentType
      const classifications = classificationResults.map((file) => {
        return {
          ...file,
          documentType: mapClassificationToDocumentType(file.classification),
        };
      });

      // Check for unsupported document types
      const multipleDocuments = classificationResults.filter(
        (doc) => doc.classification === 'Archivo con múltiples documentos (iguales o distintos)'
      );
      
      if (multipleDocuments.length > 0) {
        return {
          success: false,
          message: 'Encontramos varios documentos en un solo archivo. No soportamos este tipo de archivos.',
        };
      }
      
      const otrosDocuments = classifications.filter(
        (doc) => doc.documentType === 'otros'
      );
      
      if (otrosDocuments.length > 0) {
        return {
          success: false,
          message: 'Se detectaron documentos no clasificables o no soportados para la glosa electrónica.',
        };
      }

      // Now group the classifications by document type, taking only the first file of each type.
      const groupedClassifications = classifications.reduce(
        (acc, curr) => {
          // Only set the value if it doesn't exist yet (keeping the first file of each type)
          if (!acc[curr.documentType]) {
            acc[curr.documentType] = curr;
          }
          return acc;
        },
        {} as Partial<
          Record<
            DocumentType,
            UploadedFileData & {
              originalFile: File;
              documentType: DocumentType;
            }
          >
        >
      );

      const { pedimento: classifiedPedimento, cove: classifiedCove } = groupedClassifications;
      if (!classifiedPedimento) {
        return {
          success: false,
          message: 'El pedimento es obligatorio para realizar la glosa electrónica.',
        };
      }
      if (!classifiedCove) {
        return {
          success: false,
          message: 'El cove es obligatorio para realizar la glosa electrónica.',
        };
      }

      const documents = await extractTextFromPDFs(
        groupedClassifications,
        trace.id
      );
      const { pedimento, cove } = documents;
      if (!pedimento || !cove) {
        throw new Error(
          'Should never happen'
        );
      }
      const operationType = pedimento.encabezado_del_pedimento?.tipo_oper;
      const importerName = pedimento.datos_importador?.razon_social;
      langfuse.event({
        traceId: trace.id,
        name: 'Validation Steps',
      });
      const gloss = await (operationType === 'IMP'
        ? glosaImpo({ ...documents, traceId: trace.id })
        : glosaExpo({ ...documents, traceId: trace.id }));

      // Remove null bytes from objects before inserting into the database
      function removeNullBytes<T>(obj: T): T {
        const str = JSON.stringify(obj);
        const cleaned = str.split('\u0000').join('');
        return JSON.parse(cleaned) as T;
      }
      const sanitizedCove = removeNullBytes(cove);
      const sanitizedPedimento = removeNullBytes(pedimento);

      const [newCustomGloss] = await db
        .insert(CustomGloss)
        .values({
          userId,
          summary: '',
          timeSaved: 20,
          moneySaved: 1000,
          importerName:
            importerName ?? 'No se encontro la razon social del importador',
          cove: sanitizedCove,
          pedimento: sanitizedPedimento,
        })
        .returning();

      if (!newCustomGloss) {
        throw new Error('Failed to create CustomGloss record');
      }

      // Batch insert files
      await db.insert(CustomGlossFile).values(
        classificationResults.map(({ name, ufsUrl, classification }) => ({
          name,
          url: ufsUrl,
          documentType: mapClassificationToDocumentType(classification),
          customGlossId: newCustomGloss.id,
        }))
      );

      await Promise.all(gloss.map(async ({ sectionName, validations }) => {
        const data = {
          name: sectionName,
          isCorrect: validations.every(({ validation: { isValid } }) => isValid),
          fullContext: true,
          isVerified: false,
          customGlossId: newCustomGloss.id,
        };
        const [insertedTab] = await db.insert(CustomGlossTab).values(data).returning();
        if (!insertedTab) {
          throw new Error('Failed to create CustomGlossTab record');
        }
        await Promise.all(validations.map(async ({ contexts, validation }) => {
          const [insertedValidationStep] = await db
            .insert(CustomGlossTabValidationStep)
            .values({
              name: validation.name,
              description: validation.description,
              llmAnalysis: validation.llmAnalysis,
              isCorrect: validation.isValid,
              customGlossTabId: insertedTab.id
            })
            .returning();
          if (!insertedValidationStep) {
            throw new Error('Failed to create CustomGlossTabValidationStep record');
          }
          await Promise.all([
            ...validation.actionsToTake.map(action =>
              db.insert(CustomGlossTabValidationStepActionToTake).values({
                description: action,
                customGlossTabValidationStepId: insertedValidationStep.id
              })
            ),
            ...Object.entries(contexts).flatMap(([contextType, origins]) =>
              Object.entries(origins).map(async ([origin, contextValue]) => {
                const [insertedContext] = await db.insert(CustomGlossTabContext).values({
                  type: contextType as CustomGlossTabContextTypes,
                  origin,
                  customGlossTabId: insertedTab.id,
                  url: "#"
                }).returning();
                if (!insertedContext) {
                  throw new Error('Failed to create CustomGlossTabContext record');
                }
                await Promise.all(contextValue.data.map(({ name, value }) =>
                  db.insert(CustomGlossTabContextData).values({
                    name,
                    value: value === undefined ? 'N/A' : JSON.stringify(value),
                    customGlossTabContextId: insertedContext.id
                  })
                ));
              })
            )
          ]);
        }));
      }));

      return {
        success: true,
        glossId: newCustomGloss.id,
      };
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Should be reported to Sentry
      console.error(error);
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
    const customGloss = await read({ id: customGlossId, userId });

    if (!customGloss) {
      throw new Error('Gloss not found');
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
