import { type ClassValue, clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';
import { type RefinementCtx, z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
