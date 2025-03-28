import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import type { z } from 'zod';
import type { DocumentType } from '../utils';

export async function extractTextFromImageOpenAI<T extends z.ZodType>(
  pdfFile: File,
  documentType: DocumentType,
  schema: T,
  traceId: string
) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString(
    'base64'
  );
  const { object } = await generateObject({
    model: openai.responses('gpt-4o'),
    experimental_telemetry: {
      isEnabled: true,
      functionId: `extract_${documentType}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        documentType,
      },
    },
    schema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `El tipo de documento es ${documentType}. Estructura el documento en base al esquema proporcionado.`,
          },
          {
            type: 'file',
            data: `data:application/pdf;base64,${base64Data}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  return object;
}
