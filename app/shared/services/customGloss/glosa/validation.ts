import { z } from "zod"

export type Validations = z.infer<typeof validationsSchema>;

export const validationsSchema = z.array(
  z.object({
    name: z.string().describe(`Nombre de la validación`),
    llmAnalysis: z.string().describe(`Análisis de la validación realizado por el LLM`),
    isValid: z.boolean().describe(`Indica si la validación es correcta`),
    actionsToTake: z.array(z.string()).describe(`Acciones a tomar en caso de que la validación no sea correcta`)
  })
);
