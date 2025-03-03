import { Pedimento, TransportDocument, PackingList, Cove, Cfdi, CartaSesion, Invoice } from '../data-extraction/schemas';
import { tracedPedimentoValidationStepsExpo } from './pedimento/validation_steps_expo';
import { tracedCoveValidationStepsExpo } from './cove/validation_steps_expo';
import { traceable } from "langsmith/traceable";

export const glosaExpo = traceable(
  async ({
    pedimento,
    transportDocument,
    packingList,
    cove,
    cfdi,
    cartaSesion,
    invoice
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
      tracedPedimentoValidationStepsExpo({ pedimento, cove, ...(cfdi ? { cfdi } : {}), ...(cartaSesion ? { cartaSesion } : {}), ...(transportDocument ? { transportDocument } : {}), ...(packingList ? { packingList } : {}) }),
      tracedCoveValidationStepsExpo({ cove, ...(cfdi ? { cfdi } : {}), ...(invoice ? { invoice } : {}) })
    ]).then(results => results.flat()),
  { name: "Exportación" }
);
