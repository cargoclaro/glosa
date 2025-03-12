import { z } from "zod"

export const listaDeFacturasSchema = z.object({
  facturasUUIDs: z.array(
    z
      .string()
      .describe("Appears on a table as column name 'No. Factura'")
  ),
});

export type ListaDeFacturas = z.infer<typeof listaDeFacturasSchema>;
