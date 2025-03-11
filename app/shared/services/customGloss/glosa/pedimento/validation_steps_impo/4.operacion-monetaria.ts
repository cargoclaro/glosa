import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { TransportDocument } from "../../../data-extraction/mkdown_schemas/transport-document";
import { Carta318 } from "../../../data-extraction/mkdown_schemas/carta-318";
import { Invoice } from "../../../data-extraction/mkdown_schemas/invoice";
import { traceable } from "langsmith/traceable";
import { getExchangeRate } from "../../exchange-rate";

// TODO: Agregar DOF


export async function validateTransportDocumentEntryDate(pedimento: Pedimento, transportDocument?: TransportDocument) {
  const pedimentoEntryDate = pedimento.fecha_entrada_presentacion;
  const transportDocmkdown = transportDocument?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  
  const validation = {
    name: "Fecha de entrada del documento de transporte",
    description: "Valida que la fecha del documento de transporte no sea posterior al pedimento",
    prompt: "La fecha de entrada del documento de transporte ser anterior o igual a la fecha de entrada del pedimento. ",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Fecha de entrada", value: pedimentoEntryDate },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Documento de transporte": {
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
  const tipoCambioDOF = await getExchangeRate(new Date(fechaEntrada ?? new Date())); // Temporary hardcoded value
  const validation = {
    name: "Tipo de cambio",
    description: "Valida que el tipo de cambio coincida con el DOF",
    prompt: "El tipo de cambio del pedimento debe ser exactamente igual al publicado en el DOF el día hábil anterior a la fecha de entrada del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Fecha de entrada", value: fechaEntrada },
            { name: "Observaciones", value: observaciones }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Tipo de cambio DOF": {
          data: [
            { name: "Tipo de cambio DOF", value: tipoCambioDOF }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

export async function validateIncrementables(pedimento: Pedimento, invoice?: Invoice, transportDocument?: TransportDocument, carta318?: Carta318) {
  // Get incrementables from pedimento
  const incrementablesPedimento = {
    val_seguros: pedimento.incrementables?.val_seguros,
    seguros: pedimento.incrementables?.seguros,
    fletes: pedimento.incrementables?.fletes,
    embalajes: pedimento.incrementables?.embalajes,
    otros: pedimento.incrementables?.otros_incrementables
  };
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const precioPagadoValorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  // Update to use markdown representations
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;
  
  const validation = {
    name: "Incrementables",
    description: "Valida que los valores de los incrementables declarados en el pedimento coincidan con los documentos que los avalan",
    prompt: "Los incrementables son los servicios a los cuales se les puede cobrar impuestos. Para hacer la declaracion correcta, se necesita verificar que los valores de los incrementables en el pedimento seas validos conforme a la carta 318, factura o documento de transporte. Los incrementables pueden ser fletes, seguros, maniobras, entre otros. Tenemos que buscar una relación entre los valores del pedimento y los documentos que lo avalan. Argumenta por que los incrementables estan bien o mal, siempre buscando sostener tus respuestas. Si hay un valor en dolares de incrementables en la carta 318, factura o documento de transporte, se debe de multiplicar por el tipo de cambio del pedimento para obtener el valor en pesos mexicanos y poder compararlo contra los incrementables del pedimento. Los incoterms son codigos de 3 letras. El Val. Seguros es el valor que aseguran, debe de ser igual al precio pagado / valor comercial del pedimento. ",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Incrementables", value: incrementablesPedimento },
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Precio pagado / valor comercial", value: precioPagadoValorComercial },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        },
        "Factura": {
          data: [
            { name: "Factura", value: invoicemkdown }
          ]
        },
        "Documento de transporte": {
          data: [
            { name: "Documento de transporte", value: transportDocmkdown }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "o3-mini");
}

async function validateValorDolares(pedimento: Pedimento, invoice?: Invoice, carta318?: Carta318) {
  const valorDolares = pedimento.valores?.valor_dolares;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const valorAduana = pedimento.valores?.valor_aduana;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: "Valor en dólares del pedimento",
    description: "Valida que el valor en dólares del pedimento sea igual al valor aduana dividido entre el tipo de cambio",
    prompt: "El valor en dólares declarado en el pedimento debe ser igual al valor aduana dividido entre el tipo de cambio (Valor USD = Valor Aduana MXN ÷ Tipo de Cambio). Este valor debe coincidir con el valor comercial de la factura más los incrementables convertidos a USD, y estar redondeado a 2 decimales usando el tipo de cambio del pedimento. Solamente valida que el valor dólares este bien, los ya se analizaron. ",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Valor en dólares", value: valorDolares },
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Valor aduana", value: valorAduana },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Factura": {
          data: [
            { name: "Factura", value: invoicemkdown }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "o3-mini");
}

async function validateValorComercial(pedimento: Pedimento, invoice?: Invoice, carta318?: Carta318) {
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const valorAduana = pedimento.valores?.valor_aduana;
  const incrementables = pedimento.incrementables;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  
  const validation = {
    name: "Valor comercial del pedimento",
    description: "Valida que el valor comercial sea igual al valor aduana menos los incrementables y que coincida con el valor de la factura",
    prompt: "El valor comercial representa el precio pagado por la mercancía sin incluir incrementables (Valor Comercial = Valor Aduana - Total Incrementables) o el valor de la factura sin los incrementables. debe ser menor o igual al valor aduana. La diferencia entre el valor aduana y el valor comercial debe corresponder exactamente a la suma de los incrementables declarados (fletes, seguros y otros), considerando cualquier decrementables aplicado y debe ser consistente con el valor declarado en la factura comercial. Si existe un redondo hacía arriba en el valor declarado en el pedimento que sea mínimo marcalo como valido, donde hay más peligro es declarar menos. ",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Valor comercial", value: valorComercial },
            { name: "Valor aduana", value: valorAduana },
            { name: "Incrementables", value: incrementables },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Factura": {
          data: [
            { name: "Factura", value: invoicemkdown }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "o3-mini");
}

async function validateValorAduana(pedimento: Pedimento, invoice?: Invoice, carta318?: Carta318) {
  const valorAduana = pedimento.valores?.valor_aduana;
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const incrementables = pedimento.incrementables;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: "Valor aduana del pedimento",
    description: "Valida que el valor aduana sea igual al valor en dólares más incrementables multiplicado por el tipo de cambio",
    prompt: "El valor aduana es la base para el cálculo de contribuciones y debe calcularse como el valor dolares más los incrementables multiplicado por el tipo de cambio (Valor Aduana = (Valor Dolares + Total Incrementables) × Tipo de Cambio). Este valor debe ser mayor o igual al valor comercial, y la diferencia debe corresponder exactamente a los incrementables declarados en el pedimento, carta 318 y documentos de transporte, considerando los decrementables aplicados y cualquier ajuste documentado en las observaciones.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Valor aduana", value: valorAduana },
            { name: "Valor comercial", value: valorComercial },
            { name: "Incrementables", value: incrementables },
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Factura": {
          data: [
            { name: "Factura", value: invoicemkdown }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "o3-mini");
}

export const tracedTransportDocumentEntryDate = traceable(
  async ({ pedimento, invoice, transportDocument, carta318 }: { pedimento: Pedimento; invoice?: Invoice; transportDocument?: TransportDocument; carta318?: Carta318 }) => {
    const validationsPromise = await Promise.all([
      validateTransportDocumentEntryDate(pedimento, transportDocument),
      validateTipoCambio(pedimento),
      validateIncrementables(pedimento, invoice, transportDocument, carta318),
      validateValorDolares(pedimento, invoice, carta318),
      validateValorComercial(pedimento, invoice),
      validateValorAduana(pedimento, invoice, carta318)
    ]);
    
    return {
      sectionName: "Operación monetaria",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S4: Operación monetaria" }
);
