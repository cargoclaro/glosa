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
  RiskAnalysis,
} from '~/db/schema';
import { classifyDocuments } from './classification/classification';
import { createExpedienteWithoutData } from './classification/create-expediente-without-data';
import { extractAndStructure } from './extract-and-structure';
import { glosaExpo } from './glosa/expo';
import { glosaImpo } from './glosa/impo';
import { uploadFiles } from './upload-files';
import { runRiskAnalysis } from './risk';

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
      console.log('[analysis] INICIO');
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
      console.log('[analysis] Clasificación terminada');
      console.log('[analysis] Expediente sin datos:', expedienteWithoutData);

      langfuse.event({
        traceId: trace.id,
        name: 'Extract and Structure',
      });
      const expediente = await extractAndStructure(
        expedienteWithoutData,
        trace.id
      );
      console.log('[analysis] Expediente estructurado:', expediente);
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
      console.log('[analysis] Archivos subidos:', uploadedFiles);

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
      console.log('[analysis] CustomGloss insertado:', newCustomGloss?.id);

      // Run risk analysis and persist
      const riskResults = runRiskAnalysis(expediente.pedimento);
      console.log('[analysis] Riesgos analizados:', riskResults);
      if (riskResults.length > 0) {
        await db.insert(RiskAnalysis).values(
          riskResults.map((r) => ({
            riskName: r.riskName,
            level: r.level,
            description: r.description,
            customGlossId: newCustomGloss.id,
          }))
        );
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
      console.log('[analysis] Archivos guardados en DB');

      await Promise.all(
        gloss.map(async ({ sectionName, validations }) => {
          const data = {
            name: sectionName,
            isCorrect: validations.every((validationResult: any) => {
              if (!validationResult?.result) {
                console.error(
                  `ERROR: validationResult.result is undefined for section ${sectionName}`,
                  validationResult
                );
                return false;
              }
              if (validationResult.result.isValid === undefined) {
                console.error(
                  `ERROR: isValid is undefined for section ${sectionName}`,
                  validationResult.result
                );
                return false;
              }
              return validationResult.result.isValid;
            }),
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
              const { name, description, result, contexts } = validationResult;
              // Remove null bytes from objects before inserting into the database
              function removeNullBytes<T>(obj: T): T {
                if (!obj) return obj;
                const json = JSON.stringify(obj);
                if (!json) return obj;
                const cleaned = json.replace(/\\u0000/g, '');
                return JSON.parse(cleaned) as T;
              }
              const cleanedResult = removeNullBytes(result);
              const cleanedName = removeNullBytes(name);
              const cleanedDescription = removeNullBytes(description);
              const cleanedTabId = removeNullBytes(insertedTab.id);

              const [insertedValidationStep] = await db
                .insert(CustomGlossTabValidationStep)
                .values({
                  name: cleanedName,
                  description: cleanedDescription,
                  llmAnalysis: cleanedResult.description, // Mapped from llmAnalysis in glosar
                  isCorrect: cleanedResult.isValid,
                  customGlossTabId: cleanedTabId,
                })
                .returning();
              if (!insertedValidationStep) {
                throw new Error('Should never happen');
              }
              await Promise.all([
                ...cleanedResult.actionsToTake.map((action: string) =>
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
      console.log('[analysis] Tabs y validaciones insertadas');

      return {
        success: true,
        glossId: newCustomGloss.id,
      };
    } catch (error) {
      console.error('[analysis] ERROR:', error);
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

export const previewClassification = api
  .input(
    zfd.formData({
      files: z.array(z.instanceof(File)),
    })
  )
  .mutation(async ({ input: { files } }) => {
    const trace = langfuse.trace({
      name: 'Glosa – Preview Classification',
    });

    try {
      console.log('[previewClassification] INICIO');
      const classificationResults = await classifyDocuments(files, trace.id);

      // Helper: flatten all classification strings
      const present = new Set<string>();
      for (const result of classificationResults) {
        if (typeof result.classification === 'string') {
          present.add(result.classification);
        } else if (Array.isArray(result.classification)) {
          result.classification.forEach((c) => present.add(c.classification));
        }
      }
      console.log('[previewClassification] Clasificación terminada:', Array.from(present));

      type DocStatus = 'present' | 'missing';
      const getStatus = (name: string): DocStatus =>
        present.has(name) ? 'present' : 'missing';

      const documents = [
        {
          name: 'Pedimento',
          status: getStatus('Pedimento'),
          required: true,
        },
        {
          name: 'Factura',
          status: getStatus('Factura'),
          required: true,
        },
        {
          name: 'Cove',
          status: getStatus('Cove'),
          required: true,
        },
        {
          name: 'Bill of Lading / Air Waybill',
          status:
            present.has('Bill of Lading') || present.has('Air Waybill')
              ? 'present'
              : 'missing',
          required: true,
        },
        {
          name: 'Carta Regla 3.1.8',
          status: getStatus('Carta Regla 3.1.8'),
          required: false,
        },
        {
          name: 'Manifiesto de Valor',
          status: getStatus('Manifiesto de Valor'),
          required: false,
        },
        {
          name: 'Carta de Instrucciones',
          status: getStatus('Carta de Instrucciones'),
          required: false,
        },
        {
          name: 'Acuse de Transporte',
          status: getStatus('Acuse de Transporte'),
          required: false,
        },
        {
          name: 'Delivery Ticket',
          status: getStatus('Delivery Ticket'),
          required: false,
        },
        {
          name: 'Shipper',
          status: getStatus('Shipper'),
          required: false,
        },
      ];
      console.log('[previewClassification] Retornando documentos:', documents);

      return {
        success: true,
        documents,
      };
    } catch (error) {
      console.error('[previewClassification] ERROR:', error);
      return {
        success: false,
        message: 'Error al clasificar los documentos',
      };
    }
  });
