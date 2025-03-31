import { traceable } from 'langsmith/traceable';
import type {
  CartaSesion,
  Cfdi,
  TransportDocument,
} from '../../../data-extraction/mkdown_schemas';
import type { PackingList } from '../../../extract-and-structure/schemas';
import type { Cove, Pedimento } from '../../../data-extraction/schemas';
import { tracedNumeroDePedimento } from './1.numero-de-pedimento';
import { tracedTipoOperacion } from './2.tipo-operacion';
import { tracedClaveApendice15 } from './3.origen-destino';
import { tracedOperacionMonetaria } from './4.operacion-monetaria';
import { tracedPesosYBultos } from './5.peso-neto';
import { tracedRfcFormat } from './6.datos-de-factura';
import { tracedTipoTransporte } from './7.datos-del-transporte';
import { tracedPartidas } from './9.partidas';

export const tracedPedimentoValidationStepsExpo = traceable(
  async ({
    pedimento,
    cove,
    cfdi,
    cartaSesion,
    transportDocument,
    packingList,
    traceId,
  }: {
    pedimento: Pedimento;
    cove: Cove;
    cfdi?: Cfdi;
    cartaSesion?: CartaSesion;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    traceId: string;
  }) =>
    Promise.all([
      tracedNumeroDePedimento({ pedimento, traceId }),
      tracedTipoOperacion({ pedimento, traceId }),
      tracedClaveApendice15({ pedimento, traceId }),
      tracedOperacionMonetaria({
        pedimento,
        cove,
        transportDocument,
        cfdi,
        traceId,
      }),
      tracedPesosYBultos({
        pedimento,
        transportDocument,
        packingList,
        cfdi,
        traceId,
      }),
      tracedRfcFormat({ pedimento, cove, cfdi, cartaSesion, traceId }),
      tracedTipoTransporte({ pedimento, transportDocument, traceId }),
      tracedPartidas({ pedimento, cfdi, traceId }),
    ]),
  { name: 'Pedimento (Exportación)' }
);
