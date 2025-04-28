import type { UploadedFileData } from 'uploadthing/types';
import type { classifyDocuments, Classification } from './classification';
import { ok, err } from 'neverthrow';

type Classifications = Awaited<ReturnType<typeof classifyDocuments>>;

// Only include supported document types (exclude 'Otro')
type SupportedClassification = Exclude<Classification, 'Otro'>;

// Pedimento appears only once, others can repeat
type NonPedimentoClassification = Exclude<SupportedClassification, 'Pedimento'>;

// Map each classification to its data; pedimento is single object, others arrays
type GroupedByClassification = {
  Pedimento?: { file: Classifications[number]; startPage: number };
} & {
  [K in NonPedimentoClassification]: { file: Classifications[number]; startPage: number }[];
};

export function processClassifications(
  classifications: Classifications
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

  for (const file of classifications) {
    for (const { classification, startPage } of file.classifications) {
      // Skip unsupported 'Otro'
      if (classification === 'Otro') { continue };
      // Pedimento must only appear once
      if (classification === 'Pedimento') {
        if (groupedByClassification.Pedimento) {
          return err('Only one Pedimento document is allowed.');
        }
        groupedByClassification.Pedimento = { file, startPage };
        continue;
      }
      // Other classifications may repeat
      if (!groupedByClassification[classification]) {
        groupedByClassification[classification] = [];
      }
      const items = groupedByClassification[classification];
      if (items) {
        items.push({ file, startPage });
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
}
