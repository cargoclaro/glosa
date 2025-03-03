import { pdfToText } from 'pdf-ts';
import { DocumentType } from "../classification";
import { invoiceSchema, carta318Schema, rrnaSchema, transportDocumentSchema, pedimentoSchema, packingListSchema, coveSchema, cfdiSchema, cartaSesionSchema } from "./schemas/";
import { extractTextFromImage } from "./vision";
import type { z } from "zod";
import { structureTaggedText } from "./tagged";
import { UploadedFileData } from 'uploadthing/types';
import { traceable } from 'langsmith/traceable';

export const documentToSchema = {
  "factura": invoiceSchema,
  "carta318": carta318Schema,
  "rrnas": rrnaSchema,
  "documentoDeTransporte": transportDocumentSchema,
  "pedimento": pedimentoSchema,
  "listaDeEmpaque": packingListSchema,
  "cove": coveSchema,
  "cfdi": cfdiSchema,
  "cartaCesionDeDerechos": cartaSesionSchema,
} as const;

async function extractTextFromPDFsParallel(
  classifications: Partial<Record<DocumentType, UploadedFileData & { originalFile: File; documentType: DocumentType }>>
) {
  const {
    factura,
    carta318,
    rrnas,
    documentoDeTransporte,
    pedimento,
    listaDeEmpaque,
    cove,
    cfdi,
    cartaCesionDeDerechos
  } = classifications;
  
  // Check if required documents are present
  if (!pedimento) {
    throw new Error("Pedimento document is required");
  }
  
  if (!cove) {
    throw new Error("COVE document is required");
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
    cartaCesionDeDerechosText
  ] = await Promise.all([
    factura ? extractTextFromPDF(
      factura.originalFile,
      factura.documentType,
      documentToSchema.factura
    ) : null,
    carta318 ? extractTextFromPDF(
      carta318.originalFile,
      carta318.documentType,
      documentToSchema.carta318
    ) : null,
    rrnas ? extractTextFromPDF(
      rrnas.originalFile,
      rrnas.documentType,
      documentToSchema.rrnas
    ) : null,
    documentoDeTransporte ? extractTextFromPDF(
      documentoDeTransporte.originalFile,
      documentoDeTransporte.documentType,
      documentToSchema.documentoDeTransporte
    ) : null,
    extractTextFromPDF(
      pedimento.originalFile,
      pedimento.documentType,
      documentToSchema.pedimento
    ),
    listaDeEmpaque ? extractTextFromPDF(
      listaDeEmpaque.originalFile,
      listaDeEmpaque.documentType,
      documentToSchema.listaDeEmpaque
    ) : null,
    extractTextFromPDF(
      cove.originalFile,
      cove.documentType,
      documentToSchema.cove
    ),
    cfdi ? extractTextFromPDF(
      cfdi.originalFile,
      cfdi.documentType,
      documentToSchema.cfdi
    ) : null,
    cartaCesionDeDerechos ? extractTextFromPDF(
      cartaCesionDeDerechos.originalFile,
      cartaCesionDeDerechos.documentType,
      documentToSchema.cartaCesionDeDerechos
    ) : null
  ]);

  return {
    ...(facturaText && { factura: facturaText }),
    ...(carta318Text && { carta318: carta318Text }),
    ...(rrnasText && { rrnas: rrnasText }),
    ...(documentoDeTransporteText && { documentoDeTransporte: documentoDeTransporteText }),
    pedimento: pedimentoText,
    ...(listaDeEmpaqueText && { listaDeEmpaque: listaDeEmpaqueText }),
    cove: coveText,
    ...(cfdiText && { cfdi: cfdiText }),
    ...(cartaCesionDeDerechosText && { cartaCesionDeDerechos: cartaCesionDeDerechosText }),
  };
}

export const extractTextFromPDFs = traceable(
  extractTextFromPDFsParallel,
  { name: 'textExtraction' }
);

async function extractTextFromPDF<T>(originalFile: File, documentType: DocumentType, schema: z.ZodType<T>) {
  const text = await pdfToText(Buffer.from(await originalFile.arrayBuffer()));
  const isPdfEmpty = text === "";

  if (isPdfEmpty) {
    return extractTextFromImage(originalFile, documentType, schema);
  }
  return structureTaggedText(text, schema, documentType);
}
