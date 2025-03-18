import { z } from 'zod';

export type TransportDocument = z.infer<typeof transportDocumentSchema>;

export const transportDocumentSchema = z.object({
  markdown_representation: z
    .string()
    .describe('Extrae todo el contenido del documento en formato markdown'),
});
