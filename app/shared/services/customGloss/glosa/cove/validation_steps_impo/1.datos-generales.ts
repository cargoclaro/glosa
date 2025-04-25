import type {
  Carta318,
  Invoice,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the invoice number in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's invoice number takes precedence.
 */
async function validateNumeroFactura(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.datosDelAcuseDeValor.numeroDeFactura;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Número de Factura (Importación)',
    description:
      'Validación que compara el número de factura del COVE con el número de factura en la factura comercial o en la carta 318 para asegurar que coincidan en operaciones de importación.',
    prompt:
      'El número de factura del COVE debe coincidir con el número de factura en la factura comercial (puede aparecer como Invoice Number, Invoice No, Invoice #) o en la carta 318. En caso de discrepancia, prevalece el número indicado en la carta 318.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'Número de Factura', value: numeroFacturaCove }],
        },
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
        carta318: {
          data: [{ name: 'Carta 318', value: carta318Mkdown }],
        },
      },
    },
  } as const;
  return await glosar(validation, traceId);
}

/**
 * Validates that the invoice date in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's date takes precedence.
 */
async function validateFechaExpedicion(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.datosDelAcuseDeValor.fechaExpedicion;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;
  const currentDate = new Date();

  const validation = {
    name: 'Fecha de Expedición (Importación)',
    description:
      'Validación que compara la fecha de expedición del COVE con la fecha de la factura comercial y/o Carta 318 para asegurar que coincidan en operaciones de importación, considerando que en caso de discrepancia prevalece la fecha indicada en la Carta 318.',
    prompt:
      'La fecha de expedición del COVE debe coincidir con la fecha de la factura y/o Carta 318. En caso de discrepancia o que falte un documento, prevalece la fecha indicada en la carta 318. Las fechas pueden tener diferentes formatos, busca que si es logico, sea valido. Por ejemplo, si la fecha es 2025-08-01 y en la 318 es 08-01-2025, probablemente sean diferentes formatos pero la misma fecha, es muy poco probable que justo esten invertidos. ',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            { name: 'Fecha de Expedición', value: fechaExpedicionCove },
            { name: 'Fecha Actual', value: currentDate.toISOString() },
          ],
        },
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
        carta318: {
          data: [{ name: 'Carta 318', value: carta318Mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function datosGenerales({
  cove,
  invoice,
  carta318,
  traceId,
}: {
  cove: Cove;
  invoice?: Invoice;
  carta318?: Carta318;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateNumeroFactura(traceId, cove, invoice, carta318),
    validateFechaExpedicion(traceId, cove, invoice, carta318),
  ]);

  return {
    sectionName: 'Datos Generales',
    validations: validationsPromise,
  };
}
