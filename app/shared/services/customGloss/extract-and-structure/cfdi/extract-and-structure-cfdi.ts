import { cfdiSchema } from '../schemas';
import { xmlParser } from './xml-parser';

export async function extractAndStructureCFDI(file: File) {
  const xmlData = await file.text();
  return cfdiSchema.parse(xmlParser.parse(xmlData, true));
}
