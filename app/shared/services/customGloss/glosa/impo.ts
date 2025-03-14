import { Pedimento, Cove } from '../data-extraction/schemas';
import { TransportDocument, PackingList, Invoice, Carta318 } from '../data-extraction/mkdown_schemas';
import { tracedPedimentoValidationStepsImpo } from './pedimento/validation_steps_impo';
import { tracedCoveValidationStepsImpo } from './cove/validation_steps_impo';
import { traceable } from "langsmith/traceable";

export const glosaImpo = traceable(
  async ({
    pedimento,
    transportDocument,
    packingList,
    cove,
    invoice,
    carta318
  }: {
    pedimento: Pedimento;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    cove: Cove;
    invoice?: Invoice;
    carta318?: Carta318;
  }) =>
    Promise.all([
      tracedPedimentoValidationStepsImpo({ pedimento, cove, transportDocument, packingList, invoice, carta318 }),
      tracedCoveValidationStepsImpo({ cove, invoice, carta318 })
    ]).then(results => results.flat()),
  { name: "Importación" }
);
