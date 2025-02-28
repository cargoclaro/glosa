import { pdfToText } from 'pdf-ts';
import { DocumentType } from "../classification";
import { invoiceSchema, carta318Schema, rrnaSchema, transportDocumentSchema, pedimentoSchema, packingListSchema, coveSchema, cfdiSchema, cartaSesionSchema } from "./schemas/";
import { extractTextFromImage } from "./vision";
import type { z } from "zod";
import { structureTaggedText } from "./tagged";
import { UploadedFileData } from 'uploadthing/types';

const documentToSchema = {
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

export async function extractTextFromPDFs(
  classifications: Record<DocumentType, UploadedFileData & { originalFile: File; documentType: DocumentType }>
): Promise<Record<DocumentType, z.infer<typeof documentToSchema[keyof typeof documentToSchema]>>> {
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
    extractTextFromPDF(
      factura.originalFile,
      factura.documentType,
      documentToSchema.factura
    ),
    extractTextFromPDF(
      carta318.originalFile,
      carta318.documentType,
      documentToSchema.carta318
    ),
    extractTextFromPDF(
      rrnas.originalFile,
      rrnas.documentType,
      documentToSchema.rrnas
    ),
    extractTextFromPDF(
      documentoDeTransporte.originalFile,
      documentoDeTransporte.documentType,
      documentToSchema.documentoDeTransporte
    ),
    extractTextFromPDF(
      pedimento.originalFile,
      pedimento.documentType,
      documentToSchema.pedimento
    ),
    extractTextFromPDF(
      listaDeEmpaque.originalFile,
      listaDeEmpaque.documentType,
      documentToSchema.listaDeEmpaque
    ),
    extractTextFromPDF(
      cove.originalFile,
      cove.documentType,
      documentToSchema.cove
    ),
    extractTextFromPDF(
      cfdi.originalFile,
      cfdi.documentType,
      documentToSchema.cfdi
    ),
    extractTextFromPDF(
      cartaCesionDeDerechos.originalFile,
      cartaCesionDeDerechos.documentType,
      documentToSchema.cartaCesionDeDerechos
    )
  ]);

  return {
    factura: facturaText,
    carta318: carta318Text,
    rrnas: rrnasText,
    documentoDeTransporte: documentoDeTransporteText,
    pedimento: pedimentoText,
    listaDeEmpaque: listaDeEmpaqueText,
    cove: coveText,
    cfdi: cfdiText,
    cartaCesionDeDerechos: cartaCesionDeDerechosText,
  };
}

async function extractTextFromPDF<T>(originalFile: File, documentType: DocumentType, schema: z.ZodType<T>) {
  const text = await pdfToText(Buffer.from(await originalFile.arrayBuffer()));
  const isPdfEmpty = text === "";

  if (isPdfEmpty) {
    return extractTextFromImage(originalFile, documentType, schema);
  }
  return structureTaggedText(text, schema, documentType);
}
