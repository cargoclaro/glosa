import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { Langfuse } from 'langfuse';
import { z } from 'zod';

const documentTypes = [
  'pedimento',
  'documentoDeTransporte',
  'factura',
  'carta318',
  'cartaCesionDeDerechos',
  'cove',
  'rrna',
  'listaDeEmpaque',
  'cfdi',
  'otros',
] as const;

export type DocumentType = (typeof documentTypes)[number];

export async function classifyDocuments<
  T extends { ufsUrl: string; name?: string },
>(
  files: T[],
  parentTraceId?: string
): Promise<(T & { documentType: DocumentType })[]> {
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
          documentType: 'cfdi' as const,
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
        object: { documentType },
      } = await generateObject({
        model: google('gemini-2.0-flash-001'),
        ...telemetryConfig,
        seed: 42,
        system: `
        Eres un experto en análisis y clasificación de documentos aduaneros.
        
        Tu tarea es analizar la imagen del documento y determinar exactamente qué tipo de documento aduanero es basado en su contenido, formato y elementos específicos. 
        Busca elementos como números de pedimento, sellos digitales, datos de importador/exportador, detalles de mercancías, referencias a NOMs, etc. que identifiquen el tipo específico de documento.
      `,
        schema: z.object({
          documentType: z.enum(documentTypes).describe(`
          Tipo de documento aduanero:
          
          - pedimento: 
            Documento oficial de la aduana mexicana con números de pedimento (15-17 dígitos),
            campos de régimen aduanero, datos del importador/exportador, y sellos digitales.
          
          - documentoDeTransporte: 
            Puede ser Bill of Lading (B/L), guía aérea (AWB) o carta porte con detalles 
            del envío, consignatario, transportista, origen/destino.
          
          - factura: 
            Documento comercial con detalles de compra-venta internacional, información 
            de vendedor/comprador, productos, precios, INCOTERMS.
          
          - carta318: 
            Documento que certifica cumplimiento de NOMs para productos usados, 
            con referencias a la regla 3.1.8. Por lo general, el documento indica que es una factura,
            cuando en realidad tiene referencias a la regla 3.1.8.
          
          - cartaCesionDeDerechos: 
            Documento legal que transfiere derechos de importación/exportación entre partes.
          
          - cove: 
            Comprobante de Valor Electrónico que valida el valor de mercancías 
            con formato específico del SAT.
          
          - rrna: 
            Documentos que certifican cumplimiento de regulaciones y restricciones no arancelarias.
          
          - listaDeEmpaque: 
            Documento detallado del contenido físico del envío, con cantidad de bultos, 
            pesos y dimensiones.
          
          - cfdi: 
            Comprobante Fiscal Digital por Internet, factura electrónica mexicana 
            con UUID y sellos digitales SAT.

          - otros:
            Documentos que no se ajustan a los tipos anteriores. Ej. NOMs, etc.
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
        documentType,
      };
    })
  );
}
