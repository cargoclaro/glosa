import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove, PackingList } from '../../../extract-and-structure/schemas';
import { numeroDePedimento } from './1.numero-de-pedimento';
import { tipoOperacion } from './2.tipo-operacion';
import { claveApendice15 } from './3.origen-destino';
import { operacionMonetaria } from './4.operacion-monetaria';
import { pesosYBultos } from './5.peso-neto';
import { datosDeFactura } from './6.datos-de-factura';
import { datosDelTransporte } from './7.datos-del-transporte';
import { partidas } from './9.partidas';

export async function pedimentoValidationStepsImpo({
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
  transportDocument?: OCR;
  packingList?: PackingList;
  invoice?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  const validationResults = await Promise.all([
    numeroDePedimento({ pedimento, traceId }),
    tipoOperacion({
      pedimento,
      ...(transportDocument ? { transportDocument } : {}),
      traceId,
    }),
    claveApendice15({ pedimento, traceId }),
    operacionMonetaria({
      pedimento,
      ...(invoice ? { invoice } : {}),
      ...(transportDocument ? { transportDocument } : {}),
      ...(carta318 ? { carta318 } : {}),
      traceId,
    }),
    pesosYBultos({
      pedimento,
      ...(transportDocument ? { transportDocument } : {}),
      ...(packingList ? { packingList } : {}),
      ...(invoice ? { invoice } : {}),
      traceId,
    }),
    datosDeFactura({
      pedimento,
      cove,
      ...(carta318 ? { carta318 } : {}),
      ...(invoice ? { invoice } : {}),
      traceId,
    }),
    datosDelTransporte({
      pedimento,
      ...(transportDocument ? { transportDocument } : {}),
      traceId,
    }),
    ...(pedimento.partidas
      ? pedimento.partidas.map((partida, index) =>
          partidas({
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
  ]);

  return validationResults.flat();
}
