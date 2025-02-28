import { z } from "zod"

export const cfdiSchema = z.object({
  folio_fiscal: z.string().describe("Folio fiscal del CFDI."),
  certificado_sat: z.string().describe("Certificado del SAT."),
  fecha_certificacion: z
    .string()
    .describe("Fecha y hora de certificación."),
  fecha_emision: z.string().describe("Fecha y hora de emisión del CFDI."),
  tipo_comprobante: z
    .string()
    .describe("Tipo de comprobante (por ejemplo, 'I' para ingreso)."),
  condiciones_pago: z
    .string()
    .describe("Condiciones de pago del comprobante.")
    .optional(),
  moneda: z.string().describe("Moneda utilizada en el comprobante."),
  tipo_cambio: z
    .number()
    .describe("Tipo de cambio utilizado.")
    .optional(),
  metodo_pago: z.string().describe("Método de pago."),
  regimen_fiscal: z.string().describe("Régimen fiscal del emisor."),
  emisor: z.object({
    nombre: z.string(),
    rfc: z.string(),
    domicilio: z.string()
  }),
  receptor: z.object({
    nombre: z.string(),
    rfc: z.string(),
    domicilio: z.string()
  }),
  conceptos: z.array(
    z.object({
      codigo_producto: z.string(),
      descripcion: z.string(),
      cantidad: z.number(),
      unidad: z.string(),
      precio_unitario: z.number(),
      importe: z.number(),
      objeto_impuesto: z.string().optional()
    })
  ),
  subtotal: z.number().describe("Subtotal del comprobante."),
  descuentos: z
    .number()
    .describe("Descuentos aplicados, si los hay.")
    .optional(),
  impuestos_trasladados: z
    .number()
    .describe("Impuestos trasladados en el comprobante.")
    .optional(),
  impuestos_retenidos: z
    .number()
    .describe("Impuestos retenidos en el comprobante.")
    .optional(),
  total: z.number().describe("Total del comprobante."),
  forma_pago: z
    .string()
    .describe("Forma de pago utilizada.")
    .optional(),
  uuid: z.string().describe("UUID del CFDI."),
  version: z.string().describe("Versión del CFDI."),
  document_summary: z
    .string()
    .describe(
      "Un resumen detallado de todos los CFDIs procesados, incluyendo detalles de las transacciones y contexto que puede ser útil para un humano. Este campo es obligatorio y debe ser generado por el LLM, no está proporcionado en el documento."
    )
})
