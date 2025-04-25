import type { OCR } from '~/lib/utils';
import type { Cove } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the supplier's general information in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDatosGeneralesProveedor(
  traceId: string,
  cove: Cove,
  cfdi?: OCR
) {
  // Extract supplier data from different sources
  const identificadorCove =
    cove.datosGeneralesDelProveedor.taxIdSinTaxIdRfcCurp;
  const tipoIdentificadorCove =
    cove.datosGeneralesDelProveedor.tipoDeIdentificador;
  const nombreRazonSocialCove =
    cove.datosGeneralesDelProveedor.nombresORazonSocial;
  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Datos generales del proveedor',
    description:
      'Validación que compara los datos generales del proveedor entre el COVE y el CFDI, verificando que el RFC o identificador fiscal y la razón social coincidan en ambos documentos para operaciones de exportación.',
    prompt:
      'Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            { name: 'Identificador', value: identificadorCove },
            { name: 'Tipo Identificador', value: tipoIdentificadorCove },
            { name: 'Nombre Razón Social', value: nombreRazonSocialCove },
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
 * Validates that the supplier's address in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDomicilioProveedor(
  traceId: string,
  cove: Cove,
  cfdi?: OCR
) {
  // Extract supplier address data from different sources
  const domicilioCove = cove.domicilioDelProveedor;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numeroExterior,
        domicilioCove.colonia,
        domicilioCove.codigoPostal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Domicilio del proveedor',
    description:
      'Validación que compara el domicilio fiscal del proveedor entre el COVE y el CFDI para asegurar que coincidan en operaciones de exportación.',
    prompt:
      'Verificar que el domicilio fiscal del proveedor coincida entre el COVE y el CFDI:\n\n• Domicilio fiscal',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'Domicilio', value: domicilioCoveCompleto }],
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
 * Validates that the recipient's general information in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDatosGeneralesDestinatario(
  traceId: string,
  cove: Cove,
  cfdi?: OCR
) {
  // Extract recipient data from different sources
  // Se supone que este valor siempre es el RFC en la exportación
  const rfcDestinatarioCove =
    cove.datosGeneralesDelDestinatario.taxIdSinTaxIdRfcCurp;
  const nombreRazonSocialCove =
    cove.datosGeneralesDelDestinatario.nombresORazonSocial;
  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Datos generales del destinatario',
    description:
      'Validación que compara los datos generales del destinatario entre el COVE y el CFDI para asegurar que coincidan en operaciones de exportación, incluyendo RFC o identificador fiscal y razón social.',
    prompt:
      'Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            { name: 'RFC', value: rfcDestinatarioCove },
            { name: 'Nombre Razón Social', value: nombreRazonSocialCove },
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
 * Validates that the recipient's address in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDomicilioDestinatario(
  traceId: string,
  cove: Cove,
  cfdi?: OCR,
) {
  // Extract recipient address data from different sources
  const domicilioCove = cove.domicilioDelDestinatario;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numeroExterior,
        domicilioCove.colonia,
        domicilioCove.codigoPostal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Domicilio del destinatario',
    description:
      'Validación que compara el domicilio fiscal del destinatario entre el COVE y el CFDI para asegurar que coincidan en operaciones de exportación.',
    prompt:
      'Verificar que el domicilio fiscal del destinatario coincida entre el COVE y el CFDI:\n\n• Domicilio fiscal',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'Domicilio', value: domicilioCoveCompleto }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function proveedorDestinatario({
  cove,
  cfdi,
  traceId,
}: { cove: Cove; cfdi?: OCR; traceId: string }) {
  const validationsPromise = await Promise.all([
    validateDatosGeneralesProveedor(traceId, cove, cfdi),
    validateDomicilioProveedor(traceId, cove, cfdi),
    validateDatosGeneralesDestinatario(traceId, cove, cfdi),
    validateDomicilioDestinatario(traceId, cove, cfdi),
  ]);

  return {
    sectionName: 'Datos Proveedor Destinatario',
    validations: validationsPromise,
  };
}
