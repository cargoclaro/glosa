'use server';

import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import { Langfuse } from 'langfuse';
import { api } from 'lib/trpc';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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
import { classifyDocuments } from './classification/classification';
import { createExpedienteWithoutData } from './classification/create-expediente-without-data';
import { extractAndStructure } from './extract-and-structure';
import { glosaExpo } from './glosa/expo';
import { glosaImpo } from './glosa/impo';
import { uploadFiles } from './upload-files';

config();

const langfuse = new Langfuse();

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
      const classifications = await classifyDocuments(files, trace.id);
      const expedienteWithoutDataResult =
        await createExpedienteWithoutData(classifications);
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
      const operationType =
        expediente.pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
      if (operationType === 'TRA') {
        return {
          success: false,
          message: 'El tipo de operación "Transito" no es soportado',
        };
      }
      if (operationType === null) {
        return {
          success: false,
          message: 'Pedimentos complementarios no son soportados',
        };
      }

      langfuse.event({
        traceId: trace.id,
        name: 'Validation Steps',
      });
      const gloss = await (operationType === 'IMP'
        ? glosaImpo({ ...expediente, traceId: trace.id })
        : glosaExpo({ ...expediente, traceId: trace.id }));

      const uploadedFilesResult = await uploadFiles(expedienteWithoutData);
      if (uploadedFilesResult.isErr()) {
        return {
          success: false,
          message: uploadedFilesResult.error,
        };
      }
      const uploadedFiles = uploadedFilesResult.value;

      const importerName =
        expediente.pedimento.encabezadoPrincipalDelPedimento.datosImportador
          .razonSocial;
      const [newCustomGloss] = await db
        .insert(CustomGloss)
        .values({
          userId,
          summary: '',
          timeSaved: 20,
          moneySaved: 1000,
          importerName,
          cove: expediente.cove, // Ahora guardamos todos los COVEs
          pedimento: expediente.pedimento,
        })
        .returning();
      if (!newCustomGloss) {
        throw new Error('Should never happen');
      }

      // Batch insert files
      await db.insert(CustomGlossFile).values(
        uploadedFiles.map((uploadedFile) => {
          return {
            name: uploadedFile.name,
            url: uploadedFile.ufsUrl,
            documentType: uploadedFile.classification,
            customGlossId: newCustomGloss.id,
          };
        })
      );

      await Promise.all(
        gloss.map(async ({ sectionName, validations }) => {
          const data = {
            name: sectionName,
            isCorrect: validations.every(
              (validationResult: any) => {
                if (!validationResult?.validation) {
                  console.error(`❌ ERROR: validationResult.validation is undefined for section ${sectionName}`, validationResult);
                  return false; // Default to false if validation is missing
                }
                if (validationResult.validation.isValid === undefined) {
                  console.error(`❌ ERROR: isValid is undefined for section ${sectionName}`, validationResult.validation);
                  return false; // Default to false if isValid is missing
                }
                return validationResult.validation.isValid;
              }
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
            validations.map(async (validationResult: any) => {
              const { contexts, validation } = validationResult;
              // Remove null bytes from objects before inserting into the database
              function removeNullBytes<T>(obj: T): T {
                if (!obj) return obj;
                const json = JSON.stringify(obj);
                if (!json) return obj;
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
                ...cleanedValidation.actionsToTake.map((action: string) =>
                  db.insert(CustomGlossTabValidationStepActionToTake).values({
                    description: action,
                    customGlossTabValidationStepId: insertedValidationStep.id,
                  })
                ),
                ...Object.entries(contexts as Record<string, any>).flatMap(([contextType, origins]) =>
                  Object.entries(origins as Record<string, any>).map(
                    async ([origin, contextValue]: [string, any]) => {
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
                        contextValue.data.map(({ name, value }: { name: string; value: any }) =>
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
    } catch (error) {
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
