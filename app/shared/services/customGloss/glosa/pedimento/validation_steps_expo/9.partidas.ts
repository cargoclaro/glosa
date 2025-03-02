import { Pedimento } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { Cfdi } from "../../../data-extraction/schemas";

// Función para validar preferencia arancelaria y certificado de origen
export async function validatePreferenciaArancelaria(pedimento: Pedimento) {
  // Extraer partidas con información de preferencia arancelaria
  const partidas = pedimento.partidas || [];
  
  // Extraer identificadores a nivel pedimento para certificados de origen
  const identificadoresPedimento = pedimento.identificadores_pedimento || [];
  
  const validation = {
    name: "Preferencia arancelaria y certificado de origen",
    description: "Verificación de preferencia arancelaria y certificado de origen:\n\n1. Regla general:\n   - Si existe preferencia arancelaria, debe existir certificado de origen\n\n2. Por tipo de tratado:\n   a) T-MEC:\n      - Verificar certificado de origen correspondiente\n   b) Unión Europea:\n      - Verificar método de acreditación:\n        i. Declaración en factura:\n           - Si valor < 6,000 EUR: Declaración en factura es válida\n           - Si valor > 6,000 EUR: Debe incluir número de exportador autorizado\n        ii. Certificado de circulación:\n           - Válido sin importar el valor de factura\n           - Requerido si no hay número de exportador en declaración.",
    partidas,
    identificadoresPedimento
  } as const;

  return await glosar(validation);
}

// Función para validar coherencia de UMC y cantidad UMC
export async function validateCoherenciaUMC(pedimento: Pedimento, cfdi: Cfdi) {
  // Extraer partidas con información de UMC
  const partidas = pedimento.partidas || [];
  
  // Extraer items del CFDI
  const conceptosCfdi = cfdi?.conceptos || [];
  
  const validation = {
    name: "Coherencia de UMC y cantidad UMC",
    description: "Los campos UMC y cantidad UMC deben coincidir con los valores en el CFDI.",
    partidas,
    conceptosCfdi
  } as const;

  return await glosar(validation);
}

// Función para validar coherencia de peso
export async function validateCoherenciaPeso(pedimento: Pedimento, cfdi: Cfdi) {
  // Extraer peso bruto del pedimento
  const pesoBrutoPedimento = pedimento.encabezado_del_pedimento?.peso_bruto;
  
  // Extraer peso bruto total del CFDI si está disponible
  const pesoBrutoCfdi = cfdi?.peso_bruto_total;
  
  // Extraer partidas con información de peso
  const partidas = pedimento.partidas || [];
  
  // Extraer conceptos del CFDI con pesos
  const conceptosCfdi = cfdi?.conceptos || [];
  
  const validation = {
    name: "Coherencia de peso",
    description: "El peso de las partidas debe coincidir con el peso bruto del pedimento y el peso declarado en el CFDI.",
    pesoBrutoPedimento,
    pesoBrutoCfdi,
    partidas,
    conceptosCfdi
  } as const;

  return await glosar(validation);
}

// Función para validar cálculo del prorrateo y DTA
export async function validateCalculoDTA(pedimento: Pedimento) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];
  
  const validation = {
    name: "Cálculo del prorrateo y DTA",
    description: "El prorrateo y el DTA calculados deben coincidir con los declarados. En el caso de DTA en cuota fija, divide el DTA entre el número de secuencias.",
    partidas
  } as const;

  return await glosar(validation);
}

// Función para validar cálculo de contribuciones
export async function validateCalculoContribuciones(pedimento: Pedimento, cfdi: Cfdi) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];
  
  // Extraer valor total del CFDI
  const valorTotalCfdi = cfdi?.total;
  
  // Extraer conceptos del CFDI
  const conceptosCfdi = cfdi?.conceptos || [];
  
  const validation = {
    name: "Cálculo de contribuciones",
    description: "Los valores de precio pagado, precio unitario, valor aduana, IGI y DTA deben coincidir con los calculados. En exportación, verificar que el valor comercial coincida con el total del CFDI.",
    partidas,
    valorTotalCfdi,
    conceptosCfdi
  } as const;

  return await glosar(validation);
}

// Función para validar coincidencia de permisos e identificadores
export async function validatePermisosIdentificadores(pedimento: Pedimento) {
  // Extraer identificadores a nivel pedimento
  const identificadoresPedimento = pedimento.identificadores_pedimento || [];
  
  // Extraer partidas con identificadores
  const partidas = pedimento.partidas || [];
  
  const validation = {
    name: "Coincidencia de permisos e identificadores",
    description: "Los permisos e identificadores en el pedimento deben existir en Taxfinder y ser apropiados para una operación de exportación.",
    identificadoresPedimento,
    partidas
  } as const;

  return await glosar(validation);
}

// Función para validar regulaciones arancelarias
export async function validateRegulacionesArancelarias(pedimento: Pedimento) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];
  
  const validation = {
    name: "Regulaciones arancelarias",
    description: "Verifica si existen regulaciones arancelarias que apliquen a la mercancía en un contexto de exportación.",
    partidas
  } as const;

  return await glosar(validation);
}

// Función para validar regulaciones no arancelarias
export async function validateRegulacionesNoArancelarias(pedimento: Pedimento) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];
  
  const validation = {
    name: "Regulaciones no arancelarias",
    description: "Verifica si existen regulaciones no arancelarias que apliquen a la mercancía en un contexto de exportación, como permisos de SEMARNAT, COFEPRIS u otras dependencias para productos de exportación.",
    partidas
  } as const;

  return await glosar(validation);
}
