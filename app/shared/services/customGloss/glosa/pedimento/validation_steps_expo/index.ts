import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove, PackingList } from '../../../extract-and-structure/schemas';
import { numeroDePedimento } from './1.numero-de-pedimento';
import { tipoOperacion } from './2.tipo-operacion';
import { claveApendice15 } from './3.origen-destino';
import { operacionMonetaria } from './4.operacion-monetaria';
import { pesosYBultos } from './5.peso-neto';
import { datosDeFactura } from './6.datos-de-factura';
import { tipoTransporte } from './7.datos-del-transporte';
import { partidas } from './9.partidas';

export function pedimentoValidationStepsExpo({
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
  cfdi?: OCR;
  cartaSesion?: OCR;
  transportDocument?: OCR;
  packingList?: PackingList;
  traceId: string;
}) {
  return Promise.all([
    numeroDePedimento({ pedimento, traceId }),
    tipoOperacion({ pedimento, traceId }),
    claveApendice15({ pedimento, traceId }),
    operacionMonetaria({
      pedimento,
      cove,
      transportDocument,
      cfdi,
      traceId,
    }),
    pesosYBultos({
      pedimento,
      transportDocument,
      packingList,
      cfdi,
      traceId,
    }),
    datosDeFactura({ pedimento, cove, cfdi, cartaSesion, traceId }),
    tipoTransporte({ pedimento, transportDocument, traceId }),
    partidas({ pedimento, cfdi, traceId }),
  ]);
}
