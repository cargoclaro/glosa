import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { apendice15 } from "../../anexo-22/apendice-15";
import { traceable } from "langsmith/traceable";

export async function validateClaveApendice15(pedimento: Pedimento) {
  const claveDestinoOrigen = pedimento.encabezado_del_pedimento?.destino_origen;
  
  const validation = {
    name: "Validación de clave",
    description: "Verificación de que la clave de destino/origen exista en el Apéndice 15",
    prompt: "La clave de destino/origen debe existir en el Apéndice 15",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: "Clave de destino/origen", value: claveDestinoOrigen }]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Apendices": {
          data: [{ name: "Apéndice 15", value: JSON.stringify(apendice15) }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedClaveApendice15 = traceable(
  async ({ pedimento }: { pedimento: Pedimento }) => {
    const validationsPromise = await Promise.all([
      validateClaveApendice15(pedimento)
    ]);
    
    return {
      sectionName: "Clave de destino/origen",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S3: Clave de destino/origen" }
);