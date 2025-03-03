import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice } from "../../../data-extraction/schemas/invoice";
import { Carta318 } from "../../../data-extraction/schemas/carta-318";

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

  // Import: get data from Invoice and Carta318
  const nombreRazonSocialInvoice = invoice?.seller_details?.name;
  const nombreRazonSocialCarta318 = carta318?.proveedor_comprador?.nombre;
  const identificadorCarta318 = carta318?.proveedor_comprador?.tax_id;

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
            { name: "Nombre/Razón social", value: nombreRazonSocialInvoice }
          ]
        },
        carta318: {
          data: [
            { name: "Nombre/Razón social", value: nombreRazonSocialCarta318 },
            { name: "Identificador", value: identificadorCarta318 }
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

  // Import: get data from Invoice and Carta318
  const domicilioInvoice = invoice?.seller_details?.address;
  const domicilioCarta318 = carta318?.proveedor_comprador?.domicilio;

  const validation = {
    name: "Domicilio del proveedor",
    description: "Verificar que el domicilio fiscal del proveedor coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Domicilio completo", value: domicilioCoveCompleto }]
        },
        factura: {
          data: [{ name: "Domicilio", value: domicilioInvoice }]
        },
        carta318: {
          data: [{ name: "Domicilio", value: domicilioCarta318 }]
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

  // Import: get data from Invoice and Carta318
  const nombreRazonSocialInvoice = invoice?.bill_to?.name;
  const nombreRazonSocialImportador = carta318?.importador_exportador?.nombre;
  const rfcImportador = carta318?.importador_exportador?.rfc;

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
            { name: "Nombre/Razón social", value: nombreRazonSocialInvoice }
          ]
        },
        carta318: {
          data: [
            { name: "Nombre/Razón social", value: nombreRazonSocialImportador },
            { name: "RFC Importador", value: rfcImportador }
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

  // Import: get data from Invoice and Carta318
  const domicilioInvoice = invoice?.bill_to?.address;
  const domicilioImportador = carta318?.importador_exportador?.domicilio;

  const validation = {
    name: "Domicilio del destinatario",
    description: "Verificar que el domicilio fiscal del destinatario coincida entre el COVE y la factura/carta 318:\n\n• Domicilio fiscal",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        factura: {
          data: [{ name: "Domicilio", value: domicilioInvoice }]
        },
        carta318: {
          data: [{ name: "Domicilio", value: domicilioImportador }]
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
