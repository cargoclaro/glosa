import { traceable } from 'langsmith/traceable';
import type {
  Carta318,
  Invoice,
  PackingList,
  TransportDocument,
} from '../data-extraction/mkdown_schemas';
import type { Cove, Pedimento } from '../data-extraction/schemas';
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
  }: {
    pedimento: Pedimento;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    cove: Cove;
    invoice?: Invoice;
    carta318?: Carta318;
  }) =>
    Promise.all([
      tracedPedimentoValidationStepsImpo({
        pedimento,
        cove,
        transportDocument,
        packingList,
        invoice,
        carta318,
      }),
      tracedCoveValidationStepsImpo({ cove, invoice, carta318 }),
    ]).then((results) => results.flat()),
  { name: 'Importación' }
);
