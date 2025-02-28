import { pdfToText } from 'pdf-ts';
import { Document } from "../classification";
import { extractSchemaFromTaggedPDF } from "./tagged";
import { extractTextFromImage } from "./vision";

export async function extractTextFromPDFs(classifications: {
  originalFile: File;
  document: Document;
}[]) {
  return await Promise.all(classifications.map(async (classification) => {
    const { originalFile, document } = classification;
    const text = await pdfToText(Buffer.from(await originalFile.arrayBuffer()));
    const isPdfEmpty = text === "";

    if (isPdfEmpty) {
      return extractTextFromImage(originalFile, document);
    } else {
      return extractSchemaFromTaggedPDF(text, document);
    }
  }));
}
