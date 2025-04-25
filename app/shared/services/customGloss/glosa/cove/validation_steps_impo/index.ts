
import type {
  Carta318,
  Invoice,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { datosGenerales } from './1.datos-generales';
import { proveedorDestinatario } from './2.datos-proveedor-destinatario';
import { mercancias } from './3.validacion-mercancias';

export function coveValidationStepsImpo({
  cove,
  invoice,
  carta318,
  traceId,
  }: {
    cove: Cove;
    invoice?: Invoice;
    carta318?: Carta318;
    traceId: string;
  }) {
    return Promise.all([
      datosGenerales({
        cove,
        ...(invoice ? { invoice } : {}),
        ...(carta318 ? { carta318 } : {}),
        traceId,
      }),
      proveedorDestinatario({
        cove,
        ...(invoice ? { invoice } : {}),
        ...(carta318 ? { carta318 } : {}),
        traceId,
      }),
      mercancias({
        cove,
        ...(invoice ? { invoice } : {}),
        ...(carta318 ? { carta318 } : {}),
        traceId,
      }),
    ]);
}
