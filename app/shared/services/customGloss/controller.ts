"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { schema } from "../../interfaces/glosa";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/app/shared/services/auth";
import { read, create, updateTabWithCustomGlossId } from "./model";
import { CustomGlossType, CustomGlossTabContextType } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { config } from 'dotenv';
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { traceable } from "langsmith/traceable";
import pdf from 'pdf-parse';
import sharp from 'sharp';

config();

/**
 * Preprocesses an image to improve OCR quality.
 * 
 * @param imageBuffer - Buffer containing the image data
 * @returns Promise with the processed image buffer
 */
async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Target height for resize
    const targetHeight = 2000;

    // Get image metadata to calculate aspect ratio
    const { width, height } = await sharp(imageBuffer).metadata();
    if (!width || !height) {
      throw new Error("Image metadata is missing width or height");
    }
    const aspectRatio = width / height;
    const targetWidth = Math.round(targetHeight * aspectRatio);

    // Process the image:
    // 1. Convert to grayscale
    // 2. Apply threshold (similar to adaptiveThreshold in OpenCV)
    // 3. Denoise with median filter (approximation of fastNlMeansDenoising)
    // 4. Resize with high-quality Lanczos resampling
    return await sharp(imageBuffer)
      .grayscale()
      .threshold(128) // Simple threshold as Sharp doesn't have adaptive threshold
      .median(3) // Apply median filter for denoising
      .resize(targetWidth, targetHeight, {
        kernel: sharp.kernel.lanczos3, // Similar to INTER_LANCZOS4
        fit: 'fill'
      })
      .toBuffer();

  } catch (error) {
    console.error(`Error preprocessing image: ${error}`);
    throw error;
  }
}

const runGlosa = traceable(
  async (formData: FormData) => {
    const session = await isAuthenticated();
    const user_id = session["userId"];
    if (typeof user_id !== "string") {
      throw new Error("User ID is not a string");
    }

    const utapi = new UTApi();
    const files = formData.getAll("files") as File[]; // TODO: We should use zod instead of this

    const uploadedFiles = await utapi.uploadFiles(files);

    // Check if any uploads failed
    const failedUploads = uploadedFiles.filter(({ error }) => error !== null);
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `Error al subir ${failedUploads.length} archivo(s): ${failedUploads.map(f => f.error?.message || "Error desconocido").join(", ")}`,
      };
    }

    // All uploads succeeded, we can safely use the data
    const successfulUploads = uploadedFiles.map((result, index) => ({
      ...result.data!,
      originalFile: files[index]  // Keep reference to the original file
    }));

    const classifications = await Promise.all(successfulUploads.map(async (uploadedFile) => {
      const { object: { tipo_de_documento } } = await generateObject({
        model: wrapAISDKModel(anthropic("claude-3-5-sonnet-20241022"), {
          name: `classification-${uploadedFile.name}`,
          project_name: "glosa",
        }),
        system: `
          Eres un experto en análisis y clasificación de documentos aduaneros.
          `,
        schema: z.object({
          tipo_de_documento: z.enum([
            "pedimento",
            "documento_de_transporte",
            "factura",
            "carta_318",
            "carta_cesion_derechos",
            "cove",
            "noms",
            "rrnas",
            "lista_de_empaque",
            "cfdi"
          ]).describe(`
            Tipo de documento aduanero:
            - pedimento: Documento oficial de la aduana mexicana con números de pedimento (15-17 dígitos), campos de régimen aduanero, datos del importador/exportador, y sellos digitales.
            - documento_de_transporte: Puede ser Bill of Lading (B/L), guía aérea (AWB) o carta porte con detalles del envío, consignatario, transportista, origen/destino.
            - factura: Documento comercial con detalles de compra-venta internacional, información de vendedor/comprador, productos, precios, INCOTERMS.
            - carta_318: Documento que certifica cumplimiento de NOMs para productos usados, con referencias a la regla 3.1.8.
            - carta_cesion_derechos: Documento legal que transfiere derechos de importación/exportación entre partes.
            - cove: Comprobante de Valor Electrónico que valida el valor de mercancías con formato específico del SAT.
            - noms: Documentos que certifican cumplimiento de Normas Oficiales Mexicanas con números de certificado.
            - rrnas: Documentos que certifican cumplimiento de regulaciones y restricciones no arancelarias.
            - lista_de_empaque: Documento detallado del contenido físico del envío, con cantidad de bultos, pesos y dimensiones.
            - cfdi: Comprobante Fiscal Digital por Internet, factura electrónica mexicana con UUID y sellos digitales SAT.
          `)
        }),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analiza la imagen del documento y determina exactamente qué tipo de documento aduanero es basado en su contenido, formato y elementos específicos. Busca elementos como números de pedimento, sellos digitales, datos de importador/exportador, detalles de mercancías, referencias a NOMs, etc. que identifiquen el tipo específico de documento.' },
              {
                type: 'file',
                data: uploadedFile.ufsUrl,
                mimeType: 'application/pdf',
              },
            ],
          },
        ],
      });

      if (!uploadedFile.originalFile) {
        throw new Error("Should never happen");
      }
      const { text } = await pdf(Buffer.from(await uploadedFile.originalFile.arrayBuffer()));

      if (text === "") {
        const processedImage = await preprocessImage(Buffer.from(await uploadedFile.originalFile.arrayBuffer()));
      }

      return {
        ...uploadedFile,
        tipo_de_documento,
      };
    }));
  },
  {
    name: "runGlosa",
    project_name: "glosa",
  }
);

