"use server";

import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/app/shared/services/auth";
import { read, create, updateTabWithCustomGlossId } from "./model";
import { ANOTHER_VICTOR_GLOSS_EXAMPLE } from "@/app/shared/constants";

export async function analysis(formData: FormData) {
  try {
    const session = await isAuthenticated();
    const user_id = session.userId as string;

    const query_id = randomUUID();

    const response = await fetch(
      `https://cargo-claro-fastapi-6z19.onrender.com/receive-pdf/production/${user_id}/${query_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GLOSS_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: "Ocurrió un error al enviar los documentos",
      };
    }

    const jsonResponse =
      (await response.json()) as typeof ANOTHER_VICTOR_GLOSS_EXAMPLE;

    await writeFile(
      "LAST_VICTOR_RESPONSE.json",
      JSON.stringify(jsonResponse, null, 2)
    );

    const customGlossAlerts = Object.entries(jsonResponse.alerts).flatMap(
      ([type, items]) =>
        items.map(({ validation_step_name }) => ({
          type: type.toUpperCase(),
          description: validation_step_name,
        }))
    );

    type IKey =
      | "pediment_number"
      | "operation_type"
      | "destination_origin"
      | "operation"
      | "gross_weight"
      | "invoice_data"
      | "transport_data"
      | "partidas";

    interface ICommonValidationSteps {
      name: string;
      description?: string | null;
      llm_analysis?: string | null;
      is_correct?: boolean | null;
      actions_to_take: {
        step_description: string;
      }[];
      resources: {
        name?: string | null;
        url?: string | null;
      }[];
    }

    interface IPartidasValidationSteps {
      fraccion: string;
      steps: ICommonValidationSteps[];
    }

    const customGlossTabs = jsonResponse.pedimento.map((tab) => {
      const key = Object.keys(tab)[0] as IKey;
      const tabData = tab[key]!;

      return {
        // BASE DATA
        name: tabData.name,
        summary: tabData.summary,
        isCorrect: tabData.is_correct,
        fullContext: tabData.context[0].full_context,
        // CONTEXTS DATA
        context: {
          create: [
            ...tabData.context[0].provided_context.map((context) => ({
              type: "PROVIDED",
              origin: context.origin,
              summary: context.document_summary,
              data: {
                create: context.data.map((data) => ({
                  name: data.name,
                  value:
                    typeof data.value === "string"
                      ? data.value
                      : JSON.stringify(data.value),
                })),
              },
            })),
            ...tabData.context[0].inferred_context.map((context) => ({
              type: "INFERRED",
              origin: context.origin,
              data: {
                create: context.data.map((data) => ({
                  name: data.name,
                  value:
                    typeof data.value === "string"
                      ? data.value
                      : JSON.stringify(data.value),
                })),
              },
            })),
            ...tabData.context[0].external_context.map((context) => ({
              type: "EXTERNAL",
              origin: context.origin,
              data: {
                create: context.data.map((data) => ({
                  name: data.name,
                  value:
                    typeof data.value === "string"
                      ? data.value
                      : JSON.stringify(data.value),
                })),
              },
            })),
          ],
        },
        // VALIDATIONS DATA
        validations: {
          create: tabData.validation_steps.map((validation) => {
            if (tabData.name === "Partidas") {
              return {
                fraccion: (validation as unknown as IPartidasValidationSteps)
                  .fraccion,
                steps: {
                  create: (
                    validation as unknown as IPartidasValidationSteps
                  ).steps.map((step) => ({
                    name: step.name,
                    llmAnalysis: step.llm_analysis,
                    isCorrect: step.is_correct,
                    actionsToTake: {
                      create: step.actions_to_take.map((action) => ({
                        description: action.step_description,
                      })),
                    },
                  })),
                },
              };
            } else {
              return {
                name: (validation as ICommonValidationSteps).name,
                description: (validation as ICommonValidationSteps).description,
                llmAnalysis: (validation as ICommonValidationSteps)
                  .llm_analysis,
                isCorrect: (validation as ICommonValidationSteps).is_correct,
                actionsToTake: {
                  create: (
                    validation as ICommonValidationSteps
                  ).actions_to_take.map((action) => ({
                    description: action.step_description,
                  })),
                },
                resources: {
                  create: (validation as ICommonValidationSteps).resources.map(
                    (resource) => ({
                      name: resource.name,
                      link: resource.url,
                    })
                  ),
                },
              };
            }
          }),
        },
      };
    });

    const newCustomGloss = await create({
      data: {
        user: { connect: { id: user_id } },
        summary: ANOTHER_VICTOR_GLOSS_EXAMPLE.summary,
        importerName: ANOTHER_VICTOR_GLOSS_EXAMPLE.importer_name,
        timeSaved: ANOTHER_VICTOR_GLOSS_EXAMPLE.metrics[0].time_saved,
        moneySaved: ANOTHER_VICTOR_GLOSS_EXAMPLE.metrics[0].money_saved,
        tabs: { create: customGlossTabs },
        alerts: { create: customGlossAlerts },
        files: { create: ANOTHER_VICTOR_GLOSS_EXAMPLE.files },
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
    return await read({ userId: session.userId as string });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMyAnalysisById(id: string) {
  try {
    const session = await isAuthenticated();
    return await read({ id, userId: session.userId as string });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRecentAnalysis() {
  try {
    const session = await isAuthenticated();
    return await read({ userId: session.userId as string, recent: true });
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
    const user_id = session.userId as string;

    const customGloss = await read({ id: customGlossId, userId: user_id });

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
