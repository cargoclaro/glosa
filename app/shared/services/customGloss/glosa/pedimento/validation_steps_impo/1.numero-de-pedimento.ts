import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { traceable } from "langsmith/traceable";

async function validateLongitud(pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const longitud = numeroPedimentoSinEspacios.length;
  
  const validation = {
    name: "Longitud",
    description: "El número de pedimento debe contar con 15 dígitos.",
    contexts: {
      [CustomGlossTabContextType.INFERRED]: {
        pedimento: {
          data: [
            {
              name: "Número de pedimento sin espacios",
              value: numeroPedimentoSinEspacios
            },
            {
              name: "Longitud",
              value: longitud
            }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

async function validateAñoPedimento(pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const añoActual = new Date().getFullYear();
  
  const validation = {
    name: "Año del pedimento",
    description: "El año del pedimento (inferido por los dígitos 1 y 2 del número del pedimento) debe ser iguales al año actual",
    contexts: {
      [CustomGlossTabContextType.INFERRED]: {
        "Pedimento": {
          data: [
            { name: "Año actual", value: añoActual },
            { name: "Número de pedimento sin espacios", value: numeroPedimentoSinEspacios }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedNumeroDePedimento = traceable(
  async ({ pedimento }: { pedimento: Pedimento }) => {
    const validationsPromise = await Promise.all([
      validateLongitud(pedimento),
      validateAñoPedimento(pedimento)
    ]);
    
    return {
      sectionName: "Número de pedimento",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S1: Número de pedimento" }
);
