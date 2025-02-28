import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import type { z } from "zod";
import { DocumentType } from "../classification";

const SYSTEM_PROMPT = `
  Eres un experto en esquematizar información estructurada de documentos aduaneros. Tu tarea es leer el texto proporcionado y extraer toda la información relevante con estructura.

  IMPORTANTE: 
  - NO inventes o asumas información que no esté explícitamente en el texto.
  - Si un campo requerido no está presente, déjalo vacío.
  - Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
  - Las fechas deben estar en formato ISO (YYYY-MM-DD).
  - Esquematiza todos los items con sus detalles completos.
  - Captura correctamente los montos y cantidades.
`;

export async function structureTaggedText<T>(
  text: string,
  schema: z.ZodType<T>,
  documentType: DocumentType,
): Promise<T> {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from ${documentType}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema,
    prompt: `
      El tipo de documento es ${documentType}. Aqui esta el texto del tag del pdf:

      ${text}
    `,
  });
  return object;
}
