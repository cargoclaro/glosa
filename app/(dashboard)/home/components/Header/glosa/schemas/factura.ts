import { z } from "zod"

export const facturaSchema = z.object({
  cantidades: z.array(z.number().describe("Appears on a table as column name 'Cantidad'")),
  folioFiscal: z.string().describe("It's a UUID that represents the cfdi identifier. It appears under the table as 'Folio Fiscal'"),
});

export type Factura = z.infer<typeof facturaSchema>;
