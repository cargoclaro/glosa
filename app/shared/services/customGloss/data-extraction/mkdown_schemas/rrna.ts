import { z } from 'zod';

export type Rrna = z.infer<typeof rrnaSchema>;

export const rrnaSchema = z.object({
  markdown_representation: z
    .string()
    .describe('Extrae todo el contenido del documento en formato markdown'),
});
