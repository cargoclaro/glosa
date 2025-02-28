import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { invoiceSchema, carta318Schema, rrnaSchema, transportDocumentSchema, pedimentoSchema, packingListSchema, coveSchema, cfdiSchema, cartaSesionSchema, } from "./schemas/";
import { Document } from "../classification";

const systemPrompt = `
  Eres un experto en esquematizar información estructurada de documentos aduaneros. Tu tarea es leer el texto proporcionado y extraer toda la información relevante con estructura.

  IMPORTANTE: 
  - NO inventes o asumas información que no esté explícitamente en el texto.
  - Si un campo requerido no está presente, déjalo vacío.
  - Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
  - Las fechas deben estar en formato ISO (YYYY-MM-DD).
  - Esquematiza todos los items con sus detalles completos.
  - Captura correctamente los montos y cantidades.
`;

export async function extractSchemaFromTaggedPDF(text: string, document: Document) {
  if (document === "pedimento") {
    return pedimento(text);
  }
  else if (document === "factura") {
    return factura(text);
  }
  else if (document === "carta_318") {
    return carta318(text);
  } 
  else if (document === "rrnas") {
    return rrnas(text);
  }
  else if (document === "cove") {
    return cove(text);
  } 
  else if (document === "cfdi") {
    return cfdi(text);
  }
  else if (document === "carta_cesion_derechos") {
    return cartaSesion(text);
  } 
  else if (document === "lista_de_empaque") {
    return packingList(text);
  }
  else {
    return transportDocument(text);
  }
}

export async function pedimento(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from pedimento`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: pedimentoSchema,
    prompt: `
      El tipo de documento es pedimento. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function factura(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from factura`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: invoiceSchema,
    prompt: `
      El tipo de documento es factura. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function carta318(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from carta318`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: carta318Schema,
    prompt: `
      El tipo de documento es carta318. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function rrnas(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from rrnas`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: rrnaSchema,
    prompt: `
      El tipo de documento es rrnas. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function cove(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from cove`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: coveSchema,
    prompt: `
      El tipo de documento es cove. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function cfdi(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from cfdi`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: cfdiSchema,
    prompt: `
      El tipo de documento es cfdi. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function cartaSesion(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from cartaSesion`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: cartaSesionSchema,
    prompt: `
      El tipo de documento es cartaSesion. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function packingList(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from packingList`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: packingListSchema,
    prompt: `
      El tipo de documento es packingList. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}

export async function transportDocument(text: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Extract schema from transportDocument`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: transportDocumentSchema,
    prompt: `
      El tipo de documento es transportDocument. Aqui esta el texto del tag:
      ${text}
    `,
  });
  return object;
}
