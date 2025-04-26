import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { datosGeneralesSchema, mercanciaSchema } from '../schemas';

export async function extractAndStructureCove(
  fileUrl: string,
  parentTraceId: string
) {
  const { text } = await generateText({
    model: google('gemini-2.5-pro-preview-03-25'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract cove',
      metadata: {
        langfuseTraceId: parentTraceId,
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
  const [{ object: datosGenerales }, { object: mercancias }] =
    await Promise.all([
      generateObject({
        model: google('gemini-2.5-flash-preview-04-17'),
        seed: 42,
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'Structure datos generales cove',
          metadata: {
            langfuseTraceId: parentTraceId,
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
        model: google('gemini-2.5-flash-preview-04-17'),
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
      }),
    ]);

  return {
    ...datosGenerales,
    mercancias,
  };
}
