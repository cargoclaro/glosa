import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import type { z } from "zod";
import { DocumentType } from "../classification";


export async function structureTaggedText<T>(
  text: unknown,
  schema: z.ZodType<T>,
  documentType: DocumentType,
): Promise<T> {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    experimental_telemetry: { isEnabled: true },
    schema,
    prompt: `
      El tipo de documento es ${documentType}. Aqui esta el texto del tag del pdf:

      ${JSON.stringify(text, null, 2)}
    `,
  });
  return object;
}
