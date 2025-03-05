import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { TransportDocument } from "../../../data-extraction/mkdown_schemas/transport-document";
import { Carta318 } from "../../../data-extraction/mkdown_schemas/carta-318";
import { Invoice } from "../../../data-extraction/mkdown_schemas/invoice";
import { traceable } from "langsmith/traceable";

// TODO: Agregar DOF


export async function validateTransportDocumentEntryDate(pedimento: Pedimento, transportDocument?: TransportDocument) {
  const pedimentoEntryDate = pedimento.fecha_entrada_presentacion;
  const transportDocmkdown = transportDocument?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  
  const validation = {
    name: "Fecha de entrada del documento de transporte",
    description: "La fecha de entrada del documento de transporte debe coincidir con la fecha de entrada del pedimento, considerando el tipo de transporte (AIR, SEA, LAND).",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Fecha de entrada", value: pedimentoEntryDate },
            { name: "Observaciones", value: observaciones }
          ]
        },
        documentoDeTransporte: {
          data: [
            { name: "Documento de transporte", value: transportDocmkdown },
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateTipoCambio(pedimento: Pedimento) {
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const fechaEntrada = pedimento.fecha_entrada_presentacion;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  // TODO: Replace with actual DOF API integration
  const tipoCambioDOF = 17.1234; // Temporary hardcoded value
  
  const validation = {
    name: "Tipo de cambio",
    description: "El tipo de cambio del pedimento debe ser exactamente igual al publicado en el DOF el día hábil anterior a la fecha de entrada del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Fecha de entrada", value: fechaEntrada },
            { name: "Observaciones", value: observaciones }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        dof: {
          data: [
            { name: "Tipo de cambio DOF", value: tipoCambioDOF }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateIncrementables(pedimento: Pedimento, invoice?: Invoice, transportDocument?: TransportDocument, carta318?: Carta318) {
  // Get incrementables from pedimento
  const incrementablesPedimento = {
    fletes: pedimento.incrementables?.fletes,
    seguros: pedimento.incrementables?.seguros,
    embalajes: pedimento.incrementables?.embalajes,
    otros: pedimento.incrementables?.otros_incrementables
  };
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  // Update to use markdown representations
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;
  
  const validation = {
    name: "Incrementables",
    description: "Los incrementables son los servicios a los cuales se les puede cobrar impuestos. Para hacer la declaracion correcta, se necesita verificar que los valores de los incrementables en el pedimento seas validos conforme a la carta 318, factura o documento de transporte. Los incrementables pueden ser fletes, seguros, maniobras, entre otros. Tenemos que buscar una relación entre los valores del pedimento y los documentos que lo avalan. Argumenta por que los incrementables estan bien o mal, siempre buscando sostener tus respuestas. Si hay un valor en dolares de incrementables en la carta 318, factura o documento de transporte, se debe de multiplicar por el tipo de cambio del pedimento para obtener el valor en pesos mexicanos y poder compararlo contra los incrementables del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Incrementables", value: incrementablesPedimento },
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Observaciones", value: observaciones }
          ]
        },
        carta318: {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        },
        factura: {
          data: [
            { name: "Factura", value: invoicemkdown }
          ]
        },
        transporte: {
          data: [
            { name: "Documento de transporte", value: transportDocmkdown }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateValoresPedimento(pedimento: Pedimento, invoice?: Invoice, transportDocument?: TransportDocument, carta318?: Carta318) {
  // Extract monetary values from pedimento
  const valorAduana = pedimento.valores?.valor_aduana;
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const valorDolares = pedimento.valores?.valor_dolares;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const tipoCambioDOF = 17.1234;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  // Update to use markdown representations
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;
  
  const validation = {
    name: "Valores del pedimento",
    description: "Sigue estos pasos para validar correctamente los valores declarados. Piensa paso por paso antes de dar una respuesta, razonando con base en la información que se te proporciona. Usa datos para fundamentar tu respuesta, como si tuvieras que citar todos tus argumentos.\n\nPaso 1: Confirmar el Valor en dólares\n• Verifica si el Valor en dólares (valor aduana / tipo de cambio) declarado en el pedimento tiene sentido comparándolo con los datos proporcionados:\n• Valor de la factura.\n• Incrementables (en USD).\n• Razona si este valor es consistente con los datos dados. No realices cálculos, solo evalúa la coherencia.\n\nPaso 2: Validar el Valor comercial\n• Confirma si el Valor comercial declarado en el pedimento se alinea con el cálculo obtenido al restar a la aduana en MXN los incrementables en MXN, considerando que el valor aduana se obtiene al multiplicar el valor en dólares total (suma de incrementables convertidos a USD y factura en USD) por el tipo de cambio DOF.\n• Evalúa si la relación entre el Valor comercial y los demás valores proporcionados es razonable, considerando la coherencia de los datos.\n\nPaso 3: Verificar el Valor aduana\n• Verifica si el Valor aduana declarado en el pedimento tiene sentido con base en los datos dados:\n• Valor comercial.\n• Incrementables.\n• Decrementables.\n• Evalúa si el resultado final es consistente con lo esperado según la información.\n\nPaso 4: Explicar el resultado con lógica\n• Razona paso por paso por qué los valores tienen sentido o, si detectas alguna discrepancia, explica por qué puede haber un problema.\n• Ejemplo esperado de respuesta:\n\"El valor en dólares del pedimento es [x], hace sentido porque el valor de la factura ([y]) más los incrementables convertidos a USD da un total consistente. Al aplicar el tipo de cambio, el Valor aduana y el Valor comercial resultan coherentes con los datos proporcionados.\"\n\nNota: utiliza únicamente la información proporcionada para llegar a las conclusiones de manera lógica y detallada. Si necesitas realizar un cálculo para argumentar, hazlo. Siempre indica dónde está el problema y adjunta la data sobre el mismo.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Valor aduana", value: valorAduana },
            { name: "Valor comercial", value: valorComercial },
            { name: "Valor en dólares", value: valorDolares },
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Observaciones", value: observaciones }
          ]
        },
        carta318: {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        },
        factura: {
          data: [
            { name: "Factura", value: invoicemkdown }
          ]
        },
        transporte: {
          data: [
            { name: "Documento de transporte", value: transportDocmkdown }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        dof: {
          data: [
            { name: "Tipo de cambio DOF", value: tipoCambioDOF }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedTransportDocumentEntryDate = traceable(
  async ({ pedimento, invoice, transportDocument, carta318 }: { pedimento: Pedimento; invoice?: Invoice; transportDocument?: TransportDocument; carta318?: Carta318 }) => {
    const validationsPromise = await Promise.all([
      validateTransportDocumentEntryDate(pedimento, transportDocument),
      validateTipoCambio(pedimento),
      validateIncrementables(pedimento, invoice, transportDocument, carta318),
      validateValoresPedimento(pedimento, invoice, transportDocument, carta318)
    ]);
    
    return {
      sectionName: "Operación monetaria",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S4: Operación monetaria" }
);
