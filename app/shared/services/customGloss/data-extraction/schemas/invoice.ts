import { z } from "zod"

export type Invoice = z.infer<typeof invoiceSchema>;

export const invoiceSchema = z
  .object({
    invoice_number: z.string().describe("Invoice number"),
    invoice_date: z
      .string()
      .describe("Invoice issue date in YYYY-MM-DD format or similar"),
    currency_code: z
      .string()
      .describe("Currency code in ISO 4217 format, e.g., 'USD', 'MXN'"),
    payment_terms: z
      .string()
      .describe("Payment terms, e.g., 'Net 30', 'Paid 30 days', etc."),
    purchase_order_number: z
      .string()
      .describe("Purchase order number related to the invoice"),
    seller_details: z
      .object({
        name: z.string().describe("Name of the selling company"),
        address: z.string().describe("Address of the selling company")
      })
      .describe("Information of the invoice issuer/seller"),
    bill_to: z
      .object({
        name: z
          .string()
          .describe("Name of the company/person receiving the invoice"),
        address: z.string().describe("Billing address")
      })
      .describe("Information about who is billed"),
    ship_to: z
      .object({
        name: z
          .string()
          .describe(
            "Name of the company/person to whom the order is sent"
          ),
        address: z.string().describe("Shipping address")
      })
      .describe("Information about where the goods are shipped"),
    items: z
      .array(
        z.object({
          description: z
            .string()
            .describe("Description of the product or service"),
          quantity: z.number().describe("Billed quantity"),
          unit_price: z.number().describe("Unit price"),
          line_amount: z
            .number()
            .describe("Total line amount (quantity * unit price)"),
          net_weight: z.number().describe("Net weight of the good"),
          gross_weight: z.number().describe("Gross weight of the good"),
          unit_of_measure: z
            .string()
            .describe(
              "Unit of measure, e.g., 'KG', 'G', 'T', 'LB', 'OZ'"
            )
        })
      )
      .describe("List of items or products in the invoice"),
    subtotal: z
      .number()
      .describe("Sum of all line items before taxes and additional charges")
      .optional(),
    discount_amount: z
      .number()
      .describe("Total discount amount applied to the invoice")
      .optional(),
    discount_percentage: z
      .number()
      .describe("Discount percentage (e.g., 0.10 for 10% discount)")
      .optional(),
    tax_amount: z
      .number()
      .describe("Total tax amount applied to the invoice")
      .optional(),
    tax_rate: z
      .number()
      .describe("Tax rate applied (e.g., 0.16 for 16% VAT/IVA)")
      .optional(),
    shipping_amount: z
      .number()
      .describe("Shipping or freight charges")
      .optional(),
    handling_amount: z
      .number()
      .describe("Handling or processing fees")
      .optional(),
    insurance_amount: z
      .number()
      .describe("Insurance charges")
      .optional(),
    additional_charges: z
      .array(
        z.object({
          description: z.string().describe("Description of the additional charge"),
          amount: z.number().describe("Amount of the additional charge"),
        })
      )
      .describe("Any additional charges not covered by other fields")
      .optional(),
    total_amount: z
      .number()
      .describe(
        "Total amount of the invoice including all charges and taxes"
      ),
    amount_due: z
      .number()
      .describe("Amount still due for payment (may differ from total if partially paid)")
      .optional(),
    amount_paid: z
      .number()
      .describe("Amount already paid")
      .optional(),
    valor_comercial: z
      .number()
      .describe("Commercial value of the goods before additional charges")
      .optional(),
    total_gross_weight: z
      .number()
      .describe("Total gross weight of the invoice")
      .optional(),
    total_net_weight: z
      .number()
      .describe("Total net weight of the invoice")
      .optional(),
    unit_of_measure: z
      .string()
      .describe("Unit of measure, e.g., 'KG', 'G', 'T', 'LB', 'OZ'")
      .optional(),
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
      .optional(),
    document_summary: z
      .string()
      .describe(
        "A detailed summary of the invoice(s), including key transaction details and context that may be useful for a human. This field is mandatory and must be generated by the LLM, not provided in the document."
      )
  })
  .describe("Data of an individual invoice")