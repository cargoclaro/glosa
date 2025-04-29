import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { packingListSchema } from '../schemas';

export async function extractAndStructurePackingList(
  file: File,
  parentTraceId: string
) {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash-preview-04-17'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Packing List',
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false,
        fileName: file.name,
      },
    },
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
            data: `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`,
            mimeType: file.type,
          },
        ],
      },
    ],
  });

  return object;
}
