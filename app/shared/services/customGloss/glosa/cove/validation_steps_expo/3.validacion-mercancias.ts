import { traceable } from 'langsmith/traceable';
import type { Cfdi, Invoice } from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the merchandise details in the COVE document match the CFDI for exports.
 * Compares merchandise details between COVE and CFDI.
 */
async function validateMercancias(traceId: string, cove: Cove, cfdi?: Cfdi) {
  // Extract merchandise data from COVE
  const datosMercanciaCove = cove.datos_mercancia;
  const cfdiMkdown = cfdi?.markdown_representation;
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
      'Validación que compara los datos de las mercancías entre el COVE y el CFDI para asegurar que coincidan en operaciones de exportación, incluyendo descripción, cantidad, unidad de medida, valor unitario y valor total.',
    prompt:
      'Validar que los siguientes datos de las mercancías en el COVE coincidan con los declarados en el CFDI:\n\n• Descripción genérica de la mercancía\n• Cantidad en unidad de medida comercial (UMC)\n• Clave de unidad de medida comercial\n• Valor unitario\n• Valor total',
    contexts: {
      PROVIDED: {
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
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

/**
 * Validates that the total value in dollars in the COVE document matches the CFDI for exports.
 */
async function validateValorTotalDolares(
  traceId: string,
  cove: Cove,
  cfdi?: Cfdi
) {
  // Extract total value from COVE
  const valorTotalDolaresCove = cove.datos_mercancia[0]?.valor_total_dolares;
  const observacionesCove = cove.observaciones || '';
  const cfdiMkdown = cfdi?.markdown_representation;
  const validation = {
    name: 'Valor total en dolares',
    description:
      'Validación que compara el valor total en dólares declarado en el COVE con el valor en el CFDI, verificando la correcta conversión de moneda y el tipo de cambio utilizado cuando el CFDI está en una moneda diferente a dólares.',
    prompt:
      'Validar que el valor total en dólares cumpla con los siguientes criterios:\n\n• El valor total debe coincidir con el declarado en el CFDI\n• Si el CFDI está en una moneda diferente a dólares, verificar que se haya realizado la conversión correcta usando el factor de equivalencia correspondiente\n• Revisar que el tipo de cambio utilizado coincida con el declarado en el área de observaciones del COVE\n• Validar que los cálculos de conversión sean correctos y precisos',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            { name: 'Valor total en dolares', value: valorTotalDolaresCove },
            { name: 'Observaciones', value: observacionesCove },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}
/**
 * Validates that the serial numbers of the merchandise match across documents.
 * First checks Carta 318, then falls back to the invoice if not found in Carta 318.
 * Serial numbers are not mandatory; if none exists, it's considered valid.
 */
async function validateNumeroSerie(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  cfdi?: Cfdi
) {
  const numeroSerieCove = cove.datos_mercancia[0]?.numeros_serie;
  const invoiceMkdown = invoice?.markdown_representation;
  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Numero de serie',
    description:
      'Validación que compara el número de serie de las mercancías entre el COVE, el CFDI y la factura comercial, verificando que coincidan exactamente como aparecen en los documentos correspondientes. Los números de serie no son obligatorios y se consideran válidos si no existen.',
    prompt:
      'Validar el número de serie de las mercancías siguiendo estos criterios:\n\n1. Revisar primero si el número de serie está declarado en la cfdi en la sección de mercancías\n\n2. Si no está en la cfdi, obtener el número de serie de la factura comercial\n\n3. El número de serie debe ser capturado exactamente como aparece en el documento correspondiente. No es obligatorio el número de serie, si no hay ninguno es por que no tenían para esa mercancía en específico. Si no hay números de serie marcar como válido.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            {
              name: 'Descripción',
              value: cove.datos_mercancia[0]?.descripcion_mercancia,
            },
            { name: 'Numero de serie', value: numeroSerieCove },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export const tracedMercancias = traceable(
  async ({
    cove,
    invoice,
    cfdi,
    traceId,
  }: { cove: Cove; invoice?: Invoice; cfdi?: Cfdi; traceId: string }) => {
    const validationsPromise = await Promise.all([
      validateMercancias(traceId, cove, cfdi),
      validateValorTotalDolares(traceId, cove, cfdi),
      validateNumeroSerie(traceId, cove, invoice, cfdi),
    ]);

    return {
      sectionName: 'Validación de mercancías',
      validations: validationsPromise,
    };
  },
  { name: 'Cove S3: Validación de mercancías' }
);
