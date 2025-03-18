import { CustomGlossTabContextType } from '@prisma/client';
import { traceable } from 'langsmith/traceable';
import type {
  Carta318,
  Invoice,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the merchandise details in the COVE document match the relevant document for imports.
 * Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
async function validateMercancias(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract merchandise data from COVE
  const datosMercanciaCove = cove.datos_mercancia;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  // Create a simplified view of COVE merchandise data
  const mercanciasCoveFormatted = datosMercanciaCove
    ? {
        descripcion: datosMercanciaCove[0]?.descripcion_mercancia,
        cantidad: datosMercanciaCove[0]?.cantidad_umc,
        unidadMedida: datosMercanciaCove[0]?.clave_umc,
        valorUnitario: datosMercanciaCove[0]?.valor_unitario,
        valorTotal: datosMercanciaCove[0]?.valor_total,
      }
    : undefined;

  const validation = {
    name: 'Mercancias',
    description:
      'Validación que compara los datos de las mercancías entre el COVE, la Carta 3.1.8 y la factura comercial para asegurar que coincidan en operaciones de importación, incluyendo descripción, cantidad, unidad de medida, valor unitario y valor total.',
    prompt:
      'Validar que los siguientes datos de las mercancías en el COVE coincidan con los declarados en la Carta 3.1.8 (si existe) o en la factura comercial:\n\n• Descripción genérica de la mercancía\n• Cantidad en unidad de medida comercial (UMC)\n• Clave de unidad de medida comercial\n• Valor unitario\n• Valor total\n\nSi existe Carta 3.1.8, los datos declarados en ésta tienen prioridad sobre la factura comercial.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            {
              name: 'Descripción',
              value: mercanciasCoveFormatted?.descripcion,
            },
            { name: 'Cantidad', value: mercanciasCoveFormatted?.cantidad },
            {
              name: 'Unidad de medida',
              value: mercanciasCoveFormatted?.unidadMedida,
            },
            {
              name: 'Valor unitario',
              value: mercanciasCoveFormatted?.valorUnitario,
            },
            { name: 'Valor total', value: mercanciasCoveFormatted?.valorTotal },
          ],
        },
        carta318: {
          data: [{ name: 'Carta 318', value: carta318Mkdown }],
        },
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the total value in dollars in the COVE document matches the relevant document for imports.
 * Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
async function validateValorTotalDolares(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract total value from COVE
  const valorTotalDolaresCove = cove.datos_mercancia[0]?.valor_total_dolares;
  const observacionesCove = cove.observaciones || '';
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor total en dolares',
    description:
      'Validación que compara el valor total en dólares declarado en el COVE con el valor en la factura comercial y/o carta 3.1.8, verificando la correcta conversión de moneda y el tipo de cambio utilizado cuando la factura está en una moneda diferente a dólares. En caso de discrepancia, la carta 3.1.8 tiene prioridad.',
    prompt:
      'Validar que el valor total en dólares cumpla con los siguientes criterios:\n\n• El valor total debe coincidir con el declarado en la factura comercial y/o carta 3.1.8\n• Si la factura está en una moneda diferente a dólares, verificar que se haya realizado la conversión correcta usando el factor de equivalencia correspondiente\n• Revisar que el tipo de cambio utilizado coincida con el declarado en el área de observaciones del COVE\n• Validar que los cálculos de conversión sean correctos y precisos\n• En caso de discrepancia entre documentos, la carta 3.1.8 tiene prioridad sobre la factura comercial. Los valores comerciales del cove y la 318 no incluyen los fletes, se tiene que comparar todo con el COVE. El valor que se tiene que verificar es el valor del COVE contra la factura y 318.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: 'Valor total en dólares', value: valorTotalDolaresCove },
            { name: 'Observaciones', value: observacionesCove },
          ],
        },
        carta318: {
          data: [{ name: 'Carta 318', value: carta318Mkdown }],
        },
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the serial numbers of the merchandise match across documents.
 * First checks Carta 318, then falls back to the invoice if not found in Carta 318.
 * Serial numbers are not mandatory; if none exists, it's considered valid.
 */
async function validateNumeroSerie(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  const numeroSerieCove = cove.datos_mercancia[0]?.numeros_serie;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Numero de serie',
    description:
      'Validación que compara el número de serie de las mercancías entre el COVE, la carta 3.1.8 y la factura comercial, verificando que coincidan exactamente como aparecen en los documentos correspondientes. Los números de serie no son obligatorios y se consideran válidos si no existen.',
    prompt:
      'Validar el número de serie de las mercancías siguiendo estos criterios:\n\n1. Revisar primero si el número de serie está declarado en la carta 3.1.8 en la sección de mercancías\n\n2. Si no está en la carta 3.1.8, obtener el número de serie de la factura comercial\n\n3. El número de serie debe ser capturado exactamente como aparece en el documento correspondiente. No es obligatorio el número de serie, si no hay ninguno es por que no tenían para esa mercancía en específico. Si no hay números de serie marcar como válido.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            {
              name: 'Descripción',
              value: cove.datos_mercancia[0]?.descripcion_mercancia,
            },
            { name: 'Numero de serie', value: numeroSerieCove },
          ],
        },
        carta318: {
          data: [{ name: 'Carta 318', value: carta318Mkdown }],
        },
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

export const tracedMercancias = traceable(
  async ({
    cove,
    invoice,
    carta318,
  }: { cove: Cove; invoice?: Invoice; carta318?: Carta318 }) => {
    const validationsPromise = await Promise.all([
      validateMercancias(cove, invoice, carta318),
      validateValorTotalDolares(cove, invoice, carta318),
      validateNumeroSerie(cove, invoice, carta318),
    ]);

    return {
      sectionName: 'Validación de mercancías',
      validations: validationsPromise,
    };
  },
  { name: 'Cove S3: Validación de mercancías' }
);
