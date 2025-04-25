import type {
  Carta318,
  Invoice,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

/**
 * Validates that the supplier's general information in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
async function validateDatosGeneralesProveedor(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract supplier data from different sources
  // Se supone que este valor siempre es el RFC en la importación
  const identificadorCove =
    cove.datosGeneralesDelProveedor.taxIdSinTaxIdRfcCurp;
  const tipoIdentificadorCove =
    cove.datosGeneralesDelProveedor.tipoDeIdentificador;
  const nombreRazonSocialCove =
    cove.datosGeneralesDelProveedor.nombresORazonSocial;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Datos generales del proveedor',
    description:
      'Validación que compara los datos generales del proveedor entre el COVE, la factura comercial y/o la carta 318, verificando que el RFC o identificador fiscal y la razón social coincidan en los documentos para operaciones de importación.',
    prompt:
      'Verificar que los siguientes datos coincidan entre el COVE y la factura y/o carta 318, con que coicida en la 318, esta bien:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            { name: 'Identificador', value: identificadorCove },
            { name: 'Tipo de identificador', value: tipoIdentificadorCove },
            { name: 'Nombre/Razón social', value: nombreRazonSocialCove },
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

/**
 * Validates that the supplier's address in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
async function validateDomicilioProveedor(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract supplier address data from different sources
  const domicilioCove = cove.domicilioDelProveedor;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numeroExterior,
        domicilioCove.numeroInterior,
        domicilioCove.colonia,
        domicilioCove.localidad,
        domicilioCove.municipio,
        domicilioCove.entidadFederativa,
        domicilioCove.codigoPostal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Domicilio del proveedor',
    description:
      'Validación que compara el domicilio fiscal del proveedor entre el COVE y la factura comercial o carta 318 para asegurar que coincidan en operaciones de importación. En caso de discrepancia, prevalece la información de la carta 318.',
    prompt:
      'Verificar que el domicilio fiscal del proveedor coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [{ name: 'Domicilio completo', value: domicilioCoveCompleto }],
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
 * Validates that the recipient's general information in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
async function validateDatosGeneralesDestinatario(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract recipient data from different sources
  // Se supone que este valor siempre es el RFC en la importación
  const rfcDestinatarioCove =
    cove.datosGeneralesDelDestinatario.taxIdSinTaxIdRfcCurp;
  const nombreRazonSocialCove =
    cove.datosGeneralesDelDestinatario.nombresORazonSocial;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Datos generales del destinatario',
    description:
      'Validación que compara los datos generales del destinatario entre el COVE y la factura comercial o carta 318 para asegurar que coincidan en operaciones de importación, incluyendo TAXID o identificador fiscal y razón social. En caso de discrepancia, prevalece la información de la carta 318.',
    prompt:
      'Verificar que los siguientes datos coincidan entre el COVE y la factura/carta 318:\n\n• TAXID\n• Razón social\n Si no hay TAXID, el tipo de identificador que tenga (tax id, tax id number, tax id number,) debe de coincidir.',
    contexts: {
      PROVIDED: {
        cove: {
          data: [
            { name: 'RFC Destinatario', value: rfcDestinatarioCove },
            { name: 'Nombre/Razón social', value: nombreRazonSocialCove },
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

  return await glosar(validation, traceId, 'o3-mini');
}

/**
 * Validates that the recipient's address in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
async function validateDomicilioDestinatario(
  traceId: string,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract recipient address data from different sources
  const domicilioCove = cove.domicilioDelDestinatario;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numeroExterior,
        domicilioCove.numeroInterior,
        domicilioCove.colonia,
        domicilioCove.localidad,
        domicilioCove.municipio,
        domicilioCove.entidadFederativa,
        domicilioCove.codigoPostal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Domicilio del destinatario',
    description:
      'Validación que compara el domicilio fiscal del destinatario entre el COVE y la factura comercial o carta 318 para asegurar que coincidan en operaciones de importación. En caso de discrepancia, prevalece la información de la carta 318.',
    prompt:
      'Verificar que el domicilio fiscal del destinatario coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal',
    contexts: {
      PROVIDED: {
        factura: {
          data: [{ name: 'Factura', value: invoiceMkdown }],
        },
        carta318: {
          data: [{ name: 'Carta 318', value: carta318Mkdown }],
        },
      },
      INFERRED: {
        cove: {
          data: [{ name: 'Domicilio completo', value: domicilioCoveCompleto }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

export async function proveedorDestinatario({
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
    validateDatosGeneralesProveedor(traceId, cove, invoice, carta318),
    validateDomicilioProveedor(traceId, cove, invoice, carta318),
    validateDatosGeneralesDestinatario(traceId, cove, invoice, carta318),
    validateDomicilioDestinatario(traceId, cove, invoice, carta318),
  ]);

  return {
    sectionName: 'Datos Proveedor Destinatario',
    validations: validationsPromise,
  };
}
