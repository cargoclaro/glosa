import { Pedimento, TransportDocument } from "../../../data-extraction/schemas";
import { apendice10 } from "../../anexo-22/apendice_10";
import { apendice3 } from "../../anexo-22/apendice_3";
import { glosar } from "../../validation-result";


export async function validateTipoTransporte(pedimento: Pedimento) {
  // Extract transport type from pedimento
  const tipoTransporteEntradaSalida = pedimento.medios_transporte?.entrada_salida;
  const tipoTransporteArribo = pedimento.medios_transporte?.arribo;
  const tipoTransporteSalida = pedimento.medios_transporte?.salida;
  
  const validation = {
    name: "Clave del tipo de transporte",
    description: "La clave del tipo de transporte debe existir en el apéndice 10.",
    tipoTransporteEntradaSalida,
    tipoTransporteArribo,
    tipoTransporteSalida,
    apendice10JSON: JSON.stringify(apendice10)
  };

  return await glosar(validation);
}

export async function validateModalidadMedioTransporte(pedimento: Pedimento, transportDocument: TransportDocument) {
  // Extract transport means from pedimento
  const tipoTransporteEntradaSalida = pedimento.medios_transporte?.entrada_salida;
  
  // Extract document type from transport document
  const tipoDocumentoTransporte = transportDocument?.document_type;
  
  const validation = {
    name: "Modalidad y medio de transporte",
    description: "La modalidad del documento de transporte y el medio de transporte deben ser coherentes entre sí. En transporte terrestre, puede no existir un documento de transporte, pero si lo hay, debe coincidir con el pedimento. Si la clave del medio de transporte es '7' (carretero) y no se proporciona modalidad de documento, esto es válido, pero se debe verificar que no falte información en documentos de transporte relacionados. Validar contra el apendice 3.",
    tipoTransporteEntradaSalida,
    tipoDocumentoTransporte,
    apendice3JSON: JSON.stringify(apendice3)
  };

  return await glosar(validation);
}

export async function validateNumeroGuiaEmbarque(pedimento: Pedimento, transportDocument: TransportDocument) {
  // Extract guide/shipment number from pedimento
  const numeroGuiaEmbarque = pedimento.no_guia_embarque_id;
  
  // Extract document number from transport document
  const numeroDocumentoTransporte = transportDocument?.document_number;
  
  const validation = {
    name: "Número de guía o embarque",
    description: "En caso de transporte terrestre, el valor es correcto porque se envía el mismo día del pago del pedimento, y puede no existir un documento de transporte. Para transporte marítimo, el número de guía o embarque del pedimento debe ser exactamente igual al número de contenedor, placa, o master y house del documento de transporte. Para transporte aéreo, el número de guía o embarque del pedimento debe ser exactamente igual al número master y house del documento de transporte. Si el documento de transporte no cuenta con estos datos, se debe validar con el documento oficial proporcionado por la naviera o agente de carga.Nota: En el pedimento pueden venir más de un valor, en caso de master y house, denotados por M y H respectivamente.",
    numeroGuiaEmbarque,
    numeroDocumentoTransporte,
    tipoTransporte: pedimento.medios_transporte?.entrada_salida,
    tipoDocumentoTransporte: transportDocument?.document_type
  };

  return await glosar(validation);
}

