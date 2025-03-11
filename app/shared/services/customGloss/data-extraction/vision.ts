import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { DocumentType } from "../classification";
/* import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { sanitizeObjectStrings } from "../remove-null-bytes"; */

export async function extractTextFromImage(
  pdfFile: File,
  documentType: DocumentType,
) {
  const base64Data = Buffer.from(await pdfFile.arrayBuffer()).toString('base64');
  // TODO: Figure out image prompts
  /* if (process.env["LANGCHAIN_MIGRATION_ENABLED"] === "true") {
    const baseUrl = process.env["PYTHON_BACKEND_URL"];
    const url = `${baseUrl}/pdf-to-images`;

    // Create form data and append the file
    const formData = new FormData();
    formData.append('file', pdfFile);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["GLOSS_TOKEN"]}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to extract text: ${response.statusText}`);
    }

    const rawData = await response.json();
    const schema = z.object({
      images: z.array(z.string()),
    })
    const images = schema.parse(rawData);
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      maxOutputTokens: 2048,
    });
    const { content } = await model.invoke([
      new HumanMessage(`El tipo de documento es ${documentType}. Transcribe la informacion de la imagen en formato markdown.`),
      ...images.images.map((image) => new HumanMessage({
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${image}`,
            },
          },
        ],
      })),
    ]);
    if (typeof content !== "string") {
      throw new Error("Failed to extract text");
    }
    return {
      markdown_representation: sanitizeObjectStrings(content),
    };
  } */
  const { text } = await generateText({
    model:  google("gemini-2.0-flash-001"),
    experimental_telemetry: { isEnabled: true },
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
