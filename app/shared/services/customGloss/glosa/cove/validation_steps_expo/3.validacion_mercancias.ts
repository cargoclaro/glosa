import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";

import { Cfdi } from "../../../data-extraction/schemas/cfdi";
import { CustomGlossTabContextType } from "@prisma/client";

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
