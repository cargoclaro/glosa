import type {
  Carta318,
  Invoice,
  TransportDocument,
} from '../data-extraction/mkdown_schemas';
import type { Pedimento } from '../data-extraction/schemas';
import type { Cove, PackingList } from '../extract-and-structure/schemas';
import { coveValidationStepsImpo } from './cove/validation_steps_impo';
import { pedimentoValidationStepsImpo } from './pedimento/validation_steps_impo';

export async function glosaImpo({
  pedimento,
  transportDocument,
  packingList,
  cove,
  invoice,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: TransportDocument;
  packingList?: PackingList;
  cove: Cove;
  invoice?: Invoice;
  carta318?: Carta318;
  traceId: string;
}) {
  const results = await Promise.all([
    pedimentoValidationStepsImpo({
      pedimento,
      cove,
      transportDocument,
      packingList,
      invoice,
      carta318,
      traceId,
    }),
    coveValidationStepsImpo({ cove, invoice, carta318, traceId }),
  ]);
  return results.flat();
};
