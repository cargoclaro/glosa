import { Pedimento } from "../../data-extraction/schemas";
import { validationResultSchema, SYSTEM_PROMPT } from "../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";

async function validateLongitud(pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  
  const validation = {
    name: "Longitud",
    description: "El número de pedimento debe contar con 15 dígitos",
    numeroDelPedimento: numeroPedimento
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

async function validateAñoPedimento(pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  
  const validation = {
    name: "Año del pedimento",
    description: "El año del pedimento (inferido por los dígitos 1 y 2 del número del pedimento) debe ser iguales al año actual",
    numeroDelPedimento: numeroPedimento,
    añoActual: new Date().getFullYear()
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

export async function numeroDePedimentoValidations(pedimento: Pedimento) {
  return Promise.all([
    validateLongitud(pedimento),
    validateAñoPedimento(pedimento)
  ]);
}
