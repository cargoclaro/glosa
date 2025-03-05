import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { google } from "@ai-sdk/google";
import type { z } from "zod";
import { DocumentType } from "../classification";


export async function structureTaggedText<T>(
  text: unknown,
  schema: z.ZodType<T>,
  documentType: DocumentType,
): Promise<T> {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from ${documentType}`,
      project_name: "glosa",
    }),
    schema,
    prompt: `
      El tipo de documento es ${documentType}. Aqui esta el texto del tag del pdf:

      ${JSON.stringify(text, null, 2)}
    `,
  });
  return object;
}
