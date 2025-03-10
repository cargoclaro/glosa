"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { read, updateTabWithCustomGlossId } from "./model";
import { CustomGlossTabContextType } from "@prisma/client";
import { config } from 'dotenv';
import { traceable } from "langsmith/traceable";
import { uploadFiles } from "./upload-files";
import { classifyDocuments } from "./classification";
import { extractTextFromPDFs } from "./data-extraction";
import { glosaImpo } from "./glosa/impo";
import { glosaExpo } from "./glosa/expo";
import prisma from "@/app/shared/services/prisma";
import { auth } from "@clerk/nextjs/server";

config();

const runGlosa = traceable(
  async (formData: FormData) => {
    await auth.protect();

    const files = formData.getAll("files") as File[]; // TODO: We should use zod instead of this
    const successfulUploads = await uploadFiles(files);
    const classifications = await classifyDocuments(successfulUploads);
    const documents = await extractTextFromPDFs(classifications);
    const { pedimento, cove } = documents;
    if (!pedimento || !cove) {
      throw new Error("El pedimento y el cove son obligatorios para realizar la glosa electrónica.");
    }
    const operationType = pedimento.encabezado_del_pedimento?.tipo_oper;
    if (operationType === "IMP") {
      return {
        gloss: await glosaImpo(documents),
        successfulUploads,
        importerName: pedimento.datos_importador?.razon_social,
      };
    } else if (operationType === "EXP") {
      return {
        gloss: await glosaExpo(documents),
        successfulUploads,
        importerName: pedimento.datos_importador?.razon_social,
      };
    } else {
      throw new Error(`El tipo de operación ${operationType} no es válido.`);
    }
  },
  {
    name: "runGlosa",
    project_name: "glosa",
  }
);

export async function analysis(formData: FormData) {
  try {
    const { userId } = await auth.protect();

    // Only use this for testing the migration from the python backend
    const { gloss, successfulUploads, importerName } = await runGlosa(formData);
    const newCustomGloss = await prisma.customGloss.create({
      data: {
        userId,
        summary: "No se donde sale esto",
        timeSaved: 20,
        moneySaved: 1000,
        importerName: importerName ?? "No se encontro la razon social del importador",
        tabs: {
          create: gloss.map(({ sectionName, validations }) => ({
            name: sectionName,
            isCorrect: validations.every(({ validation: { isValid } }) => isValid),
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
                        value: value === undefined ? "N/A" : JSON.stringify(value),
                      })),
                    },
                  }))
                )
              ),
            },
            validations: {
              create: validations.map(
                ({ validation: { name, description, llmAnalysis, isValid, actionsToTake } }) => ({
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
        files: { create: successfulUploads.map(({ name, ufsUrl }) => ({ name, url: ufsUrl })) },
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
    const { userId } = await auth.protect();
    return await read({ userId });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMyAnalysisById(id: string) {
  try {
    const { userId } = await auth.protect();
    return await read({ id, userId });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRecentAnalysis() {
  try {
    const { userId } = await auth.protect();
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
    const { userId } = await auth.protect();

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
