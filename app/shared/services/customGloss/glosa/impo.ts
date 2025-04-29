import type { OCR } from '~/lib/utils';
import type {
  Cove,
  PackingList,
  Pedimento,
} from '../extract-and-structure/schemas';
import { coveValidationStepsImpo } from './cove/validation_steps_impo';
import { pedimentoValidationStepsImpo } from './pedimento/validation_steps_impo';

export async function glosaImpo({
  pedimento,
  documentoDeTransporte,
  packingList,
  cove,
  factura,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  documentoDeTransporte?: OCR[];
  packingList?: PackingList[];
  cove: Cove[];
  factura?: OCR[];
  carta318?: OCR[];
  traceId: string;
}) {
  // Ensure cove exists since it's required
  const firstCove = cove[0];
  if (!firstCove) {
    throw new Error('This should never happen');
  }

  const results = await Promise.all([
    pedimentoValidationStepsImpo({
      pedimento,
      cove: firstCove,
      transportDocument: documentoDeTransporte?.[0],
      packingList: packingList?.[0],
      invoice: factura?.[0],
      carta318: carta318?.[0],
      traceId,
    }),
    coveValidationStepsImpo({
      cove: firstCove,
      invoice: factura?.[0],
      carta318: carta318?.[0],
      traceId,
    }),
  ]);
  return results.flat();
}
