import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { Result } from 'neverthrow';
import type { createExpedienteWithoutData } from '../classification/create-expediente-without-data';
import { extractAndStructureCFDI } from './cfdi/extract-and-structure-cfdi';
import { extractAndStructureCove } from './cove/extract-and-structure-cove';
import { extractAndStructureFactura } from './factura/extract-and-structure-factura';
import { extractAndStructurePackingList } from './packing-list/extract-and-structure-packing-list';
import { extractAndStructurePedimento } from './pedimento/extract-and-structure-pedimento';

async function extractTextFromImage(file: File, traceId: string) {
  const base64Data = Buffer.from(await file.arrayBuffer()).toString('base64');
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    experimental_telemetry: {
      isEnabled: true,
      functionId: `Extract ${file.name}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        fileName: file.name,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe la informacion de la imagen en formato markdown.',
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

  return {
    markdown_representation: text,
  };
}

// Función auxiliar para extraer facturas con markdown_representation
async function extractFacturaWithMarkdown(facturaFile: File, traceId: string) {
  // Extraer ambos: estructura de factura y markdown_representation
  const [facturaStructured, facturaMarkdown] = await Promise.all([
    extractAndStructureFactura(facturaFile, traceId),
    extractTextFromImage(facturaFile, traceId)
  ]);

  // Combinar ambos objetos manteniendo la compatibilidad con OCR
  return {
    ...facturaStructured,
    ...facturaMarkdown,
  };
}

// Extract only the Ok variant from createExpedienteWithoutData's result
type expedienteWithoutData = Awaited<
  ReturnType<typeof createExpedienteWithoutData>
> extends Result<infer V, unknown>
  ? V
  : never;

export async function extractAndStructure(
  expedienteWithoutData: expedienteWithoutData,
  traceId: string
) {
  const {
    Pedimento: pedimentoFiles,
    'Bill of Lading': billOfLadingFiles,
    'Air Waybill': airWaybillFiles,
    Factura: facturaFiles,
    'Carta Regla 3.1.8': carta318Files,
    Cove: coveFiles,
    'Packing List': packingListFiles,
    'Packing Slip': packingSlipFiles,
    CFDI: cfdiFiles,
  } = expedienteWithoutData;

  const documentoDeTransporteFiles = [...billOfLadingFiles, ...airWaybillFiles];
  const packingFiles = [...packingListFiles, ...packingSlipFiles];

  // Run all extraction operations in parallel instead of sequentially
  const [
    pedimento,
    documentoDeTransporte,
    factura,
    carta318,
    cove,
    packingList,
    cfdiResult,
  ] = await Promise.all([
    extractAndStructurePedimento(pedimentoFiles, traceId),
    Promise.all(
      documentoDeTransporteFiles.map((documentoDeTransporteFile) =>
        extractTextFromImage(documentoDeTransporteFile, traceId)
      )
    ),
    Promise.all(
      facturaFiles.map((facturaFile) =>
        extractFacturaWithMarkdown(facturaFile, traceId)
      )
    ),
    Promise.all(
      carta318Files.map((cartaFile) => extractTextFromImage(cartaFile, traceId))
    ),
    Promise.all(
      coveFiles.map((coveFile) => extractAndStructureCove(coveFile, traceId))
    ),
    Promise.all(
      packingFiles.map((packingFile) =>
        extractAndStructurePackingList(packingFile, traceId)
      )
    ),
    Promise.all(cfdiFiles.map((cfdiFile) => extractAndStructureCFDI(cfdiFile))),
  ]);

  return {
    pedimento,
    documentoDeTransporte,
    factura,
    carta318,
    cove,
    packingList,
    cfdiResult,
  };
}
