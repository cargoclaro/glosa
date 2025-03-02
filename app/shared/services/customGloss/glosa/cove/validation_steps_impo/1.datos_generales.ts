import { Cove } from "../../../data-extraction/schemas/cove";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice } from "../../../data-extraction/schemas/invoice";
import { Carta318 } from "../../../data-extraction/schemas/carta-318";

/**
 * Validates that the invoice number in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's invoice number takes precedence.
 */
export async function validateNumeroFactura(cove: Cove, invoice: Invoice, carta318?: Carta318) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;
  const numeroFacturaInvoice = invoice.invoice_number;
  const numeroFacturaCarta318 = carta318?.factura?.numero_factura;

  const validation = {
    name: "Número de Factura (Importación)",
    description: "El número de factura del COVE debe coincidir con el número de factura en la factura comercial (puede aparecer como Invoice Number, Invoice No, Invoice #) o en la carta 318. En caso de discrepancia, prevalece el número indicado en la carta 318.",
    contexts: {
      cove: {
        type: CustomGlossTabContextType.PROVIDED,
        data: [{ name: "Número de Factura", value: numeroFacturaCove }]
      },
      factura: {
        type: CustomGlossTabContextType.PROVIDED,
        data: [{ name: "Número de Factura", value: numeroFacturaInvoice }]
      },
      carta318: {
        type: CustomGlossTabContextType.PROVIDED,
        data: [{ name: "Número de Factura", value: numeroFacturaCarta318 }]
      }
    }
  } as const;
  return await glosar(validation);
}

/**
 * Validates that the invoice date in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's date takes precedence.
 */
export async function validateFechaExpedicion(cove: Cove, invoice: Invoice, carta318?: Carta318) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;
  const fechaExpedicionInvoice = invoice.invoice_date;
  const fechaExpedicionCarta318 = carta318?.factura?.fecha_factura;

  const validation = {
    name: "Fecha de Expedición (Importación)",
    description: "La fecha de expedición del COVE debe coincidir con la fecha de la factura comercial (puede aparecer como Invoice Date, Date) o en la carta 318. En caso de discrepancia, prevalece la fecha indicada en la carta 318.",
    contexts: {
      cove: {
        type: CustomGlossTabContextType.PROVIDED,
        data: [{ name: "Fecha de Expedición", value: fechaExpedicionCove }]
      },
      factura: {
        type: CustomGlossTabContextType.PROVIDED,
        data: [{ name: "Fecha de Expedición", value: fechaExpedicionInvoice }]
      },
      carta318: {
        type: CustomGlossTabContextType.PROVIDED,
        data: [{ name: "Fecha de Expedición", value: fechaExpedicionCarta318 }]
      }
    }
  } as const;

  return await glosar(validation);
}
