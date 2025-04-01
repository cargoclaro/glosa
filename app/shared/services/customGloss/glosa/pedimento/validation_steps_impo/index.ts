import { traceable } from 'langsmith/traceable';
import type {
  Carta318,
  Invoice,
  TransportDocument,
} from '../../../data-extraction/mkdown_schemas';
import type { PackingList } from '../../../extract-and-structure/schemas';
import type { Cove, Pedimento } from '../../../data-extraction/schemas';
import { tracedNumeroDePedimento } from './1.numero-de-pedimento';
import { tracedTipoOperacion } from './2.tipo-operacion';
import { tracedClaveApendice15 } from './3.origen-destino';
import { tracedTransportDocumentEntryDate } from './4.operacion-monetaria';
import { tracedPesosYBultos } from './5.peso-neto';
import { tracedDatosDeFactura } from './6.datos-de-factura';
import { tracedTipoTransporte } from './7.datos-del-transporte';
import { tracedPartidas } from './9.partidas';

export const tracedPedimentoValidationStepsImpo = traceable(
  async ({
    pedimento,
    cove,
    transportDocument,
    packingList,
    invoice,
    carta318,
    traceId,
  }: {
    pedimento: Pedimento;
    cove: Cove;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    invoice?: Invoice;
    carta318?: Carta318;
    traceId: string;
  }) =>
    Promise.all([
      tracedNumeroDePedimento({ pedimento, traceId }),
      tracedTipoOperacion({
        pedimento,
        ...(transportDocument ? { transportDocument } : {}),
        traceId,
      }),
      tracedClaveApendice15({ pedimento, traceId }),
      tracedTransportDocumentEntryDate({
        pedimento,
        ...(invoice ? { invoice } : {}),
        ...(transportDocument ? { transportDocument } : {}),
        ...(carta318 ? { carta318 } : {}),
        traceId,
      }),
      tracedPesosYBultos({
        pedimento,
        ...(transportDocument ? { transportDocument } : {}),
        ...(packingList ? { packingList } : {}),
        ...(invoice ? { invoice } : {}),
        traceId,
      }),
      tracedDatosDeFactura({
        pedimento,
        cove,
        ...(carta318 ? { carta318 } : {}),
        ...(invoice ? { invoice } : {}),
        traceId,
      }),
      tracedTipoTransporte({
        pedimento,
        ...(transportDocument ? { transportDocument } : {}),
        traceId,
      }),
      ...(pedimento.partidas
        ? pedimento.partidas.map((partida, index) =>
            tracedPartidas({
              pedimento,
              invoice,
              cove,
              carta318,
              partida,
              partidaNumber: index + 1,
              traceId,
            })
          )
        : []),
    ]),
  { name: 'Pedimento (Importación)' }
);
