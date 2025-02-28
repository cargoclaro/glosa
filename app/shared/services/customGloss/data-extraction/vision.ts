const systemPrompt = `
  Eres un experto en esquematizar información estructurada de documentos aduaneros a partir de imágenes. Tu tarea es analizar la imagen proporcionada y extraer toda la información relevante con estructura.

  IMPORTANTE: 
  - NO inventes o asumas información que no esté explícitamente visible en la imagen.
  - Si un campo requerido no está presente, déjalo vacío.
  - Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
  - Las fechas deben estar en formato ISO (YYYY-MM-DD).
  - Esquematiza todos los items con sus detalles completos.
  - Captura correctamente los montos y cantidades.
`;

import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { google } from "@ai-sdk/google";
import { Document } from "../classification";
import { invoiceSchema, carta318Schema, rrnaSchema, transportDocumentSchema, pedimentoSchema, packingListSchema, coveSchema, cfdiSchema, cartaSesionSchema } from "./schemas/";

export async function extractTextFromImage(pdfFile: File, document: Document) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString('base64');
  
  if (document === "pedimento") {
    return extractPedimento(base64Data);
  }
  else if (document === "factura") {
    return extractFactura(base64Data);
  }
  else if (document === "carta318") {
    return extractCarta318(base64Data);
  } 
  else if (document === "rrnas") {
    return extractRrnas(base64Data);
  }
  else if (document === "cove") {
    return extractCove(base64Data);
  } 
  else if (document === "cfdi") {
    return extractCfdi(base64Data);
  }
  else if (document === "cartaCesionDeDerechos") {
    return extractCartaSesion(base64Data);
  } 
  else if (document === "listaDeEmpaque") {
    return extractPackingList(base64Data);
  }
  else {
    return extractTransportDocument(base64Data);
  }
}

async function extractPedimento(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from pedimento pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: pedimentoSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es pedimento. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractFactura(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from factura pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: invoiceSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es factura. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractCarta318(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from carta318 pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: carta318Schema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es carta318. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractRrnas(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from rrnas pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: rrnaSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es rrnas. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractCove(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from cove pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: coveSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es cove. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractCfdi(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from cfdi pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: cfdiSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es cfdi. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractCartaSesion(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from cartaSesion pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: cartaSesionSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es cartaSesion. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractPackingList(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from packingList pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: packingListSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es packingList. Analiza la imagen y extrae toda la información relevante con estructura.'
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

async function extractTransportDocument(base64Data: string) {
  const { object } = await generateObject({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from transportDocument pdf`,
      project_name: "glosa",
    }),
    system: systemPrompt,
    schema: transportDocumentSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'El tipo de documento es documento_de_transporte. Analiza la imagen y extrae toda la información relevante con estructura.'
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
