import { traceable } from 'langsmith/traceable';
import type { UploadedFileData } from 'uploadthing/types';
import { z } from 'zod';
import type { DocumentType } from '../classification';
import {
  carta318Schema,
  cartaSesionSchema,
  cfdiSchema,
  invoiceSchema,
  packingListSchema,
  rrnaSchema,
  transportDocumentSchema,
} from './mkdown_schemas';
import { coveSchema, pedimentoSchema } from './schemas/';
import { structureTaggedText } from './tagged';
import { extractTextFromImage } from './vision';
import { Langfuse } from 'langfuse';

const documentToSchema = {
  factura: invoiceSchema,
  carta318: carta318Schema,
  rrna: rrnaSchema,
  documentoDeTransporte: transportDocumentSchema,
  pedimento: pedimentoSchema,
  listaDeEmpaque: packingListSchema,
  cove: coveSchema,
  cfdi: cfdiSchema,
  cartaCesionDeDerechos: cartaSesionSchema,
} as const;

async function extractTextFromPDFsParallel(
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
    throw new Error('Pedimento document is required');
  }

  if (!cove) {
    throw new Error('COVE document is required');
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
    extractTextFromPedimento(
      pedimento.originalFile,
      pedimento.documentType,
      documentToSchema.pedimento,
      traceId
    ),
    listaDeEmpaque
      ? extractTextFromImage(
          listaDeEmpaque.originalFile,
          listaDeEmpaque.documentType,
          traceId
        )
      : null,
    extractTextFromPDF(
      cove.originalFile,
      cove.documentType,
      documentToSchema.cove,
      traceId
    ),
    cfdi
      ? extractTextFromImage(cfdi.originalFile, cfdi.documentType, traceId)
      : null,
    cartaCesionDeDerechos
      ? extractTextFromImage(
          cartaCesionDeDerechos.originalFile,
          cartaCesionDeDerechos.documentType,
          traceId
        )
      : null,
  ]);

  return {
    ...(facturaText && { invoice: facturaText }),
    ...(carta318Text && { carta318: carta318Text }),
    ...(rrnasText && { rrnas: rrnasText }),
    ...(documentoDeTransporteText && {
      transportDocument: documentoDeTransporteText,
    }),
    pedimento: pedimentoText,
    ...(listaDeEmpaqueText && { packingList: listaDeEmpaqueText }),
    cove: coveText,
    ...(cfdiText && { cfdi: cfdiText }),
    ...(cartaCesionDeDerechosText && {
      cartaSesion: cartaCesionDeDerechosText,
    }),
  };
}

export const extractTextFromPDFs = traceable(extractTextFromPDFsParallel, {
  name: 'textExtraction',
});

const extractionResponseSchema = z.object({
  text: z.string(),
});

async function extractTextFromPDF<T extends z.ZodType>(
  originalFile: File,
  documentType: DocumentType,
  schema: T,
  traceId: string
) {
  const baseUrl = process.env['PYTHON_BACKEND_URL'];
  const url = `${baseUrl}/extract-pdf-text`;

  // Create form data and append the file
  const formData = new FormData();
  formData.append('file', originalFile);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env['GLOSS_TOKEN']}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to extract text: ${response.statusText}`);
  }

  const rawData = await response.json();
  const data = extractionResponseSchema.parse(rawData);
  const extractedText = data.text;
  return structureTaggedText(extractedText, schema, documentType, traceId);
}

async function extractTextFromPedimento<S extends z.ZodType>(
  originalFile: File,
  documentType: DocumentType,
  schema: S,
  traceId: string
): Promise<z.infer<S>> {
  const baseUrl = process.env['PYTHON_BACKEND_URL'];
  const url = `${baseUrl}/extract-pedimento`;

  // Create form data and append the file
  const formData = new FormData();
  formData.append('file', originalFile);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env['GLOSS_TOKEN']}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to extract text: ${response.statusText}`);
  }

  const rawData = await response.json();
  const extractionResponseSchema = z.object({
    pedimento_sections: z.unknown(),
    partidas: z.unknown(),
  });
  const data = extractionResponseSchema.parse(rawData);
  return structureTaggedText(data, schema, documentType, traceId);
}
