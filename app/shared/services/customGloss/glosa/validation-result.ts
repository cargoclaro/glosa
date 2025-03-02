import { generateObject } from "ai";
import { z } from "zod"
import { CustomGlossTabContextType } from "@prisma/client"
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";

const SYSTEM_PROMPT = `
Eres un Glosador de inteligencia artificial en una agencia aduanal en México.
Tu trabajo es clave para que la agencia funcione bien.
Seras dado contexto de la validación que debes realizar y deberas regresar el contexto validado.
`;

const validationResultSchema = z.object({
  name: z.string().describe(`Nombre de la validación`),
  llmAnalysis: z.string().describe(`Análisis de la validación realizado por el LLM`),
  isValid: z.boolean().describe(`Indica si la validación es correcta`),
  actionsToTake: z.array(z.string()).describe(`Acciones a tomar en caso de que la validación no sea correcta`)
});

export async function glosar(validation: {
  name: string;
  description: string;
  contexts: {
    [key in CustomGlossTabContextType]?: {
      [origin: string]: {
        data: readonly {
          name: string;
          value: unknown;
        }[];
      };
    };
  };
}) {
  const { object: glosaResult } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Glosar ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return {
    validation: glosaResult,
    contexts: validation.contexts
  };
}
