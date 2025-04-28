import { err, ok } from 'neverthrow';
import { cfdiSchema } from '../schemas';
import { xmlParser } from './xml-parser';

export async function extractAndStructureCFDI(file: File) {
  const xmlData = await file.text();
  const cfdiData = cfdiSchema.safeParse(xmlParser.parse(xmlData, true));
  
  if (!cfdiData.success) {
    return err(
      `Error parsing cfdi: ${cfdiData.error.message}. File name: ${file.name}`
    );
  }
  
  return ok(cfdiData.data);
}
