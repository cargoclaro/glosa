import { z } from "zod"

export const facturaSchema = z.object({
  mainTable: z.array(z.object({
    cantidad: z.number().describe("It's under the first column of the table, as 'Cantidad'"),
  })).describe("It's the main table of the factura, it indicates the products and their quantities, among other things."),
  folioFiscal: z.string().describe("It's a UUID that represents the cfdi identifier. It appears under the table as 'Folio Fiscal'"),
  fechaYHoraDeCertificacion: z.string().describe("It's the date and time of the certification of the factura. It appears under the table as 'Fecha y Hora de Certificación'"),
});

export type Factura = z.infer<typeof facturaSchema>;
