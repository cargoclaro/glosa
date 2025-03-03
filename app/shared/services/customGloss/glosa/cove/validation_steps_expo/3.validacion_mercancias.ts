import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";
import { Cfdi } from "../../../data-extraction/schemas/cfdi";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice } from "../../../data-extraction/schemas/invoice";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the merchandise details in the COVE document match the CFDI for exports.
 * Compares merchandise details between COVE and CFDI.
 */
export async function validateMercancias(
  cove: Cove,
  cfdi?: Cfdi
) {
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

  // Extract merchandise data from CFDI
  const mercanciasCfdi = cfdi?.conceptos || [];

  // Format CFDI merchandise data
  const mercanciasCfdiFormatted = mercanciasCfdi.map(item => ({
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    unidadMedida: item.unidad,
    valorUnitario: item.precio_unitario,
    valorTotal: item.importe
  }));

  const validation = {
    name: "Mercancias",
    description: "Validar que los siguientes datos de las mercancías en el COVE coincidan con los declarados en el CFDI:\n\n• Descripción genérica de la mercancía\n• Cantidad en unidad de medida comercial (UMC)\n• Clave de unidad de medida comercial\n• Valor unitario\n• Valor total",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "Descripción", value: mercanciasCoveFormatted?.descripcion },
            { name: "Cantidad", value: mercanciasCoveFormatted?.cantidad },
            { name: "Unidad de medida", value: mercanciasCoveFormatted?.unidadMedida },
            { name: "Valor unitario", value: mercanciasCoveFormatted?.valorUnitario },
            { name: "Valor total", value: mercanciasCoveFormatted?.valorTotal }
          ]
        },
        cfdi: {
          data: [
            { name: "Mercancias", value: mercanciasCfdiFormatted }
          ]
        }
      }
    },
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the total value in dollars in the COVE document matches the CFDI for exports.
 */
export async function validateValorTotalDolares(
  cove: Cove,
  cfdi?: Cfdi
) {
  // Extract total value from COVE
  const valorTotalDolaresCove = cove.datos_mercancia?.valor_total_dolares;
  const observacionesCove = cove.observaciones || '';

  // Extract total value and currency from CFDI
  const valorTotalCfdi = cfdi?.total;
  const monedaCfdi = cfdi?.moneda;

  const validation = {
    name: "Valor total en dolares",
    description: "Validar que el valor total en dólares cumpla con los siguientes criterios:\n\n• El valor total debe coincidir con el declarado en el CFDI\n• Si el CFDI está en una moneda diferente a dólares, verificar que se haya realizado la conversión correcta usando el factor de equivalencia correspondiente\n• Revisar que el tipo de cambio utilizado coincida con el declarado en el área de observaciones del COVE\n• Validar que los cálculos de conversión sean correctos y precisos",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "Valor total en dolares", value: valorTotalDolaresCove },
            { name: "Observaciones", value: observacionesCove }
          ]
        },
        cfdi: {
          data: [
            { name: "Valor total", value: valorTotalCfdi },
            { name: "Moneda", value: monedaCfdi }
          ]
        }
      }
    },
  } as const;

  return await glosar(validation);
}
/**
 * Validates that the serial numbers of the merchandise match across documents.
 * First checks Carta 318, then falls back to the invoice if not found in Carta 318.
 * Serial numbers are not mandatory; if none exists, it's considered valid.
 */
export async function validateNumeroSerie(
  cove: Cove,
  invoice?: Invoice,
  cfdi?: Cfdi
) {
  // Extract merchandise data from Carta 318 if available
  const mercanciasCfdi = cfdi?.conceptos || [];

  // Format Carta 318 merchandise data
  const mercanciasCfdiFormatted = mercanciasCfdi.map(item => ({
    descripcion: item.descripcion,
    // Assuming serial numbers might be part of the description
    // If there was a specific field for serial numbers, we'd use that instead
  }));

  // Extract merchandise data from invoice
  const mercanciasInvoice = invoice?.items || [];

  // Format invoice merchandise data
  const mercanciasInvoiceFormatted = mercanciasInvoice.map(item => ({
    descripcion: item.description,
    // Similarly, assuming serial numbers might be in the description
    // If there was a specific field for serial numbers, we'd use that instead
  }));

  const validation = {
    name: "Numero de serie",
    description: "Validar el número de serie de las mercancías siguiendo estos criterios:\n\n1. Revisar primero si el número de serie está declarado en la cfdi en la sección de mercancías\n\n2. Si no está en la cfdi, obtener el número de serie de la factura comercial\n\n3. El número de serie debe ser capturado exactamente como aparece en el documento correspondiente. No es obligatorio el número de serie, si no hay ninguno es por que no tenían para esa mercancía en específico. Si no hay números de serie marcar como válido.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "Descripción", value: cove.datos_mercancia?.descripcion_mercancia }
          ]
        },
        cfdi: {
          data: [
            { name: "Mercancías", value: mercanciasCfdiFormatted }
          ]
        },
        factura: {
          data: [
            { name: "Mercancías", value: mercanciasInvoiceFormatted }
          ]
        }
      }
    },
  } as const;

  return await glosar(validation);
}

export const tracedMercancias = traceable(
  async (cove: Cove, invoice?: Invoice, cfdi?: Cfdi) =>
    Promise.all([
      validateMercancias(cove, cfdi),
      validateValorTotalDolares(cove, cfdi),
      validateNumeroSerie(cove, invoice, cfdi)
    ]),
  { name: "Cove S3: Validación de mercancías" }
);
