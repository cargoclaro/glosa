import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { DocumentTypeEnum, DocumentTypeDescription } from "./text-extraction";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { UploadedFileData } from 'uploadthing/types';

export async function classifyDocuments(uploadedFiles: (UploadedFileData & { originalFile: File })[]) {
  const classifications = await Promise.all(uploadedFiles.map(async (uploadedFile) => {
    const { object: { tipo_de_documento } } = await generateObject({
      model: wrapAISDKModel(anthropic("claude-3-7-sonnet-20250219"), {
        name: `Classify ${uploadedFile.name}`,
        project_name: "glosa",
      }),
      system: `
        Eres un experto en análisis y clasificación de documentos aduaneros.
      `,
      schema: z.object({
        tipo_de_documento: z.enum(DocumentTypeEnum).describe(DocumentTypeDescription)
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza la imagen del documento y determina exactamente qué tipo de documento aduanero es basado en su contenido, formato y elementos específicos. Busca elementos como números de pedimento, sellos digitales, datos de importador/exportador, detalles de mercancías, referencias a NOMs, etc. que identifiquen el tipo específico de documento.`,
            },
            {
              type: 'file',
              data: uploadedFile.ufsUrl,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return {
      ...uploadedFile,
      tipo_de_documento,
    };
  }));

  return classifications;
}
