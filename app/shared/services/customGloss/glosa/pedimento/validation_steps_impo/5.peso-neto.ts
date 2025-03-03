import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { TransportDocument } from "../../../data-extraction/schemas";
import { Invoice } from "../../../data-extraction/schemas/invoice";
import { PackingList } from "../../../data-extraction/schemas/packing-list";
import { traceable } from "langsmith/traceable";

export async function validatePesosYBultos(pedimento: Pedimento, transportDocument?: TransportDocument, packingList?: PackingList, invoice?: Invoice) {
  // Extract weight values from pedimento
  const pesoBrutoPedimento = pedimento.encabezado_del_pedimento?.peso_bruto;
  // Extract weight values from transport document
  const pesoBrutoTransportDocument = transportDocument?.gross_weight;
  const pesoNetoTransportDocument = transportDocument?.net_weight;
  const bultosTransportDocument = transportDocument?.number_of_packages;
  
  // Extract weight values from packing list
  const pesoBrutoPackingList = packingList?.totals?.total_gross_weight;
  const pesoNetoPackingList = packingList?.totals?.total_net_weight;
  
  // Extract weight values from invoice
  const pesoBrutoInvoice = invoice?.total_gross_weight;
  const pesoNetoInvoice = invoice?.total_net_weight;
  
  const validation = {
    name: "Validación de pesos y bultos",
    description: "Para validar los pesos y bultos, sigue estos pasos detallados:\n\n1. Verifica que el peso bruto declarado en el pedimento sea igual o menor a alguno de los pesos declarados en el documento de transporte, packing list o factura.\n2. Asegúrate de que el peso bruto declarado en el pedimento coincida con el peso declarado en el documento de transporte, carta 318 o packing list. La relación entre estos pesos debe ser lógica y consistente.\n3. Comprueba que el peso neto declarado en el pedimento sea menor que el peso bruto y que sea consistente con los documentos soporte.\n4. Verifica que el número total de bultos coincida entre el pedimento, documento de transporte y/o carta 3.1.8 / invoice.",
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
        factura: {
          data: [
            { name: "Peso bruto", value: pesoBrutoInvoice },
            { name: "Peso neto", value: pesoNetoInvoice }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateBultos(pedimento: Pedimento, transportDocument?: TransportDocument) {
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

export const tracedPesosYBultos = traceable(
  async ({ pedimento, transportDocument, packingList, invoice }: { pedimento: Pedimento; transportDocument?: TransportDocument; packingList?: PackingList; invoice?: Invoice }) => {
    const validationsPromise = await Promise.all([
      validatePesosYBultos(pedimento, transportDocument, packingList, invoice),
      validateBultos(pedimento, transportDocument)
    ]);
    
    return {
      sectionName: "Pesos y bultos",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S5: Pesos y bultos" }
);

