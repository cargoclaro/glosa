import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { UploadedFileData } from 'uploadthing/types';

export const documents = [
  "pedimento",
  "documento_de_transporte",
  "factura",
  "carta_318",
  "carta_cesion_derechos",
  "cove",
  "rrnas",
  "lista_de_empaque",
  "cfdi"
] as const;

export type Document = (typeof documents)[number];

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
        tipo_de_documento: z.enum(documents).describe(`
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
        `)
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
