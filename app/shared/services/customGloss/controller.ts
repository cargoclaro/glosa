'use server';

import { randomUUID } from 'node:crypto';
import { db } from '~/db';
import type { CustomGlossTabContextTypes } from '~/db/schema';
import { config } from 'dotenv';
import { Langfuse } from 'langfuse';
import { traceable } from 'langsmith/traceable';
import { api } from 'lib/trpc';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { UploadedFileData } from 'uploadthing/types';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { classifyDocuments } from './classification';
import type { DocumentType } from './classification';
import { extractTextFromPDFs } from './data-extraction';
import { glosaExpo } from './glosa/expo';
import { glosaImpo } from './glosa/impo';
import { uploadFiles } from './upload-files';
import { and, eq } from 'drizzle-orm';
import { 
  CustomGloss, 
  CustomGlossTab, 
  CustomGlossFile, 
  CustomGlossTabContext, 
  CustomGlossTabContextData, 
  CustomGlossTabValidationStep, 
  CustomGlossTabValidationStepActionToTake 
} from '~/db/schema';

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
      where: (gloss, { eq, and }) => and(eq(gloss.id, id), eq(gloss.userId, userId)),
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
      orderBy: (gloss, { desc }) => [desc(gloss.updatedAt)],
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

const runGlosa = traceable(
  async (
    classifications: Partial<
      Record<
        DocumentType,
        UploadedFileData & { originalFile: File; documentType: DocumentType }
      >
    >,
    traceId: string
  ) => {
    const documents = await extractTextFromPDFs(classifications, traceId);
    const { pedimento, cove } = documents;
    if (!pedimento || !cove) {
      throw new Error(
        'El pedimento y el cove son obligatorios para realizar la glosa electrónica.'
      );
    }
    const operationType = pedimento.encabezado_del_pedimento?.tipo_oper;
    langfuse.event({
      traceId,
      name: 'Validation Steps',
    });
    if (operationType === 'IMP') {
      return {
        gloss: await glosaImpo({ ...documents, traceId }),
        importerName: pedimento.datos_importador?.razon_social,
      };
    }
    if (operationType === 'EXP') {
      return {
        gloss: await glosaExpo({ ...documents, traceId }),
        importerName: pedimento.datos_importador?.razon_social,
      };
    }
    throw new Error(`El tipo de operación ${operationType} no es válido.`);
  },
  {
    name: 'runGlosa',
    project_name: 'glosa',
  }
);

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

      // Only use this for testing the migration from the python backend
      const { gloss, importerName } = await runGlosa(
        groupedClassifications,
        parentTraceId
      );

      // Create CustomGloss record
      const customGlossId = randomUUID();
      const now = new Date();
      const newCustomGlossArray = await db.insert(CustomGloss).values({
        id: customGlossId,
        userId,
        summary: 'No se donde sale esto',
        timeSaved: 20,
        moneySaved: 1000,
        importerName: importerName ?? 'No se encontro la razon social del importador',
        updatedAt: now,
      }).returning();
      
      const newCustomGloss = newCustomGlossArray[0];
      if (!newCustomGloss) {
        throw new Error('Failed to create CustomGloss record');
      }
      
      // Batch insert files
      await db.insert(CustomGlossFile).values(
        classifications.map(({ name, ufsUrl, documentType }) => ({
          name,
          url: ufsUrl,
          documentType,
          customGlossId,
          updatedAt: now,
        }))
      );
      
      // Create tabs with their IDs for later reference
      const tabsToInsert = gloss.map(({ sectionName, validations }) => {
        const tabId = randomUUID();
        return {
          id: tabId,
          name: sectionName,
          isCorrect: validations.every(({ validation: { isValid } }) => isValid),
          fullContext: true,
          isVerified: false,
          customGlossId,
          updatedAt: now,
          // Store additional data for context/validation creation
          _validations: validations,
        };
      });
      
      // Extract just the tab data for insertion (remove _validations)
      const tabInsertData = tabsToInsert.map(({ _validations, ...tabData }) => tabData);
      await db.insert(CustomGlossTab).values(tabInsertData);
      
      // Process contexts and their data in batches
      type ContextToInsert = {
        type: CustomGlossTabContextTypes;
        origin: string;
        customGlossTabId: string;
        updatedAt: Date;
      };
      
      type ContextDataToInsert = {
        name: string;
        value: string;
        customGlossTabContextId: number;
        updatedAt: Date;
      };
      
      const contextsToInsert: ContextToInsert[] = [];
      const contextDataToInsert: ContextDataToInsert[] = [];
      
      // Use for...of instead of forEach for better performance
      for (const tab of tabsToInsert) {
        for (const { contexts } of tab._validations) {
          // Process each context type
          for (const [contextType, origins] of Object.entries(contexts)) {
            // Process each origin
            for (const [origin, contextValue] of Object.entries(origins)) {
              const contextId = contextsToInsert.length + 1; // Simple incrementing ID for reference
              
              // Create context record
              contextsToInsert.push({
                type: contextType as CustomGlossTabContextTypes,
                origin,
                customGlossTabId: tab.id,
                updatedAt: now,
              });
              
              // Create context data records
              for (const { name, value } of contextValue.data) {
                contextDataToInsert.push({
                  name,
                  value: value === undefined ? 'N/A' : JSON.stringify(value),
                  customGlossTabContextId: contextId,
                  updatedAt: now,
                });
              }
            }
          }
        }
      }
      
      // Insert all contexts
      if (contextsToInsert.length > 0) {
        const insertedContexts = await db
          .insert(CustomGlossTabContext)
          .values(contextsToInsert)
          .returning({ id: CustomGlossTabContext.id });
        
        // Update context data with actual context IDs
        const contextDataWithCorrectIds = contextDataToInsert.map((data, index) => {
          const contextIndex = Math.floor(
            index / (contextDataToInsert.length / contextsToInsert.length)
          );
          const contextId = insertedContexts[contextIndex]?.id;
          
          if (contextId === undefined) {
            throw new Error('Failed to retrieve context ID');
          }
          
          return {
            ...data,
            customGlossTabContextId: contextId,
          };
        });
        
        // Insert all context data
        if (contextDataWithCorrectIds.length > 0) {
          await db.insert(CustomGlossTabContextData).values(contextDataWithCorrectIds);
        }
      }
      
      // Process validation steps and their actions
      type ValidationStepToInsert = {
        name?: string;
        description?: string;
        llmAnalysis?: string;
        isCorrect?: boolean;
        customGlossTabId: string;
        updatedAt: Date;
      };
      
      type ActionToInsert = {
        description: string;
        customGlossTabValidationStepId: number;
        updatedAt: Date;
      };
      
      const validationStepsToInsert: ValidationStepToInsert[] = [];
      const actionsToInsert: ActionToInsert[] = [];
      
      // Use for...of instead of forEach for better performance
      for (const tab of tabsToInsert) {
        for (const { validation } of tab._validations) {
          const validationId = validationStepsToInsert.length + 1; // Simple incrementing ID for reference
          
          // Create validation step record
          validationStepsToInsert.push({
            name: validation.name,
            description: validation.description,
            llmAnalysis: validation.llmAnalysis,
            isCorrect: validation.isValid,
            customGlossTabId: tab.id,
            updatedAt: now,
          });
          
          // Create action to take records
          for (const action of validation.actionsToTake) {
            actionsToInsert.push({
              description: action,
              customGlossTabValidationStepId: validationId,
              updatedAt: now,
            });
          }
        }
      }
      
      // Insert all validation steps
      if (validationStepsToInsert.length > 0) {
        const insertedValidations = await db
          .insert(CustomGlossTabValidationStep)
          .values(validationStepsToInsert)
          .returning({ id: CustomGlossTabValidationStep.id });
        
        // Update actions with actual validation step IDs
        const actionsWithCorrectIds = actionsToInsert.map((action, index) => {
          const validationIndex = Math.floor(
            index / (actionsToInsert.length / validationStepsToInsert.length)
          );
          const validationId = insertedValidations[validationIndex]?.id;
          
          if (validationId === undefined) {
            throw new Error('Failed to retrieve validation step ID');
          }
          
          return {
            ...action,
            customGlossTabValidationStepId: validationId,
          };
        });
        
        // Insert all actions
        if (actionsWithCorrectIds.length > 0) {
          await db.insert(CustomGlossTabValidationStepActionToTake).values(actionsWithCorrectIds);
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
