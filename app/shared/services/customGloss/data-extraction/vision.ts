import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { DocumentType } from '../classification';

export async function extractTextFromImage(
  pdfFile: File,
  documentType: DocumentType,
  traceId: string
) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString(
    'base64'
  );
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    experimental_telemetry: {
      isEnabled: true,
      functionId: `extract_${documentType}`,
      metadata: {
        langfuseTraceId: traceId,
        langfuseUpdateParent: false,
        documentType,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe la informacion de la imagen en formato markdown.',
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

  return {
    markdown_representation: text,
  };
}
