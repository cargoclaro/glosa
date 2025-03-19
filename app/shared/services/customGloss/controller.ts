'use server';

import { randomUUID } from 'node:crypto';
import prisma from '@/shared/services/prisma';
import type { CustomGlossTabContextType } from '@prisma/client';
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
  const globalInclude = {
    files: true,
    alerts: true,
    tabs: {
      include: {
        context: {
          include: {
            data: true,
          },
        },
        validations: {
          include: {
            resources: true,
            actionsToTake: true,
          },
        },
      },
    },
  };

  if (id && userId) {
    return await prisma.customGloss.findUnique({
      where: { id, userId },
      include: globalInclude,
    });
  }

  if (userId && recent) {
    return await prisma.customGloss.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }

  if (userId) {
    return await prisma.customGloss.findMany({
      where: { userId },
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
  data: (typeof prisma.customGlossTab.update)['arguments']['data'];
}) {
  return await prisma.customGlossTab.update({
    where: { id, customGlossId },
    data,
  });
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
      const newCustomGloss = await prisma.customGloss.create({
        data: {
          userId,
          summary: 'No se donde sale esto',
          timeSaved: 20,
          moneySaved: 1000,
          importerName:
            importerName ?? 'No se encontro la razon social del importador',
          tabs: {
            create: gloss.map(({ sectionName, validations }) => ({
              name: sectionName,
              isCorrect: validations.every(
                ({ validation: { isValid } }) => isValid
              ),
              fullContext: true,
              context: {
                create: validations.flatMap(({ contexts }) =>
                  // "contexts" is an object keyed by context type:
                  Object.entries(contexts).flatMap(([contextType, origins]) =>
                    // "origins" is an object keyed by origin string:
                    Object.entries(origins).map(([origin, contextValue]) => ({
                      type: contextType as CustomGlossTabContextType, // TODO: This is a hack to make the type checker happy
                      origin,
                      data: {
                        create: contextValue.data.map(({ name, value }) => ({
                          name,
                          value:
                            value === undefined ? 'N/A' : JSON.stringify(value),
                        })),
                      },
                    }))
                  )
                ),
              },
              validations: {
                create: validations.map(
                  ({
                    validation: {
                      name,
                      description,
                      llmAnalysis,
                      isValid,
                      actionsToTake,
                    },
                  }) => ({
                    name,
                    description,
                    llmAnalysis,
                    isCorrect: isValid,
                    actionsToTake: {
                      create: actionsToTake.map((action) => ({
                        description: action,
                      })),
                    },
                  })
                ),
              },
            })),
          },
          files: {
            create: classifications.map(({ name, ufsUrl, documentType }) => ({
              name,
              url: ufsUrl,
              documentType,
            })),
          },
        },
      });
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
    try {
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
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Ocurrió un error interno',
      };
    }
  });
