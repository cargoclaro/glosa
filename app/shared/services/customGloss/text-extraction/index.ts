import {pdfToText} from 'pdf-ts';
import sharp from 'sharp';
import { z } from 'zod';
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { pedimentoSchema } from "./schemas/pedimento";
import { DocumentTypeEnum } from "../classification";

// Create a Zod enum schema that can be imported in other files
export const DocumentTypeSchema = z.enum(DocumentTypeEnum);

// Create a type from the enum for TypeScript
export type DocumentType = typeof DocumentTypeEnum[number];

/**
 * Preprocesses an image to improve OCR quality.
 * 
 * @param imageBuffer - Buffer containing the image data
 * @returns Promise with the processed image buffer
 */
async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Target height for resize
    const targetHeight = 2000;

    // Get image metadata to calculate aspect ratio
    const { width, height } = await sharp(imageBuffer).metadata();
    if (!width || !height) {
      throw new Error("Image metadata is missing width or height");
    }
    const aspectRatio = width / height;
    const targetWidth = Math.round(targetHeight * aspectRatio);

    // Process the image:
    // 1. Convert to grayscale
    // 2. Apply threshold (similar to adaptiveThreshold in OpenCV)
    // 3. Denoise with median filter (approximation of fastNlMeansDenoising)
    // 4. Resize with high-quality Lanczos resampling
    return await sharp(imageBuffer)
      .grayscale()
      .threshold(128) // Simple threshold as Sharp doesn't have adaptive threshold
      .median(3) // Apply median filter for denoising
      .resize(targetWidth, targetHeight, {
        kernel: sharp.kernel.lanczos3, // Similar to INTER_LANCZOS4
        fit: 'fill'
      })
      .toBuffer();

  } catch (error) {
    console.error(`Error preprocessing image: ${error}`);
    throw error;
  }
}

export async function extractText({ ufsUrl, originalFile, documentType }: {
  ufsUrl: string;
  originalFile: File;
  documentType: DocumentType;
}) {
  const text = await pdfToText(Buffer.from(await originalFile.arrayBuffer()));
  const isPdfEmpty = text === "";

  if (isPdfEmpty) {
    const processedImage = await preprocessImage(Buffer.from(await originalFile.arrayBuffer()));
    const systemPrompt = `Eres un experto en esquematizar información estructurada de documentos aduaneros a partir de imágenes. Tu tarea es analizar la imagen proporcionada y extraer toda la información relevante con estructura.

IMPORTANTE: 
- Si la imagen contiene información de múltiples documentos (por ejemplo diferentes ID, o páginas numeradas como "1 OF X", "2 OF X", etc.), debes crear un objeto separado para cada documento.
- Cada documento independiente debe tener su propia estructura completa, incluso si comparten información similar.
- Presta especial atención a los números de documento o segmentos completos repetidos con información distinta para identificar documentos distintos.
- NO inventes o asumas información que no esté explícitamente visible en la imagen.
- Si un campo requerido no está presente, déjalo vacío.
- Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
- Las fechas deben estar en formato ISO (YYYY-MM-DD).
- Esquematiza todos los items con sus detalles completos.
- Captura correctamente los montos y cantidades.`;
  } else {
    const systemPrompt = `Eres un experto en esquematizar información estructurada de documentos aduaneros. Tu tarea es leer el texto proporcionado y extraer toda la información relevante con estructura.

IMPORTANTE: 
- Si el texto contiene información de múltiples documentos (por ejemplo diferentes ID, o páginas numeradas como "1 OF X", "2 OF X", etc.), debes crear un objeto separado para cada documento.
- Cada documento independiente debe tener su propia estructura completa, incluso si comparten información similar.
- Presta especial atención a los números de documento o segmentos completos repetidos con información distinta para identificar documentos distintos.
- NO inventes o asumas información que no esté explícitamente en el texto.
- Si un campo requerido no está presente, déjalo vacío.
- Para campos numéricos, extrae SOLO los números sin símbolos de moneda o separadores.
- Las fechas deben estar en formato ISO (YYYY-MM-DD).
- Esquematiza todos los items con sus detalles completos.
- Captura correctamente los montos y cantidades.`;
    if (documentType === "pedimento") {
      const { object } = await generateObject({
        model: wrapAISDKModel(openai("gpt-4o"), {
          name: `Structure ${originalFile.name} text`,
          project_name: "glosa",
        }),
        system: systemPrompt,
        schema: pedimentoSchema,
        prompt: `
          - Identifica los datos del pedimento
          - Identifica con cuidado las múltiples fracciones que puede haber en el documento, para llenar adecuadamente toda la sección de partidas

          OCR text dump:
          ${text}
        `,
      });
      return object;
    }
  }
}
