"use server";

// import { randomUUID } from "crypto";
import { create, read } from "./model";
import { isAuthenticated } from "../auth";
import { DUMP_GLOSS_FOR_CREATION } from "@/app/shared/constants";

// import { ANEXO_22_FIELDS_REQUESTS } from "@/app/constants";

export async function analysis(formData: FormData) {
  console.log("analysis", formData);
  try {
    // const responses = await Promise.all(
    //   ANEXO_22_FIELDS_REQUESTS.map((req) => fetch(req.url, req.options))
    // );

    // const allOk = responses.every((res) => res.ok);
    // if (!allOk) {
    //   return {
    //     success: false,
    //     message: "Ocurrió un error al obtener los campos del Anexo 22",
    //   };
    // }

    // const data = await Promise.all(responses.map((res) => res.text()));

    // console.log(data);

    // const pdfModifications = await fetch(
    //   "http://localhost:3000/api/gloss/highlighting_pediment_pdf",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       data,
    //     }),
    //   }
    // )
    //   .then((res) => res.text())
    //   .catch((error) => {
    //     console.error(error);
    //     return {
    //       success: false,
    //       message: "Ocurrió un error al modificar el PDF",
    //     };
    //   });

    // console.log(pdfModifications);

    const session = await isAuthenticated();
    const user_id = session.userId as string;

    // const custom_id = "3b25fce1-f969-4449-9968-dca412c022ac"; // CDMX

    // const query_id = randomUUID();

    // const response = await fetch(
    //   `https://cargo-claro-fastapi.onrender.com/receive-pdf/sandbox/${user_id}/${query_id}`,
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

    // const jsonResponse = await response.json();

    const jsonResponse = DUMP_GLOSS_FOR_CREATION;

    const newCustomGloss = await create({
      data: {
        user: { connect: { id: user_id } },
        summary: jsonResponse.summary,
        timeSaved: jsonResponse.timeSaved,
        moneySaved: jsonResponse.moneySaved,
        importerName: jsonResponse.importerName,
        tabs: {
          create: jsonResponse.tabs.map((tab) => ({
            name: tab.name,
            isCorrect: tab.isCorrect,
            fullContext: tab.fullContext,
            context: {
              create: tab.context.map((context) => ({
                type: context.type,
                origin: context.origin,
                data: {
                  create: context.data.map((data) => ({
                    name: data.name,
                    value: data.value,
                  })),
                },
              })),
            },
            validations: {
              create: tab.validations.map((validation) => ({
                name: validation.name,
                description: validation.description,
                llmAnalysis: validation.llmAnalysis,
                isCorrect: validation.isCorrect,
                summary: validation.summary,
                resources: {
                  create: validation.resources.map((resource) => ({
                    link: resource.link,
                  })),
                },
                actionsToTake: {
                  create: validation.actionsToTake.map((action) => ({
                    description: action.description,
                  })),
                },
              })),
            },
          })),
        },
        alerts: { create: jsonResponse.alerts },
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
