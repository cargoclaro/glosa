import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { TransportDocument } from "../../../data-extraction/schemas";
import { Carta318 } from "../../../data-extraction/schemas/carta-318";
import { Invoice } from "../../../data-extraction/schemas/invoice";
// TODO: Agregar DOF


export async function validateTransportDocumentEntryDate(pedimento: Pedimento, transportDocument: TransportDocument) {
  const pedimentoEntryDate = pedimento.fecha_entrada_presentacion;
  const transportEntryDate = transportDocument.date;
  const transportType = transportDocument.document_type;
  
  const validation = {
    name: "Fecha de entrada del documento de transporte",
    description: "La fecha de entrada del documento de transporte debe coincidir con la fecha de entrada del pedimento, considerando el tipo de transporte (AIR, SEA, LAND).",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Fecha de entrada", value: pedimentoEntryDate }
          ]
        },
        documentoDeTransporte: {
          data: [
            { name: "Fecha de entrada", value: transportEntryDate },
            { name: "Tipo de documento de transporte", value: transportType }
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
            { name: "Fecha de entrada", value: fechaEntrada }
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

export async function validateIncrementables(pedimento: Pedimento, invoice: Invoice, carta318: Carta318, transportDocument: TransportDocument) {
  // Get incrementables from pedimento
  const incrementablesPedimento = {
    fletes: pedimento.incrementables?.fletes,
    seguros: pedimento.incrementables?.seguros,
    embalajes: pedimento.incrementables?.embalajes,
    otros: pedimento.incrementables?.otros_incrementables
  };

  // Get incrementables from facturas (invoices)
  const { detalle_facturacion: { incrementables: incrementablesCarta } } = carta318;
  const incrementablesCarta318 = { 
    fletes: incrementablesCarta?.fletes,
    seguros: incrementablesCarta?.seguros,
    embalajes: incrementablesCarta?.embalajes,
    otros: incrementablesCarta?.otros
  };

  const { incrementables: incrementablesInv } = invoice;
  const incrementablesInvoice = { 
    fletes: incrementablesInv?.fletes,
    seguros: incrementablesInv?.seguros,
    embalajes: incrementablesInv?.embalajes,
    otros: incrementablesInv?.otros
  };
  
  // Get incrementables from transport document
  const { costos_adicionales: { incrementables: incrementablesTransport } } = transportDocument;
  const incrementablesTransportDocument = {
    fletes: incrementablesTransport?.fletes,
    seguros: incrementablesTransport?.seguros,
    embalajes: incrementablesTransport?.embalajes,
    otros: incrementablesTransport?.otros
  };
  
  const validation = {
    name: "Incrementables",
    description: "Los incrementables son los servicios a los cuales se les puede cobrar impuestos. Para hacer la declaracion correcta, se necesita verificar que los valores de los incrementables en el pedimento seas validos conforme a la carta 318, factura o documento de transporte. Los incrementables pueden ser fletes, seguros, maniobras, entre otros. Tenemos que buscar una relación entre los valores del pedimento y los documentos que lo avalan. Argumenta por que los incrementables estan bien o mal, siempre buscando sostener tus respuestas.",
    incrementablesPedimento,
    incrementablesCarta318,
    incrementablesInvoice,
    incrementablesTransportDocument
  } as const;

  return await glosar(validation);
}

export async function validateValoresPedimento(pedimento: Pedimento, invoice: Invoice, carta318: Carta318, transportDocument: TransportDocument) {
  // Extract monetary values from pedimento
  const valorAduana = pedimento.valores?.valor_aduana; // Customs value in MXN
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial; // Commercial value/paid price in MXN
  const valorDolares = pedimento.valores?.valor_dolares; // Value in USD
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio; // Exchange rate from pedimento
  const tipoCambioDOF = 17.1234; // Official exchange rate from DOF (Diario Oficial de la Federación)

  // Extract incrementables (costs that increase customs value) from pedimento
  const incrementablesPedimento = {
    fletes: pedimento.incrementables?.fletes, // Freight costs
    seguros: pedimento.incrementables?.seguros, // Insurance costs
    embalajes: pedimento.incrementables?.embalajes, // Packaging costs
    otros: pedimento.incrementables?.otros_incrementables // Other incremental costs
  };

  // Extract incrementables from Carta 318 (customs value declaration)
  const incrementablesCarta318 = {
    fletes: carta318.detalle_facturacion?.incrementables?.fletes,
    seguros: carta318.detalle_facturacion?.incrementables?.seguros,
    embalajes: carta318.detalle_facturacion?.incrementables?.embalajes,
    otros: carta318.detalle_facturacion?.incrementables?.otros
  };

  // Extract incrementables from commercial invoice
  const incrementablesInvoice = {
    fletes: invoice.incrementables?.fletes,
    seguros: invoice.incrementables?.seguros,
    embalajes: invoice.incrementables?.embalajes,
    otros: invoice.incrementables?.otros
  };

  // Extract incrementables from transport document
  const incrementablesTransportDocument = {
    fletes: transportDocument.costos_adicionales?.incrementables?.fletes,
    seguros: transportDocument.costos_adicionales?.incrementables?.seguros,
    embalajes: transportDocument.costos_adicionales?.incrementables?.embalajes,
    otros: transportDocument.costos_adicionales?.incrementables?.otros
  };

  // Group all incrementables for comparison
  const incrementables = {
    pedimento: incrementablesPedimento,
    carta318: incrementablesCarta318,
    invoice: incrementablesInvoice,
    transportDocument: incrementablesTransportDocument
  };

  // Extract decrementables (costs that decrease customs value)
  const decrementablesPedimento = pedimento.decrementables;
  const decrementablesCarta318 = carta318.detalle_facturacion?.decrementables;
  const decrementablesInvoice = invoice.decrementables;

  // Group all decrementables for comparison
  const decrementables = {
    pedimento: decrementablesPedimento,
    carta318: decrementablesCarta318,
    invoice: decrementablesInvoice
  };

  // Extract commercial values from documents
  const valorCarta318 = carta318.detalle_facturacion?.valor_comercial;
  const valorInvoice = invoice.valor_comercial;

  
  const validation = {
    name: "Valores del pedimento",
    description: "Sigue estos pasos para validar correctamente los valores declarados. Piensa paso por paso antes de dar una respuesta, razonando con base en la información que se te proporciona. Usa datos para fundamentar tu respuesta, como si tuvieras que citar todos tus argumentos.\n\nPaso 1: Confirmar el Valor en dólares\n• Verifica si el Valor en dólares (valor aduana / tipo de cambio) declarado en el pedimento tiene sentido comparándolo con los datos proporcionados:\n• Valor de la factura.\n• Incrementables (en USD).\n• Razona si este valor es consistente con los datos dados. No realices cálculos, solo evalúa la coherencia.\n\nPaso 2: Validar el Valor comercial\n• Confirma si el Valor comercial declarado en el pedimento se alinea con el cálculo obtenido al restar a la aduana en MXN los incrementables en MXN, considerando que el valor aduana se obtiene al multiplicar el valor en dólares total (suma de incrementables convertidos a USD y factura en USD) por el tipo de cambio DOF.\n• Evalúa si la relación entre el Valor comercial y los demás valores proporcionados es razonable, considerando la coherencia de los datos.\n\nPaso 3: Verificar el Valor aduana\n• Verifica si el Valor aduana declarado en el pedimento tiene sentido con base en los datos dados:\n• Valor comercial.\n• Incrementables.\n• Decrementables.\n• Evalúa si el resultado final es consistente con lo esperado según la información.\n\nPaso 4: Explicar el resultado con lógica\n• Razona paso por paso por qué los valores tienen sentido o, si detectas alguna discrepancia, explica por qué puede haber un problema.\n• Ejemplo esperado de respuesta:\n\"El valor en dólares del pedimento es [x], hace sentido porque el valor de la factura ([y]) más los incrementables convertidos a USD da un total consistente. Al aplicar el tipo de cambio, el Valor aduana y el Valor comercial resultan coherentes con los datos proporcionados.\"\n\nNota: utiliza únicamente la información proporcionada para llegar a las conclusiones de manera lógica y detallada. Si necesitas realizar un cálculo para argumentar, hazlo. Siempre indica dónde está el problema y adjunta la data sobre el mismo.",
    valorAduana,
    valorComercial,
    valorDolares,
    tipoCambio,
    incrementables,
    decrementables,
    valorCarta318,
    valorInvoice,
    tipoCambioDOF
  } as const;

  return await glosar(validation);
}

