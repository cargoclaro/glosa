import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { Langfuse } from 'langfuse';
import { z } from 'zod';

const classifications = [
  'Pedimento',
  'Bill of Lading',
  'Air Waybill',
  'Factura',
  'Carta Regla 3.1.8',
  'Carta de cesión de derechos',
  'Cove',
  'Packing List',
  'CFDI',
  'Otros',
] as const;

export type Classification = (typeof classifications)[number];

export async function classifyDocuments<
  T extends { ufsUrl: string; name?: string },
>(
  files: T[],
  parentTraceId?: string
): Promise<(T & { classification: Classification })[]> {
  const langfuse = new Langfuse();
  if (parentTraceId) {
    langfuse.event({
      traceId: parentTraceId,
      name: 'Classification',
    });
  }
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
          classification: 'CFDI' as Classification,
        };
      }
      const telemetryConfig = parentTraceId
        ? {
            experimental_telemetry: {
              isEnabled: true,
              functionId: fetchedFile.name,
              metadata: {
                langfuseTraceId: parentTraceId,
                langfuseUpdateParent: false,
                fileUrl: fetchedFile.ufsUrl,
              },
            },
          }
        : {};

      const {
        object: { classification },
      } = await generateObject({
        model: openai('gpt-4o'),
        ...telemetryConfig,
        seed: 42,
        system: 'Eres un experto en análisis y clasificación de documentos aduaneros.',
        schema: z.object({
          classification: z.enum(classifications).describe(`
            La carta de regla 3.1.8 es un complemento de la factura, ten cuidado de no clasificarla como factura.
            Este documento lee como una carta legal, referenciando la ley aduanera y el reglamento de comercio exterior.
          `),
        }),
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
        classification,
      };
    })
  );
}
