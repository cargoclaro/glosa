import { Cove } from "../../data-extraction/schemas/cove";
import { validationResultSchema, SYSTEM_PROMPT } from "../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { Invoice } from "../../data-extraction/schemas/invoice";
import { Carta318 } from "../../data-extraction/schemas/carta-318";

/**
 * Validates that the invoice number in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's invoice number takes precedence.
 */
export async function validateNumeroFacturaImportacion(cove: Cove, invoice: Invoice, carta318?: Carta318) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;
  const numeroFacturaInvoice = invoice.invoice_number;
  const numeroFacturaCarta318 = carta318?.factura?.numero_factura;

  const validation = {
    name: "Número de Factura (Importación)",
    description: "El número de factura del COVE debe coincidir con el número de factura en la factura comercial (puede aparecer como Invoice Number, Invoice No, Invoice #) o en la carta 318. En caso de discrepancia, prevalece el número indicado en la carta 318.",
    numeroFacturaCove,
    numeroFacturaInvoice,
    numeroFacturaCarta318,
    tipoOperacion: "IMP"
  };

  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Validate ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return object;
}

/**
 * Validates that the invoice number in the COVE document matches other documents for exports.
 * Different validation rules apply according to CFDI requirements.
 */
export async function validateNumeroFacturaExportacion(cove: Cove, invoice: Invoice, carta318?: Carta318) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;
  const numeroFacturaInvoice = invoice.invoice_number;
  const numeroFacturaCarta318 = carta318?.factura?.numero_factura;

  const validation = {
    name: "Número de Factura (Exportación)",
    description: "El numero de factura esta en el CFDI y se puede encontrar como (Invoice Number, Invoice No, Invoice #). También puede venir en la carta CFDI. En caso de discrepancia, prevalece el número indicado en la carta CFDI.",
    numeroFacturaCove,
    numeroFacturaInvoice,
    numeroFacturaCarta318,
    tipoOperacion: "EXP"
  };

  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Validate ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return object;
}

/**
 * Validates that the invoice date in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's date takes precedence.
 */
export async function validateFechaExpedicionImportacion(cove: Cove, invoice: Invoice, carta318?: Carta318) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;
  const fechaExpedicionInvoice = invoice.invoice_date;
  const fechaExpedicionCarta318 = carta318?.factura?.fecha_factura;

  const validation = {
    name: "Fecha de Expedición (Importación)",
    description: "La fecha de expedición del COVE debe coincidir con la fecha de la factura comercial (puede aparecer como Invoice Date, Date) o en la carta 318. En caso de discrepancia, prevalece la fecha indicada en la carta 318.",
    fechaExpedicionCove,
    fechaExpedicionInvoice,
    fechaExpedicionCarta318,
    tipoOperacion: "IMP"
  };

  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Validate ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return object;
}

/**
 * Validates that the invoice date in the COVE document matches other documents for exports.
 * Different validation rules apply according to CFDI requirements.
 */
export async function validateFechaExpedicionExportacion(cove: Cove, invoice: Invoice, carta318?: Carta318) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;
  const fechaExpedicionInvoice = invoice.invoice_date;
  const fechaExpedicionCarta318 = carta318?.factura?.fecha_factura;

  const validation = {
    name: "Fecha de Expedición (Exportación)",
    description: "La fecha de expedicion viene en el CFDI como (Invoice Date, Date). También puede venir en la carta CFDI. En caso de discrepancia, prevalece la fecha indicada en la carta CFDI.",
    fechaExpedicionCove,
    fechaExpedicionInvoice,
    fechaExpedicionCarta318,
    tipoOperacion: "EXP"
  };

  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Validate ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return object;
}
