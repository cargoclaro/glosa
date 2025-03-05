import { Pedimento, Cove } from "../../../data-extraction/schemas";
import { TransportDocument, PackingList, Invoice, Carta318 } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";
import { tracedNumeroDePedimento } from "./1.numero-de-pedimento";
import { tracedTipoOperacion } from "./2.tipo-operacion";
import { tracedClaveApendice15 } from "./3.origen-destino";
import { tracedTransportDocumentEntryDate } from "./4.operacion-monetaria";
import { tracedPesosYBultos } from "./5.peso-neto";
import { tracedDatosDeFactura } from "./6.datos-de-factura";
import { tracedTipoTransporte } from "./7.datos-del-transporte";
import { tracedPartidas } from "./9.partidas";

export const tracedPedimentoValidationStepsImpo = traceable(
  async ({ 
    pedimento, 
    cove,
    transportDocument,
    packingList,
    invoice,
    carta318
  }: { 
    pedimento: Pedimento; 
    cove: Cove; 
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    invoice?: Invoice;
    carta318?: Carta318;
  }) => 
    Promise.all([
      tracedNumeroDePedimento({ pedimento }),
      tracedTipoOperacion({ pedimento, ...(transportDocument ? { transportDocument } : {}) }),
      tracedClaveApendice15({ pedimento }),
      tracedTransportDocumentEntryDate({ pedimento, ...(invoice ? { invoice } : {}), ...(transportDocument ? { transportDocument } : {}), ...(carta318 ? { carta318 } : {}) }),
      tracedPesosYBultos({ pedimento, ...(transportDocument ? { transportDocument } : {}), ...(packingList ? { packingList } : {}), ...(invoice ? { invoice } : {}) }),
      tracedDatosDeFactura({ pedimento, cove, ...(carta318 ? { carta318 } : {}), ...(invoice ? { invoice } : {}) }),
      tracedTipoTransporte({ pedimento, ...(transportDocument ? { transportDocument } : {}) }),
      tracedPartidas({ pedimento, ...(invoice ? { invoice } : {}) })
    ]),
  { name: "Pedimento (Importación)" }
); 