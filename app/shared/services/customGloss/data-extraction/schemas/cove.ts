import moment from 'moment';
import { z } from 'zod';

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
    .nullable(),
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
    .nullable(),
  fecha_expedicion: z
    .string()
    .describe("Date of issuance of the document in 'DD-MM-YYYY' format.")
    .transform((dateStr, ctx) => {
      if (!dateStr) {
        return null;
      }

      const parsedDate = moment(dateStr, 'DD/MM/YYYY');

      if (!parsedDate.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid date format: ${dateStr}. Expected DD/MM/YYYY.`,
        });
        return null;
      }

      return parsedDate.toDate();
    }),
  observaciones: z
    .string()
    .describe('Additional observations noted in the document.')
    .nullable(),
  datos_generales_proveedor: z
    .object({
      tipo_identificador: z
        .string()
        .describe("Type of identifier, e.g., 'TAX ID' or 'RFC'.")
        .nullable(),
      identificador: z
        .string()
        .describe("Identifier value, e.g., '131881870'.")
        .nullable(),
      nombre_razon_social: z
        .string()
        .describe(
          "Supplier's name or business name, e.g., 'REVELL CHEMICALS INC.'."
        )
        .nullable(),
      domicilio: z
        .object({
          calle: z.string().describe("Street name, e.g., 'MASON STREET'."),
          numero_exterior: z.string().describe("External number, e.g., '35'."),
          numero_interior: z
            .string()
            .describe("Interior number, e.g., 'ROOM 420H'.")
            .nullable(),
          codigo_postal: z.string().describe("Postal code, e.g., '06830'."),
          colonia: z
            .string()
            .describe(
              "Neighborhood or subdivision, e.g., 'GREENWICH CONNECTICUT'."
            ),
          localidad: z
            .string()
            .describe("Locality, e.g., 'SHANGHAI'.")
            .nullable(),
          entidad_federativa: z
            .string()
            .describe(
              "Federal entity or state, e.g., 'CHINA (REPUBLICA POPULAR)'."
            )
            .nullable(),
          municipio: z.string().describe('Municipality.').nullable(),
          pais: z.string().describe("Country, e.g., 'USA'."),
        })
        .describe("Supplier's address details."),
    })
    .describe('General details about the supplier.'),
  datos_generales_destinatario: z
    .object({
      rfc_destinatario: z
        .string()
        .describe("Recipient's RFC, e.g., 'TMM210726PZ7'.")
        .nullable(),
      nombre_razon_social: z
        .string()
        .describe(
          "Recipient's name or business name, e.g., 'TARKETT MANUFACTURING MEXICO SA DE CV'."
        )
        .nullable(),
      domicilio: z
        .object({
          calle: z.string().describe("Street name, e.g., 'CANELA'."),
          numero_exterior: z.string().describe("External number, e.g., '229'."),
          numero_interior: z
            .string()
            .describe("Interior number, e.g., 'L3 B9 10 11 12 13a'.")
            .nullable(),
          codigo_postal: z.string().describe("Postal code, e.g., '08400'."),
          colonia: z
            .string()
            .describe("Neighborhood or subdivision, e.g., 'GRANJAS MEXICO'."),
          localidad: z
            .string()
            .describe("Locality, e.g., 'SAN LUIS POTOSI'.")
            .nullable(),
          entidad_federativa: z
            .string()
            .describe("Federal entity or state, e.g., 'SAN LUIS POTOSI'.")
            .nullable(),
          municipio: z
            .string()
            .describe("Municipality, e.g., 'SAN LUIS POTOSI'.")
            .nullable(),
          pais: z.string().describe("Country, e.g., 'MEX'."),
        })
        .describe("Recipient's address details."),
    })
    .describe('General details about the recipient.'),
  datos_mercancia: z.array(
    z
      .object({
        descripcion_mercancia: z
          .string()
          .describe(
            "Generic description of the merchandise, e.g., 'PIGMENTOS A BASE DE DIOXIDO DE TITANIO'."
          )
          .nullable(),
        clave_umc: z
          .string()
          .describe("Code for the unit of measurement, e.g., 'POUND'.")
          .nullable(),
        cantidad_umc: z
          .number()
          .describe(
            "Quantity of the merchandise in the specified unit of measurement, e.g., '11023.00'."
          )
          .nullable(),
        tipo_moneda: z
          .string()
          .describe(
            "Type of currency used in the transaction, e.g., 'US Dollar'."
          )
          .nullable(),
        valor_unitario: z
          .number()
          .describe("Unit value of the merchandise, e.g., '1.69'.")
          .nullable(),
        valor_total: z
          .number()
          .describe("Total value of the merchandise, e.g., '18628.87'.")
          .nullable(),
        valor_total_dolares: z
          .number()
          .describe("Total value of the merchandise in USD, e.g., '1866.00'.")
          .nullable(),
        numeros_serie: z
          .array(z.string())
          .describe(
            "Array of serial numbers for the merchandise, e.g., ['1234567890', '0987654321']."
          )
          .nullable(),
      })
      .describe('Details about the merchandise.')
  ),
  document_summary: z
    .string()
    .describe(
      'Un resumen detallado del documento COVE, incluyendo detalles de la transacción y contexto que puede ser útil para un humano. Este campo es obligatorio y debe ser generado por el LLM, no está proporcionado en el documento.'
    ),
});
