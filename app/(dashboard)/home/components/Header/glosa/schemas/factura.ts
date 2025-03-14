import { z } from "zod"
import moment from "moment"

export const facturaSchema = z.object({
  mainTable: z.array(z.object({
    cantidad: z.number().describe("It's under the first column of the table, as 'Cantidad'"),
  })).describe("It's the main table of the factura, it indicates the products and their quantities, among other things."),
  pesoBrutoTotal: z
    .number()
    .describe(`
      It's the total weight of the factura's products, sometimes it is calculated from the 'Cantidad' column, when the measure unit is 'kg' or something similar, and sometimes it is written on a description under the table.
    `),
  folioFiscal: z.string().describe("It's a UUID that represents the cfdi identifier. It appears under the table as 'Folio Fiscal'"),
  fechaYHoraDeCertificacion: z
    .string()
    .describe("It's the date and time of the certification of the factura. It appears under the table as 'Fecha y Hora de Certificación'")
    .transform((fechaYHoraDeCertificacion) => {
      return moment(fechaYHoraDeCertificacion);
    }),
  importeTotal: z.number().describe("It's the total amount of the factura. It appears under the table as the sum of the merchandises values"),
});

export type Factura = z.infer<typeof facturaSchema>;
