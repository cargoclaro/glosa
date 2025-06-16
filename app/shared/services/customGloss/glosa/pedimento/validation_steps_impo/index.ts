import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove, PackingList } from '../../../extract-and-structure/schemas';
import type { Factura } from '../../../extract-and-structure/schemas/factura';
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
  coves,
  facturas,
  transportDocument,
  packingList,
  invoice,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  cove: Cove; // Compatibilidad
  coves?: Cove[]; // Múltiples COVEs
  facturas?: Factura[]; // Múltiples facturas
  transportDocument?: OCR;
  packingList?: PackingList;
  invoice?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  const allCoves = coves && coves.length > 0 ? coves : [cove];
  
  const singleValidationResults = await Promise.all([
    numeroDePedimento({ pedimento, traceId }),
    tipoOperacion({
      pedimento,
      ...(transportDocument ? { transportDocument } : {}),
      traceId,
    }),
    claveApendice15({ pedimento, traceId }),
    operacionMonetaria({
      pedimento,
      coves: allCoves,
      facturas,
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
    datosDelTransporte({
      pedimento,
      ...(transportDocument ? { transportDocument } : {}),
      traceId,
    }),
  ]);

  const facturaValidations = await datosDeFactura({
    pedimento,
    cove,
    ...(carta318 ? { carta318 } : {}),
    ...(invoice ? { invoice } : {}),
    traceId,
  });

  const partidaValidations = pedimento.partidas
    ? await Promise.all(
        pedimento.partidas.map((partida, index) =>
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
      )
    : [];

  const allResults = [
    ...singleValidationResults,
    ...(Array.isArray(facturaValidations) ? facturaValidations : [facturaValidations]),
    ...partidaValidations.flat(),
  ];

  return allResults;
}
