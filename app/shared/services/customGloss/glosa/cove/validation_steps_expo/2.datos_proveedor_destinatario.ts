import { CustomGlossTabContextType } from '@prisma/client';
import { traceable } from 'langsmith/traceable';
import type { Cfdi } from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the supplier's general information in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDatosGeneralesProveedor(cove: Cove, cfdi?: Cfdi) {
  // Extract supplier data from different sources
  const identificadorCove = cove.datos_generales_proveedor?.identificador;
  const tipoIdentificadorCove =
    cove.datos_generales_proveedor?.tipo_identificador;
  const nombreRazonSocialCove =
    cove.datos_generales_proveedor?.nombre_razon_social;
  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Datos generales del proveedor',
    description:
      'Validación que compara los datos generales del proveedor entre el COVE y el CFDI, verificando que el RFC o identificador fiscal y la razón social coincidan en ambos documentos para operaciones de exportación.',
    prompt:
      'Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
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

  return await glosar(validation);
}

/**
 * Validates that the supplier's address in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDomicilioProveedor(cove: Cove, cfdi?: Cfdi) {
  // Extract supplier address data from different sources
  const domicilioCove = cove.datos_generales_proveedor?.domicilio;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numero_exterior,
        domicilioCove.colonia,
        domicilioCove.codigo_postal,
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
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: 'Domicilio', value: domicilioCoveCompleto }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the recipient's general information in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDatosGeneralesDestinatario(cove: Cove, cfdi?: Cfdi) {
  // Extract recipient data from different sources
  const rfcDestinatarioCove =
    cove.datos_generales_destinatario?.rfc_destinatario;
  const nombreRazonSocialCove =
    cove.datos_generales_destinatario?.nombre_razon_social;
  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Datos generales del destinatario',
    description:
      'Validación que compara los datos generales del destinatario entre el COVE y el CFDI para asegurar que coincidan en operaciones de exportación, incluyendo RFC o identificador fiscal y razón social.',
    prompt:
      'Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
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

  return await glosar(validation);
}

/**
 * Validates that the recipient's address in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
async function validateDomicilioDestinatario(cove: Cove, cfdi?: Cfdi) {
  // Extract recipient address data from different sources
  const domicilioCove = cove.datos_generales_destinatario?.domicilio;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numero_exterior,
        domicilioCove.colonia,
        domicilioCove.codigo_postal,
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
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: 'Domicilio', value: domicilioCoveCompleto }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

export const tracedProveedorDestinatario = traceable(
  async ({ cove, cfdi }: { cove: Cove; cfdi?: Cfdi }) => {
    const validationsPromise = await Promise.all([
      validateDatosGeneralesProveedor(cove, cfdi),
      validateDomicilioProveedor(cove, cfdi),
      validateDatosGeneralesDestinatario(cove, cfdi),
      validateDomicilioDestinatario(cove, cfdi),
    ]);

    return {
      sectionName: 'Datos Proveedor Destinatario',
      validations: validationsPromise,
    };
  },
  { name: 'Cove S2: Datos Proveedor Destinatario' }
);
