import { ClassifiedDocumentSet, StructuredDocumentSet } from "./types";
import { XMLParser } from "fast-xml-parser";
import { cfdiSchema, listaDeFacturasSchema } from "./schemas";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { Langfuse } from "langfuse";
import { randomUUID } from "crypto";

const langfuse = new Langfuse();
const parentTraceId = randomUUID();
 
langfuse.trace({
  id: parentTraceId,
  name: "extract-structured-text",
});

export async function extractStructuredText({ cfdis, listaDeFacturas}: Pick<ClassifiedDocumentSet, 'cfdis' | 'listaDeFacturas'>): Promise<StructuredDocumentSet> {
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
    model: anthropic("claude-3-7-sonnet-20250219"),
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
            data: `${listaDeFacturas.ufsUrl}`,
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
