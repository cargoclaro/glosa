import { Langfuse } from 'langfuse';
import { err, ok } from 'neverthrow';
import type { UploadedFileData } from 'uploadthing/types';
import { extractAndStructureCFDI } from './cfdi/extract-and-structure-cfdi';
import { extractAndStructureCove } from './cove/extract-and-structure-cove';
import { extractAndStructurePackingList } from './packing-list/extract-and-structure-packing-list';
import { extractAndStructurePedimento } from './pedimento/extract-and-structure-pedimento';
import type { DocumentType } from '../utils';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

async function extractTextFromImage(
  pdfFile: File,
  documentType: DocumentType,
  traceId: string
) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString(
    'base64'
  );
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    experimental_telemetry: {
      isEnabled: true,
      functionId: `extract_${documentType}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        documentType,
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

export async function extractAndStructure(
  classifications: Partial<
    Record<
      DocumentType,
      UploadedFileData & { originalFile: File; documentType: DocumentType }
    >
  >,
  traceId: string
) {
  const langfuse = new Langfuse();
  langfuse.event({
    traceId: traceId,
    name: 'Text Extraction and Structuring',
  });
  const {
    factura,
    carta318,
    rrna,
    documentoDeTransporte,
    pedimento,
    listaDeEmpaque,
    cove,
    cfdi,
    cartaCesionDeDerechos,
  } = classifications;

  // Check if required documents are present
  if (!pedimento) {
    return err('Pedimento document is required');
  }

  if (!cove) {
    return err('COVE document is required');
  }

  // Run all extraction operations in parallel instead of sequentially
  const [
    facturaText,
    carta318Text,
    rrnasText,
    documentoDeTransporteText,
    pedimentoText,
    listaDeEmpaqueText,
    coveText,
    cfdiText,
    cartaCesionDeDerechosText,
  ] = await Promise.all([
    factura
      ? extractTextFromImage(
          factura.originalFile,
          factura.documentType,
          traceId
        )
      : null,
    carta318
      ? extractTextFromImage(
          carta318.originalFile,
          carta318.documentType,
          traceId
        )
      : null,
    rrna
      ? extractTextFromImage(rrna.originalFile, rrna.documentType, traceId)
      : null,
    documentoDeTransporte
      ? extractTextFromImage(
          documentoDeTransporte.originalFile,
          documentoDeTransporte.documentType,
          traceId
        )
      : null,
    extractAndStructurePedimento(pedimento.ufsUrl, traceId),
    listaDeEmpaque
      ? extractAndStructurePackingList(listaDeEmpaque.ufsUrl, traceId)
      : null,
    extractAndStructureCove(cove.ufsUrl, traceId),
    cfdi ? extractAndStructureCFDI(cfdi.ufsUrl) : null,
    cartaCesionDeDerechos
      ? extractTextFromImage(
          cartaCesionDeDerechos.originalFile,
          cartaCesionDeDerechos.documentType,
          traceId
        )
      : null,
  ]);

  if (cfdiText?.isErr()) {
    return cfdiText;
  }

  return ok({
    ...(facturaText && { invoice: facturaText }),
    ...(carta318Text && { carta318: carta318Text }),
    ...(rrnasText && { rrnas: rrnasText }),
    ...(documentoDeTransporteText && {
      transportDocument: documentoDeTransporteText,
    }),
    pedimento: pedimentoText,
    ...(listaDeEmpaqueText && { packingList: listaDeEmpaqueText }),
    cove: coveText,
    ...(cfdiText?.isOk() && { cfdi: cfdiText.value }),
    ...(cartaCesionDeDerechosText && {
      cartaSesion: cartaCesionDeDerechosText,
    }),
  });
}
