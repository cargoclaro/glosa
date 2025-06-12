import type { OCR } from '~/lib/utils';
import type { CFDI, Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove, PackingList } from '../../../extract-and-structure/schemas';
import { numeroDePedimento } from './1.numero-de-pedimento';
import { tipoOperacion } from './2.tipo-operacion';
import { claveApendice15 } from './3.origen-destino';
import { operacionMonetaria } from './4.operacion-monetaria';
import { pesosYBultos } from './5.peso-neto';
import { datosDeFactura } from './6.datos-de-factura';
import { tipoTransporte } from './7.datos-del-transporte';
import { partidas } from './9.partidas';

export async function pedimentoValidationStepsExpo({
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
  cfdi?: CFDI;
  cartaSesion?: OCR;
  transportDocument?: OCR;
  packingList?: PackingList;
  traceId: string;
}) {
  // Ejecutar validaciones que devuelven un solo resultado
  const singleValidationResults = await Promise.all([
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
    tipoTransporte({ pedimento, transportDocument, traceId }),
    partidas({ pedimento, cfdi, traceId }),
  ]);

  // Ejecutar validaciones de facturas que devuelven múltiples resultados
  const facturaValidations = await datosDeFactura({ 
    pedimento, 
    cove, 
    cfdi, 
    cartaSesion, 
    traceId 
  });

  // Combinar todos los resultados
  const allResults = [
    ...singleValidationResults,
    ...(Array.isArray(facturaValidations) ? facturaValidations : [facturaValidations]),
  ];

  return allResults;
}
