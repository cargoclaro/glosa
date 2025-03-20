import { z } from 'zod';

export type Cfdi = z.infer<typeof cfdiSchema>;

export const cfdiSchema = z.object({
  markdown_representation: z
    .string()
    .describe('Extrae todo el contenido del documento en formato markdown'),
});
