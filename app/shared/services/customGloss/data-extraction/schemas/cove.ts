import { z } from "zod"

export type Cove = z.infer<typeof coveSchema>;

export const coveSchema = z.object({
  acuse_valor: z
    .string()
    .describe(
      "Unique identifier of the Acuse de Valor, e.g., 'COVE247163T13'."
    ),
  tipo_operacion: z
    .string()
    .describe("Type of operation, e.g., 'Importación' or 'Exportación'."),
  relacion_facturas: z
    .string()
    .describe(
      "Indicates if the operation is related to invoices, e.g., 'SIN RELACIÓN DE FACTURAS'."
    )
    .optional(),
  numero_factura: z
    .string()
    .describe(
      "Invoice number associated with the operation, e.g., '0060257-IN'."
    ),
  tipo_figura: z
    .string()
    .describe(
      "Type of figure involved in the operation, e.g., 'Agente Aduanal'."
    )
    .optional(),
  fecha_expedicion: z
    .string()
    .describe("Date of issuance of the document in 'YYYY-MM-DD' format.")
    .optional(),
  observaciones: z
    .string()
    .describe("Additional observations noted in the document.")
    .optional(),
  datos_generales_proveedor: z
    .object({
      tipo_identificador: z
        .string()
        .describe("Type of identifier, e.g., 'TAX ID' or 'RFC'.")
        .optional(),
      identificador: z
        .string()
        .describe("Identifier value, e.g., '131881870'.")
        .optional(),
      nombre_razon_social: z
        .string()
        .describe(
          "Supplier's name or business name, e.g., 'REVELL CHEMICALS INC.'."
        )
        .optional(),
      domicilio: z
        .object({
          calle: z
            .string()
            .describe("Street name, e.g., 'MASON STREET'.")
            .optional(),
          numero_exterior: z
            .string()
            .describe("External number, e.g., '35'.")
            .optional(),
          codigo_postal: z
            .string()
            .describe("Postal code, e.g., '06830'.")
            .optional(),
          colonia: z
            .string()
            .describe(
              "Neighborhood or subdivision, e.g., 'GREENWICH CONNECTICUT'."
            )
            .optional(),
          pais: z
            .string()
            .describe("Country, e.g., 'USA'.")
            .optional()
        })
        .describe("Supplier's address details.")
        .optional()
    })
    .describe("General details about the supplier."),
  datos_generales_destinatario: z
    .object({
      rfc_destinatario: z
        .string()
        .describe("Recipient's RFC, e.g., 'TMM210726PZ7'.")
        .optional(),
      nombre_razon_social: z
        .string()
        .describe(
          "Recipient's name or business name, e.g., 'TARKETT MANUFACTURING MEXICO SA DE CV'."
        )
        .optional(),
      domicilio: z
        .object({
          calle: z
            .string()
            .describe("Street name, e.g., 'CANELA'.")
            .optional(),
          numero_exterior: z
            .string()
            .describe("External number, e.g., '229'.")
            .optional(),
          codigo_postal: z
            .string()
            .describe("Postal code, e.g., '08400'.")
            .optional(),
          colonia: z
            .string()
            .describe("Neighborhood or subdivision, e.g., 'GRANJAS MEXICO'.")
            .optional(),
          pais: z
            .string()
            .describe("Country, e.g., 'MEX'.")
            .optional()
        })
        .describe("Recipient's address details.")
        .optional()
    })
    .describe("General details about the recipient."),
  datos_mercancia: z
    .object({
      descripcion_mercancia: z
        .string()
        .describe(
          "Generic description of the merchandise, e.g., 'PIGMENTOS A BASE DE DIOXIDO DE TITANIO'."
        )
        .optional(),
      clave_umc: z
        .string()
        .describe("Code for the unit of measurement, e.g., 'POUND'.")
        .optional(),
      cantidad_umc: z
        .number()
        .describe(
          "Quantity of the merchandise in the specified unit of measurement, e.g., '11023.00'."
        )
        .optional(),
      tipo_moneda: z
        .string()
        .describe(
          "Type of currency used in the transaction, e.g., 'US Dollar'."
        )
        .optional(),
      valor_unitario: z
        .number()
        .describe("Unit value of the merchandise, e.g., '1.69'.")
        .optional(),
      valor_total: z
        .number()
        .describe("Total value of the merchandise, e.g., '18628.87'.")
        .optional(),
      valor_total_dolares: z
        .number()
        .describe("Total value of the merchandise in USD, e.g., '1866.00'.")
        .optional(),
      numeros_serie: z
        .array(z.string())
        .describe("Array of serial numbers for the merchandise, e.g., ['1234567890', '0987654321'].")
        .optional()
    })
    .describe("Details about the merchandise."),
  document_summary: z
    .string()
    .describe(
      "Un resumen detallado del documento COVE, incluyendo detalles de la transacción y contexto que puede ser útil para un humano. Este campo es obligatorio y debe ser generado por el LLM, no está proporcionado en el documento."
    )
})
