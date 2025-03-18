import { z } from 'zod';

export type Carta318 = z.infer<typeof carta318Schema>;

export const carta318Schema = z.object({
  markdown_representation: z
    .string()
    .describe('Extrae todo el contenido del documento en formato markdown'),
});
