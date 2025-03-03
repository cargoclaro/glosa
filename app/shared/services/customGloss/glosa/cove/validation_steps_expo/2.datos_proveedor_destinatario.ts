import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";
import { Cfdi } from "../../../data-extraction/schemas/cfdi";
import { CustomGlossTabContextType } from "@prisma/client";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the supplier's general information in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
export async function validateDatosGeneralesProveedor(
  cove: Cove,
  cfdi?: Cfdi
) {
  // Extract supplier data from different sources
  const identificadorCove = cove.datos_generales_proveedor?.identificador;
  const tipoIdentificadorCove = cove.datos_generales_proveedor?.tipo_identificador;
  const nombreRazonSocialCove = cove.datos_generales_proveedor?.nombre_razon_social;

  // Export: get data from CFDI
  const nombreRazonSocialCfdi = cfdi?.emisor?.nombre;
  const identificadorCfdi = cfdi?.emisor?.rfc;

  const validation = {
    name: "Datos generales del proveedor",
    description: "Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "Identificador", value: identificadorCove },
            { name: "Tipo Identificador", value: tipoIdentificadorCove },
            { name: "Nombre Razón Social", value: nombreRazonSocialCove }
          ]
        },
        cfdi: {
          data: [
            { name: "Nombre Razón Social", value: nombreRazonSocialCfdi },
            { name: "Identificador", value: identificadorCfdi }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the supplier's address in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
export async function validateDomicilioProveedor(
  cove: Cove,
  cfdi?: Cfdi
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

  // Export: get data from CFDI
  const domicilioCfdi = cfdi?.emisor?.domicilio;

  const validation = {
    name: "Domicilio del proveedor",
    description: "Verificar que el domicilio fiscal del proveedor coincida entre el COVE y el CFDI:\n\n• Domicilio fiscal",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Domicilio", value: domicilioCoveCompleto }]
        },
        cfdi: {
          data: [{ name: "Domicilio", value: domicilioCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the recipient's general information in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
export async function validateDatosGeneralesDestinatario(
  cove: Cove,
  cfdi?: Cfdi
) {
  // Extract recipient data from different sources
  const rfcDestinatarioCove = cove.datos_generales_destinatario?.rfc_destinatario;
  const nombreRazonSocialCove = cove.datos_generales_destinatario?.nombre_razon_social;

  // Export: get data from CFDI
  const nombreRazonSocialCfdi = cfdi?.receptor?.nombre;
  const rfcCfdi = cfdi?.receptor?.rfc;

  const validation = {
    name: "Datos generales del destinatario",
    description: "Verificar que los siguientes datos coincidan entre el COVE y el CFDI:\n\n• RFC\n• Razón social\n Si no hay RFC, el tipo de identificador que tenga (tax id, tax id number, tax id number, etc) debe de coincidir.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [
            { name: "RFC", value: rfcDestinatarioCove },
            { name: "Nombre Razón Social", value: nombreRazonSocialCove }
          ]
        },
        cfdi: {
          data: [
            { name: "Nombre Razón Social", value: nombreRazonSocialCfdi },
            { name: "RFC", value: rfcCfdi }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the recipient's address in the COVE document matches the relevant document.
 * For exports: Compares with the CFDI.
 */
export async function validateDomicilioDestinatario(
  cove: Cove,
  cfdi?: Cfdi
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

  // Export: get data from CFDI
  const domicilioCfdi = cfdi?.receptor?.domicilio;

  const validation = {
    name: "Domicilio del destinatario",
    description: "Verificar que el domicilio fiscal del destinatario coincida entre el COVE y el CFDI:\n\n• Domicilio fiscal",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Domicilio", value: domicilioCoveCompleto }]
        },
        cfdi: {
          data: [{ name: "Domicilio", value: domicilioCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
} 

export const tracedProveedorDestinatario = traceable(
  async ({ cove, cfdi }: { cove: Cove; cfdi?: Cfdi }) => {
    const validationsPromise = Promise.all([
      validateDatosGeneralesProveedor(cove, cfdi),
      validateDomicilioProveedor(cove, cfdi),
      validateDatosGeneralesDestinatario(cove, cfdi),
      validateDomicilioDestinatario(cove, cfdi),
    ]);
    
    return {
      sectionName: "Datos Proveedor Destinatario",
      validations: validationsPromise
    };
  },
  { name: "Cove S2: Datos Proveedor Destinatario" }
);
