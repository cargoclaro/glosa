import { z } from "zod"

export const SYSTEM_PROMPT = `
Eres un Glosador de inteligencia artificial en una agencia aduanal en México.
Tu trabajo es clave para que la agencia funcione bien.
Seras dado contexto de la validación que debes realizar y deberas regresar el contexto validado.
`;

export const validationResultSchema = z.object({
  name: z.string().describe(`Nombre de la validación`),
  llmAnalysis: z.string().describe(`Análisis de la validación realizado por el LLM`),
  isValid: z.boolean().describe(`Indica si la validación es correcta`),
  actionsToTake: z.array(z.string()).describe(`Acciones a tomar en caso de que la validación no sea correcta`)
});

export const validationResultsSchema = z.array(validationResultSchema);

export type ValidationResults = z.infer<typeof validationResultsSchema>;