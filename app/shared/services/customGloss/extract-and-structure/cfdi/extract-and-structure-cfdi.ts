import { err, ok } from 'neverthrow';
import { cfdiSchema } from '../schemas';
import { xmlParser } from './xml-parser';
export async function extractAndStructureCFDI(fileUrl: string) {
  const response = await fetch(fileUrl);
  const xmlData = await response.text();
  const cfdiData = cfdiSchema.safeParse(xmlParser.parse(xmlData, true));
  if (!cfdiData.success) {
    return err(
      `Error parsing cfdi: ${cfdiData.error.message}. XML URL: ${fileUrl}`
    );
  }
  return ok(cfdiData.data);
}