export async function analysis(formData: FormData) {
  try {
    const session = await isAuthenticated();
    const user_id = session["userId"];
    if (typeof user_id !== "string") {
      throw new Error("User ID is not a string");
    }

    // Only use this for testing the migration from the python backend
    const enableMigrationCode = false;
    if (enableMigrationCode) {
      const glosa = await runGlosa(formData);
      return
    }
    const query_id = randomUUID();

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://host.docker.internal:8000"
        : "https://cargo-claro-fastapi-6z19.onrender.com";
    const url = `${baseUrl}/receive-pdf/${process.env.NODE_ENV}/${user_id}/${query_id}`;
    console.log("url", url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["GLOSS_TOKEN"]}`,
      },
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Ocurrió un error al enviar los documentos",
      };
    }

    const parseResult = schema.safeParse(await response.json());
    if (!parseResult.success) {
      console.error("Invalid response format:", parseResult.error);
      return {
        success: false,
        message: "El formato de respuesta del servidor es inválido",
      };
    }
    const jsonResponse = parseResult.data;
    console.log("jsonResponse", jsonResponse);

    // const jsonResponse = VICTOR_GLOSS_EXAMPLE;

    const {
      pediment_number,
      operation_type,
      destination_origin,
      operation,
      gross_weight,
      invoice_data,
      transport_data,
      partidas,
    } = jsonResponse.secciones_pedimento;

    const pedimentNumberTab = {
      name: "N° de pedimento",
      isCorrect: pediment_number.is_correct,
      fullContext: true,
      context: {
        create: pediment_number.provided_context.pedimento.flatMap(({ data }) =>
          data.map((item) => ({
            type: CustomGlossTabContextType.PROVIDED,
            origin: "pedimento",
            data: {
              create: [
                {
                  name: item.name,
                  value: item.value?.toString() || "Sin valor",
                },
              ],
            },
          }))
        ),
      },
      validations: {
        create: pediment_number.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const operationTypeTab = {
      name: "Tipo de operación",
      isCorrect: operation_type.is_correct,
      fullContext: true,
      context: {
        create: [
          ...operation_type.provided_context.pedimento.data.map(
            ({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            })
          ),
          {
            type: CustomGlossTabContextType.EXTERNAL,
            origin: "apendice_2",
            data: {
              create: [
                {
                  name: operation_type.external_context.apendice_2.name,
                  value: JSON.stringify(operation_type.external_context.apendice_2.value),
                },
              ],
            },
          },
          {
            type: CustomGlossTabContextType.EXTERNAL,
            origin: "apendice_16",
            data: {
              create: [
                {
                  name: operation_type.external_context.apendice_16.name,
                  value: JSON.stringify(operation_type.external_context.apendice_16.value),
                },
              ],
            },
          },
        ],
      },
      validations: {
        create: operation_type.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const destinationOriginTab = {
      name: "Destino/Origen",
      isCorrect: destination_origin.is_correct,
      fullContext: true,
      context: {
        create: [
          ...destination_origin.provided_context.pedimento.data.map(
            ({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            })
          ),
          {
            type: CustomGlossTabContextType.EXTERNAL,
            origin: "apendice_15",
            data: {
              create: [
                {
                  name: destination_origin.external_context.apendice_15.name,
                  value: JSON.stringify(destination_origin.external_context.apendice_15.value),
                },
              ],
            },
          },
        ],
      },
      validations: {
        create: destination_origin.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const operationTab = {
      name: "Operación",
      isCorrect: operation.is_correct,
      fullContext: true,
      context: {
        create: [
          ...operation.provided_context.pedimento.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...operation.provided_context.cove.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "cove",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...operation.provided_context.carta_318.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "carta_318",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...operation.provided_context.factura.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "factura",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...operation.inferred_context.flatMap((inferredItem) => {
            if ("pedimento" in inferredItem) {
              return inferredItem.pedimento?.flatMap(({ data }) =>
                data.map(({ name, value }) => ({
                  type: CustomGlossTabContextType.INFERRED,
                  origin: "pedimento",
                  data: {
                    create: [
                      {
                        name,
                        value: JSON.stringify(value),
                      },
                    ],
                  },
                }))
              ) || [];
            } else if ("factura" in inferredItem) {
              return inferredItem.factura?.flatMap(({ data }) =>
                data.map(({ name, value }) => ({
                  type: CustomGlossTabContextType.INFERRED,
                  origin: "factura",
                  data: {
                    create: [
                      {
                        name,
                        value: JSON.stringify(value),
                      },
                    ],
                  },
                }))
              ) || [];
            }
            return [];
          }),
          ...operation.external_context.diario_oficial_de_la_federacion.flatMap(
            ({ name, value }) => ({
              type: CustomGlossTabContextType.EXTERNAL,
              origin: "diario_oficial_de_la_federacion",
              data: {
                create: [
                  {
                    name,
                    value: value?.toString() || "Sin valor",
                  },
                ],
              },
            })
          ),
          ...operation.external_context.apendice_3.flatMap(
            ({ name, value }) => ({
              type: CustomGlossTabContextType.EXTERNAL,
              origin: "apendice_3",
              data: {
                create: [
                  {
                    name,
                    value: value?.toString() || "Sin valor",
                  },
                ],
              },
            })
          ),
          ...operation.external_context.apendice_14.flatMap(
            ({ name, value }) => ({
              type: CustomGlossTabContextType.EXTERNAL,
              origin: "apendice_14",
              data: {
                create: [
                  {
                    name,
                    value: value?.toString() || "Sin valor",
                  },
                ],
              },
            })
          ),
        ],
      },
      validations: {
        create: operation.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const grossWeightTab = {
      name: "Peso bruto",
      isCorrect: gross_weight.is_correct,
      fullContext: true,
      context: {
        create: [
          ...gross_weight.provided_context.pedimento.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...gross_weight.provided_context.cove.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "cove",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...gross_weight.provided_context.factura.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "factura",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...gross_weight.provided_context.packing_list.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "packing_list",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
        ],
      },
      validations: {
        create: gross_weight.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const invoiceDataTab = {
      name: "Datos de la factura",
      isCorrect: invoice_data.is_correct,
      fullContext: true,
      context: {
        create: [
          ...invoice_data.provided_context.pedimento.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...invoice_data.provided_context.cove.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "cove",
              data: {
                create: [
                  {
                    name,
                    value: value?.toString() || "Sin valor",
                  },
                ],
              },
            }))
          ),
          ...invoice_data.provided_context.carta_318.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "carta_318",
              data: {
                create: [
                  {
                    name,
                    value:
                      typeof value === "object" &&
                        value !== null &&
                        "valor" in value &&
                        "moneda" in value
                        ? `${value.valor} ${value.moneda}`
                        : value,
                  },
                ],
              },
            }))
          ),
          ...invoice_data.provided_context.factura.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "factura",
              data: {
                create: [
                  {
                    name,
                    value: value.toString(),
                  },
                ],
              },
            }))
          ),
          ...invoice_data.external_context.diario_oficial_de_la_federacion.flatMap(
            ({ name, value }) => ({
              type: CustomGlossTabContextType.EXTERNAL,
              origin: "diario_oficial_de_la_federacion",
              data: {
                create: [
                  {
                    name,
                    value: value?.toString() || "Sin valor",
                  },
                ],
              },
            })
          ),
          ...invoice_data.external_context.validacion_rfc.map(
            ({ rfc, tipo }) => ({
              type: CustomGlossTabContextType.EXTERNAL,
              origin: "validacion_rfc",
              data: {
                create: [
                  {
                    name: rfc,
                    value: tipo,
                  },
                ],
              },
            })
          ),
        ],
      },
      validations: {
        create: invoice_data.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const transportDataTab = {
      name: "Datos de transporte",
      isCorrect: transport_data.is_correct,
      fullContext: true,
      context: {
        create: [
          ...transport_data.provided_context.pedimento.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          {
            type: CustomGlossTabContextType.EXTERNAL,
            origin: "apendice_3",
            data: {
              create: [
                {
                  name: transport_data.external_context.apendice_3.name,
                  value: JSON.stringify(transport_data.external_context.apendice_3.value),
                },
              ],
            },
          },
          {
            type: CustomGlossTabContextType.EXTERNAL,
            origin: "apendice_10",
            data: {
              create: [
                {
                  name: transport_data.external_context.apendice_10.name,
                  value: JSON.stringify(transport_data.external_context.apendice_10.value),
                },
              ],
            },
          },
        ],
      },
      validations: {
        create: transport_data.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const partidasTab = {
      name: "Partidas",
      isCorrect: partidas.is_correct,
      fullContext: true,
      context: {
        create: [
          ...partidas.provided_context.pedimento.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...partidas.provided_context.cove.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.PROVIDED,
              origin: "cove",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...partidas.inferred_context.pedimento.flatMap(({ data }) =>
            data.map(({ name, value }) => ({
              type: CustomGlossTabContextType.INFERRED,
              origin: "pedimento",
              data: {
                create: [
                  {
                    name,
                    value: JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
        ],
      },
      validations: {
        create: partidas.validation_steps.map(
          ({
            name,
            description,
            llm_analysis,
            is_correct,
            actions_to_take,
          }) => ({
            name,
            description,
            llmAnalysis: llm_analysis,
            isCorrect: is_correct,
            actionsToTake: {
              create: actions_to_take.map(({ step_description }) => ({
                description: step_description,
              })),
            },
          })
        ),
      },
    };

    const newCustomGloss = await create({
      data: {
        user: { connect: { id: user_id } },
        summary: jsonResponse.summary,
        timeSaved: jsonResponse.metrics[0]?.time_saved ?? 0,
        moneySaved: jsonResponse.metrics[0]?.money_saved ?? 0,
        importerName: jsonResponse.importer_name,
        tabs: {
          create: [
            pedimentNumberTab,
            operationTypeTab,
            destinationOriginTab,
            operationTab,
            grossWeightTab,
            invoiceDataTab,
            transportDataTab,
            partidasTab,
          ],
        },
        alerts: {
          create: [
            ...jsonResponse.alerts.high.map((alert) => ({
              type: CustomGlossType.HIGH,
              description: alert.validation_step_name,
            })),
            ...jsonResponse.alerts.medium.map((alert) => ({
              type: CustomGlossType.MEDIUM,
              description: alert.validation_step_name,
            })),
            ...jsonResponse.alerts.low.map((alert) => ({
              type: CustomGlossType.LOW,
              description: alert.validation_step_name,
            })),
          ],
        },
        files: { create: jsonResponse.files },
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
      message: "Ocurrió un error interno",
    };
  }
}

export async function getMyAnalysis() {
  try {
    const session = await isAuthenticated();
    const userId = session["userId"];
    if (typeof userId !== "string") {
      throw new Error("User ID is not a string");
    }
    return await read({ userId });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMyAnalysisById(id: string) {
  try {
    const session = await isAuthenticated();
    const userId = session["userId"];
    if (typeof userId !== "string") {
      throw new Error("User ID is not a string");
    }
    return await read({ id, userId });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRecentAnalysis() {
  try {
    const session = await isAuthenticated();
    const userId = session["userId"];
    if (typeof userId !== "string") {
      throw new Error("User ID is not a string");
    }
    return await read({ userId, recent: true });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function markTabAsVerifiedByTabIdNCustomGlossID({
  tabId,
  customGlossId,
}: {
  tabId: string;
  customGlossId: string;
}) {
  try {
    const session = await isAuthenticated();
    const userId = session["userId"];
    if (typeof userId !== "string") {
      throw new Error("User ID is not a string");
    }

    const customGloss = await read({ id: customGlossId, userId });

    if (!customGloss) {
      throw new Error("Gloss not found");
    }

    await updateTabWithCustomGlossId({
      id: tabId,
      customGlossId,
      data: {
        isVerified: true,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
  revalidatePath(`/gloss/${customGlossId}/analysis`);
  redirect(`/gloss/${customGlossId}/analysis`);
}
