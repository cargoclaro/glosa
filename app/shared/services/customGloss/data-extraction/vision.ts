import { generateText } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { google } from "@ai-sdk/google";
import { DocumentType } from "../classification";
import { z } from "zod";

export async function extractTextFromImage<T>(
  pdfFile: File,
  documentType: DocumentType,
  schema: z.ZodType<T>,
) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString('base64');
  const { text } = await generateText({
    model: wrapAISDKModel(google("gemini-2.0-flash-001"), {
      name: `Extract schema from ${documentType} pdf`,
      project_name: "glosa",
    }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `El tipo de documento es ${documentType}. Transcribe la informacion de la imagen en formato markdown.`
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
