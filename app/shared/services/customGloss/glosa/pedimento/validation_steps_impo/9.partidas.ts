import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { 
  Invoice,
  PackingList,
  Cove,
  Carta318 
} from "../../../data-extraction/mkdown_schemas";
import { apendice7 } from "../../anexo-22/apendice_7";
import { traceable } from "langsmith/traceable";

// Función para validar preferencia arancelaria y certificado de origen
export async function validateFraccionArancelaria(pedimento: Pedimento) {
  // Extraer partidas con información de fracción arancelaria
  const partidas = pedimento.partidas || [];
  
  const validation = {
    name: "Validación de fracción arancelaria",
    description: "Verificar que la fracción arancelaria declarada en cada partida exista en el sistema de Tax Finder y coincida con la información del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Tax Finder": {
          data: [
            { name: "Fracciones arancelarias", value: "Consulta al sistema Tax Finder" }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar coherencia de UMC y cantidad UMC
export async function validateCoherenciaUMT(pedimento: Pedimento) {
  // Extraer partidas con información de UMC
  const partidas = pedimento.partidas || [];
  
  const validation = {
    name: "Validación de unidad de medida de la tarifa",
    description: "Validar la unidad de medida de la tarifa, es decir que la unidad de medida declarada en la partida sea la misma que le corresponde a esa fracción arancelaria, si son piezas, piezas. Checar contra el apendice 7 que dice que la medida esta bien.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas }
          ]
        }
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

  return await glosar(validation);
}


// Función para validar coherencia de UMC
export async function validateCoherenciaUMC(pedimento: Pedimento, cove?: Cove, carta318?: Carta318, invoice?: Invoice) {
  // Extraer partidas con información de UMC
  const partidas = pedimento.partidas || [];
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
            { name: "Partidas", value: partidas }
          ]
        }
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
      [CustomGlossTabContextType.EXTERNAL]: {
        "Apéndices": {
          data: [
            { name: "Apéndice 7", value: JSON.stringify(apendice7) }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar el país de venta
export async function validatePaisVenta(pedimento: Pedimento, invoice?: Invoice, packing?: PackingList) {
  // Extraer el país de venta del pedimento
  const partidas = pedimento.partidas 
  
  // Extraer el país de la dirección de facturación de la factura
  const invoicemkdown = invoice?.markdown_representation;
  
  // Extraer el país de la dirección de facturación del packing
  const packingmkdown = packing?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación del país de venta",
    description: "Validar que el país de venta en el pedimento coincida con el país de la dirección de facturación en la factura y/o el packing.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
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
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar el país de origen
export async function validatePaisOrigen(pedimento: Pedimento, invoice?: Invoice, packing?: PackingList, carta318?: Carta318) {
  // Extraer el país de origen del pedimento
  const paisOrigenPedimento = pedimento.partidas || [];
  
  const packingmkdown = packing?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación del país de origen",
    description: "Validar que el país de origen en el pedimento coincida con la leyenda 'hecho en...' en la factura o el packing. Si no se encuentra la leyenda, se debe imprimir una advertencia.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "País de origen", value: paisOrigenPedimento },
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

  return await glosar(validation);
}

// Función para validar la descripción de la mercancía
export async function validateDescripcionMercancia(pedimento: Pedimento, cove?: Cove, invoice?: Invoice, carta318?: Carta318) {
  // Extraer la descripción de la mercancía del pedimento
  const partidas = pedimento.partidas || [];
  
  // Extraer la descripción de la mercancía del COVE, factura y carta 318
  const descripcionCove = cove?.datos_mercancia?.descripcion_mercancia;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de descripción de mercancía",
    description: "La descripción de la mercancía en el pedimento debe coincidir con la descripción en el COVE, factura o carta 318 para asegurar que se trata de la misma mercancía.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
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

  return await glosar(validation);
}

// Función para validar el prorrateo del valor aduana
export async function validateProrrateoValorAduana(pedimento: Pedimento) {
  // Extraer el valor aduana y valor comercial del pedimento
  const valorAduana = pedimento.valores?.valor_aduana;
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  
  // Calcular el prorrateo
  const prorrateo = valorAduana && valorComercial ? valorAduana / valorComercial : null;
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Prorrateo del valor aduana",
    description: "Calcula el prorrateo del valor aduana dividiendo el valor aduana del pedimento entre el valor comercial. Multiplica el importe pagado valor comercial de la partida por el prorrateo y redondea hacia arriba al siguiente número entero para obtener el valor aduana de la partida.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Valor aduana", value: valorAduana },
            { name: "Valor comercial", value: valorComercial },
            { name: "Prorrateo", value: prorrateo },
            { name: "Observaciones", value: observaciones }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para calcular el valor aduana de la partida
export async function calculateValorAduanaPartida(pedimento: Pedimento) {
  // Extraer partidas del pedimento
  const partidas = pedimento.partidas || [];
  
  // Extraer el prorrateo del pedimento
  const valorAduana = pedimento.valores?.valor_aduana;
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const prorrateo = valorAduana && valorComercial ? valorAduana / valorComercial : null;
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const valorAduanaPartidas = partidas.map(partida => {
    const valorComercialPartida = partida.importe_pagado_valor_comercial;
    const valorAduanaCalculado = prorrateo ? Math.ceil(valorComercialPartida * prorrateo) : null;
    return {
      ...partida,
      valorAduanaCalculado
    };
  });

  const validation = {
    name: "Cálculo del valor aduana de la partida",
    description: "Multiplica el importe pagado valor comercial de la partida por el prorrateo y redondea hacia arriba al siguiente número entero para obtener el valor aduana de la partida.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas con valor aduana calculado", value: valorAduanaPartidas },
            { name: "Observaciones", value: observaciones }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar el precio unitario
export async function validatePrecioUnitario(pedimento: Pedimento) {
  const partidas = pedimento.partidas || [];
  
  const preciosUnitarios = partidas.map(partida => ({
    numeroPartida: partida.numero_partida,
    valorComercial: partida.importe_pagado_valor_comercial,
    cantidadUMC: partida.cantidad_umc,
    precioUnitario: partida.importe_pagado_valor_comercial / partida.cantidad_umc
  }));

  const validation = {
    name: "Validación de precio unitario",
    description: "Verifica que el precio unitario sea correcto dividiendo el valor comercial entre la cantidad de unidad de medida comercial para cada partida.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Cálculos de precio unitario", value: preciosUnitarios }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar el cálculo del DTA
export async function validateCalculoDTA(pedimento: Pedimento) {
  const valorAduana = pedimento.valores?.valor_aduana || 0;
  const tipoOperacion = pedimento.tipo_operacion;
  const preferenciaArancelaria = pedimento.preferencia_arancelaria;
  const esActivoFijo = pedimento.activo_fijo;
  
  let tasaDTA = 0.008; // Tasa general
  if (esActivoFijo) {
    tasaDTA = 0.00176;
  }
  
  let dtaCalculado = valorAduana * tasaDTA;
  
  // Aplicar cuota fija mínima de 500 pesos
  if (dtaCalculado < 500) {
    dtaCalculado = 500;
  }

  const validation = {
    name: "Validación del cálculo de DTA",
    description: "Calcula el DTA según el tipo de operación: 0.008 para general, 0.00176 para activos fijos. Si el resultado es menor a 500 pesos, se aplica cuota fija de 500 pesos.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Valor Aduana", value: valorAduana },
            { name: "Tipo Operación", value: tipoOperacion },
            { name: "Es Activo Fijo", value: esActivoFijo },
            { name: "DTA Calculado", value: dtaCalculado }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar el cálculo del IGI
export async function validateCalculoIGI(pedimento: Pedimento) {
  const partidas = pedimento.partidas || [];
  
  const calculosIGI = partidas.map(partida => ({
    numeroPartida: partida.numero_partida,
    fraccionArancelaria: partida.fraccion_arancelaria,
    valorAduana: partida.valor_aduana,
    tasaIGI: partida.tasa_igi,
    igiCalculado: partida.valor_aduana * (partida.tasa_igi / 100)
  }));

  const validation = {
    name: "Validación del cálculo de IGI",
    description: "Calcula el IGI multiplicando el valor aduana por el porcentaje correspondiente según la fracción arancelaria de cada partida.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Cálculos IGI", value: calculosIGI }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar el cálculo del IVA
export async function validateCalculoIVA(pedimento: Pedimento) {
  const partidas = pedimento.partidas || [];
  const dtaTotal = pedimento.contribuciones?.dta || 0;
  
  const calculosIVA = partidas.map(partida => {
    const igiPartida = partida.valor_aduana * (partida.tasa_igi / 100);
    const dtaProrrateo = dtaTotal * (partida.valor_aduana / (pedimento.valores?.valor_aduana || 1));
    const baseIVA = partida.valor_aduana + igiPartida + dtaProrrateo;
    const tasaIVA = partida.tasa_iva || 0.16; // 16% por defecto
    
    return {
      numeroPartida: partida.numero_partida,
      baseIVA,
      tasaIVA,
      ivaCalculado: baseIVA * tasaIVA
    };
  });

  const validation = {
    name: "Validación del cálculo de IVA",
    description: "Calcula el IVA sumando el valor aduana, IGI y DTA prorrateado, multiplicado por la tasa de IVA correspondiente.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Cálculos IVA", value: calculosIVA }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar números de serie, modelo y parte
export async function validateNumerosSerie(pedimento: Pedimento, cove?: Cove) {
  const partidas = pedimento.partidas || [];
  const numerosSeriesCove = cove?.datos_mercancia?.numeros_serie || [];
  
  const validation = {
    name: "Validación de números de serie, modelo y parte",
    description: "Verifica que los números de serie, modelo y parte declarados en el pedimento coincidan con los declarados en el COVE.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas }
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

  return await glosar(validation);
}

export const tracedPartidas = traceable(
  async ({ pedimento, invoice }: { pedimento: Pedimento; invoice?: Invoice }) => {
    const validationsPromise = await Promise.all([
      validatePreferenciaArancelaria(pedimento),
      validateCoherenciaUMC(pedimento, invoice),
      validateCoherenciaPeso(pedimento),
      validateCalculoDTA(pedimento),
      validateCalculoContribuciones(pedimento),
      validatePermisosIdentificadores(pedimento),
      validateRegulacionesArancelarias(pedimento),
      validateRegulacionesNoArancelarias(pedimento)
    ]);
    
    return {
      sectionName: "Partidas",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S9: Partidas" }
);