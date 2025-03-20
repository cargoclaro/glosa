import { z } from 'zod';

export type Invoice = z.infer<typeof invoiceSchema>;

export const invoiceSchema = z.object({
  markdown_representation: z
    .string()
    .describe('Extrae todo el contenido del documento en formato markdown'),
});
