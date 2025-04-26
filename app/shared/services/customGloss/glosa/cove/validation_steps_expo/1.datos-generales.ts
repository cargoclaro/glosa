import type { CFDI, Cove } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the invoice number in the COVE document matches the CFDI for exports.
 */
async function validateNumeroFactura(traceId: string, cove: Cove, cfdi?: CFDI) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.datosDelAcuseDeValor.numeroDeFactura;

  const validation = {
    name: 'Número de Factura (Exportación)',
    description:
      'Validación que compara el número de factura del COVE con el folio fiscal del CFDI para asegurar que coincidan en operaciones de exportación.',
    prompt:
      'El número de factura del COVE debe coincidir con el folio fiscal del CFDI. En exportación, el CFDI es el documento de facturación oficial emitido por el exportador mexicano.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'Número de Factura', value: numeroFacturaCove }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

/**
 * Validates that the invoice date in the COVE document matches the CFDI for exports.
 */
async function validateFechaExpedicion(
  traceId: string,
  cove: Cove,
  cfdi?: CFDI
) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.datosDelAcuseDeValor.fechaExpedicion;

  const validation = {
    name: 'Fecha de Expedición (Exportación)',
    description:
      'Validación que compara la fecha de expedición del COVE con la fecha de emisión del CFDI para asegurar que coincidan en operaciones de exportación.',
    prompt:
      'La fecha de expedición del COVE debe coincidir con la fecha de emisión del CFDI. En exportación, el CFDI es el documento de facturación oficial emitido por el exportador mexicano.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'Fecha de Expedición', value: fechaExpedicionCove }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

/**
 * Validates that the RFC in the COVE document matches other documents for exports.
 */
async function validateRfc(traceId: string, cove: Cove, cfdi?: CFDI) {
  // Extract RFC values from different sources
  // Se supone que este valor siempre es el RFC en la exportación
  const rfcCove = cove.datosGeneralesDelDestinatario.taxIdSinTaxIdRfcCurp;
  const validation = {
    name: 'RFC (Exportación)',
    description:
      'Validación que compara el RFC del destinatario en el COVE con el RFC del emisor en el CFDI para asegurar que coincidan en operaciones de exportación.',
    prompt:
      'El RFC del destinatario en el COVE debe coincidir con el RFC del emisor en el CFDI. En exportación, el emisor del CFDI es la empresa mexicana que realiza la exportación.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'RFC', value: rfcCove }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function datosGenerales({
  cove,
  cfdi,
  traceId,
}: { cove: Cove; cfdi?: CFDI; traceId: string }) {
  const validationsPromise = await Promise.all([
    validateNumeroFactura(traceId, cove, cfdi),
    validateFechaExpedicion(traceId, cove, cfdi),
    validateRfc(traceId, cove, cfdi),
  ]);

  return {
    sectionName: 'Datos Generales',
    validations: validationsPromise,
  };
}
