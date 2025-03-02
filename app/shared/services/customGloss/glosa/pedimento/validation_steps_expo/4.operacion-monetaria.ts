import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { TransportDocument } from "../../../data-extraction/schemas";
import { Cfdi } from "../../../data-extraction/schemas/cfdi";
import { Cove } from "../../../data-extraction/schemas/cove";
// TODO: Agregar DOF y Dia de salida
// TODO: Multiples mercancias, se tienen que sumar los valores de todas las mercancias

export async function validateFechaSalida(pedimento: Pedimento, transportDocument: TransportDocument) {
  const pedimentoExitDate = pedimento.fecha_entrada_presentacion;
  const transportExitDate = transportDocument.date;
  const transportType = transportDocument.document_type;
  const fechaoperador = "24/07/2025"; //Temporary hardcoded value
  
  const validation = {
    name: "Fecha de entrada",
    description: "La fecha de salida del pedimento debe ser la fecha de salida dada por el operador de la carga.",
    pedimentoExitDate,
    transportExitDate,
    fechaoperador,
    transportType
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
    tipoCambio,
    fechaSalida,
    tipoCambioDOF
  } as const;

  return await glosar(validation);
}

export async function validateValorComercial(pedimento: Pedimento, cfdi: Cfdi, cove: Cove) {
  const valorComercialPedimento = pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambioPedimento = pedimento.encabezado_del_pedimento?.tipo_cambio;
  
  const valorComercialCFDI = cfdi.total;
  const monedaCFDI = cfdi.moneda;
  
  const valorComercialCOVE = cove.datos_mercancia.valor_total;
  const monedaCOVE = cove.datos_mercancia.tipo_moneda;
  
  const validation = {
    name: "Valor comercial",
    description: "El valor comercial del pedimento debe ser el mismo que el valor comercial del CFDI y el valor comercial en el COVE. Si el valor en el cfdi o en el cove es en dolares, se debe de convertir a pesos mexicanos usando el tipo de cambio del pedimento.",
    valorComercialPedimento,
    valorComercialCFDI,
    monedaCFDI,
    valorComercialCOVE,
    monedaCOVE,
    tipoCambioPedimento
  } as const;

  return await glosar(validation);
}

export async function validateValorDolares(pedimento: Pedimento, cfdi: Cfdi, cove: Cove) {
  const valorDolaresPedimento = pedimento.valores?.valor_dolares;
  const valorComercialPedimento = pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambioPedimento = pedimento.encabezado_del_pedimento?.tipo_cambio;
  
  const valorComercialCFDI = cfdi.total;
  const monedaCFDI = cfdi.moneda;
  
  const valorComercialCOVE = cove.datos_mercancia.valor_total;
  const monedaCOVE = cove.datos_mercancia.tipo_moneda;
  
  const validation = {
    name: "Valor dolares",
    description: "El valor en dólares del pedimento se calcula dividiendo el valor comercial entre el tipo de cambio del pedimento. Si el valor en el CFDI o en el COVE está en dólares, debe coincidir con el valor en dólares del pedimento.",
    valorDolaresPedimento,
    valorComercialPedimento,
    tipoCambioPedimento,
    valorComercialCFDI,
    monedaCFDI,
    valorComercialCOVE,
    monedaCOVE
  } as const;

  return await glosar(validation);
}

export async function operacionMonetariaValidations(pedimento: Pedimento, transportDocument: TransportDocument, cfdi: Cfdi, cove: Cove) {
  return Promise.all([
    validateFechaSalida(pedimento, transportDocument),
    validateTipoCambio(pedimento),
    validateValorComercial(pedimento, cfdi, cove),
    validateValorDolares(pedimento, cfdi, cove)
  ]);
}

