import { Pedimento, Cove, Partida } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice, PackingList, Carta318 } from "../../../data-extraction/mkdown_schemas";
import { apendice7 } from "../../anexo-22/apendice_7";
import { traceable } from "langsmith/traceable";
import { getFraccionInfo } from "../../tax-finder";

// Función para validar preferencia arancelaria y certificado de origen
export async function validateFraccionArancelaria(partida: Partida, pedimento: Pedimento) {
  // Extraer partidas con información de fracción arancelaria
  const fraccion = partida.fraccion_y_nico || "";
  const fechaDeEntrada = pedimento.fecha_entrada_presentacion;
  const tipoDeOperacion = pedimento.encabezado_del_pedimento.tipo_oper;
  let fraccionExiste = false;
  if (fechaDeEntrada && tipoDeOperacion && tipoDeOperacion !== "TRA") {
    try {
      await getFraccionInfo({ fraccion, fechaDeEntrada, tipoDeOperacion });
      fraccionExiste = true;
    } catch (error) {
      console.error(error);
    }
  }


  const validation = {
    name: "Validación de fracción arancelaria",
    description: "Verificar que la fracción arancelaria declarada en cada partida exista en el sistema de Tax Finder y coincida con la información del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Fracción arancelaria", value: fraccion }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Tax Finder": {
          data: [
            { name: "Existe", value: fraccionExiste ? "Si" : "No" }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

// Función para validar coherencia de UMC y cantidad UMC
export async function validateCoherenciaUMT(partida: Partida, pedimento: Pedimento) {
  // Extraer partidas con información de UMC
  const partidasUMT = partida.umt || "";
  const fraccion = partida.fraccion_y_nico;
  const fechaDeEntrada = pedimento.fecha_entrada_presentacion;
  const tipoDeOperacion = pedimento.encabezado_del_pedimento.tipo_oper;
  if (!fechaDeEntrada || !tipoDeOperacion || tipoDeOperacion === "TRA") {
    throw new Error("No se puede validar la unidad de medida de la tarifa, ya que no se tiene fecha de entrada o tipo de operación o es tránsito");
  }
  const { data: { arancel: { unidad_medida } } } = await getFraccionInfo({ fraccion, fechaDeEntrada, tipoDeOperacion });
  const validation = {
    name: "Validación de unidad de medida de la tarifa",
    description: "Validar la unidad de medida de la tarifa, es decir que la unidad de medida declarada en la partida sea la misma que le corresponde a esa fracción arancelaria, si son piezas, piezas. Checar contra el apendice 7 que dice que la medida esta bien.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "PartidasUMT", value: partidasUMT }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Apéndices": {
          data: [
            { name: "Apéndice 7", value: JSON.stringify(apendice7) }
          ]
        },
        "Tax Finder": {
          data: [
            { name: "Unidad de medida", value: JSON.stringify(unidad_medida, null, 2) }
          ]
        }
      },
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}


// Función para validar coherencia de UMC
export async function validateCoherenciaUMC(partida: Partida, cove?: Cove, carta318?: Carta318, invoice?: Invoice) {
  // Extraer partidas con información de UMC
  const partidasUMC = partida.umc || "";
  const claveUmcCove = cove?.datos_mercancia?.clave_umc;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;

  const validation = {
    name: "Validación de unidad de medida comercial",
    description: "Validar la unidad de medida comercial, es decir que la unidad de medida declarada en la partida sea la misma que en factura y COVE. Debe corresponder con el Apéndice 7.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "PartidasUMC", value: partidasUMC }
          ]
        },
        "COVE": {
          data: [
            { name: "COVE", value: claveUmcCove }
          ]
        },
        "Factura": {
          data: [
            { name: "Invoice", value: invoicemkdown }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown }
          ]
        },
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Apéndices": {
          data: [
            { name: "Apéndice 7", value: JSON.stringify(apendice7) }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

// Función para validar el país de venta
export async function validatePaisVenta(partida: Partida, pedimento?: Pedimento, invoice?: Invoice, packing?: PackingList, carta318?: Carta318) {
  // Extraer el país de venta del pedimento
  const partidasPaisVentaCompra = partida.p_v_c || "";

  // Extraer el país de la dirección de facturación de la factura
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  // Extraer el país de la dirección de facturación del packing
  const packingmkdown = packing?.markdown_representation;
  const observaciones = pedimento?.observaciones_a_nivel_pedimento;

  const validation = {
    name: "Validación del país de venta",
    description: "Validar que el país de venta en el pedimento coincida con el país de la dirección de facturación en la factura/carta 318 y/o el packing.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "PartidasPaisVentaCompra", value: partidasPaisVentaCompra },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Factura": {
          data: [
            { name: "Invoice", value: invoicemkdown }
          ]
        },
        "Packing List": {
          data: [
            { name: "Packing List", value: packingmkdown }
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

  return await glosar(validation, "gpt-4o-mini");
}

// Función para validar el país de origen
export async function validatePaisOrigen(partida: Partida, pedimento?: Pedimento, invoice?: Invoice, packing?: PackingList, carta318?: Carta318) {
  // Extraer el país de origen del pedimento
  const paisOrigenDestino = partida.p_o_d || "";

  const packingmkdown = packing?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;


  const observaciones = pedimento?.observaciones_a_nivel_pedimento;

  const validation = {
    name: "Validación del país de origen",
    description: "Validar que el país de origen en el pedimento coincida con la leyenda 'hecho en...' en la factura o el packing. Si no se encuentra la leyenda, se debe imprimir una advertencia.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "País de origen", value: paisOrigenDestino },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Factura": {
          data: [
            { name: "Invoice", value: invoicemkdown }
          ]
        },
        "Packing": {
          data: [
            { name: "Packing List", value: packingmkdown }
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

  return await glosar(validation, "gpt-4o-mini");
}

// Función para validar la descripción de la mercancía
export async function validateDescripcionMercancia(partida: Partida, pedimento?: Pedimento, cove?: Cove, invoice?: Invoice, carta318?: Carta318) {
  // Extraer la descripción de la mercancía del pedimento
  const partidasDescripcionMercancia = partida.descripcion || "";

  // Extraer la descripción de la mercancía del COVE, factura y carta 318
  const descripcionCove = cove?.datos_mercancia?.descripcion_mercancia;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const observaciones = pedimento?.observaciones_a_nivel_pedimento;

  const validation = {
    name: "Validación de descripción de mercancía",
    description: "La descripción de la mercancía en el pedimento debe coincidir con la descripción en el COVE, factura o carta 318 para asegurar que se trata de la misma mercancía.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "PartidasDescripcionMercancia", value: partidasDescripcionMercancia },
            { name: "Observaciones a nivel pedimento", value: observaciones }
          ]
        },
        "COVE": {
          data: [
            { name: "Descripción en COVE", value: descripcionCove || "No se encontró descripción en COVE" }
          ]
        },
        "Factura": {
          data: [
            { name: "Invoice", value: invoicemkdown }
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

  return await glosar(validation, "gpt-4o-mini");
}

export async function validateTarifasArancelarias(partida: Partida, pedimento: Pedimento) {
  const fraccion = partida.fraccion_y_nico;
  const fechaDeEntrada = pedimento.fecha_entrada_presentacion;
  const tipoDeOperacion = pedimento.encabezado_del_pedimento.tipo_oper;
  if (!fechaDeEntrada || !tipoDeOperacion || tipoDeOperacion === "TRA") {
    throw new Error("No se puede validar la tarifa arancelaria, ya que no se tiene fecha de entrada o tipo de operación o es tránsito");
  }
  const { data: { iva, extra: { ligie_arancel, ieps_tasas } } } = await getFraccionInfo({ fraccion, fechaDeEntrada, tipoDeOperacion });

  const tasasTaxFinder = {
    iva: iva?.valor_iva || 0,
    ligie_arancel,
    ieps_tasas
  }
  
  const tasasPartida = {
    iva: partida.contribuciones?.find(contribucion => contribucion.con === "IVA")?.tasa || 0.16,
    ligie_arancel: partida.contribuciones?.find(contribucion => contribucion.con === "IGI/IGE")?.tasa || 0,
    ieps_tasas: partida.contribuciones?.find(contribucion => contribucion.con === "IEPS")?.tasa || 0
  }

  const validation = {
    name: "Validación de tarifas arancelarias",
    description: "Validar que las tarifas arancelarias declaradas en la partida coincidan con las tarifas arancelarias declaradas en el Tax Finder.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Partida": {
          data: [
            { name: "Tasas Partida", value: JSON.stringify(tasasPartida, null, 2) }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Tax Finder": {
          data: [
            { name: "Tasas Tax Finder", value: JSON.stringify(tasasTaxFinder, null, 2) }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

export async function validateCalculosPartidas(pedimento: Pedimento, partida: Partida) {
  // Extract total values from pedimento
  const valorAduanaTotal = pedimento.valores?.valor_aduana || 0;
  const valorComercialTotal = pedimento.valores?.precio_pagado_valor_comercial || 0;

  const prorrateo = valorComercialTotal !== 0 ? valorAduanaTotal / valorComercialTotal : null;

  // Calculate DTA
  const esActivoFijo = false;
  const tasaDTA = esActivoFijo ? 0.00176 : 0.008;
  const dtaCalculado = valorAduanaTotal * tasaDTA;
  const dtaFinal = dtaCalculado < 500 ? 500 : dtaCalculado;

  // Values from partida
  const valorComercialPartida = partida.imp_precio_pag || 0;
  const cantidadUMC = partida.cantidad_umc || 0;


  // Calculate inferred values for the partida
  const valorAduanaCalculado = prorrateo !== null ? Math.ceil(valorComercialPartida * prorrateo) : null;
  const precioUnitarioCalculado = cantidadUMC !== 0 ? valorComercialPartida / cantidadUMC : null;
  const tasaIGI = partida.contribuciones?.find(contribucion => contribucion.con === "IGI/IGE")?.tasa || 0;
  const igiCalculado = valorAduanaCalculado !== null ? valorAduanaCalculado * (tasaIGI / 100) : null;
  const dtaProrrateo = dtaFinal * ((valorAduanaCalculado || 0) / valorAduanaTotal);
  const baseIVA = (valorAduanaCalculado || 0) + (igiCalculado || 0) + dtaProrrateo;
  const tasaIVA = (partida.contribuciones?.find(contribucion => contribucion.con === "IVA")?.tasa || 16) / 100;
  const ivaCalculado = baseIVA * tasaIVA;

  // Construct validation object
  const validation = {
    name: "Validación Calculos de Partidas",
    description: `
      Verifica que los valores de la partida sean los mismo que calculamos. 
    `,
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Partidas": {
          data: [
            { name: "Partidas", value: partida }
          ]
        }
      },
      [CustomGlossTabContextType.INFERRED]: {
        "Cálculos": {
          data: [
            { name: "Prorrateo", value: prorrateo },
            { name: "DTA calculado", value: dtaFinal },
            { name: "Valor Aduana Calculado", value: valorAduanaCalculado },
            { name: "Precio Unitario Calculado", value: precioUnitarioCalculado },
            { name: "IGI Calculado", value: igiCalculado },
            { name: "IVA Calculado", value: ivaCalculado }
          ]
        }
      }
    }
  } as const;

  // Return result for LLM processing
  return await glosar(validation, "gpt-4o-mini");
}

// Función para validar números de serie, modelo y parte
export async function validateNumerosSerie(pedimento: Pedimento, partida: Partida, cove?: Cove) {
  const observaciones_partida = partida.observaciones;
  const observaciones_nivel_pedimento = pedimento?.observaciones_a_nivel_pedimento;
  const numerosSeriesCove = cove?.datos_mercancia?.numeros_serie || [];

  const validation = {
    name: "Validación de números de serie, modelo y parte",
    description: "Verifica que los números de serie, modelo y parte declarados en el pedimento coincidan con los declarados en el COVE. Si no hay valor es por que no se declararon los numeros de serie, modelo y parte. Da una advertencia de que no se declararon los numeros de serie, modelo y parte.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Observaciones Partida", value: observaciones_partida },
            { name: "Observaciones Nivel Pedimento", value: observaciones_nivel_pedimento }
          ]
        },
        "COVE": {
          data: [
            { name: "Números de Serie", value: numerosSeriesCove }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

import { IDENTIFICADORES } from "./identificadores";

export async function validateIdentificadores(identificador: Partida["identificadores"][number]) {
  if (!(identificador.clave in IDENTIFICADORES)) {
    throw new Error(`Identificador ${identificador.clave} no encontrado`);
  }
  // Hack since TS doesn't narrow string types for some reason
  const identificadorFundamentoLegal = IDENTIFICADORES[identificador.clave as keyof typeof IDENTIFICADORES];

  const validation = {
    name: "Validación de identificadores",
    description: "Verifica que los complementos del identificador coincidan con los del apéndice 8. Solamente has una validación simple de data types, no hay necesidad de checar reglas o leyes extras, o usar logica condicional, es simplemente checar que el valor de los complementos sea posible que exista en el apéndice 8.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Identificador": {
          data: [
            { name: "Identificador", value: JSON.stringify(identificador, null, 2) }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Identificadores Apéndice 8": {
          data: [
            { name: "Identificadores Apéndice 8", value: JSON.stringify(identificadorFundamentoLegal, null, 2) }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "o3-mini");
}

export const tracedPartidas = traceable(
  async ({ pedimento, invoice, cove, carta318, partida, packing, partidaNumber }: { pedimento: Pedimento; invoice?: Invoice, cove?: Cove, carta318?: Carta318, partida: Partida, packing?: PackingList, partidaNumber: number }) => {
    const validationsPromise = await Promise.all([
      validateFraccionArancelaria(partida, pedimento),
      validateCoherenciaUMC(partida, cove, carta318, invoice),
      validateCoherenciaUMT(partida, pedimento),
      validatePaisVenta(partida, pedimento, invoice, packing, carta318),
      validatePaisOrigen(partida, pedimento, invoice, packing, carta318),
      validateDescripcionMercancia(partida, pedimento, cove, invoice, carta318),
      validateTarifasArancelarias(partida, pedimento),
      validateCalculosPartidas(pedimento, partida),
      validateNumerosSerie(pedimento, partida, cove),
      ...(partida.identificadores.map(identificador => validateIdentificadores(identificador)))
    ]);

    return {
      sectionName: `Partida ${partidaNumber}`,
      validations: validationsPromise
    };
  },
  { name: "Fraccion" }
);