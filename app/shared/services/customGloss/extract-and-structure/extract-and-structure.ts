import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { packingListSchema, datosGeneralesSchema, mercanciaSchema } from './schemas';

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
  const { object } = await generateObject({
    model: openai('gpt-4o-2024-11-20'),
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

export async function extractAndStructureCove(
  fileUrl: string,
  parentTraceId?: string,
) {
  const telemetryConfig = parentTraceId
    ? {
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Cove',
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
    } 
    : {};
  const { object: datosGenerales } = await generateObject({
    model: openai('gpt-4o-2024-11-20'),
    seed: 42,
    ...telemetryConfig,
    schema: datosGeneralesSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Structure the document based on the provided schema. Keep the text "exactly as is", no exceptions.',
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
  const { object: mercancias } = await generateObject({
    model: openai('gpt-4o-2024-11-20'),
    seed: 42,
    ...telemetryConfig,
    output: 'array',
    schema: mercanciaSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Structure the document based on the provided schema. Keep the text "exactly as is", no exceptions.',
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

  return {
    ...datosGenerales,
    mercancias,
  };
}
