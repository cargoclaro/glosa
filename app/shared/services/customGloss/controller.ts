'use server';

import { randomUUID } from 'node:crypto';
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
import { classifyDocuments } from './classification';
import type { DocumentType } from './classification';
import { extractTextFromPDFs } from './data-extraction';
import { glosaExpo } from './glosa/expo';
import { glosaImpo } from './glosa/impo';
import { uploadFiles } from './upload-files';

config();

const langfuse = new Langfuse();

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
      // Generate a trace ID for Langfuse tracking
      const parentTraceId = randomUUID();
      langfuse.trace({
        id: parentTraceId,
        name: 'Glosa de Pedimento',
      });
      const successfulUploads = await uploadFiles(files);
      const classifications = await classifyDocuments(
        successfulUploads,
        parentTraceId
      );
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

      const documents = await extractTextFromPDFs(
        groupedClassifications,
        parentTraceId
      );
      const { pedimento, cove } = documents;
      if (!pedimento || !cove) {
        throw new Error(
          'El pedimento y el cove son obligatorios para realizar la glosa electrónica.'
        );
      }
      const operationType = pedimento.encabezado_del_pedimento?.tipo_oper;
      const importerName = pedimento.datos_importador?.razon_social;
      langfuse.event({
        traceId: parentTraceId,
        name: 'Validation Steps',
      });
      let gloss = null;
      if (operationType === 'IMP') {
        gloss = await glosaImpo({ ...documents, traceId: parentTraceId });
      } else {
        gloss = await glosaExpo({ ...documents, traceId: parentTraceId });
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
          cove: cove,
          pedimento: pedimento,
        })
        .returning();

      if (!newCustomGloss) {
        throw new Error('Failed to create CustomGloss record');
      }

      // Batch insert files
      await db.insert(CustomGlossFile).values(
        classifications.map(({ name, ufsUrl, documentType }) => ({
          name,
          url: ufsUrl,
          documentType,
          customGlossId: newCustomGloss.id,
        }))
      );

      for (const { sectionName, validations } of gloss) {
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
          throw new Error('Failed to create CustomGlossTab record');
        }

        for (const { contexts, validation } of validations) {
          const [insertedValidationStep] = await db
            .insert(CustomGlossTabValidationStep)
            .values({
              name: validation.name,
              description: validation.description,
              llmAnalysis: validation.llmAnalysis,
              isCorrect: validation.isValid,
              customGlossTabId: insertedTab.id,
            })
            .returning();

          if (!insertedValidationStep) {
            throw new Error(
              'Failed to create CustomGlossTabValidationStep record'
            );
          }

          for (const action of validation.actionsToTake) {
            await db.insert(CustomGlossTabValidationStepActionToTake).values({
              description: action,
              customGlossTabValidationStepId: insertedValidationStep.id,
            });
          }

          // Process each context type
          for (const [contextType, origins] of Object.entries(contexts)) {
            // Process each origin
            for (const [origin, contextValue] of Object.entries(origins)) {
              const [insertedContext] = await db
                .insert(CustomGlossTabContext)
                .values({
                  type: contextType as CustomGlossTabContextTypes,
                  origin,
                  customGlossTabId: insertedTab.id,
                })
                .returning();

              if (!insertedContext) {
                throw new Error(
                  'Failed to create CustomGlossTabContext record'
                );
              }

              // Create context data records
              for (const { name, value } of contextValue.data) {
                await db.insert(CustomGlossTabContextData).values({
                  name,
                  value: value === undefined ? 'N/A' : JSON.stringify(value),
                  customGlossTabContextId: insertedContext.id,
                });
              }
            }
          }
        }
      }

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
