import { type ClassValue, clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import { type RefinementCtx, z } from 'zod';
import { PDFDocument } from 'pdf-lib';

// Define regex at top level scope
const FILENAME_REGEX = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fetches a file from a URL and returns a File object
 * Requires Content-Disposition header to be present in the response
 * @throws Error if Content-Disposition header is missing or malformed
 */
export async function fetchFileFromUrl(ufsUrl: string): Promise<File> {
  const response = await fetch(ufsUrl);
  const blob = await response.blob();
  
  const contentDisposition = response.headers.get('content-disposition');
  if (!contentDisposition) {
    throw new Error('Should never happen');
  }
  
  const filenameMatch = FILENAME_REGEX.exec(contentDisposition);
  if (!filenameMatch || !filenameMatch[1]) {
    throw new Error('Should never happen');
  }
  
  // Clean up the filename (remove quotes if present)
  const filename = filenameMatch[1].replace(/['"]/g, '');
  
  return new File([blob], filename, { type: blob.type });
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
