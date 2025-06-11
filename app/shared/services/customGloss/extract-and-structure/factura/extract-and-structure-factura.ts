import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { PDFDocument } from 'pdf-lib';
import { facturaSchema } from '../schemas';

/**
 * Splits a PDF into individual pages and returns array of base64-encoded pages
 * (Reutilizada de extract-and-structure-pedimento.ts)
 */
async function splitPdfIntoPages(file: File): Promise<string[]> {
  // Read the file content
  const fileArrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileArrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  // Array to store base64 strings for each page
  const pageBase64Strings: string[] = [];

  // Process each page
  for (let i = 0; i < pageCount; i++) {
    // Create a new document with just this page
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);

    // Save and convert to base64
    const pageBytes = await newPdfDoc.save();
    const base64String = Buffer.from(pageBytes).toString('base64');
    pageBase64Strings.push(base64String);
  }

  return pageBase64Strings;
}

/**
 * Combines multiple base64-encoded PDF pages into a single PDF
 * (Reutilizada de extract-and-structure-pedimento.ts)
 */
async function combinePagesToPdf(pageBase64Strings: string[]): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Process each page and add it to the new document
  for (const pageBase64 of pageBase64Strings) {
    // Remove data URL prefix if present
    const base64Data = pageBase64.startsWith('data:')
      ? pageBase64.split(',')[1]
      : pageBase64;

    // Convert base64 to Uint8Array
    if (!base64Data) {
      continue;
    }
    const pageBytes = Buffer.from(base64Data, 'base64');

    // Load the page PDF
    const pagePdf = await PDFDocument.load(pageBytes);

    // Copy all pages (should just be one) from this page PDF
    const copiedPages = await pdfDoc.copyPages(
      pagePdf,
      pagePdf.getPageIndices()
    );

    // Add each copied page to the new document
    for (const page of copiedPages) {
      pdfDoc.addPage(page);
    }
  }

  // Save and convert the new PDF to base64
  const combinedPdfBytes = await pdfDoc.save();
  return Buffer.from(combinedPdfBytes).toString('base64');
}

/**
 * Extrae múltiples facturas de un solo PDF usando rangos de páginas de la clasificación
 */
export async function extractMultipleFacturas(
  file: File,
  facturaRanges: Array<{ startPage: number; endPage: number }>,
  parentTraceId: string
) {
  console.log(`Iniciando extracción de ${facturaRanges.length} facturas desde PDF: ${file.name}`);
  
  // 1. Dividir PDF en páginas individuales
  const pages = await splitPdfIntoPages(file);
  console.log(`PDF dividido en ${pages.length} páginas`);

  // 2. Para cada factura clasificada, extraer y procesar por separado
  const facturaExtractionPromises = facturaRanges.map(async ({ startPage, endPage }, index) => {
    console.log(`Procesando Factura ${index + 1}: páginas ${startPage}-${endPage}`);
    
    // Extraer páginas de la factura (1-indexed to 0-indexed)
    const facturaPages = pages.slice(startPage - 1, endPage);
    
    // Combinar en un PDF individual de la factura
    const facturaPdfBase64 = await combinePagesToPdf(facturaPages);
    
    // Crear File object para esta factura específica
    const facturaBuffer = Buffer.from(facturaPdfBase64, 'base64');
    const facturaFile = new File([facturaBuffer], 
                                `factura-${startPage}-${endPage}.pdf`, 
                                { type: 'application/pdf' });
    
    // Extraer ESTA factura individual (usando la función existente)
    const facturaResult = await extractAndStructureFactura(facturaFile, parentTraceId);
    
    console.log(`Factura ${index + 1} extraída: Número=${facturaResult.invoice_number}, Total=${facturaResult.total_amount}`);
    
    return {
      facturaIndex: index + 1,
      pageRange: { startPage, endPage },
      ...facturaResult
    };
  });

  // 3. Paralelizar extracción de todas las facturas
  console.log(`Procesando ${facturaRanges.length} facturas en paralelo...`);
  const results = await Promise.all(facturaExtractionPromises);
  
  console.log(`Extracción completa: ${results.length} facturas procesadas`);
  return results;
}

/**
 * Extrae y estructura una sola factura (función original)
 */
export async function extractAndStructureFactura(
  file: File,
  parentTraceId: string
) {
  const fileData = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;

  const { text } = await generateText({
    model: google('gemini-2.5-pro-preview-03-25'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract factura',
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false,
        fileName: file.name,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe the pdf to markdown',
          },
          {
            type: 'file',
            data: fileData,
            mimeType: file.type,
          },
        ],
      },
    ],
  });

  const { object: facturaData } = await generateObject({
    model: google('gemini-2.5-flash-preview-04-17'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Structure factura data',
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false,
        fileName: file.name,
      },
    },
    schema: facturaSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Structure the document based on the provided schema. Keep the text "exactly as is", no exceptions.',
          },
          {
            type: 'text',
            text,
          },
        ],
      },
    ],
  });

  return facturaData;
} 