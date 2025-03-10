import { Cove } from "../../../data-extraction/schemas";
import { Cfdi, Invoice } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";
import { tracedDatosGenerales } from "./1.datos_generales";
import { tracedProveedorDestinatario } from "./2.datos_proveedor_destinatario";
import { tracedMercancias } from "./3.validacion_mercancias";

export const tracedCoveValidationStepsExpo = traceable(
  async ({ cove, cfdi, invoice }: { cove: Cove; cfdi?: Cfdi; invoice?: Invoice }) => 
    Promise.all([
      tracedDatosGenerales({ cove, cfdi }),
      tracedProveedorDestinatario({ cove, cfdi }),
      tracedMercancias({ cove, invoice, cfdi }),
    ]),
  { name: "COVE (Exportación)" }
);
