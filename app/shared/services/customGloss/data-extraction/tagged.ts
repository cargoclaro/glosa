import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import type { z } from 'zod';
import type { DocumentType } from '../classification';

export async function structureTaggedText<T>(
  text: unknown,
  schema: z.ZodType<T>,
  documentType: DocumentType,
  traceId: string
): Promise<T> {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    experimental_telemetry: {
      isEnabled: true,
      functionId: `structure_${documentType}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        documentType,
      },
    },
    schema,
    prompt: `
      El tipo de documento es ${documentType}. Aqui esta el texto del tag del pdf:

      ${JSON.stringify(text, null, 2)}
    `,
  });
  return object;
}
