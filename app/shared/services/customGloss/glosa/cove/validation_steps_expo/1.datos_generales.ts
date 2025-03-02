import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";
import { Cfdi } from "../../../data-extraction/schemas";
import { CustomGlossTabContextType } from "@prisma/client";

/**
 * Validates that the invoice number in the COVE document matches the CFDI for exports.
 */
export async function validateNumeroFactura(cove: Cove, cfdi: Cfdi) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;
  const numeroFacturaCfdi = cfdi.folio_fiscal;

  const validation = {
    name: "Número de Factura (Exportación)",
    description: "El número de factura del COVE debe coincidir con el folio fiscal del CFDI. En exportación, el CFDI es el documento de facturación oficial emitido por el exportador mexicano.",
    contexts: [
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cove",
        data: [{ name: "Número de Factura", value: numeroFacturaCove }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cfdi",
        data: [{ name: "Número de Factura", value: numeroFacturaCfdi }]
      }
    ]
  };

  return await glosar(validation);
}

/**
 * Validates that the invoice date in the COVE document matches the CFDI for exports.
 */
export async function validateFechaExpedicion(cove: Cove, cfdi: Cfdi) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;
  const fechaExpedicionCfdi = cfdi.fecha_emision;

  const validation = {
    name: "Fecha de Expedición (Exportación)",
    description: "La fecha de expedición del COVE debe coincidir con la fecha de emisión del CFDI. En exportación, el CFDI es el documento de facturación oficial emitido por el exportador mexicano.",
    contexts: [
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cove",
        data: [{ name: "Fecha de Expedición", value: fechaExpedicionCove }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cfdi",
        data: [{ name: "Fecha de Expedición", value: fechaExpedicionCfdi }]
      }
    ]
  };

  return await glosar(validation);
}

/**
 * Validates that the RFC in the COVE document matches other documents for exports.
 */
export async function validateRfc(cove: Cove, cfdi: Cfdi) {
  // Extract RFC values from different sources
  const rfcCove = cove.datos_generales_destinatario?.rfc_destinatario;
  const rfcCfdi = cfdi.emisor?.rfc;

  const validation = {
    name: "RFC (Exportación)",
    description: "El RFC del destinatario en el COVE debe coincidir con el RFC del emisor en el CFDI. En exportación, el emisor del CFDI es la empresa mexicana que realiza la exportación.",
    contexts: [
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cove",
        data: [{ name: "RFC", value: rfcCove }]
      },
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "cfdi",
        data: [{ name: "RFC", value: rfcCfdi }]
      }
    ]
  };

  return await glosar(validation);
}
