import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { datosGeneralesSchema, mercanciaSchema } from '../schemas';

export async function extractAndStructureCove(
  file: File,
  parentTraceId: string
) {
  const fileData = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;
  
  const { text } = await generateText({
    model: google('gemini-2.5-pro-preview-03-25'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract cove',
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false,
        fileName: file.name,
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
            data: fileData,
            mimeType: file.type,
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
            fileName: file.name,
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
            fileName: file.name,
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
