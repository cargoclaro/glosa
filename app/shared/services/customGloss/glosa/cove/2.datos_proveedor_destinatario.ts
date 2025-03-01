import { Cove } from "../../data-extraction/schemas/cove";
import { validationResultSchema, SYSTEM_PROMPT } from "../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { Invoice } from "../../data-extraction/schemas/invoice";
import { Carta318 } from "../../data-extraction/schemas/carta-318";
import { Pedimento } from "../../data-extraction/schemas/pedimento";
import { Cfdi } from "../../data-extraction/schemas/cfdi";

/**
 * Validates that the supplier's general information in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 * For exports: Compares with the CFDI.
 */
export async function validateDatosGeneralesProveedor(
  cove: Cove, 
  invoice: Invoice, 
  pedimento: Pedimento, 
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';
  
  // Extract supplier data from different sources
  const identificadorCove = cove.datos_generales_proveedor?.identificador;
  const tipoIdentificadorCove = cove.datos_generales_proveedor?.tipo_identificador;
  const nombreRazonSocialCove = cove.datos_generales_proveedor?.nombre_razon_social;
  
  // Import: get data from Invoice and Carta318
  const nombreRazonSocialInvoice = invoice.seller_details?.name;
  const nombreRazonSocialCarta318 = carta318?.proveedor?.nombre;
  const identificadorCarta318 = carta318?.proveedor?.tax_id;
  
  // Export: get data from CFDI
  const nombreRazonSocialCfdi = isExportacion ? cfdi?.emisor?.nombre : undefined;
  const identificadorCfdi = isExportacion ? cfdi?.emisor?.rfc : undefined;
  
  const validation = {
    name: "Datos generales del proveedor",
    description: isExportacion 
      ? "Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir."
      : "Verificar que los siguientes datos coincidan entre el COVE y la factura/carta 318:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.",
    identificadorCove,
    tipoIdentificadorCove,
    nombreRazonSocialCove,
    nombreRazonSocialInvoice,
    nombreRazonSocialCarta318,
    identificadorCarta318,
    nombreRazonSocialCfdi,
    identificadorCfdi,
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
 * Validates that the supplier's address in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 * For exports: Compares with the CFDI.
 */
export async function validateDomicilioProveedor(
  cove: Cove, 
  invoice: Invoice, 
  pedimento: Pedimento, 
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';
  
  // Extract supplier address data from different sources
  const domicilioCove = cove.datos_generales_proveedor?.domicilio;
  
  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove ? 
    [
      domicilioCove.calle, 
      domicilioCove.numero_exterior, 
      domicilioCove.colonia, 
      domicilioCove.codigo_postal,
      domicilioCove.pais
    ].filter(Boolean).join(' ') : '';
  
  // Import: get data from Invoice and Carta318
  const domicilioInvoice = invoice.seller_details?.address;
  const domicilioCarta318 = carta318?.proveedor?.direccion;
  
  // Export: get data from CFDI
  const domicilioCfdi = isExportacion ? cfdi?.emisor?.domicilio : undefined;
  
  const validation = {
    name: "Domicilio del proveedor",
    description: isExportacion 
      ? "Verificar que el domicilio fiscal del proveedor coincida entre el COVE y el CFDI:\n\n• Domicilio fiscal"
      : "Verificar que el domicilio fiscal del proveedor coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal",
    domicilioCoveCompleto,
    domicilioInvoice,
    domicilioCarta318,
    domicilioCfdi,
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
 * Validates that the recipient's general information in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 * For exports: Compares with the CFDI.
 */
export async function validateDatosGeneralesDestinatario(
  cove: Cove, 
  invoice: Invoice, 
  pedimento: Pedimento, 
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';
  
  // Extract recipient data from different sources
  const rfcDestinatarioCove = cove.datos_generales_destinatario?.rfc_destinatario;
  const nombreRazonSocialCove = cove.datos_generales_destinatario?.nombre_razon_social;
  
  // Import: get data from Invoice and Carta318
  const nombreRazonSocialInvoice = invoice.bill_to?.name;
  const nombreRazonSocialImportador = carta318?.importador?.nombre;
  const rfcImportador = carta318?.importador?.rfc;
  
  // Export: get data from CFDI
  const nombreRazonSocialCfdi = isExportacion ? cfdi?.receptor?.nombre : undefined;
  const rfcCfdi = isExportacion ? cfdi?.receptor?.rfc : undefined;
  
  const validation = {
    name: "Datos generales del destinatario",
    description: isExportacion 
      ? "Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir."
      : "Verificar que los siguientes datos coincidan entre el COVE y la factura/carta 318:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.",
    rfcDestinatarioCove,
    nombreRazonSocialCove,
    nombreRazonSocialInvoice,
    nombreRazonSocialImportador,
    rfcImportador,
    nombreRazonSocialCfdi,
    rfcCfdi,
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
 * Validates that the recipient's address in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 * For exports: Compares with the CFDI.
 */
export async function validateDomicilioDestinatario(
  cove: Cove, 
  invoice: Invoice, 
  pedimento: Pedimento, 
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';
  
  // Extract recipient address data from different sources
  const domicilioCove = cove.datos_generales_destinatario?.domicilio;
  
  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove ? 
    [
      domicilioCove.calle, 
      domicilioCove.numero_exterior, 
      domicilioCove.colonia, 
      domicilioCove.codigo_postal,
      domicilioCove.pais
    ].filter(Boolean).join(' ') : '';
  
  // Import: get data from Invoice and Carta318
  const domicilioInvoice = invoice.bill_to?.address;
  const domicilioImportador = carta318?.importador?.direccion;
  
  // Export: get data from CFDI
  const domicilioCfdi = isExportacion ? cfdi?.receptor?.domicilio : undefined;
  
  const validation = {
    name: "Domicilio del destinatario",
    description: isExportacion 
      ? "Verificar que el domicilio fiscal del destinatario coincida entre el COVE y el CFDI:\n\n• Domicilio fiscal"
      : "Verificar que el domicilio fiscal del destinatario coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal",
    domicilioCoveCompleto,
    domicilioInvoice,
    domicilioImportador,
    domicilioCfdi,
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