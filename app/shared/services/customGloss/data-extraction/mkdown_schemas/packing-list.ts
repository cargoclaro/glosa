import { z } from 'zod';

export type PackingList = z.infer<typeof packingListSchema>;

export const packingListSchema = z.object({
  markdown_representation: z
    .string()
    .describe('Extrae todo el contenido del documento en formato markdown'),
});
