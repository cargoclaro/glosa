import { Cove } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice, Carta318 } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the invoice number in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's invoice number takes precedence.
 */
export async function validateNumeroFactura(cove: Cove, invoice?: Invoice, carta318?: Carta318) {
  // Extract invoice numbers from different sources
  const numeroFacturaCove = cove.numero_factura;

  const validation = {
    name: "Número de Factura (Importación)",
    description: "El número de factura del COVE debe coincidir con el número de factura en la factura comercial (puede aparecer como Invoice Number, Invoice No, Invoice #) o en la carta 318. En caso de discrepancia, prevalece el número indicado en la carta 318.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Número de Factura", value: numeroFacturaCove }]
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
 * Validates that the invoice date in the COVE document matches other documents for imports.
 * In case of discrepancy, the Carta 318's date takes precedence.
 */
export async function validateFechaExpedicion(cove: Cove, invoice?: Invoice, carta318?: Carta318) {
  // Extract invoice dates from different sources
  const fechaExpedicionCove = cove.fecha_expedicion;

  const validation = {
    name: "Fecha de Expedición (Importación)",
    description: "La fecha de expedición del COVE debe coincidir con la fecha de la factura comercial (puede aparecer como Invoice Date, Date) o en la carta 318. En caso de discrepancia, prevalece la fecha indicada en la carta 318.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        cove: {
          data: [{ name: "Fecha de Expedición", value: fechaExpedicionCove }]
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

export const tracedDatosGenerales = traceable(
  async ({ cove, invoice, carta318 }: { cove: Cove; invoice?: Invoice, carta318?: Carta318 }) => {
    const validationsPromise = await Promise.all([
      validateNumeroFactura(cove, invoice, carta318),
      validateFechaExpedicion(cove, invoice, carta318),
    ]);
    
    return {
      sectionName: "Datos Generales",
      validations: validationsPromise
    };
  },
  { name: "Cove S1: Datos Generales" }
);
