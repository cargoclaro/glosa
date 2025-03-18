import { traceable } from 'langsmith/traceable';
import type {
  CartaSesion,
  Cfdi,
  Invoice,
  PackingList,
  TransportDocument,
} from '../data-extraction/mkdown_schemas';
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
  }: {
    pedimento: Pedimento;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    cove: Cove;
    cfdi?: Cfdi;
    cartaSesion?: CartaSesion;
    invoice?: Invoice;
  }) =>
    Promise.all([
      tracedPedimentoValidationStepsExpo({
        pedimento,
        cove,
        cfdi,
        cartaSesion,
        transportDocument,
        packingList,
      }),
      tracedCoveValidationStepsExpo({ cove, cfdi, invoice }),
    ]).then((results) => results.flat()),
  { name: 'Exportación' }
);
