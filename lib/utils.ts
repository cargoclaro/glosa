import { type ClassValue, clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import { type RefinementCtx, z } from 'zod';
import { PDFDocument } from 'pdf-lib';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Combines multiple base64-encoded PDF pages into a single PDF
 */
export async function combinePagesToPdf(pageBase64Strings: string[]): Promise<string> {
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
 * Fetches a PDF file and returns an array of base64-encoded pages
 */
export async function fetchPdfPages(fileUrl: string): Promise<string[]> {
  // Fetch the file content
  const response = await fetch(fileUrl);
  const fileContent = await response.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileContent);
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


export type OCR = {
  markdown_representation: string;
};

export function transformStringToDate(dateStr: string, ctx: RefinementCtx) {
  const parsedDate = moment(dateStr, 'DD/MM/YYYY');

  if (!parsedDate.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY.`,
    });
    return null;
  }

  return parsedDate.toDate();
}

export function transformStringToDateNullVersion(
  dateStr: string | null,
  ctx: RefinementCtx
) {
  if (!dateStr) {
    return null;
  }

  const parsedDate = moment(dateStr, 'DD/MM/YYYY');

  if (!parsedDate.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY.`,
    });
    return null;
  }

  return parsedDate.toDate();
}
