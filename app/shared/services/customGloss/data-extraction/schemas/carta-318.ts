import { z } from "zod"

export type Carta318 = z.infer<typeof carta318Schema>;

export const carta318Schema = z.object({
  document_info: z
    .object({
      referencia: z
        .string()
        .describe(
          "Breve referencia del documento, un resumen de la información que contiene. Es contexto para un humano."
        ),
      fecha: z
        .string()
        .describe(
          "Fecha de emisión del documento en formato YYYY-MM-DD."
        ),
      destinatario: z
        .string()
        .describe("Nombre o cargo del destinatario del documento."),
      lugar_emision: z
        .string()
        .describe(
          "Lugar donde se emitió el documento, usualmente una ciudad o entidad."
        )
    })
    .describe("Información general del documento."),
  declaracion: z
    .string()
    .describe("Texto de la declaración bajo protesta de decir verdad."),
  factura: z
    .object({
      conocimiento_maritimo_aereo: z
        .string()
        .describe("Número de conocimiento marítimo o guía aérea.")
        .optional(),
      numero_factura: z
        .string()
        .describe("Número de la factura asociada."),
      fecha_factura: z
        .string()
        .describe(
          "Fecha de emisión de la factura en formato YYYY-MM-DD."
        ),
      contenedores: z
        .array(z.string())
        .describe("Lista de números de contenedores, si aplica.")
        .optional()
    })
    .describe("Detalles relacionados con la factura asociada."),
  importador: z
    .object({
      nombre: z
        .string()
        .describe("Nombre o razón social del importador."),
      direccion: z
        .string()
        .describe("Dirección completa del importador."),
      rfc: z
        .string()
        .describe("Identificador fiscal del importador (RFC)")
    })
    .describe("Información del importador."),
  proveedor: z
    .object({
      nombre: z.string().describe("Nombre o razón social del proveedor."),
      direccion: z.string().describe("Dirección completa del proveedor."),
      tax_id: z.string().describe("Identificador fiscal del proveedor.")
    })
    .describe("Información del proveedor."),
  termino_facturacion: z
    .string()
    .describe("Término de facturación, como EXW, FOB, etc."),
  detalle_facturacion: z
    .object({
      valor_comercial: z.object({
        valor: z.number(),
        moneda: z.string().describe("Código de moneda (e.g., USD, MXN)")
      }),
      incrementables: z
        .object({
          fletes: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          seguros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          embalajes: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          otros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional()
        })
        .describe("Costos incrementables")
        .optional(),
      decrementables: z
        .object({
          fletes: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          seguros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          carga: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          descarga: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional(),
          otros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Código de moneda (e.g., USD, MXN)")
            })
            .optional()
        })
        .describe("Costos decrementables")
        .optional()
    })
    .describe("Detalles de los costos asociados a la facturación."),
  valores_calculados: z
    .object({
      valor_dolares: z
        .number()
        .describe("Valor total en USD incluyendo incrementables"),
      valor_aduana: z.number().describe("Valor en aduana en MXN"),
      valor_comercial: z.number().describe("Valor comercial en MXN"),
      tipo_cambio_usado: z
        .number()
        .describe("Tipo de cambio DOF utilizado para los cálculos")
    })
    .describe("Valores calculados según reglas del DOF"),
  mercancias: z
    .array(
      z.object({
        descripcion: z.string().describe("Descripción de la mercancía."),
        cantidad: z.number().describe("Cantidad total de la mercancía."),
        unidad: z
          .string()
          .describe(
            "Unidad de medida de la mercancía, por ejemplo, 'pieza'."
          ),
        precio_unitario: z
          .number()
          .describe(
            "Precio unitario de la mercancía en la moneda especificada."
          ),
        precio_total: z
          .number()
          .describe(
            "Precio total de la mercancía en la moneda especificada."
          ),
        moneda: z
          .string()
          .describe("Moneda utilizada, por ejemplo, 'USD'.")
      })
    )
    .describe("Lista de mercancías incluidas en la factura."),
  representante_legal: z
    .object({
      nombre: z.string().describe("Nombre del representante legal."),
      cargo: z
        .string()
        .describe("Cargo del representante legal en la empresa."),
      empresa: z
        .string()
        .describe("Nombre de la empresa que representa."),
      direccion: z
        .string()
        .describe(
          "Dirección completa de la empresa del representante legal."
        )
    })
    .describe("Datos del representante legal que firma el documento."),
  document_summary: z
    .string()
    .describe(
      "Un resumen detallado de esta carta 3.1.8 específica, incluyendo detalles y contexto que puede ser útil para un humano. Este campo es obligatorio y debe ser generado por el LLM, no está proporcionado en el documento."
    )
})
