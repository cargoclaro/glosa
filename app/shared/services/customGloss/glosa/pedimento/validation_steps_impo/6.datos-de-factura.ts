import { Pedimento, Carta318, Cove, CartaSesion, Invoice } from "../../../data-extraction/schemas";
import { validationResultSchema, SYSTEM_PROMPT } from "../../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";

export async function validateRfcFormat(pedimento: Pedimento, cove: Cove, carta318: Carta318) {
  // Extract RFC values from documents
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const rfcCarta318 = carta318?.importador_exportador?.rfc;
  
  const validation = {
    name: "Validación de los RFC",
    description: "Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Existencia real:\n• Consultar el RFC ante el SAT (servicio web)\n\n3. Consistencia entre documentos:\n• RFC del importador debe ser idéntico en Pedimento, COVE y Carta 3.1.8\n• Si hay Cesión de Derechos, el RFC de la comercializadora debe coincidir con el RFC del importador en la Carta 3.1.8",
    rfcPedimento,
    rfcCove,
    rfcCarta318
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

export async function validateCesionDerechos(pedimento: Pedimento, cartaSesion: CartaSesion, carta318: Carta318) {
  // Extract values from documents
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const rfcComercializadora = cartaSesion?.assignee?.identification_rfc;
  const rfcImportadorCarta318 = carta318?.importador_exportador?.rfc;
  const fechaEmisionCesion = cartaSesion?.fecha_emision;
  
  const validation = {
    name: "Validación de cesión de derechos y carta 3.1.8",
    description: "Si existe Cesión de Derechos:\n\nComparar:\n• RFC comercializadora vs. RFC importador en Carta 3.1.8\n• Fecha de emisión de la Cesión debe ser anterior a Fecha de entrada del Pedimento\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido",
    fechaEntradaPedimento,
    rfcComercializadora,
    rfcImportadorCarta318,
    fechaEmisionCesion,
    existeCesionDerechos: !!cartaSesion
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

export async function validateDatosImportador(pedimento: Pedimento, cove: Cove, carta318: Carta318) {
  // Extract values from documents
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const rfcCarta318 = carta318?.importador_exportador?.rfc;
  
  const domicilioPedimento = pedimento.datos_importador?.domicilio;
  const domicilioCove = cove?.datos_generales_destinatario?.domicilio;
  const domicilioCarta318 = carta318?.importador_exportador?.domicilio;
  
  const razonSocialPedimento = pedimento.datos_importador?.razon_social;
  const razonSocialCove = cove?.datos_generales_destinatario?.nombre_razon_social;
  const razonSocialCarta318 = carta318?.importador_exportador?.nombre;
  
  const validation = {
    name: "Validación de datos del importador",
    description: "Validar que los siguientes campos coincidan literalmente entre documentos:\n\nRFC: Debe coincidir entre Pedimento, Carta 3.1.8 y COVE.\nDomicilio fiscal: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y Factura (importador).\nRazón social: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y COVE.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. Cualquier discrepancia en otros documentos se marca como error.",
    rfcPedimento,
    rfcCove,
    rfcCarta318,
    domicilioPedimento,
    domicilioCove,
    domicilioCarta318,
    razonSocialPedimento,
    razonSocialCove,
    razonSocialCarta318,
    existeCarta318: !!carta318
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

export async function validateDatosProveedor(pedimento: Pedimento, cove: Cove, carta318: Carta318) {
  // Extract values from documents
  const nombreProveedorPedimento = pedimento.nombre_razon_social;
  const nombreProveedorCove = cove?.datos_generales_proveedor?.nombre_razon_social;
  const nombreProveedorCarta318 = carta318?.proveedor_comprador?.nombre;
  
  const domicilioProveedorPedimento = pedimento.domicilio;
  const domicilioProveedorCove = cove?.datos_generales_proveedor?.domicilio;
  const domicilioProveedorCarta318 = carta318?.proveedor_comprador?.domicilio;
  
  const idProveedorPedimento = pedimento.id_fiscal;
  const idProveedorCove = cove?.datos_generales_proveedor?.identificador;
  const idProveedorCarta318 = carta318?.proveedor_comprador?.tax_id;
  
  const validation = {
    name: "Validación de datos comerciales del proveedor",
    description: "Validar que los siguientes campos coincidan literalmente entre documentos:\n\nRFC: Debe coincidir entre Pedimento, Carta 3.1.8 y COVE.\nDomicilio fiscal: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y Factura (importador).\nRazón social: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y COVE.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. Cualquier discrepancia en otros documentos se marca como error.",
    nombreProveedorPedimento,
    nombreProveedorCove,
    nombreProveedorCarta318,
    domicilioProveedorPedimento,
    domicilioProveedorCove,
    domicilioProveedorCarta318,
    idProveedorPedimento,
    idProveedorCove,
    idProveedorCarta318,
    existeCarta318: !!carta318
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

export async function validateFechasYFolios(pedimento: Pedimento, cove: Cove, invoice: Invoice, carta318: Carta318) {
  // Extract values from documents
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const fechaExpedicionCove = cove?.fecha_expedicion;
  const fechaExpedicionFactura = invoice?.invoice_date;
  const fechaExpedicionCarta318 = carta318?.document_info?.fecha;
  
  const numeroCovePedimento = pedimento.cove;
  const numeroCove = cove?.acuse_valor;
  
  // Para invoice necesitaríamos saber la ruta exacta, pero asumimos que podría ser:
  const numeroFactura = invoice?.invoice_number;

  
  const validation = {
    name: "Validación de fechas de emisión, números de folio y COVE",
    description: "Verificar secuencias lógicas y coincidencias exactas:\n\nFechas:\n• Fecha emisión Factura debe ser menor o igual a la Fecha entrada Pedimento\n• Fecha COVE debe ser igual a la Fecha Factura\n\nNúmeros:\n• Número COVE en el Pedimento debe ser igual al Número COVE en el COVE\n• Número Factura debe ser único y no repetido en otras operaciones",
    fechaEntradaPedimento,
    fechaExpedicionFactura,
    fechaExpedicionCove,
    fechaExpedicionCarta318,
    numeroCovePedimento,
    numeroCove,
    numeroFactura
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

export async function validateMonedaYEquivalencia(pedimento: Pedimento, cove: Cove, carta318: Carta318, invoice: Invoice) {
 // Moneda
 const monedaPedimento = pedimento.datos_factura?.[0]?.moneda_factura;
 const monedaCove = cove?.datos_mercancia?.tipo_moneda;
 const monedaCarta318 = carta318?.mercancias?.[0]?.moneda;
 const monedaFactura = invoice?.currency_code;

 // Valores DOF
 const factorDof = 1.5;
 const tipoCambioDOF = 17.1234;

    // Extract values from documents
  const valorDolaresPedimento = pedimento.datos_factura?.[0]?.valor_dolares_factura;
  const valorDolaresCove = cove?.datos_mercancia?.valor_total_dolares;
  const valorDolaresCarta318 = carta318?.factura?.valor_factura;
  const valorDolaresFactura = invoice?.total_amount;
  
  // Valor factura from pedimento:
  const valorFactura = pedimento.datos_factura?.[0]?.valor_moneda_factura;
  const factorMonedaFactura = pedimento.datos_factura?.[0]?.factor_moneda_factura;
  
  const validation = {
    name: "Validación de moneda y factor de equivalencia",
    description: "Validar los siguientes aspectos:\n\nMoneda:\n• La moneda declarada debe coincidir entre:\n  - Factura\n  - COVE\n  - Carta 3.1.8\n\nCálculo en USD:\n• El valor en dólares del pedimento debe ser igual a:\n  - Valor de Factura multiplicado por Factor DOF\n• Se permite una tolerancia máxima de ±0.5%\n\nFactor DOF:\n• Debe corresponder al tipo de cambio publicado el día de la fecha de emisión de la Factura",
    monedaPedimento,
    monedaFactura,
    monedaCove,
    monedaCarta318,
    valorDolaresPedimento,
    valorDolaresCove,
    valorDolaresCarta318,
    valorDolaresFactura,
    valorFactura,
    factorMonedaFactura,
    factorDof,
    tipoCambioDOF
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


