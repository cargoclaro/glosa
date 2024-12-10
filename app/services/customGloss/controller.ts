"use server";

import { randomUUID } from "crypto";
import { isAuthenticated } from "../auth";
import { create, read } from "./model";

// import { ANEXO_22_FIELDS_REQUESTS } from "@/app/constants";

export async function analysis(formData: FormData) {
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

    const query_id = randomUUID();

    const response = await fetch(
      `https://cargo-claro-fastapi.onrender.com/receive-pdf/sandbox/${user_id}/${query_id}`,
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

    const {
      isVerified,
      customGlossTaxes,
      customGlossNonTariffRestrictionNRegulations,
    } = await response.json();

    const DUMP_GLOBAL_SUMMARY =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec libero tincidunt tincidunt. Nullam nec purus nec libero tincidunt tincidunt. Nullam nec purus nec libero";
    const DUMP_TIME_SAVED = 2.5; // hours
    const DUMP_MONEY_SAVED = 1000; // MXN
    const DUMP_IMPORTER_NAME = "IMPORTADORA SA DE CV";
    const custom_id = "25cea766-d2cc-4ba4-86bb-4470a5fa17ad"; // CDMX
    const DUMP_DOCUMENTS = [
      {
        id: 1,
        url: "https://dummycloud.com/glosas/files/gloss28/proforma.pdf",
      },
      {
        id: 2,
        url: "https://dummycloud.com/glosas/files/gloss28/ficha_tecnica.pdf",
      },
      {
        id: 3,
        url: "https://dummycloud.com/glosas/files/gloss28/carta_318.pdf",
      },
      {
        id: 4,
        url: "https://dummycloud.com/glosas/files/gloss28/certificado_origen.pdf",
      },
      {
        id: 5,
        url: "https://dummycloud.com/glosas/files/gloss28/sedena.pdf",
      },
      {
        id: 6,
        url: "/pedimento_format_modified.pdf",
      },
    ];
    const DUMP_ALERTS = [
      {
        id: 1,
        type: "HIGH",
        description: "NUM. FACTURA",
      },
      {
        id: 2,
        type: "LOW",
        description: "# CONTENEDOR",
      },
      {
        id: 3,
        type: "LOW",
        description: "PRECIO UNIT",
      },
      {
        id: 4,
        type: "LOW",
        description: "CANTIDAD UMT",
      },
      {
        id: 5,
        type: "LOW",
        description: "PESO BRUTO",
      },
    ];
    interface ICustomGlossNonTariffRestrictionNRegulation {
      id: number;
      title: string;
      result: string;
      status: string;
      summary: string;
      description: string;
      comparisons: object;
      actionsToTake: object;
    }
    const newCustomGlossNonTariffRestrictionNRegulations =
      customGlossNonTariffRestrictionNRegulations.map(
        (item: ICustomGlossNonTariffRestrictionNRegulation) => ({
          ...item,
          type: "SC", // DUMP
          comparisons: JSON.stringify(item.comparisons),
          actionsToTake: JSON.stringify(item.actionsToTake),
        })
      );

    const newCustomGloss = await create({
      data: {
        userId: user_id,
        summary: DUMP_GLOBAL_SUMMARY,
        timeSaved: DUMP_TIME_SAVED,
        moneySaved: DUMP_MONEY_SAVED,
        isVerified,
        importerName: DUMP_IMPORTER_NAME,
        customId: custom_id,
        files: { create: DUMP_DOCUMENTS },
        alerts: { create: DUMP_ALERTS },
        customGlossTaxes: { create: customGlossTaxes },
        customGlossNonTariffRestrictionNRegulations: {
          create: newCustomGlossNonTariffRestrictionNRegulations,
        },
      },
    });

    // console.log(newCustomGloss);

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
