import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";

import { Carta318 } from "../../../data-extraction/schemas/carta-318";
import { Cfdi } from "../../../data-extraction/schemas/cfdi";
import { CustomGlossTabContextType } from "@prisma/client";

/**
 * Validates that the merchandise details in the COVE document match the relevant document for exports.
 * Compares with the CFDI or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateMercancias(
  cove: Cove,
  carta318?: Carta318,
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
    description: "Validar que los siguientes datos de las mercancías en el COVE coincidan con los declarados en la Carta 3.1.8 (si existe) o en el CFDI:\n\n• Descripción genérica de la mercancía\n• Cantidad en unidad de medida comercial (UMC)\n• Clave de unidad de medida comercial\n• Valor unitario\n• Valor total\n\nSi existe Carta 3.1.8, los datos declarados en ésta tienen prioridad sobre el CFDI.",
    mercanciasCove: mercanciasCoveFormatted,
    mercanciasCarta318: mercanciasCarta318Formatted,
    mercanciasCfdi: mercanciasCfdiFormatted,
    tipoOperacion: 'EXP'
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the total value in dollars in the COVE document matches the relevant document for exports.
 * Compares with the CFDI or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateValorTotalDolares(
  cove: Cove,
  carta318?: Carta318,
  cfdi?: Cfdi
) {
  // Extract total value from COVE
  const valorTotalDolaresCove = cove.datos_mercancia?.valor_total_dolares;
  const observacionesCove = cove.observaciones || '';

  // Extract total value and currency from Carta 318 if available
  const valorTotalCarta318 = carta318?.valores_calculados?.valor_dolares;
  const monedaCarta318 = carta318?.detalle_facturacion?.valor_comercial?.moneda;

  // Extract total value and currency from CFDI
  const valorTotalCfdi = cfdi?.total;
  const monedaCfdi = cfdi?.moneda;

  const validation = {
    name: "Valor total en dolares",
    description: "Validar que el valor total en dólares cumpla con los siguientes criterios:\n\n• El valor total debe coincidir con el declarado en el CFDI y/o carta 3.1.8\n• Si el CFDI está en una moneda diferente a dólares, verificar que se haya realizado la conversión correcta usando el factor de equivalencia correspondiente\n• Revisar que el tipo de cambio utilizado coincida con el declarado en el área de observaciones del COVE\n• Validar que los cálculos de conversión sean correctos y precisos\n• En caso de discrepancia entre documentos, la carta 3.1.8 tiene prioridad sobre el CFDI",
    contexts: [
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cove",
        data: [{ name: "Valor total en dolares", value: valorTotalDolaresCove }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cove",
        data: [{ name: "Observaciones", value: observacionesCove }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "carta318",
        data: [{ name: "Valor total en dolares", value: valorTotalCarta318 }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "carta318",
        data: [{ name: "Moneda", value: monedaCarta318 }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cfdi",
        data: [{ name: "Valor total", value: valorTotalCfdi }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cfdi",
        data: [{ name: "Moneda", value: monedaCfdi }]
      }
    ],
  } as const;

  return await glosar(validation);
}
