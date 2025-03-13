import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { UploadedFileData } from 'uploadthing/types';

const documentTypes = [
  "listaDeFacturas",
  "reporteEDocumentRemesaConsolidado",
  "packingList",
  "factura",
  "otros"
] as const;

type DocumentType = (typeof documentTypes)[number];

export async function classifyDocuments(
  uploadedFiles: (UploadedFileData & { originalFile: File })[],
  parentTraceId: string
) {
  return await Promise.all(uploadedFiles.map(async (uploadedFile) => {
    // We assume all xml files are cfdis
    if (uploadedFile.type === "text/xml") {
      return {
        ...uploadedFile,
        documentType: "cfdi" as const,
      };
    }
    const { object: { documentType } } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      experimental_telemetry: {
        isEnabled: true,
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false, // Do not update the parent trace with execution results
          fileUrl: uploadedFile.ufsUrl,
        },
      },
      system: `
        Eres un experto en análisis y clasificación de documentos aduaneros.
        
        Tu tarea es analizar la imagen del documento y determinar exactamente qué tipo de documento aduanero es basado en su contenido, formato y elementos específicos. 
        Busca elementos como números de pedimento, sellos digitales, datos de importador/exportador, detalles de mercancías, referencias a NOMs, etc. que identifiquen el tipo específico de documento.
      `,
      schema: z.object({
        documentType: z.enum(documentTypes).describe(`
          Tipo de documento aduanero:

          - listaDeFacturas: 
            Es una lista de facturas de importacion/exportacion. Por alguna razon no hay formato oficial para este tipo de documentos. Literalmente dice formato "no oficial" en el documento.
          
          - reporteEDocumentRemesaConsolidado:
            Es la representacion interna del COVE.

          - packingList: 
            Documento detallado del contenido físico del envío, con cantidad de bultos, 
            pesos y dimensiones. Siempre se parece a una tabla de excel.

          - factura: 
            Documento comercial con detalles de compra-venta internacional, información 
            de vendedor/comprador, productos, precios, INCOTERMS. Es la version legible del cfdi. Siempre indica el UUID del cfdi al que corresponde.

          - otros:
            Documentos que no se ajustan a los tipos anteriores. Ej. NOMs, Pedimentos, etc.
        `)
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: `data:${uploadedFile.type};base64,${Buffer.from(await uploadedFile.originalFile.arrayBuffer()).toString('base64')}`,
              mimeType: uploadedFile.type,
            },
          ],
        },
      ],
    });

    return {
      ...uploadedFile,
      documentType: documentType as DocumentType,
    };
  }));
}
