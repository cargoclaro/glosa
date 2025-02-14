"use server";

// import { randomUUID } from "crypto";
import { read, create, updateTabWithCustomGlossId } from "./model";
import { isAuthenticated } from "../auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ANOTHER_VICTOR_GLOSS_EXAMPLE } from "@/app/shared/constants";

export async function analysis(formData: FormData) {
  console.log("analysis", formData);
  try {
    const session = await isAuthenticated();
    const user_id = session.userId as string;

    // const query_id = randomUUID();

    console.log(ANOTHER_VICTOR_GLOSS_EXAMPLE);

    const newCustomGloss = await create({
      data: {
        user: { connect: { id: user_id } },
      },
    });

    return {
      success: true,
      glossId: newCustomGloss.id,
    };

    // const response = await fetch(
    //   `https://cargo-claro-fastapi-6z19.onrender.com/receive-pdf/production/${user_id}/${query_id}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${process.env.GLOSS_TOKEN}`,
    //     },
    //     body: formData,
    //   }
    // );

    // if (!response.ok) {
    //   return {
    //     success: false,
    //     message: "Ocurrió un error al enviar los documentos",
    //   };
    // }

    // const jsonResponse = (await response.json()) as ILLMResponse;
    // console.dir(jsonResponse, { depth: null });

    // const jsonResponse = VICTOR_GLOSS_EXAMPLE;

    // const newCustomGloss = await create({
    //   data: {
    //     user: { connect: { id: user_id } },
    //     summary: jsonResponse.summary,
    //     timeSaved: jsonResponse.timeSaved,
    //     moneySaved: jsonResponse.moneySaved,
    //     importerName: jsonResponse.importerName,
    // tabs: {
    //   create: jsonResponse.tabsPedimento.map((tab) => ({
    //     name: tab.name,
    //     isCorrect: tab.isCorrect,
    //     fullContext:
    //       typeof tab.fullContext === "boolean" ? tab.fullContext : false,
    //     context: {
    //       create: tab.context.map((context) => ({
    //         type: context.type,
    //         origin: context.origin,
    //         data: {
    //           create: context.data.map((data) => ({
    //             name: data.name,
    //             value: data.value,
    //           })),
    //         },
    //       })),
    //         },
    //         validations: {
    //           create: tab.validations.map((validation) => ({
    //             name: validation.name,
    //             description: validation.description,
    //             llmAnalysis: validation.llmAnalysis,
    //             isCorrect: validation.isCorrect,
    //             resources: {
    //               create: validation.resources.map((resource) => ({
    //                 link: resource.link,
    //               })),
    //             },
    //             actionsToTake: {
    //               create: validation.actionsToTake.map((action) => ({
    //                 description: action.description,
    //               })),
    //             },
    //           })),
    //         },
    //       })),
    //     },
    //     alerts: { create: jsonResponse.alerts },
    //     files: { create: jsonResponse.files },
    //   },
    // });

    // return {
    //   success: true,
    //   glossId: newCustomGloss.id,
    //   glossId: query_id,
    // };
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
