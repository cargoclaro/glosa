import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import type { UploadedFileData } from 'uploadthing/types';
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

export async function classifyDocuments(
  uploadedFiles: (UploadedFileData & { originalFile: File })[]
) {
  return await Promise.all(
    uploadedFiles.map(async (uploadedFile) => {
      const {
        object: { documentType },
      } = await generateObject({
        model: google('gemini-2.0-flash-001'),
        experimental_telemetry: { isEnabled: true },
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
                data: `data:application/pdf;base64,${Buffer.from(await uploadedFile.originalFile.arrayBuffer()).toString('base64')}`,
                mimeType: 'application/pdf',
              },
            ],
          },
        ],
      });

      return {
        ...uploadedFile,
        documentType,
      };
    })
  );
}
