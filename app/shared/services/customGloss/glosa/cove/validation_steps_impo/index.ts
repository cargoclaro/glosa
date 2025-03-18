import { traceable } from 'langsmith/traceable';
import type {
  Carta318,
  Invoice,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../data-extraction/schemas';
import { tracedDatosGenerales } from './1.datos_generales';
import { tracedChooseDocument } from './2.datos_proveedor_destinatario';
import { tracedMercancias } from './3.validacion_mercancias';

export const tracedCoveValidationStepsImpo = traceable(
  async ({
    cove,
    invoice,
    carta318,
  }: { cove: Cove; invoice?: Invoice; carta318?: Carta318 }) =>
    Promise.all([
      tracedDatosGenerales({
        cove,
        ...(invoice ? { invoice } : {}),
        ...(carta318 ? { carta318 } : {}),
      }),
      tracedChooseDocument({
        cove,
        ...(invoice ? { invoice } : {}),
        ...(carta318 ? { carta318 } : {}),
      }),
      tracedMercancias({
        cove,
        ...(invoice ? { invoice } : {}),
        ...(carta318 ? { carta318 } : {}),
      }),
    ]),
  { name: 'COVE (Importación)' }
);
