import type { OCR } from '~/lib/utils';
import type {
  CFDI,
  Cove,
  PackingList,
  Pedimento,
} from '../extract-and-structure/schemas';
import { coveValidationStepsExpo } from './cove/validation_steps_expo';
import { pedimentoValidationStepsExpo } from './pedimento/validation_steps_expo';

export async function glosaExpo({
  pedimento,
  documentoDeTransporte,
  packingList,
  cove,
  cfdiResult,
  carta318,
  factura,
  traceId,
}: {
  pedimento: Pedimento;
  documentoDeTransporte?: OCR[];
  packingList?: PackingList[];
  cove: Cove[];
  cfdiResult?: CFDI[];
  carta318?: OCR[];
  factura?: OCR[];
  traceId: string;
}) {
  // Ensure cove exists since it's required
  const firstCove = cove[0];
  if (!firstCove) {
    throw new Error('This should never happen');
  }

  const results = await Promise.all([
    pedimentoValidationStepsExpo({
      pedimento,
      cove: firstCove,
      cfdi: cfdiResult?.[0],
      cartaSesion: carta318?.[0],
      transportDocument: documentoDeTransporte?.[0],
      packingList: packingList?.[0],
      traceId,
    }),
    coveValidationStepsExpo({ 
      cove: firstCove, 
      cfdi: cfdiResult?.[0], 
      invoice: factura?.[0], 
      traceId 
    }),
  ]);
  return results.flat();
}
