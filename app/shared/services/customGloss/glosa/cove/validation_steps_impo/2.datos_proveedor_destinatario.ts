import { Cove } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice, Carta318 } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the supplier's general information in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateDatosGeneralesProveedor(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract supplier data from different sources
  const identificadorCove = cove.datos_generales_proveedor?.identificador;
  const tipoIdentificadorCove = cove.datos_generales_proveedor?.tipo_identificador;
  const nombreRazonSocialCove = cove.datos_generales_proveedor?.nombre_razon_social;

  const validation = {
    name: "Datos generales del proveedor",
    description: "Verificar que los siguientes datos coincidan entre el COVE y la factura/carta 318:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "Identificador", value: identificadorCove },
            { name: "Tipo de identificador", value: tipoIdentificadorCove },
            { name: "Nombre/Razón social", value: nombreRazonSocialCove }
          ]
        },
        factura: {
          data: [
            { name: "Factura", value: invoice }
          ]
        },
        carta318: {
          data: [
            { name: "Carta 318", value: carta318 }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the supplier's address in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateDomicilioProveedor(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract supplier address data from different sources
  const domicilioCove = cove.datos_generales_proveedor?.domicilio;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove ?
    [
      domicilioCove.calle,
      domicilioCove.numero_exterior,
      domicilioCove.colonia,
      domicilioCove.codigo_postal,
      domicilioCove.pais
    ].filter(Boolean).join(' ') : '';

  const validation = {
    name: "Domicilio del proveedor",
    description: "Verificar que el domicilio fiscal del proveedor coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Domicilio completo", value: domicilioCoveCompleto }]
        },
        factura: {
          data: [{ name: "Factura", value: invoice }]
        },
        carta318: {
          data: [{ name: "Carta 318", value: carta318 }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the recipient's general information in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateDatosGeneralesDestinatario(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract recipient data from different sources
  const rfcDestinatarioCove = cove.datos_generales_destinatario?.rfc_destinatario;
  const nombreRazonSocialCove = cove.datos_generales_destinatario?.nombre_razon_social;

  const validation = {
    name: "Datos generales del destinatario",
    description: "Verificar que los siguientes datos coincidan entre el COVE y la factura/carta 318:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "RFC Destinatario", value: rfcDestinatarioCove },
            { name: "Nombre/Razón social", value: nombreRazonSocialCove }
          ]
        },
        factura: {
          data: [
            { name: "Factura", value: invoice }
          ]
        },
        carta318: {
          data: [
            { name: "Carta 318", value: carta318 }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the recipient's address in the COVE document matches the relevant document.
 * For imports: Compares with the invoice or Carta 318. In case of discrepancy, Carta 318 takes precedence.
 */
export async function validateDomicilioDestinatario(
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract recipient address data from different sources
  const domicilioCove = cove.datos_generales_destinatario?.domicilio;

  // Compose full address string for comparison
  const domicilioCoveCompleto = domicilioCove ?
    [
      domicilioCove.calle,
      domicilioCove.numero_exterior,
      domicilioCove.colonia,
      domicilioCove.codigo_postal,
      domicilioCove.pais
    ].filter(Boolean).join(' ') : '';

  const validation = {
    name: "Domicilio del destinatario",
    description: "Verificar que el domicilio fiscal del destinatario coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        factura: {
          data: [{ name: "Factura", value: invoice }]
        },
        carta318: {
          data: [{ name: "Carta 318", value: carta318 }]
        }
      },
      [CustomGlossTabContextType.INFERRED]: {
        cove: {
          data: [{ name: "Domicilio completo", value: domicilioCoveCompleto }]
        },
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedChooseDocument = traceable(
  async ({ cove, invoice, carta318 }: { cove: Cove; invoice?: Invoice, carta318?: Carta318 }) => {
    const validationsPromise = await Promise.all([
      validateDatosGeneralesProveedor(cove, invoice, carta318),
      validateDomicilioProveedor(cove, invoice, carta318),
      validateDatosGeneralesDestinatario(cove, invoice, carta318),
      validateDomicilioDestinatario(cove, invoice, carta318),
    ]);
    
    return {
      sectionName: "Datos Proveedor Destinatario",
      validations: validationsPromise
    };
  },
  { name: "Cove S2: Datos Proveedor Destinatario" }
);
