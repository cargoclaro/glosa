import { z } from 'zod';

export type PackingList = z.infer<typeof packingListSchema>;

export const packingListSchema = z.object({
  mercancias: z.array(z.object({
    cantidad: z.number(),
  })),
  pesoBruto: z.object({
    valor: z.number(),
    unidadDeMedida: z.enum(['kg', 'lb']).describe('La unidad de medida del peso bruto, si no se proporciona, basate en el lenguaje del documento para determinar si es libras o kilogramos'),
  }),
});
