import { traceable } from 'langsmith/traceable';
import type {
  Carta318,
  Invoice,
  TransportDocument,
} from '../data-extraction/mkdown_schemas';
import type { Pedimento } from '../data-extraction/schemas';
import type { Cove, PackingList } from '../extract-and-structure/schemas';
import { tracedCoveValidationStepsImpo } from './cove/validation_steps_impo';
import { tracedPedimentoValidationStepsImpo } from './pedimento/validation_steps_impo';

export const glosaImpo = traceable(
  async ({
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
  }) =>
    Promise.all([
      tracedPedimentoValidationStepsImpo({
        pedimento,
        cove,
        transportDocument,
        packingList,
        invoice,
        carta318,
        traceId,
      }),
      tracedCoveValidationStepsImpo({ cove, invoice, carta318, traceId }),
    ]).then((results) => results.flat()),
  { name: 'Importación' }
);
