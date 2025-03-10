"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { schema } from "../../interfaces/glosa";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/app/shared/services/auth";
import { read, create, updateTabWithCustomGlossId } from "./model";
import { CustomGlossType, CustomGlossTabContextType } from "@prisma/client";

export async function analysis(formData: FormData) {
  try {
    const session = await isAuthenticated();
    const user_id = session["userId"];
    if (typeof user_id !== "string") {
      throw new Error("User ID is not a string");
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
                  value: item.value.toString(),
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
                    value,
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
                  value: operation_type.external_context.apendice_2.value,
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
                  value: operation_type.external_context.apendice_16.value,
                },
              ],
            },
          },
        ],
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
                    value,
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
                  value: destination_origin.external_context.apendice_15.value,
                },
              ],
            },
          },
        ],
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
                    value:
                      typeof value === "string" ? value : JSON.stringify(value),
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
                    value:
                      typeof value === "string" ? value : JSON.stringify(value),
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
                    value:
                      typeof value === "string" ? value : JSON.stringify(value),
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
                    value:
                      typeof value === "string" ? value : JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
          ...operation.inferred_context.flatMap((inferredItem) => {
            if ("pedimento" in inferredItem) {
              return inferredItem.pedimento.flatMap(({ data }) =>
                data.map(({ name, value }) => ({
                  type: CustomGlossTabContextType.INFERRED,
                  origin: "pedimento",
                  data: {
                    create: [
                      {
                        name,
                        value,
                      },
                    ],
                  },
                }))
              );
            } else if ("factura" in inferredItem) {
              return inferredItem.factura.flatMap(({ data }) =>
                data.map(({ name, value }) => ({
                  type: CustomGlossTabContextType.INFERRED,
                  origin: "factura",
                  data: {
                    create: [
                      {
                        name,
                        value,
                      },
                    ],
                  },
                }))
              );
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
                    value: value.toString(),
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
                    value,
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
                    value,
                  },
                ],
              },
            })
          ),
        ],
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
                    value: Array.isArray(value)
                      ? value
                          .map(
                            (item) =>
                              `ID: ${item.id}, UMC: ${item.umc}, Cantidad UMC: ${item.cantidad_umc}`
                          )
                          .join("; ")
                      : value,
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
                    value: Array.isArray(value)
                      ? value
                          .map(
                            (item) =>
                              `ID: ${item.id}, UMC: ${item.umc}, Cantidad UMC: ${item.cantidad_umc}`
                          )
                          .join("; ")
                      : value,
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
                    value: Array.isArray(value)
                      ? value
                          .map(
                            (item) =>
                              `ID: ${item.id}, Peso Bruto: ${item.peso_bruto}, Peso Neto: ${item.peso_neto}`
                          )
                          .join("; ")
                      : value,
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
                    value: Array.isArray(value)
                      ? value
                          .map(
                            (item) =>
                              `ID: ${item.id}, Peso Bruto: ${item.peso_bruto}, Peso Neto: ${item.peso_neto}`
                          )
                          .join("; ")
                      : value,
                  },
                ],
              },
            }))
          ),
        ],
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
                    value:
                      typeof value === "string"
                        ? value
                        : Array.isArray(value)
                        ? value
                            .map(
                              (item) =>
                                `Factura: ${item.num_factura}, Fecha: ${item.fecha_factura}, Incoterm: ${item.incoterm}, ` +
                                `Moneda: ${item.moneda_factura}, Valor: ${item.valor_moneda_factura}, ` +
                                `Factor: ${item.factor_moneda_factura}, Valor USD: ${item.valor_dolares_factura}`
                            )
                            .join("; ")
                        : value,
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
                    value: value.toString(),
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
                    value:
                      typeof value === "object" &&
                      value !== null &&
                      "entrada_salida" in value
                        ? `${value.entrada_salida} | Arribo: ${value.arribo} | Salida: ${value.salida}`
                        : value,
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
                  value: transport_data.external_context.apendice_3.value,
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
                  value: transport_data.external_context.apendice_10.value,
                },
              ],
            },
          },
        ],
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
                    value:
                      typeof value === "string" ? value : JSON.stringify(value),
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
                    value:
                      typeof value === "number"
                        ? value.toString()
                        : JSON.stringify(value),
                  },
                ],
              },
            }))
          ),
        ],
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
