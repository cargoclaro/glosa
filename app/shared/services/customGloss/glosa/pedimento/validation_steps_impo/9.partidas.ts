import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Invoice } from "../../../data-extraction/mkdown_schemas";
import { traceable } from "langsmith/traceable";

// Función para validar preferencia arancelaria y certificado de origen
export async function validateFraccionArancelaria(pedimento: Pedimento) {
  // Extraer partidas con información de fracción arancelaria
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de fracción arancelaria",
    description: "Verificar que la fracción arancelaria declarada en cada partida exista en el sistema de Tax Finder y coincida con la información del pedimento.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
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
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de unidad de medida de la tarifa",
    description: "Validar la unidad de medida de la tarifa, es decir que la unidad de medida declarada en la partida sea la misma que le corresponde a esa fracción arancelaria, si son piezas, piezas. Checar contra el apendice 7 que dice que la medida esta bien.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Apéndices": {
          data: [
            { name: "Apéndice 7", value: "Catálogo de unidades de medida según fracción arancelaria" }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar coherencia de UMC
export async function validateCoherenciaPeso(pedimento: Pedimento) {
  // Extraer partidas con información de UMC
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de unidad de medida comercial",
    description: "Validar la unidad de medida comercial, es decir que la unidad de medida declarada en la partida sea la misma que en factura y COVE. Debe corresponder con el Apéndice 7.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Apéndices": {
          data: [
            { name: "Apéndice 7", value: "Catálogo de unidades de medida según fracción arancelaria" }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar cálculo del prorrateo y DTA
export async function validateCalculoDTA(pedimento: Pedimento) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Cálculo del prorrateo y DTA",
    description: "El prorrateo y el DTA calculados deben coincidir con los declarados. En el caso de DTA en cuota fija, divide el DTA entre el número de secuencias.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar cálculo de contribuciones
export async function validateCalculoContribuciones(pedimento: Pedimento) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Cálculo de contribuciones",
    description: "Los valores de precio pagado, precio unitario, valor aduana, IGI, IVA y DTA deben coincidir con los calculados.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar coincidencia de permisos e identificadores
export async function validatePermisosIdentificadores(pedimento: Pedimento) {
  // Extraer identificadores a nivel pedimento
  const identificadoresPedimento = pedimento.partidas?.map((partida) => partida.identificadores) || [];
  
  // Extraer partidas con identificadores
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Coincidencia de permisos e identificadores",
    description: "Los permisos e identificadores en el pedimento deben existir en Taxfinder.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Identificadores", value: identificadoresPedimento },
            { name: "Observaciones", value: observaciones }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar regulaciones arancelarias
export async function validateRegulacionesArancelarias(pedimento: Pedimento) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Regulaciones arancelarias",
    description: "Verifica si existen regulaciones arancelarias que apliquen a la mercancía.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

// Función para validar regulaciones no arancelarias
export async function validateRegulacionesNoArancelarias(pedimento: Pedimento) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Regulaciones no arancelarias",
    description: "Verifica si existen regulaciones no arancelarias que apliquen a la mercancía.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Partidas", value: partidas },
            { name: "Observaciones", value: observaciones }
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