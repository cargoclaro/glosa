import { ClassifiedDocumentSet, StructuredDocumentSet } from "./types";
import { xmlParser } from "./xml-parser";
import { cfdiSchema, listaDeFacturasSchema, facturaSchema } from "./schemas";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function extractStructuredText(
  { cfdis, listaDeFacturas, facturas }: Pick<ClassifiedDocumentSet, 'cfdis' | 'listaDeFacturas' | 'facturas'>,
  parentTraceId: string
): Promise<StructuredDocumentSet> {
  const cfdisData = await Promise.all(cfdis.map(async ({ originalFile, ufsUrl }) => {
    const xmlData = await originalFile.text();
    const cfdiData = cfdiSchema.safeParse(xmlParser.parse(xmlData, true));
    if (!cfdiData.success) {
      throw new Error(`Error parsing cfdi: ${cfdiData.error.message}. XML URL: ${ufsUrl}`);
    }
    return cfdiData.data;
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
  const facturasData = await Promise.all(facturas.map(async (factura) => {
    const { object: facturaData } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      experimental_telemetry: {
        isEnabled: true,
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false, // Do not update the parent trace with execution results
          fileUrl: factura.ufsUrl,
        },
      },
      system: "Eres un experto en extraccion y estructuracion de datos de documentos aduaneros.",
      schema: facturaSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: `data:${factura.type};base64,${Buffer.from(await factura.originalFile.arrayBuffer()).toString('base64')}`,
              mimeType: factura.type,
            },
          ],
        },
      ],
    });
    return facturaData;
  }))
  return {
    listaDeFacturas: listaDeFacturasData,
    cfdis: cfdisData,
    facturas: facturasData,
  };
}
