import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { apendice15 } from "../../anexo-22/apendice-15";

async function validateClaveApendice15(pedimento: Pedimento) {
  const claveDestinoOrigen = pedimento.encabezado_del_pedimento?.destino_origen;
  
  const validation = {
    name: "Validación de clave",
    description: "La clave de destino/origen debe existir en el Apéndice 15",
    contexts: [
      {
        type: CustomGlossTabContextType.PROVIDED,
        origin: "pedimento",
        data: [{ name: "Clave de destino/origen", value: claveDestinoOrigen }]
      },
      {
        type: CustomGlossTabContextType.EXTERNAL,
        origin: "pedimento",
        data: [{ name: "Apéndice 15", value: JSON.stringify(apendice15) }]
      }
    ]
  } as const;

  return await glosar(validation);
}

export async function origenDestinoOrigenValidations(pedimento: Pedimento) {
  return Promise.all([
    validateClaveApendice15(pedimento)
  ]);
}
