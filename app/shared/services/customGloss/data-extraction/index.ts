import { DocumentType } from "../classification";
import { pedimentoSchema, coveSchema } from "./schemas/";
import { transportDocumentSchema, invoiceSchema, carta318Schema, rrnaSchema, packingListSchema, cfdiSchema, cartaSesionSchema } from "./mkdown_schemas";
import { extractTextFromImage } from "./vision";
import { z } from "zod";
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
    factura ? extractTextFromImage(
      factura.originalFile,
      factura.documentType,
      documentToSchema.factura
    ) : null,
    carta318 ? extractTextFromImage(
      carta318.originalFile,
      carta318.documentType,
      documentToSchema.carta318
    ) : null,
    rrnas ? extractTextFromImage(
      rrnas.originalFile,
      rrnas.documentType,
      documentToSchema.rrnas
    ) : null,
    documentoDeTransporte ? extractTextFromImage(
      documentoDeTransporte.originalFile,
      documentoDeTransporte.documentType,
      documentToSchema.documentoDeTransporte
    ) : null,
    extractTextFromPDF(
      pedimento.originalFile,
      pedimento.documentType,
      documentToSchema.pedimento
    ),
    listaDeEmpaque ? extractTextFromImage(
      listaDeEmpaque.originalFile,
      listaDeEmpaque.documentType,
      documentToSchema.listaDeEmpaque
    ) : null,
    extractTextFromPDF(
      cove.originalFile,
      cove.documentType,
      documentToSchema.cove
    ),
    cfdi ? extractTextFromImage(
      cfdi.originalFile,
      cfdi.documentType,
      documentToSchema.cfdi
    ) : null,
    cartaCesionDeDerechos ? extractTextFromImage(
      cartaCesionDeDerechos.originalFile,
      cartaCesionDeDerechos.documentType,
      documentToSchema.cartaCesionDeDerechos
    ) : null
  ]);

  return {
    ...(facturaText && { invoice: facturaText }),
    ...(carta318Text && { carta318: carta318Text }),
    ...(rrnasText && { rrnas: rrnasText }),
    ...(documentoDeTransporteText && { transportDocument: documentoDeTransporteText }),
    pedimento: pedimentoText,
    ...(listaDeEmpaqueText && { packingList: listaDeEmpaqueText }),
    cove: coveText,
    ...(cfdiText && { cfdi: cfdiText }),
    ...(cartaCesionDeDerechosText && { cartaSesion: cartaCesionDeDerechosText }),
  };
}

export const extractTextFromPDFs = traceable(
  extractTextFromPDFsParallel,
  { name: 'textExtraction' }
);

const extractionResponseSchema = z.object({
  text: z.string()
});

async function extractTextFromPDF<T>(originalFile: File, documentType: DocumentType, schema: z.ZodType<T>) {
  const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://host.docker.internal:8000"
        : "https://cargo-claro-fastapi-6z19.onrender.com";
  const url = `${baseUrl}/extract-pdf-text`;

  // Create form data and append the file
  const formData = new FormData();
  formData.append('file', originalFile);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env["GLOSS_TOKEN"]}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to extract text: ${response.statusText}`);
  }

  const rawData = await response.json();
  const data = extractionResponseSchema.parse(rawData);
  const extractedText = data.text;
  return structureTaggedText(extractedText, schema, documentType);
}
