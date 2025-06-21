import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove, PackingList } from '../../../extract-and-structure/schemas';
import type { Factura } from '../../../extract-and-structure/schemas/factura';
import { numeroDePedimento } from './1.numero-de-pedimento';
import { numeroDePedimento as numeroDePedimentoV2 } from './1.numero-de-pedimento_v2';
import { tipoOperacion } from './2.tipo-operacion';
import { tipoOperacion as tipoOperacionV2 } from './2.tipo-operacion_v2';
import { claveApendice15 } from './3.origen-destino';
import { claveApendice15 as claveApendice15V2 } from './3.origen-destino_v2';
import { operacionMonetaria } from './4.operacion-monetaria';
import { operacionMonetaria as operacionMonetariaV2 } from './4.operacion-monetaria_v2';
import { pesosYBultos } from './5.peso-neto';
import { pesosYBultos as pesosYBultosV2 } from './5.peso-neto_v2';
import { datosDeFactura } from './6.datos-de-factura';
import { datosDeFactura as datosDeFacturaV2 } from './6.datos-de-factura_v2';
import { datosDelTransporte } from './7.datos-del-transporte';
import { datosDelTransporte as datosDelTransporteV2 } from './7.datos-del-transporte_v2';
import { partidas } from './9.partidas';
import { partidas as partidasV2 } from './9.partidas_v2';
import { cuadroDeLiquidacion } from './8.cuadro-de-liquidacion';
import { cuadroDeLiquidacion as cuadroDeLiquidacionV2 } from './8.cuadro-de-liquidacion_v2';
import { USE_SECTION_VALIDATION } from './use-clean-validation';

export async function pedimentoValidationStepsImpo({
  pedimento,
  cove,
  coves: _coves,
  facturas: _facturas,
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
  // const allCoves = coves && coves.length > 0 ? coves : [cove]; // TODO: Use when COVEs validation is implemented
  
  const singleValidationResults = await Promise.all([
    USE_SECTION_VALIDATION.numeroDePedimento
      ? numeroDePedimentoV2({ pedimento, traceId })
      : numeroDePedimento({ pedimento, traceId }),
    USE_SECTION_VALIDATION.tipoOperacion
      ? tipoOperacionV2({
          pedimento,
          ...(transportDocument ? { transportDocument } : {}),
          traceId,
        })
      : tipoOperacion({
          pedimento,
          ...(transportDocument ? { transportDocument } : {}),
          traceId,
        }),
    USE_SECTION_VALIDATION.origenDestino
      ? claveApendice15V2({ pedimento, traceId })
      : claveApendice15({ pedimento, traceId }),
    USE_SECTION_VALIDATION.operacionMonetaria
      ? operacionMonetariaV2({
          pedimento,
          ...(invoice ? { invoice } : {}),
          ...(transportDocument ? { transportDocument } : {}),
          ...(carta318 ? { carta318 } : {}),
          traceId,
        })
      : operacionMonetaria({
          pedimento,
          ...(invoice ? { invoice } : {}),
          ...(transportDocument ? { transportDocument } : {}),
          ...(carta318 ? { carta318 } : {}),
          traceId,
        }),
    USE_SECTION_VALIDATION.pesoNeto
      ? pesosYBultosV2({
          pedimento,
          ...(transportDocument ? { transportDocument } : {}),
          ...(packingList ? { packingList } : {}),
          ...(invoice ? { invoice } : {}),
          traceId,
        })
      : pesosYBultos({
          pedimento,
          ...(transportDocument ? { transportDocument } : {}),
          ...(packingList ? { packingList } : {}),
          ...(invoice ? { invoice } : {}),
          traceId,
        }),
    USE_SECTION_VALIDATION.datosDelTransporte
      ? datosDelTransporteV2({
          pedimento,
          ...(transportDocument ? { transportDocument } : {}),
          traceId,
        })
      : datosDelTransporte({
          pedimento,
          ...(transportDocument ? { transportDocument } : {}),
          traceId,
        }),
    USE_SECTION_VALIDATION.cuadroDeLiquidacion
      ? cuadroDeLiquidacionV2({ pedimento, traceId })
      : cuadroDeLiquidacion({ pedimento, traceId }),
  ]);

  const facturaValidations = USE_SECTION_VALIDATION.datosDeFactura
    ? await datosDeFacturaV2({
        pedimento,
        cove,
        ...(carta318 ? { carta318 } : {}),
        ...(invoice ? { invoice } : {}),
        traceId,
      })
    : await datosDeFactura({
        pedimento,
        cove,
        ...(carta318 ? { carta318 } : {}),
        ...(invoice ? { invoice } : {}),
        traceId,
      });

  const partidaValidations = pedimento.partidas
    ? await Promise.all(
        pedimento.partidas.map((partida, index) =>
          USE_SECTION_VALIDATION.partidas
            ? partidasV2({
                pedimento,
                invoice,
                cove,
                carta318,
                partida,
                packing: packingList,
                partidaNumber: index + 1,
                traceId,
              })
            : partidas({
                pedimento,
                invoice,
                cove,
                carta318,
                partida,
                packing: packingList,
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
