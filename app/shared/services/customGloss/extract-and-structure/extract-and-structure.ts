import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
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
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract cove',
      metadata: {
        langfuseTraceId: parentTraceId ?? '',
        langfuseUpdateParent: false,
        fileUrl,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe the pdf to markdown',
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
  const [
    { object: datosGenerales },
    { object: mercancias }
  ] = await Promise.all([
    generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Structure datos generales cove',
        metadata: {
          langfuseTraceId: parentTraceId ?? '',
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
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
              type: 'text',
              text,
            },
          ],
        },
      ],
    }),
    generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Structure mercancias cove',
        metadata: {
          langfuseTraceId: parentTraceId ?? '',
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
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
              type: 'text',
              text,
            },
          ],
        },
      ],
    })
  ]);

  return {
    ...datosGenerales,
    mercancias,
  };
}
