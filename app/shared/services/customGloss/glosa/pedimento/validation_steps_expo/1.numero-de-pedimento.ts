import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";

async function validateLongitud(pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  
  const validation = {
    name: "Longitud",
    description: "El número de pedimento debe contar con 15 dígitos",
    numeroDelPedimento: numeroPedimento
  };

  return await glosar(validation);
}

async function validateAñoPedimento(pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  
  const validation = {
    name: "Año del pedimento",
    description: "El año del pedimento (inferido por los dígitos 1 y 2 del número del pedimento) debe ser iguales al año actual",
    numeroDelPedimento: numeroPedimento,
    añoActual: new Date().getFullYear()
  };

  return await glosar(validation);
}

export async function numeroDePedimentoValidations(pedimento: Pedimento) {
  return Promise.all([
    validateLongitud(pedimento),
    validateAñoPedimento(pedimento)
  ]);
}
