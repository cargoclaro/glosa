import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { pedimentoSchema } from "./schemas/pedimento";
import { Document } from "../classification";

export async function extractSchemaFromTaggedPDF(text: string, document: Document) {
  const systemPrompt = `
    Eres un experto en esquematizar información estructurada de documentos aduaneros. Tu tarea es leer el texto proporcionado y extraer toda la información relevante con estructura.

    IMPORTANTE: 
    - Si el texto contiene información de múltiples documentos (por ejemplo diferentes ID, o páginas numeradas como "1 OF X", "2 OF X", etc.), debes crear un objeto separado para cada documento.
    - Cada documento independiente debe tener su propia estructura completa, incluso si comparten información similar.
    - Presta especial atención a los números de documento o segmentos completos repetidos con información distinta para identificar documentos distintos.
    - NO inventes o asumas información que no esté explícitamente en el texto.
    - Si un campo requerido no está presente, déjalo vacío.
    - Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
    - Las fechas deben estar en formato ISO (YYYY-MM-DD).
    - Esquematiza todos los items con sus detalles completos.
    - Captura correctamente los montos y cantidades.
  `;
  if (document === "pedimento") {
    const { object } = await generateObject({
      model: wrapAISDKModel(openai("gpt-4o"), {
        name: `Extract schema from ${document}`,
        project_name: "glosa",
      }),
      system: systemPrompt,
      schema: pedimentoSchema,
      prompt: `
        - Identifica los datos del pedimento
        - Identifica con cuidado las múltiples fracciones que puede haber en el documento, para llenar adecuadamente toda la sección de partidas

        OCR text dump:
        ${text}
      `,
    });
    return object;
  }
}
