import { z } from 'zod';

export type PackingList = z.infer<typeof packingListSchema>;

export const packingListSchema = z.object({
  provider: z.object({
    name: z.string().describe('Full name of the exporting company'),
    address: z.string().describe('Complete address of the exporter'),
    igstn: z.string().describe('IGSTN number (Indian GST Number)'),
    iec_code: z.string().describe('IEC code (Import Export Code)'),
    pan_no: z.string().describe('PAN number (Permanent Account Number)'),
    invoice: z.object({
      number: z.string().describe('Invoice number'),
      date: z.string().describe('Invoice date (format DD.MM.YYYY)'),
      buyer_order: z.object({
        number: z.string().describe("Buyer's order number"),
        date: z.string().describe('Order date (format DD.MM.YYYY)'),
      }),
    }),
  }),
  consignee: z.object({
    name: z.string().describe('Name of the consignee'),
    tax_id: z.string().describe('Tax ID of the consignee'),
    address: z.string().describe('Complete address of the consignee'),
  }),
  shipment_details: z.object({
    origin_country: z.string().describe('Country of origin'),
    destination_country: z.string().describe('Country of destination'),
    terms: z.string().describe('Shipping terms (Incoterms)'),
    payment_terms: z.string().describe('Payment terms'),
    port_of_loading: z.string().describe('Port of loading'),
    port_of_discharge: z.string().describe('Port of discharge'),
  }),
  items: z.array(
    z.object({
      crate_no: z.number().int().describe('Crate number'),
      item: z.string().describe('Description of the item'),
      size: z.string().describe('Dimensions of the item'),
      pcs: z.number().int().describe('Number of pieces'),
      m2: z.number().describe('Square meters'),
      gross_weight: z.number().describe('Gross weight of the item'),
      net_weight: z
        .number()
        .describe(
          'Total net weight. Net weight is always equal or lower than gross weight.'
        ),
      unit_of_measure: z
        .string()
        .describe("Unit of measure, e.g., 'KG', 'G', 'T', 'LB', 'OZ'"),
    })
  ),
  totals: z.object({
    total_crates: z.number().int().describe('Total number of crates'),
    total_m2: z.number().describe('Total square meters'),
    total_gross_weight: z.number().describe('Total gross weight'),
    total_net_weight: z.number().describe('Total net weight'),
  }),
});
