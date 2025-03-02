import { Pedimento } from "../../../data-extraction/schemas";
import { validationResultSchema, SYSTEM_PROMPT } from "../../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { apendice15 } from "../../anexo-22/apendice-15";

async function validateClaveApendice15(pedimento: Pedimento) {
  const claveDestinoOrigen = pedimento.encabezado_del_pedimento?.destino_origen;
  
  const validation = {
    name: "Validación de clave",
    description: "La clave de destino/origen debe existir en el Apéndice 15",
    claveDestinoOrigen,
    apendice15JSON: JSON.stringify(apendice15)
  };

  const { object } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Validate ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });
  
  return object;
}

export async function origenDestinoOrigenValidations(pedimento: Pedimento) {
  return Promise.all([
    validateClaveApendice15(pedimento)
  ]);
}
