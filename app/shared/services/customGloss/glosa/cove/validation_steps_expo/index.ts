import type { OCR } from '~/lib/utils';
import type { CFDI, Cove } from '../../../extract-and-structure/schemas';
import { datosGenerales } from './1.datos-generales';
import { proveedorDestinatario } from './2.datos-proveedor-destinatario';
import { mercancias } from './3.validacion-mercancias';

export function coveValidationStepsExpo({
  cove,
  cfdi,
  invoice,
  traceId,
}: { cove: Cove; cfdi?: CFDI; invoice?: OCR; traceId: string }) {
  return Promise.all([
    datosGenerales({ cove, cfdi, traceId }),
    proveedorDestinatario({ cove, cfdi, traceId }),
    mercancias({ cove, invoice, cfdi, traceId }),
  ]);
}
