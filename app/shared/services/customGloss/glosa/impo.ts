import type { OCR } from '~/lib/utils';
import type { Cove, PackingList, Pedimento } from '../extract-and-structure/schemas';
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
  transportDocument?: OCR;
  packingList?: PackingList;
  cove: Cove;
  invoice?: OCR;
  carta318?: OCR;
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
}
