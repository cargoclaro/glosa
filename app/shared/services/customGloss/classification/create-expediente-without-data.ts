import type { classifyDocuments, Classification } from './classification';
import { ok, err } from 'neverthrow';
import { PDFDocument } from 'pdf-lib';

type ClassificationResult = Awaited<ReturnType<typeof classifyDocuments>>;

// Only include supported document types (exclude 'Otro')
type SupportedClassification = Exclude<Classification, 'Otro'>;

// Pedimento appears only once, others can repeat
type NonPedimentoClassification = Exclude<SupportedClassification, 'Pedimento'>;

// Map each classification to its data; pedimento is single object, others arrays
type GroupedByClassification = {
  Pedimento?: File;
} & {
  [K in NonPedimentoClassification]: File[];
};

// Define regex at top level
const PDF_EXTENSION_REGEX = /\.pdf$/i;

/**
 * Splits a PDF file into multiple files based on page ranges
 */
async function splitDocumentByClassifications(
  file: File,
  classifications: Array<{ classification: Classification; startPage: number; endPage: number }>
): Promise<Array<{ file: File; classification: Classification }>> {
  // Skip if not a PDF file
  if (file.type !== 'application/pdf') {
    return classifications.map(({ classification }) => ({
      file,
      classification,
    }));
  }

  const result: Array<{ file: File; classification: Classification }> = [];
  const fileArrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileArrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  // Process each classification
  for (const { classification, startPage, endPage } of classifications) {
    // Validate page range
    const start = Math.max(0, startPage);
    const end = Math.min(pageCount - 1, endPage);
    
    if (start > end || start >= pageCount) {
      continue;
    }

    // Create a new document with just these pages
    const newPdfDoc = await PDFDocument.create();
    const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    
    for (const page of copiedPages) {
      newPdfDoc.addPage(page);
    }

    // Save and create a new File
    const pdfBytes = await newPdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const newFileName = `${file.name.replace(PDF_EXTENSION_REGEX, '')}_${classification}_p${start+1}-p${end+1}.pdf`;
    const newFile = new File([pdfBlob], newFileName, { type: 'application/pdf' });

    result.push({
      file: newFile,
      classification,
    });
  }

  return result;
}

export async function createExpedienteWithoutData(
  classificationResults: ClassificationResult
) {
  const groupedByClassification: GroupedByClassification = {
    'Bill of Lading': [],
    'Air Waybill': [],
    'Factura': [],
    'Carta Regla 3.1.8': [],
    'Cove': [],
    'Packing List': [],
    'Packing Slip': [],
    'Shipper': [],
    'Delivery Ticket': [],
    'CFDI': []
  };

  // Process all classification results
  for (const result of classificationResults) {
    // Handle case when classification is a string (single classification)
    if (typeof result.classification === 'string') {
      const classification = result.classification;
      if (classification === 'Otro') { continue; }

      if (classification === 'Pedimento') {
        if (groupedByClassification.Pedimento) {
          return err('Only one Pedimento document is allowed.');
        }
        groupedByClassification.Pedimento = result.file;
      } else if (classification in groupedByClassification) {
        // Safely cast to access the property
        const key = classification as NonPedimentoClassification;
        groupedByClassification[key].push(result.file);
      }
    } 
    // Handle case when classification is an array
    else if (Array.isArray(result.classification)) {
      // Create array of classification objects with page ranges
      const classificationItems = result.classification.map(item => ({
        classification: item.classification,
        startPage: item.startPage,
        endPage: item.endPage
      }));

      // Split the document based on classifications
      const splitDocuments = await splitDocumentByClassifications(result.file, classificationItems);
      
      // Add each split document to the appropriate classification group
      for (const { file, classification } of splitDocuments) {
        if (classification === 'Otro') { continue; }

        if (classification === 'Pedimento') {
          if (groupedByClassification.Pedimento) {
            return err('Only one Pedimento document is allowed.');
          }
          groupedByClassification.Pedimento = file;
        } else if (classification in groupedByClassification) {
          // Safely cast to access the property
          const key = classification as NonPedimentoClassification;
          groupedByClassification[key].push(file);
        }
      }
    }
  }

  if (!groupedByClassification.Pedimento) {
    return err('Pedimento is required.');
  }

  // Cove must appear at least once
  if (groupedByClassification.Cove.length === 0) {
    return err('At least one Cove document is required.');
  }

  return ok(groupedByClassification);
}
