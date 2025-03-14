import { ClassifiedDocumentSet, StructuredDocumentSet } from "./types";
import { xmlParser } from "./xml-parser";
import { cfdiSchema, listaDeFacturasSchema, facturaSchema, reportesRemesaSchema } from "./schemas";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Langfuse } from "langfuse";
import { extractPdfPages } from "./pdf-page-extractor";

export async function extractStructuredText(
  { cfdis, listaDeFacturas, facturas, reporteEDocumentRemesaConsolidado }: Pick<ClassifiedDocumentSet, 'cfdis' | 'listaDeFacturas' | 'facturas' | 'reporteEDocumentRemesaConsolidado'>,
  parentTraceId: string
): Promise<StructuredDocumentSet> {
  const langfuse = new Langfuse();
  langfuse.event({
    traceId: parentTraceId,
    name: "Extract and Structure",
  });
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
      functionId: listaDeFacturas.name,
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
      model: openai.responses("gpt-4o-2024-11-20"),
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
  const reporteEDocumentRemesaConsolidadoPdfPages = await extractPdfPages(await reporteEDocumentRemesaConsolidado.originalFile.arrayBuffer());
  const reporteEDocumentRemesaConsolidadoData = await Promise.all(reporteEDocumentRemesaConsolidadoPdfPages.map(async (base64Page, index) => {
    const { object: reporteRemesaItemData } = await generateObject({
      model: openai.responses("gpt-4o-2024-11-20"),
      experimental_telemetry: {
        isEnabled: true,
        functionId: reporteEDocumentRemesaConsolidado.name,
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false, // Do not update the parent trace with execution results
          fileUrl: reporteEDocumentRemesaConsolidado.ufsUrl,
          page: index + 1,
        },
      },
      system: "Eres un experto en extraccion y estructuracion de datos de documentos aduaneros.",
      schema: reportesRemesaSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: `data:application/pdf;base64,${base64Page}`,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    });
    return reporteRemesaItemData;
  }));
  return {
    listaDeFacturas: listaDeFacturasData,
    reporteRemesa: reporteEDocumentRemesaConsolidadoData.flatMap(reportArray => 
      reportArray.reportesRemesa.flatMap(report => 
        report.productos.map(producto => ({
          ...producto,
          factura: report.factura
        }))
      )
    ),
    cfdis: cfdisData,
    facturas: facturasData,
  };
}
