import { traceable } from 'langsmith/traceable';
import type { Cfdi, Invoice } from '../../../data-extraction/mkdown_schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { tracedDatosGenerales } from './1.datos-generales';
import { tracedProveedorDestinatario } from './2.datos-proveedor-destinatario';
import { tracedMercancias } from './3.validacion-mercancias';

export const tracedCoveValidationStepsExpo = traceable(
  async ({
    cove,
    cfdi,
    invoice,
    traceId,
  }: { cove: Cove; cfdi?: Cfdi; invoice?: Invoice; traceId: string }) =>
    Promise.all([
      tracedDatosGenerales({ cove, cfdi, traceId }),
      tracedProveedorDestinatario({ cove, cfdi, traceId }),
      tracedMercancias({ cove, invoice, cfdi, traceId }),
    ]),
  { name: 'COVE (Exportación)' }
);
