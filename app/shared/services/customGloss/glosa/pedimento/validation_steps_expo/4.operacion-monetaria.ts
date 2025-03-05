import { Pedimento, Cove } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Cfdi, TransportDocument } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";

// TODO: Agregar DOF y Dia de salida
// TODO: Multiples mercancias, se tienen que sumar los valores de todas las mercancias

export async function validateFechaSalida(pedimento: Pedimento, transportDocument?: TransportDocument) {
  const pedimentoExitDate = pedimento.fecha_entrada_presentacion;
  const fechaoperador = "24/07/2025"; //Temporary hardcoded value
  
  const validation = {
    name: "Fecha de entrada",
    description: "La fecha de salida del pedimento debe ser la fecha de salida dada por el operador de la carga.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Fecha de salida", value: pedimentoExitDate }
          ]
        },
        documentoDeTransporte: {
          data: [
            { name: "Transport Document", value: transportDocument }
          ]
        },
        operador: {
          data: [
            { name: "Fecha de salida", value: fechaoperador }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateTipoCambio(pedimento: Pedimento) {
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const fechaSalida = pedimento.fecha_entrada_presentacion;
  // TODO: Replace with actual DOF API integration
  const tipoCambioDOF = 17.1234; // Temporary hardcoded value
  
  const validation = {
    name: "Tipo de cambio",
    description: "El tipo de cambio debe ser exactamente igual al publicado en el DOF el día hábil anterior a la fecha de entrada.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Tipo de cambio", value: tipoCambio },
            { name: "Fecha de salida", value: fechaSalida }
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

export async function validateValorComercial(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
  const valorComercialPedimento = pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambioPedimento = pedimento.encabezado_del_pedimento?.tipo_cambio;
  
  const valorComercialCOVE = cove.datos_mercancia.valor_total;
  const monedaCOVE = cove.datos_mercancia.tipo_moneda;
  
  const validation = {
    name: "Valor comercial",
    description: "El valor comercial del pedimento debe ser el mismo que el valor comercial del CFDI y el valor comercial en el COVE. Si el valor en el cfdi o en el cove es en dolares, se debe de convertir a pesos mexicanos usando el tipo de cambio del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Valor comercial", value: valorComercialPedimento },
            { name: "Tipo de cambio", value: tipoCambioPedimento }
          ]
        },
        cfdi: {
          data: [
            { name: "CFDI", value: cfdi }
          ]
        },
        cove: {
          data: [
            { name: "Valor comercial", value: valorComercialCOVE },
            { name: "Moneda", value: monedaCOVE }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateValorDolares(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
  const valorDolaresPedimento = pedimento.valores?.valor_dolares;
  const valorComercialPedimento = pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambioPedimento = pedimento.encabezado_del_pedimento?.tipo_cambio;
  
  const valorComercialCOVE = cove.datos_mercancia.valor_total;
  const monedaCOVE = cove.datos_mercancia.tipo_moneda;
  
  const validation = {
    name: "Valor dolares",
    description: "El valor en dólares del pedimento se calcula dividiendo el valor comercial entre el tipo de cambio del pedimento. Si el valor en el CFDI o en el COVE está en dólares, debe coincidir con el valor en dólares del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Valor en dólares", value: valorDolaresPedimento },
            { name: "Valor comercial", value: valorComercialPedimento },
            { name: "Tipo de cambio", value: tipoCambioPedimento }
          ]
        },
        cfdi: {
          data: [
            { name: "CFDI", value: cfdi }
          ]
        },
        cove: {
          data: [
            { name: "Valor comercial", value: valorComercialCOVE },
            { name: "Moneda", value: monedaCOVE }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedOperacionMonetaria = traceable(
  async ({ pedimento, cove, transportDocument, cfdi }: { pedimento: Pedimento; cove: Cove; transportDocument?: TransportDocument; cfdi?: Cfdi }) => {
    const validationsPromise = await Promise.all([
      validateFechaSalida(pedimento, transportDocument),
      validateTipoCambio(pedimento),
      validateValorComercial(pedimento, cove, cfdi),
      validateValorDolares(pedimento, cove, cfdi)
    ]);
    
    return {
      sectionName: "Operación monetaria",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S4: Operación monetaria" }
);
