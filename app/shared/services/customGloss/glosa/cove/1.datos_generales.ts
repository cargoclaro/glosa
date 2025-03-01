import { Cove } from "../../data-extraction/schemas/cove";
import { validationResultSchema, SYSTEM_PROMPT } from "../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { Invoice } from "../../data-extraction/schemas/invoice";
import { Carta318 } from "../../data-extraction/schemas/carta-318";
import { Pedimento } from "../../data-extraction/schemas/pedimento";

/**
 * Validates that the invoice number in the COVE document matches either the invoice or relevant document.
 * For imports: In case of discrepancy, the Carta 318's invoice number takes precedence.
 * For exports: Different validation rules apply according to CFDI requirements.
 */
export async function validateNumeroFactura(cove: Cove, invoice: Invoice, pedimento: Pedimento, carta318?: Carta318) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;
  const numeroFacturaInvoice = invoice.invoice_number;
  const numeroFacturaCarta318 = carta318?.factura?.numero_factura;
  
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';
  
  const validation = {
    name: "Número de Factura",
    description: isExportacion 
      ? "El numero de factura esta en el CFDI y se puede encontrar como (Invoice Number, Invoice No, Invoice #). También puede venir en la carta CFDI. En caso de discrepancia, prevalece el número indicado en la carta CFDI."
      : "El número de factura del COVE debe coincidir con el número de factura en la factura comercial (puede aparecer como Invoice Number, Invoice No, Invoice #) o en la carta 318. En caso de discrepancia, prevalece el número indicado en la carta 318.",
    numeroFacturaCove,
    numeroFacturaInvoice,
    numeroFacturaCarta318,
    tipoOperacion
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
 * Validates that the invoice date in the COVE document matches either the invoice or relevant document.
 * For imports: In case of discrepancy, the Carta 318's date takes precedence.
 * For exports: Different validation rules apply according to CFDI requirements.
 */
export async function validateFechaExpedicion(cove: Cove, invoice: Invoice, pedimento: Pedimento, carta318?: Carta318) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;
  const fechaExpedicionInvoice = invoice.invoice_date;
  const fechaExpedicionCarta318 = carta318?.factura?.fecha_factura;
  
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';
  
  const validation = {
    name: "Fecha de Expedición",
    description: isExportacion 
      ? "La fecha de expedicion viene en el CFDI como (Invoice Date, Date). También puede venir en la carta CFDI. En caso de discrepancia, prevalece la fecha indicada en la carta CFDI."
      : "La fecha de expedición del COVE debe coincidir con la fecha de la factura comercial (puede aparecer como Invoice Date, Date) o en la carta 318. En caso de discrepancia, prevalece la fecha indicada en la carta 318.",
    fechaExpedicionCove,
    fechaExpedicionInvoice,
    fechaExpedicionCarta318,
    tipoOperacion
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
