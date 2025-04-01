import { traceable } from 'langsmith/traceable';
import type {
  CartaSesion,
  Cfdi,
  Invoice,
  TransportDocument,
} from '../data-extraction/mkdown_schemas';
import type { PackingList } from '../extract-and-structure/schemas';
import type { Cove, Pedimento } from '../data-extraction/schemas';
import { tracedCoveValidationStepsExpo } from './cove/validation_steps_expo';
import { tracedPedimentoValidationStepsExpo } from './pedimento/validation_steps_expo';

export const glosaExpo = traceable(
  async ({
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
  }) =>
    Promise.all([
      tracedPedimentoValidationStepsExpo({
        pedimento,
        cove,
        cfdi,
        cartaSesion,
        transportDocument,
        packingList,
        traceId,
      }),
      tracedCoveValidationStepsExpo({ cove, cfdi, invoice, traceId }),
    ]).then((results) => results.flat()),
  { name: 'Exportación' }
);
