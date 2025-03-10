import { z } from "zod"

export type CartaSesion = z.infer<typeof cartaSesionSchema>;

export const cartaSesionSchema = z.object({
  markdown_representation: z.string().describe("Extrae todo el contenido del documento en formato markdown"),
});