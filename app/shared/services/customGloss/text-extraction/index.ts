import {pdfToText} from 'pdf-ts';
import sharp from 'sharp';
import { z } from 'zod';
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { pedimentoSchema } from "./pedimento";

// Document type enum for centralized definition
export const DocumentTypeEnum = [
  "pedimento",
  "documento_de_transporte",
  "factura",
  "carta_318",
  "carta_cesion_derechos",
  "cove",
  "noms",
  "rrnas",
  "lista_de_empaque",
  "cfdi"
] as const;

// Description for document types to be used with Zod schema
export const DocumentTypeDescription = `
  Tipo de documento aduanero:
  - pedimento: Documento oficial de la aduana mexicana con números de pedimento (15-17 dígitos), campos de régimen aduanero, datos del importador/exportador, y sellos digitales.
  - documento_de_transporte: Puede ser Bill of Lading (B/L), guía aérea (AWB) o carta porte con detalles del envío, consignatario, transportista, origen/destino.
  - factura: Documento comercial con detalles de compra-venta internacional, información de vendedor/comprador, productos, precios, INCOTERMS.
  - carta_318: Documento que certifica cumplimiento de NOMs para productos usados, con referencias a la regla 3.1.8.
  - carta_cesion_derechos: Documento legal que transfiere derechos de importación/exportación entre partes.
  - cove: Comprobante de Valor Electrónico que valida el valor de mercancías con formato específico del SAT.
  - noms: Documentos que certifican cumplimiento de Normas Oficiales Mexicanas con números de certificado.
  - rrnas: Documentos que certifican cumplimiento de regulaciones y restricciones no arancelarias.
  - lista_de_empaque: Documento detallado del contenido físico del envío, con cantidad de bultos, pesos y dimensiones.
  - cfdi: Comprobante Fiscal Digital por Internet, factura electrónica mexicana con UUID y sellos digitales SAT.
`;

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
          - Identifica con cuidado las múltiples fracciones que puede haber en el documento, para llenar adecuadamente toda la sección de partidas

          OCR text dump:
          ${text}
        `
      });
      return object;
    }
  }
}
