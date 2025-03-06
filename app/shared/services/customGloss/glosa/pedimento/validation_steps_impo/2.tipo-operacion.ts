import { Pedimento } from "../../../data-extraction/schemas";
import { TransportDocument } from "../../../data-extraction/mkdown_schemas/transport-document";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { apendice2 } from "../../anexo-22/apendice-2";
import { apendice16 } from "../../anexo-22/apendice-16";
import { traceable } from "langsmith/traceable";

/**
 * Validates that the operation type is consistent with the origin/destination
 * If destination is Mexico, operation type should be IMP (import)
 */
export async function validateCoherenciaOrigenDestino(pedimento: Pedimento, transportDocument?: TransportDocument) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const transportDocumentmkdown = transportDocument?.markdown_representation;
  
  const validation = {
    name: "Coherencia con origen/destino",
    description: "El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir IMP (importación) si destino es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Tipo de operación", value: tipoOperacion },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Documento de transporte": {
          data: [
            { name: "Documento de transporte", value: transportDocumentmkdown },
          ]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

/**
 * Validates that the pedimento key is valid for the operation type according to Appendix 2
 */
export async function validateClavePedimento(pedimento: Pedimento) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const clavePedimento = pedimento.encabezado_del_pedimento?.cve_pedim;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de clave de pedimento",
    description: "La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Tipo de operación", value: tipoOperacion },
            { name: "Clave de pedimento", value: clavePedimento },
            { name: "Observaciones", value: observaciones }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Anexo 22 -> Apendices": {
          data: [{ name: "Apéndice 2", value: JSON.stringify(apendice2) }]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

/**
 * Validates that the regime is valid for the operation type according to Appendix 16
 */
export async function validateRegimen(pedimento: Pedimento) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const regimen = pedimento.encabezado_del_pedimento?.regimen;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de régimen",
    description: "El régimen debe ser válido para el tipo de operación según el Apéndice 16",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Tipo de operación", value: tipoOperacion },
            { name: "Régimen", value: regimen },
            { name: "Observaciones", value: observaciones }
          ]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Anexo 22 -> Apendices": {
          data: [{ name: "Apéndice 16", value: JSON.stringify(apendice16) }]
        }
      }
    }
  } as const;

  return await glosar(validation, "gpt-4o-mini");
}

export const tracedTipoOperacion = traceable(
  async ({ pedimento, transportDocument }: { pedimento: Pedimento; transportDocument?: TransportDocument }) => {
    const validationsPromise = await Promise.all([
      validateCoherenciaOrigenDestino(pedimento, transportDocument),
      validateClavePedimento(pedimento),
      validateRegimen(pedimento)
    ]);
    
    return {
      sectionName: "Tipo de operación",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S2: Tipo de operación" }
);
