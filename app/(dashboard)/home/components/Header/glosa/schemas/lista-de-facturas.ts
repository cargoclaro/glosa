import { z } from "zod"

export const listaDeFacturasSchema = z.array(z.object({
  facturaUUID: z.string().describe("Appears on a table as column name 'No. Factura'"),
  fecha: z.string().describe("Appears on a table as column name 'Fecha'"),
  cantidadEnUMC: z.number().describe("Appears on a table as column name 'Cantidad en UMC'"),
}));

export type ListaDeFacturas = z.infer<typeof listaDeFacturasSchema>;
