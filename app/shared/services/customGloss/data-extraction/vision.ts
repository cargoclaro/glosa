import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { google } from "@ai-sdk/google";
import type { z } from "zod";
import { DocumentType } from "../classification";

const SYSTEM_PROMPT = `
  Eres un experto en esquematizar información estructurada de documentos aduaneros a partir de imágenes. Tu tarea es analizar la imagen proporcionada y extraer toda la información relevante con estructura.

  IMPORTANTE: 
  - NO inventes o asumas información que no esté explícitamente visible en la imagen.
  - Si un campo requerido no está presente, déjalo vacío.
  - Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
  - Las fechas deben estar en formato ISO (YYYY-MM-DD).
  - Esquematiza todos los items con sus detalles completos.
  - Captura correctamente los montos y cantidades.
`;

export async function extractTextFromImage<T>(
  pdfFile: File,
  documentType: DocumentType,
  schema: z.ZodType<T>,
) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString('base64');
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from ${documentType} pdf`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `El tipo de documento es ${documentType}. Analiza la imagen y extrae toda la información relevante con estructura.`
          },
          {
            type: 'file',
            data: `data:application/pdf;base64,${base64Data}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  return object;
}
