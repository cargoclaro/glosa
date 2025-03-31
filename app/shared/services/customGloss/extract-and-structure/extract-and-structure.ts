import { google } from '@ai-sdk/google';
import { generateObject, NoObjectGeneratedError } from 'ai';
import { packingListSchema } from './schemas';

export async function extractAndStructurePackingList(
  fileUrl: string,
  parentTraceId?: string,
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
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
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
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return {
        type: 'NoObjectGenerated',
        message: error.message,
        cause: error.cause,
      };
    }
    return {
      type: 'UnknownError',
      message: 'Unknown error',
    };
  }
}
