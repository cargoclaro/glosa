import { Pedimento, Cove } from "../../../data-extraction/schemas";
import { TransportDocument, PackingList, Cfdi, CartaSesion } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";
import { tracedNumeroDePedimento } from "./1.numero-de-pedimento";
import { tracedTipoOperacion } from "./2.tipo-operacion";
import { tracedClaveApendice15 } from "./3.origen-destino";
import { tracedOperacionMonetaria } from "./4.operacion-monetaria";
import { tracedPesosYBultos } from "./5.peso-neto";
import { tracedRfcFormat } from "./6.datos-de-factura";
import { tracedTipoTransporte } from "./7.datos-del-transporte";
import { tracedPartidas } from "./9.partidas";

export const tracedPedimentoValidationStepsExpo = traceable(
  async ({ 
    pedimento, 
    cove, 
    cfdi, 
    cartaSesion,
    transportDocument,
    packingList
  }: { 
    pedimento: Pedimento; 
    cove: Cove; 
    cfdi?: Cfdi; 
    cartaSesion?: CartaSesion;
    transportDocument?: TransportDocument;
    packingList?: PackingList
  }) => 
    Promise.all([
      tracedNumeroDePedimento({ pedimento }),
      tracedTipoOperacion({ pedimento }),
      tracedClaveApendice15({ pedimento }),
      tracedOperacionMonetaria({ pedimento, cove, transportDocument, cfdi }),
      tracedPesosYBultos({ pedimento, transportDocument, packingList, cfdi }),
      tracedRfcFormat({ pedimento, cove, cfdi, cartaSesion }),
      tracedTipoTransporte({ pedimento, transportDocument }),
      tracedPartidas({ pedimento, cfdi })
    ]),
  { name: "Pedimento (Exportación)" }
); 