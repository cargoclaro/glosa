import { z } from "zod"
import moment from 'moment'

export const listaDeFacturasSchema = z.array(z.object({
  facturaUUID: z.string().describe("Appears on a table as column name 'No. Factura'"),
  fecha: z.string()
    .describe("Appears on a table as column name 'Fecha'")
    .transform((fecha) => {
      return moment(fecha, 'DD/MM/YYYY');
    }),
  cantidadEnUMC: z.number().describe("Appears on a table as column name 'Cantidad en UMC'"),
  valorFacturaEnDolares: z.number().describe("Appears on a table as column name 'Valor Factura en Dolares'"),
}));

export type ListaDeFacturas = z.infer<typeof listaDeFacturasSchema>;
