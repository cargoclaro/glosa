import { ClassifiedDocumentSet, StructuredDocumentSet } from "./types";
import { XMLParser } from "fast-xml-parser";
import { cfdiSchema, listaDeFacturasSchema } from "./schemas";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { Langfuse } from "langfuse";
import { randomUUID } from "crypto";

const langfuse = new Langfuse();
const parentTraceId = randomUUID();
 
langfuse.trace({
  id: parentTraceId,
  name: "extract-structured-text",
});

export async function extractStructuredText({ cfdis, listaDeFacturas}: ClassifiedDocumentSet): Promise<StructuredDocumentSet> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const cfdisData = await Promise.all(cfdis.map(async ({ originalFile }) => {
    const xmlData = await originalFile.text();
    const cfdiData = cfdiSchema.parse(parser.parse(xmlData, true));
    return cfdiData;
  }));
  const { object: listaDeFacturasData } = await generateObject({
    model: google("gemini-2.0-flash-001"),
    experimental_telemetry: {
      isEnabled: true,
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false, // Do not update the parent trace with execution results
        fileUrl: listaDeFacturas.ufsUrl,
      },
    },
    system: "Eres un experto en extraccion y estructuracion de datos de documentos aduaneros.",
    schema: listaDeFacturasSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: `data:${listaDeFacturas.type};base64,${Buffer.from(await listaDeFacturas.originalFile.arrayBuffer()).toString('base64')}`,
            mimeType: listaDeFacturas.type,
          },
        ],
      },
    ],
  });
  return {
    listaDeFacturas: listaDeFacturasData,
    cfdis: cfdisData,
  };
}
