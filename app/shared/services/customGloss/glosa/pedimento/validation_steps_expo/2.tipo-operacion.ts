import { Pedimento, TransportDocument } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { apendice2 } from "../../anexo-22/apendice-2";
import { apendice16 } from "../../anexo-22/apendice-16";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the operation type is consistent with the origin/destination
 * If origin is Mexico, operation type should be EXP (export)
 */
export async function validateCoherenciaOrigenDestino(pedimento: Pedimento, transportDoc?: TransportDocument) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const origen = transportDoc?.origin_country;
  const destino = transportDoc?.destination_country;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Coherencia con origen/destino",
    description: "El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir EXP (exportación) si origen es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Tipo de operación", value: tipoOperacion },
            { name: "Observaciones", value: observaciones }
          ]
        },
        documentoDeTransporte: {
          data: [
            { name: "País de origen", value: origen },
            { name: "País de destino", value: destino }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the pedimento key is valid for the operation type according to Appendix 2
 */
export async function validateClavePedimento(pedimento: Pedimento) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const clavePedimento = pedimento.encabezado_del_pedimento?.cve_pedim;
  
  const validation = {
    name: "Validación de clave de pedimento",
    description: "La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Tipo de operación", value: tipoOperacion },
            { name: "Clave de pedimento", value: clavePedimento }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "apendices": {
          data: [{ name: "Apéndice 2", value: JSON.stringify(apendice2) }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

/**
 * Validates that the regime is valid for the operation type according to Appendix 16
 */
export async function validateRegimen(pedimento: Pedimento) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const regimen = pedimento.encabezado_del_pedimento?.regimen;
  
  const validation = {
    name: "Validación de régimen",
    description: "El régimen debe ser válido para el tipo de operación según el Apéndice 16",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Tipo de operación", value: tipoOperacion },
            { name: "Régimen", value: regimen }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "apendices": {
          data: [{ name: "Apéndice 16", value: JSON.stringify(apendice16) }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedTipoOperacion = traceable(
  async ({ pedimento, transportDoc }: { pedimento: Pedimento; transportDoc?: TransportDocument }) => {
    const validationsPromise = await Promise.all([
      validateCoherenciaOrigenDestino(pedimento, transportDoc),
      validateClavePedimento(pedimento),
      validateRegimen(pedimento),
    ]);
    
    return {
      sectionName: "Tipo de operación",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S2: Tipo de operación" }
);
