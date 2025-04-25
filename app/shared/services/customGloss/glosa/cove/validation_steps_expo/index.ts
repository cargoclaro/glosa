
import type { Cfdi, Invoice } from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { datosGenerales } from './1.datos-generales';
import { proveedorDestinatario } from './2.datos-proveedor-destinatario';
import { mercancias } from './3.validacion-mercancias';

export function coveValidationStepsExpo({
  cove,
  cfdi,
  invoice,
  traceId,
  }: { cove: Cove; cfdi?: Cfdi; invoice?: Invoice; traceId: string }) {
  return Promise.all([
    datosGenerales({ cove, cfdi, traceId }),
    proveedorDestinatario({ cove, cfdi, traceId }),
    mercancias({ cove, invoice, cfdi, traceId }),
  ]);
}
