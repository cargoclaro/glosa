import type {
  CartaSesion,
  Cfdi,
  Invoice,
  TransportDocument,
} from '../data-extraction/mkdown_schemas';
import type { Pedimento } from '../data-extraction/schemas';
import type { Cove, PackingList } from '../extract-and-structure/schemas';
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
  transportDocument?: TransportDocument;
  packingList?: PackingList;
  cove: Cove;
  cfdi?: Cfdi;
  cartaSesion?: CartaSesion;
  invoice?: Invoice;
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
