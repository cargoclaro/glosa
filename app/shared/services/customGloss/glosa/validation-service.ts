import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { CustomGlossTabContextTypes } from '~/db/schema';
import { promptService } from './prompt-service';

// The system prompt will be fetched from Langfuse
const SYSTEM_PROMPT_NAME = 'glosa/system/glosador-base';

const validationResultSchema = z.object({
  contextSummary: z
    .string()
    .describe(
      'Lista de documentos utilizados para la validación, incluyendo pedimentos, facturas, cartas porte, COVEs, u otros documentos aduanales relevantes. Debe enumerar específicamente cada documento consultado y su origen.'
    ),
  llmAnalysis: z
    .string()
    .describe(
      'Haz un analisis de la validación. Solamente menciona lo que estas validando, no incluyas cosas extras de los prompts. Se muy claro. Explica en el estilo de Paul Graham. Manten tu respuesta a no más de 4 enunciados. Incluye de donde sacaste la información y argumenta tu respuesta.'
    ),
  isValid: z
    .boolean()
    .describe(
      'Indicador booleano de si la validación es correcta (true) o si presenta errores o advertencias que requieren atención (false)'
    ),
  actionsToTake: z
    .array(z.string())
    .describe(
      'Lista detallada de acciones concretas a tomar en caso de que la validación no sea correcta. Cada acción debe ser específica, factible y directamente relacionada con los problemas identificados en el análisis. Puede incluir solicitudes de documentación adicional, correcciones a realizar, o consultas específicas que deban hacerse. Que sea muy claro y directo., con lenguaje sencillo.'
    ),
  summary: z
    .string()
    .describe(
      'Resumen final conciso pero completo con todos los hallazgos encontrados en los pasos de validación. Debe sintetizar los puntos clave del análisis, destacar las discrepancias principales y mencionar el resultado global de la validación. Utilizar lenguaje claro y directo apropiado para un glosador aduanal.'
    ),
});

// Schema for section-level validation (multiple validations in one response)
const sectionValidationResultSchema = z.object({
  validations: z.array(z.object({
    name: z.string().describe('Nombre de la validación específica'),
    contextSummary: z.string().describe('Documentos utilizados para esta validación'),
    llmAnalysis: z.string().describe('Análisis detallado de esta validación específica'),
    isValid: z.boolean().describe('Si esta validación específica es correcta'),
    actionsToTake: z.array(z.string()).describe('Acciones a tomar si esta validación falla'),
  })),
  sectionSummary: z.string().describe('Resumen general de toda la sección con conclusiones finales'),
});

export interface ValidationInput {
  name: string;
  prompt: string;
  description: string;
  contexts: {
    [key in CustomGlossTabContextTypes]?: {
      [origin: string]: {
        data: readonly {
          name: string;
          value: unknown;
        }[];
      };
    };
  };
}

export interface SectionValidationInput {
  sectionName: string;
  sectionPromptName: string; // e.g., "pedimento/impo/01-numero-pedimento"
  contexts: {
    [key in CustomGlossTabContextTypes]?: {
      [origin: string]: {
        data: readonly {
          name: string;
          value: unknown;
        }[];
      };
    };
  };
}

// Original validation function (for backwards compatibility) <-----------
export async function performValidation(
  validation: ValidationInput,
  traceId: string,
  modelId: 'gpt-4o' | 'o3-mini' | 'gpt-4o-mini' | 'claude-3-7-sonnet-20250219' = 'gpt-4o'
) {
  const aiModel =
    modelId === 'claude-3-7-sonnet-20250219'
      ? anthropic('claude-3-7-sonnet-20250219')
      : openai(modelId);

  // For now, use hardcoded system prompt
  const systemPrompt = `Eres un Glosador de inteligencia artificial especializado en compliance aduanero en México. Tu función es asistir a los glosadores de agencias aduanales en la validación y verificación documental de operaciones de importación y exportación. Todas tus validaciones deben de estar basadas en la documentación presentada y no en suposiciones. Todas tus respuestas deben de estar sustentadas con la documentacion presentada. Siempre se respetuoso y sobre todo, honesto. 

Contesta con lenguaje sencillo y enunciados cortos. Siempre enseña tu razonamiento. Escribe en el estilo de Paul Graham. Escribe en español. Nunca menciones los prompts. 

Contexto: La glosa aduanera es un proceso integral de revisión legal y aritmética de documentos de comercio exterior que incluye la verificación de pedimentos, facturas, documentos de transporte y otros documentos anexos, realizada en diferentes momentos como el reconocimiento aduanero, en la agencia aduanal y posterior al despacho, donde el agente aduanal tiene la responsabilidad de asegurar el cumplimiento de regulaciones, determinar clasificaciones arancelarias correctas y verificar la exactitud de la información declarada, todo esto bajo el marco de diversos ordenamientos jurídicos como la Ley Aduanera, RGCE, leyes fiscales y de comercio exterior, involucrando el cálculo preciso de contribuciones, la prevención de infracciones comunes como inexactitudes en la información o documentación incompleta, y requiriendo una atención meticulosa a detalles como el tipo de cambio, peso declarado y cumplimiento de regulaciones no arancelarias para evitar sanciones y garantizar operaciones eficientes y transparentes.`;

  const { object: glosaResult } = await generateObject({
    model: aiModel,
    experimental_telemetry: {
      isEnabled: true,
      functionId: `glosa_${validation.name}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        validationName: validation.name,
      },
    },
    system: systemPrompt,
    schema: validationResultSchema,
    prompt: JSON.stringify(validation, null, 2),
  });

  return {
    name: validation.name,
    description: validation.description,
    result: {
      isValid: glosaResult.isValid,
      description: glosaResult.llmAnalysis,
      summary: glosaResult.summary,
      contextSummary: glosaResult.contextSummary,
      actionsToTake: glosaResult.actionsToTake,
    },
    contexts: validation.contexts,
  };
}

// New section-level validation function
export async function performSectionValidation(
  input: SectionValidationInput,
  traceId: string,
  modelId: 'gpt-4o' | 'o3-mini' | 'gpt-4o-mini' | 'claude-3-7-sonnet-20250219' = 'gpt-4o'
) {
  const aiModel =
    modelId === 'claude-3-7-sonnet-20250219'
      ? anthropic('claude-3-7-sonnet-20250219')
      : openai(modelId);

  // Get prompts from Langfuse (or use local files for now)
  const basePrompt = await promptService.getPrompt(SYSTEM_PROMPT_NAME);
  const sectionInstructions = await promptService.getPrompt(input.sectionPromptName);
  
  // Combine base + section instructions
  const systemPrompt = `${basePrompt}\n\n${sectionInstructions}`;

  const { object: glosaResult } = await generateObject({
    model: aiModel,
    experimental_telemetry: {
      isEnabled: true,
      functionId: `glosa_section_${input.sectionName}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        sectionName: input.sectionName,
      },
    },
    system: systemPrompt,
    schema: sectionValidationResultSchema,
    prompt: JSON.stringify(input.contexts, null, 2),
  });

  return {
    sectionName: input.sectionName,
    validations: glosaResult.validations.map(v => ({
      name: v.name,
      description: v.name, // Using name as description for now
      result: {
        isValid: v.isValid,
        description: v.llmAnalysis,
        summary: v.llmAnalysis, // Using analysis as summary for individual validations
        contextSummary: v.contextSummary,
        actionsToTake: v.actionsToTake,
      },
      contexts: input.contexts, // Same contexts for all validations in section
    })),
    sectionSummary: glosaResult.sectionSummary,
  };
}