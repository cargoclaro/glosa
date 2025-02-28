import { z } from "zod"

export type TransportDocument = z.infer<typeof transportDocumentSchema>;

export const transportDocumentSchema = z.object({
  document_type: z
    .enum(["AIR", "SEA", "LAND"])
    .describe(
      "The type of transport based on the document: AIR (Guía Aérea), SEA (Conocimiento de Embarque), LAND (Carta Porte)"
    ),
  document_number: z
    .string()
    .describe(
      "The unique document number for the transport document. Example: 1000175MEX. In case of air transport, it is the House Air Waybill Number and Master Air Waybill Number. In case of sea transport, it is the Bill of Lading Number."
    ),
  entry_date: z
    .string()
    .describe("The date of entry in YYYY-MM-DD format."),
  origin_country: z
    .string()
    .describe(
      "The country of origin for the shipment using ISO 3166-1 alpha-3 country codes"
    ),
  destination_country: z
    .string()
    .describe(
      "The destination country for the shipment using ISO 3166-1 alpha-3 country codes"
    ),
  number_of_packages: z
    .number()
    .int()
    .describe("The total number of packages in the shipment."),
  net_weight: z
    .number()
    .describe("The total net weight of the shipment in kilograms.")
    .optional(),
  gross_weight: z
    .number()
    .describe("The total gross weight of the shipment in kilograms."),
  unit_of_measure: z
    .string()
    .describe("Unit of measure, e.g., 'KG', 'G', 'T', 'LB', 'OZ'")
    .optional(),
  collect_value: z
    .object({
      valor: z.number(),
      moneda: z
        .string()
        .describe("ISO 4217 currency code (e.g., USD, MXN)")
    })
    .describe(
      "Total collect charges. Also known as Total Freight Charge in some documents. Only linked to freight charges."
    ),
  value_of_goods: z
    .object({
      valor: z.number(),
      moneda: z
        .string()
        .describe("ISO 4217 currency code (e.g., USD, MXN)")
    })
    .describe("Total value of the goods"),
  is_prepaid: z
    .boolean()
    .describe(
      "Indicates whether the shipment is prepaid (true if 'PREPAID' is marked on the document, false otherwise)"
    ),
  currency: z
    .enum(["USD"])
    .describe("The currency code for collect charges"),
  costos_adicionales: z
    .object({
      incrementables: z
        .object({
          fletes: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional(),
          seguros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("Currency code (e.g., USD, MXN)")
            })
            .optional(),
          embalajes: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional(),
          otros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional()
        })
        .describe("Costs that are added to the commercial value")
        .optional(),
      decrementables: z
        .object({
          fletes: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional(),
          seguros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional(),
          carga: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional(),
          descarga: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional(),
          otros: z
            .object({
              valor: z.number(),
              moneda: z
                .string()
                .describe("ISO 4217 currency code (e.g., USD, MXN)")
            })
            .optional()
        })
        .describe("Costs that are deducted from the commercial value")
        .optional()
    })
    .describe("Additional costs associated with the transport"),
  mercancias: z
    .array(
      z.object({
        descripcion: z
          .string()
          .describe("Description of the good")
          .optional(),
        cantidad: z
          .number()
          .describe("Quantity of the good")
          .optional(),
        peso_neto: z
          .number()
          .describe("Net weight of the good")
          .optional(),
        peso_bruto: z
          .number()
          .describe("Gross weight of the good")
          .optional(),
        unidad: z
          .string()
          .describe("Unit of measure, e.g., 'KG', 'G', 'T', 'LB', 'OZ'")
          .optional(),
        precio_unitario: z
          .number()
          .describe("Unit price of the good")
          .optional(),
        precio_total: z
          .number()
          .describe("Total price of the good")
          .optional(),
        moneda: z
          .string()
          .describe("ISO 4217 currency code (e.g., USD, MXN)")
          .optional()
      })
    )
    .describe("List of transported goods"),
  document_summary: z
    .string()
    .describe(
      "A detailed summary of the processed transport document, including details of shipments and context that may be useful for a human. This field is mandatory and must be generated by the LLM, it is not provided in the document."
    )
})