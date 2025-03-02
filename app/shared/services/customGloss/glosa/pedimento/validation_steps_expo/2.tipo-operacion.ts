import { Pedimento, TransportDocument } from "../../../data-extraction/schemas";
import { validationResultSchema, SYSTEM_PROMPT } from "../../validation-result";
import { generateObject } from "ai";
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
import { apendice2 } from "../../anexo-22/apendice-2";
import { apendice16 } from "../../anexo-22/apendice-16";

/**
 * Validates that the operation type is consistent with the origin/destination
 * If origin is Mexico, operation type should be EXP (export)
 */
async function validateCoherenciaOrigenDestino(pedimento: Pedimento, transportDoc?: TransportDocument) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const origen = transportDoc?.origin_country;
  const destino = transportDoc?.destination_country;
  
  const validation = {
    name: "Coherencia con origen/destino",
    description: "El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir EXP (exportación) si origen es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.",
    tipoOperacion,
    observaciones: pedimento.observaciones_a_nivel_pedimento,
    origen,
    destino
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

/**
 * Validates that the pedimento key is valid for the operation type according to Appendix 2
 */
async function validateClavePedimento(pedimento: Pedimento) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const clavePedimento = pedimento.encabezado_del_pedimento?.cve_pedim;
  
  const validation = {
    name: "Validación de clave de pedimento",
    description: "La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2",
    tipoOperacion,
    clavePedimento,
    apendice2JSON: JSON.stringify(apendice2)
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

/**
 * Validates that the regime is valid for the operation type according to Appendix 16
 */
async function validateRegimen(pedimento: Pedimento) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const regimen = pedimento.encabezado_del_pedimento?.regimen;
  
  const validation = {
    name: "Validación de régimen",
    description: "El régimen debe ser válido para el tipo de operación según el Apéndice 16",
    tipoOperacion,
    regimen,
    apendice16JSON: JSON.stringify(apendice16)
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

/**
 * Main function that runs all tipo-operacion validations
 */
export async function tipoOperacionValidations(pedimento: Pedimento, transportDoc?: TransportDocument) {
  return Promise.all([
    validateCoherenciaOrigenDestino(pedimento, transportDoc),
    validateClavePedimento(pedimento),
    validateRegimen(pedimento)
  ]);
} 