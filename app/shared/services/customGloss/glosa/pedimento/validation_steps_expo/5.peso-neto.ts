import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { TransportDocument } from "../../../data-extraction/schemas";
import { Cfdi } from "../../../data-extraction/schemas/cfdi";
import { PackingList } from "../../../data-extraction/schemas/packing-list";

export async function validatePesosYBultos(pedimento: Pedimento, transportDocument: TransportDocument, packingList: PackingList, cfdi: Cfdi) {
  // Extract weight values from pedimento
  const pesoBrutoPedimento = pedimento.encabezado_del_pedimento?.peso_bruto;
  // Extract weight values from transport document
  const pesoBrutoTransportDocument = transportDocument?.gross_weight;
  const pesoNetoTransportDocument = transportDocument?.net_weight;
  const bultosTransportDocument = transportDocument?.number_of_packages;
  
  // Extract weight values from packing list
  const pesoBrutoPackingList = packingList?.totals?.total_gross_weight;
  const pesoNetoPackingList = packingList?.totals?.total_net_weight;
  
  // Extract weight values from CFDI
  const pesoBrutoCFDI = cfdi?.peso_bruto_total;
  const pesoNetoCFDI = cfdi?.peso_neto_total;
  
  const validation = {
    name: "Validación de pesos y bultos",
    description: "Para validar los pesos y bultos, sigue estos pasos detallados:\n\n1. Verifica que el peso bruto declarado en el pedimento sea igual o menor a alguno de los pesos declarados en el documento de transporte, packing list o CFDI.\n2. Asegúrate de que el peso bruto declarado en el pedimento coincida con el peso declarado en el documento de transporte, carta 318 o packing list. La relación entre estos pesos debe ser lógica y consistente.\n3. Comprueba que el peso neto declarado en el pedimento sea menor que el peso bruto y que sea consistente con los documentos soporte.\n4. Verifica que el número total de bultos coincida entre el pedimento, documento de transporte y/o CFDI",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: "Peso bruto", value: pesoBrutoPedimento }]
        },
        documentoDeTransporte: {
          data: [
            { name: "Peso bruto", value: pesoBrutoTransportDocument },
            { name: "Peso neto", value: pesoNetoTransportDocument },
            { name: "Número de bultos", value: bultosTransportDocument }
          ]
        },
        listaDeEmpaque: {
          data: [
            { name: "Peso bruto", value: pesoBrutoPackingList },
            { name: "Peso neto", value: pesoNetoPackingList }
          ]
        },
        cfdi: {
          data: [
            { name: "Peso bruto", value: pesoBrutoCFDI },
            { name: "Peso neto", value: pesoNetoCFDI }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateBultos(pedimento: Pedimento, transportDocument: TransportDocument) {
  // Extract bultos values from pedimento
  const bultosPedimento = pedimento.identificadores_nivel_pedimento?.marcas_numeros_bultos;
  
  // Extract bultos values from transport document
  const bultosTransportDocument = transportDocument?.number_of_packages;
  
  const validation = {
    name: "Coincidencia de bultos",
    description: "El número total de bultos debe coincidir entre el pedimento y el documento de transporte. Si no hay documento de transporte, marcar como advertencia.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: "Número de bultos", value: bultosPedimento }]
        },
        documentoDeTransporte: {
          data: [{ name: "Número de bultos", value: bultosTransportDocument }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}




