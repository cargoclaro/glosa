import moment from 'moment';
import { z } from 'zod';

export const listaDeFacturasSchema = z.object({
  peso: z.number().describe("Appears as 'Peso', on top of the table"),
  facturas: z.array(
    z.object({
      facturaUUID: z
        .string()
        .describe("Appears on a table as column name 'No. Factura'"),
      fecha: z
        .string()
        .describe("Appears on a table as column name 'Fecha'")
        .transform((fecha) => {
          return moment(fecha, 'DD/MM/YYYY');
        }),
      cantidadEnUMC: z
        .number()
        .describe("Appears on a table as column name 'Cantidad en UMC'"),
      valorFacturaEnDolares: z
        .number()
        .describe(
          "Appears on a table as column name 'Valor Factura en Dolares'"
        ),
    })
  ),
});

export type ListaDeFacturas = z.infer<typeof listaDeFacturasSchema>;
