import type { OCR } from '~/lib/utils';
import type { Cove } from '../../../extract-and-structure/schemas';
import { datosGenerales } from './1.datos-generales';
import { proveedorDestinatario } from './2.datos-proveedor-destinatario';
import { mercancias } from './3.validacion-mercancias';

export async function coveValidationStepsImpo({
  cove,
  invoice,
  carta318,
  traceId,
}: {
  cove: Cove;
  invoice?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  const validationResults = await Promise.all([
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

  return validationResults.flat();
}
