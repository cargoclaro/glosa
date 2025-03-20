import { PDFDocument } from 'pdf-lib';

/**
 * Extracts individual pages from a PDF file and returns them as base64-encoded strings
 * @param pdfBuffer The buffer containing the PDF data
 * @returns Array of base64-encoded strings, each representing a single page PDF
 */
export async function extractPdfPages(
  pdfBuffer: ArrayBuffer
): Promise<string[]> {
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(pdfBuffer);
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
