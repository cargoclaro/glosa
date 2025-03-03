import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";
import { Cfdi } from "../../../data-extraction/schemas";
import { CustomGlossTabContextType } from "@prisma/client";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the invoice number in the COVE document matches the CFDI for exports.
 */
export async function validateNumeroFactura(cove: Cove, cfdi?: Cfdi) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;
  const numeroFacturaCfdi = cfdi?.folio_fiscal;

  const validation = {
    name: "Número de Factura (Exportación)",
    description: "El número de factura del COVE debe coincidir con el folio fiscal del CFDI. En exportación, el CFDI es el documento de facturación oficial emitido por el exportador mexicano.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Número de Factura", value: numeroFacturaCove }]
        },
        cfdi: {
          data: [{ name: "Número de Factura", value: numeroFacturaCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the invoice date in the COVE document matches the CFDI for exports.
 */
export async function validateFechaExpedicion(cove: Cove, cfdi?: Cfdi) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;
  const fechaExpedicionCfdi = cfdi?.fecha_emision;

  const validation = {
    name: "Fecha de Expedición (Exportación)",
    description: "La fecha de expedición del COVE debe coincidir con la fecha de emisión del CFDI. En exportación, el CFDI es el documento de facturación oficial emitido por el exportador mexicano.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Fecha de Expedición", value: fechaExpedicionCove }]
        },
        cfdi: {
          data: [{ name: "Fecha de Expedición", value: fechaExpedicionCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the RFC in the COVE document matches other documents for exports.
 */
export async function validateRfc(cove: Cove, cfdi?: Cfdi) {
  // Extract RFC values from different sources
  const rfcCove = cove.datos_generales_destinatario?.rfc_destinatario;
  const rfcCfdi = cfdi?.emisor?.rfc;

  const validation = {
    name: "RFC (Exportación)",
    description: "El RFC del destinatario en el COVE debe coincidir con el RFC del emisor en el CFDI. En exportación, el emisor del CFDI es la empresa mexicana que realiza la exportación.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "RFC", value: rfcCove }]
        },
        cfdi: {
          data: [{ name: "RFC", value: rfcCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedDatosGenerales = traceable(
  async ({ cove, cfdi }: { cove: Cove; cfdi?: Cfdi }) =>
    Promise.all([
      validateNumeroFactura(cove, cfdi),
      validateFechaExpedicion(cove, cfdi),
      validateRfc(cove, cfdi),
    ]),
  { name: "Cove S1: Datos Generales" }
);
