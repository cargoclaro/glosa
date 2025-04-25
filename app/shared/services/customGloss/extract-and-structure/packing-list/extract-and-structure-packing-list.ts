import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { packingListSchema } from '../schemas';

export async function extractAndStructurePackingList(
  fileUrl: string,
  parentTraceId?: string
) {
  const telemetryConfig = parentTraceId
    ? {
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'Packing List',
          metadata: {
            langfuseTraceId: parentTraceId,
            langfuseUpdateParent: false,
            fileUrl,
          },
        },
      }
    : {};
  const { object } = await generateObject({
    model: google('gemini-2.5-flash-preview-04-17'),
    seed: 42,
    ...telemetryConfig,
    schema: packingListSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Estructura el documento en base al esquema proporcionado.',
          },
          {
            type: 'file',
            data: `${fileUrl}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  return object;
}
