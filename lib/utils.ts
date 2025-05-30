import { type ClassValue, clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import { type RefinementCtx, z } from 'zod';

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
