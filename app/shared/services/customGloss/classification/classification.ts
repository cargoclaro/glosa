import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const classifications = [
  'Pedimento',
  'Bill of Lading',
  'Air Waybill',
  'Factura',
  'Carta Regla 3.1.8',
  'Cove',
  'Packing List',
  'Packing Slip',
  'Shipper',
  'Delivery Ticket',
  'CFDI',
  'Otro',
] as const;

export type Classification = (typeof classifications)[number];

const classificationSchema = z
  .array(z.object({
    classification: z
      .enum(classifications)
      .describe(`
      La carta de regla 3.1.8 es un complemento de la factura, ten cuidado de no clasificarla como factura.
      Este documento lee como una carta legal, referenciando la ley aduanera y el reglamento de comercio exterior.

      Verifica si en el archivo existen diferentes números de factura; esto es un indicador clave de que el archivo contiene múltiples documentos.
    `),
    startPage: z
      .number()
      .describe(`
      El número de página en el que comienza el documento.
    `),
    endPage: z
      .number()
      .describe(`
      El número de página en el que termina el documento.
    `),
  }))
  .describe(`
    Clasifica los documentos/ el documento en el archivo.
  `);

export async function classifyDocuments<
  T extends { ufsUrl: string; },
>(
  files: T[],
  parentTraceId: string
) {
  const fetchedFiles = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(file.ufsUrl);
      const base64 = Buffer.from(await response.arrayBuffer()).toString(
        'base64'
      );
      const contentType =
        response.headers.get('content-type') || 'application/octet-stream';
      return {
        ...file,
        base64,
        type: contentType,
      };
    })
  );
  return await Promise.all(
    fetchedFiles.map(async (fetchedFile) => {
      // We assume all xml files are cfdis
      if (fetchedFile.type === 'text/xml') {
        return {
          ...fetchedFile,
          classifications: 'CFDI' as const,
        };
      }

      const {
        object: classifications,
      } = await generateObject({
        model: google('gemini-2.5-pro-preview-03-25'),
        experimental_telemetry: {
          isEnabled: true,
          functionId: fetchedFile.ufsUrl,
          metadata: {
            langfuseTraceId: parentTraceId,
            langfuseUpdateParent: false,
            fileUrl: fetchedFile.ufsUrl,
          },
        },
        seed: 42,
        schema: classificationSchema,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'file',
                data: `data:${fetchedFile.type};base64,${fetchedFile.base64}`,
                mimeType: fetchedFile.type,
              },
            ],
          },
        ],
      });

      return {
        ...fetchedFile,
        classifications: classifications.length === 1 && classifications[0]
          ? classifications[0].classification 
          : classifications,
      };
    })
  );
}
