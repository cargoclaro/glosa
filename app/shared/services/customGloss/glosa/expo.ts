import type { OCR } from '~/lib/utils';
import type {
  Cove,
  PackingList,
  Pedimento,
  CFDI,
} from '../extract-and-structure/schemas';
import { coveValidationStepsExpo } from './cove/validation_steps_expo';
import { pedimentoValidationStepsExpo } from './pedimento/validation_steps_expo';

export async function glosaExpo({
  pedimento,
  transportDocument,
  packingList,
  cove,
  cfdi,
  cartaSesion,
  invoice,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  packingList?: PackingList;
  cove: Cove;
  cfdi?: CFDI;
  cartaSesion?: OCR;
  invoice?: OCR;
  traceId: string;
}) {
  const results = await Promise.all([
    pedimentoValidationStepsExpo({
      pedimento,
      cove,
      cfdi,
      cartaSesion,
      transportDocument,
      packingList,
      traceId,
    }),
    coveValidationStepsExpo({ cove, cfdi, invoice, traceId }),
  ]);
  return results.flat();
}
