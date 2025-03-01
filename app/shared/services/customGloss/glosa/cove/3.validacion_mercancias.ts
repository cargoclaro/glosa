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
 * Validates that the merchandise details in the COVE document match the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 * For exports: Compares with the CFDI or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateMercancias(
  cove: Cove,
  invoice: Invoice,
  pedimento: Pedimento,
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';

  // Extract merchandise data from COVE
  const datosMercanciaCove = cove.datos_mercancia;

  // Create a simplified view of COVE merchandise data
  const mercanciasCoveFormatted = datosMercanciaCove ? {
    descripcion: datosMercanciaCove.descripcion_mercancia,
    cantidad: datosMercanciaCove.cantidad_umc,
    unidadMedida: datosMercanciaCove.clave_umc,
    valorUnitario: datosMercanciaCove.valor_unitario,
    valorTotal: datosMercanciaCove.valor_total
  } : undefined;

  // Extract merchandise data from Carta 318 if available
  const mercanciasCarta318 = carta318?.mercancias || [];
  
  // Format Carta 318 merchandise data
  const mercanciasCarta318Formatted = mercanciasCarta318.map(item => ({
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    unidadMedida: item.unidad,
    valorUnitario: item.precio_unitario,
    valorTotal: item.precio_total
  }));

  // For imports: Extract merchandise data from invoice
  const mercanciasInvoice = isExportacion ? undefined : invoice.items || [];

  // Format invoice merchandise data
  const mercanciasInvoiceFormatted = mercanciasInvoice?.map(item => ({
    descripcion: item.description,
    cantidad: item.quantity,
    unidadMedida: item.unit_of_measure,
    valorUnitario: item.unit_price,
    valorTotal: item.line_amount
  }));

  // For exports: Extract merchandise data from CFDI
  const mercanciasCfdi = isExportacion ? cfdi?.conceptos || [] : undefined;

  // Format CFDI merchandise data
  const mercanciasCfdiFormatted = mercanciasCfdi?.map(item => ({
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    unidadMedida: item.unidad,
    valorUnitario: item.precio_unitario,
    valorTotal: item.importe
  }));

  const validation = {
    name: "Mercancias",
    description: isExportacion
      ? "Validar que los siguientes datos de las mercancías en el COVE coincidan con los declarados en la Carta 3.1.8 (si existe) o en el CFDI:\n\n• Descripción genérica de la mercancía\n• Cantidad en unidad de medida comercial (UMC)\n• Clave de unidad de medida comercial\n• Valor unitario\n• Valor total\n\nSi existe Carta 3.1.8, los datos declarados en ésta tienen prioridad sobre el CFDI."
      : "Validar que los siguientes datos de las mercancías en el COVE coincidan con los declarados en la Carta 3.1.8 (si existe) o en la factura comercial:\n\n• Descripción genérica de la mercancía\n• Cantidad en unidad de medida comercial (UMC)\n• Clave de unidad de medida comercial\n• Valor unitario\n• Valor total\n\nSi existe Carta 3.1.8, los datos declarados en ésta tienen prioridad sobre la factura comercial.",
    mercanciasCove: mercanciasCoveFormatted,
    mercanciasCarta318: mercanciasCarta318Formatted,
    mercanciasInvoice: mercanciasInvoiceFormatted,
    mercanciasCfdi: mercanciasCfdiFormatted,
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
 * Validates that the total value in dollars in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 * For exports: Compares with the CFDI or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateValorTotalDolares(
  cove: Cove,
  invoice: Invoice,
  pedimento: Pedimento,
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Check operation type (import or export)
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const isExportacion = tipoOperacion === 'EXP';

  // Extract total value from COVE
  const valorTotalDolaresCove = cove.datos_mercancia?.valor_total_dolares;
  const observacionesCove = cove.observaciones || '';

  // Extract total value and currency from Carta 318 if available
  const valorTotalCarta318 = carta318?.valores_calculados?.valor_dolares;
  const monedaCarta318 = carta318?.detalle_facturacion?.valor_comercial?.moneda;

  // For imports: Extract total value and currency from invoice
  const valorTotalInvoice = isExportacion ? undefined : invoice.total_amount;
  const monedaInvoice = isExportacion ? undefined : invoice.currency_code;

  // For exports: Extract total value and currency from CFDI
  const valorTotalCfdi = isExportacion ? cfdi?.total : undefined;
  const monedaCfdi = isExportacion ? cfdi?.moneda : undefined;

  const validation = {
    name: "Valor total en dolares",
    description: isExportacion
      ? "Validar que el valor total en dólares cumpla con los siguientes criterios:\n\n• El valor total debe coincidir con el declarado en el CFDI y/o carta 3.1.8\n• Si el CFDI está en una moneda diferente a dólares, verificar que se haya realizado la conversión correcta usando el factor de equivalencia correspondiente\n• Revisar que el tipo de cambio utilizado coincida con el declarado en el área de observaciones del COVE\n• Validar que los cálculos de conversión sean correctos y precisos\n• En caso de discrepancia entre documentos, la carta 3.1.8 tiene prioridad sobre el CFDI"
      : "Validar que el valor total en dólares cumpla con los siguientes criterios:\n\n• El valor total debe coincidir con el declarado en la factura comercial y/o carta 3.1.8\n• Si la factura está en una moneda diferente a dólares, verificar que se haya realizado la conversión correcta usando el factor de equivalencia correspondiente\n• Revisar que el tipo de cambio utilizado coincida con el declarado en el área de observaciones del COVE\n• Validar que los cálculos de conversión sean correctos y precisos\n• En caso de discrepancia entre documentos, la carta 3.1.8 tiene prioridad sobre la factura comercial. Los valores comerciales del cove y la 318 no incluyen los fletes, se tiene que comparar todo con el COVE. El valor que se tiene que verificar es el valor del COVE contra la factura y 318.",
    valorTotalCove: valorTotalDolaresCove,
    observacionesCove,
    valorTotalCarta318,
    monedaCarta318,
    valorTotalInvoice,
    monedaInvoice,
    valorTotalCfdi,
    monedaCfdi,
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
