import { Pedimento, TransportDocument } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { apendice2 } from "../../anexo-22/apendice-2";
import { apendice16 } from "../../anexo-22/apendice-16";

/**
 * Validates that the operation type is consistent with the origin/destination
 * If destination is Mexico, operation type should be IMP (import)
 */
async function validateCoherenciaOrigenDestino(pedimento: Pedimento, transportDoc?: TransportDocument) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const origen = transportDoc?.origin_country;
  const destino = transportDoc?.destination_country;
  
  const validation = {
    name: "Coherencia con origen/destino",
    description: "El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir IMP (importación) si destino es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.",
    tipoOperacion,
    observaciones: pedimento.observaciones_a_nivel_pedimento,
    origen,
    destino
  };

  return await glosar(validation);
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

  return await glosar(validation);
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

  return await glosar(validation);
}

/**
 * Main function that runs all tipo-operacion validations
 */
export async function tipoOperacionValidations(pedimento: Pedimento) {
  return Promise.all([
    validateCoherenciaOrigenDestino(pedimento),
    validateClavePedimento(pedimento),
    validateRegimen(pedimento)
  ]);
} 