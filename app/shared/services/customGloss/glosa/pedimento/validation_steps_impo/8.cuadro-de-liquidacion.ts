import type { Pedimento } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

// Helper to build a common PROVIDED context with pedimento data
function buildBaseContext(pedimento: Pedimento) {
  const valorAduana = pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const liquidaciones = pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.liquidaciones;
  const identificadores = pedimento.identificadoresPedimento;

  return {
    Pedimento: {
      data: [
        { name: 'Valor aduana', value: valorAduana },
        { name: 'Liquidaciones', value: JSON.stringify(liquidaciones, null, 2) },
        { name: 'Identificadores a nivel pedimento', value: JSON.stringify(identificadores, null, 2) },
      ],
    },
  } as const;
}

async function validateDTA(traceId: string, pedimento: Pedimento) {
  const validation = {
    name: 'DTA',
    description: 'Valida el Derecho de Trámite Aduanero (DTA) declarado en el cuadro de liquidación.',
    prompt: `Realiza la siguiente validación:\n\n1. Toma el valor en aduana declarado y multiplícalo por 0.008 (0.8 %).\n2. Compara el resultado con la cuota fija mínima de $445 MXN vigente para 2025.\n3. El DTA correcto es el mayor entre el cálculo proporcional y la cuota fija.\n\nExcepciones:\n- Si el pedimento corresponde a importación temporal IMMEX, el DTA es siempre $445.\n- Si existe exención por TLC bajo la regla 5.1.4, el DTA es 0.\n- Si aplica tasa preferencial por regla 5.1.5 o 5.1.7, el DTA es 445.\n- Si es un pedimento consolidado, el DTA es 445 \u00d7 número de vehículos.\n\nCompara el resultado obtenido con el renglón DTA del cuadro de liquidación.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
      EXTERNAL: {
        'RGCE 2025, Anexo 13': {
          data: [
            { name: 'Cuota fija DTA 2025', value: '$445 MNX' },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o');
}

async function validatePRV(traceId: string, pedimento: Pedimento) {
  const validation = {
    name: 'Prevalidación (PRV)',
    description: 'Valida el importe de prevalidación declarado.',
    prompt: `Si el pedimento muestra renglón PREVALIDACIÓN, el importe debe ser $290 MXN y el IVA/PRV debe ser $46 MXN (16 % sobre 290).\nSi no existe renglón PREVALIDACIÓN, indica que no aplica.\nCompara contra los renglones PREVALIDACIÓN e IVA/PRV del cuadro.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
      EXTERNAL: {
        'RGCE 2025, Anexo 13': {
          data: [
            { name: 'Cuota fija Prevalidación 2025', value: '$290 MNX' },
            { name: 'IVA 16 %', value: '0.16' },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateIVA(traceId: string, pedimento: Pedimento) {
  const validation = {
    name: 'IVA sobre operación',
    description: 'Valida el cálculo de IVA en el cuadro de liquidación.',
    prompt: `Calcula la base para IVA sumando valor en aduana + IGI total + DTA + IEPS (si existe) + cuotas compensatorias (si existen).\nMultiplica la base por 0.16 (16 %).\nExcepciones:\n- Para exportaciones la tasa es 0 %.\n- Si alguna fracción está a tasa 0 conforme Anexo 27, descuéntala de la base.\n\nCompara el resultado con el renglón IVA del cuadro de liquidación.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
      EXTERNAL: {
        'Ley IVA Art.1 y 2': {
          data: [
            { name: 'Tasa general IVA', value: '16 %' },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateIGI(traceId: string, pedimento: Pedimento) {
  const liquidaciones = pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.liquidaciones;
  const igiLinea = liquidaciones.find((l) => l.concepto.toUpperCase().includes('IGI'));

  const validation = {
    name: 'IGI',
    description: 'Valida el cálculo del Impuesto General de Importación (IGI).',
    prompt: `Realiza el cálculo de IGI conforme a las siguientes reglas generales:\n\n1. Base gravable = Valor en aduana (considera reglas de INCOTERM e incrementables).\n2. IGI = Base gravable × tasa arancelaria de la fracción arancelaria (o cuotas específicas convertidas a MXN).\n3. Valida la aplicación de tasas preferenciales (TLC, PROSEC, etc.).\n4. Suma los importes por partida y compáralo con el renglón IGI del cuadro de liquidación (${igiLinea?.importe ?? 'N/D'} MXN declarado).\n\nMuestra discrepancias y cita decretos publicados en DOF cuando aplique.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
      EXTERNAL: {
        'DOF Decretos 2022-2024': {
          data: [
            { name: 'Lista de decretos', value: '18 nov 2022; 6 y 16 ene; 18 mayo; 23 junio; 15 ago; 27 dic 2023; 22 abr, 8 mayo, 19 dic 2024' },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateIEPS(traceId: string, pedimento: Pedimento) {
  const validation = {
    name: 'IEPS',
    description: 'Valida el cálculo del Impuesto Especial sobre Producción y Servicios (IEPS).',
    prompt: `Calcula la base de IEPS = Valor en aduana + IGI + DTA + Cuotas Compensatorias.\nAplica la tasa o cuota conforme al artículo 2 de la Ley IEPS y cuotas publicadas anualmente.\nSi se usa cuota específica, genera alerta para revisión.\nCompara el IEPS calculado con el renglón IEPS del cuadro de liquidación.\nPara exportaciones la tasa es 0 %.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
      EXTERNAL: {
        'Ley IEPS art.2 y cuotas 2025': {
          data: [
            { name: 'Nota', value: 'Cuotas actualizadas por SHCP cada año' },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateCuotasCompensatorias(traceId: string, pedimento: Pedimento) {
  const validation = {
    name: 'Cuotas compensatorias',
    description: 'Valida el cálculo y declaración de cuotas compensatorias.',
    prompt: `Determina si existen cuotas compensatorias (CC).\nSi la CC es porcentual, importe = Valor en aduana × tasa.\nSi es específica, conviértela a MXN (cuota USD × TC × cantidad UMT).\nCompara con el importe declarado en el renglón CC del cuadro de liquidación.\nGenera alerta si hay discrepancia.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

// New validation: Identificadores pedimento risk analysis
async function validateIdentificadoresPedimentoRiskAnalysis(traceId: string, pedimento: Pedimento) {
  const validation = {
    name: 'Identificadores (análisis de riesgo)',
    description: 'Analiza los identificadores a nivel pedimento para identificar riesgos y validar requisitos regulatorios.',
    prompt: `✅ Validaciones a nivel pedimento\n\n(Solo se usa información de los identificadores del pedimento)\n\nSi ves el identificador IM, están declarando una importación temporal de insumos bajo IMMEX. Solo informa.\n\nSi ves MS, están declarando una importación temporal de mercancías bajo la modalidad de servicios. Solo informa.\n\nSi ves PC o RC, el pedimento es consolidado. Solo informa.\n\nSi ves AF, están declarando una importación temporal de activo fijo bajo IMMEX. Solo informa.\n\nSi ves PP, están usando PROSEC. Valida que el RFC del importador esté registrado para el sector correspondiente. Revisa la constancia PROSEC o listado vigente.\n\nSi ves CI, están usando una certificación en IVA/IEPS (CIVA). Valida que el RFC esté en el padrón oficial del SAT.\n\nSi ves IC con complemento A, están declarando una Comercializadora e Importadora certificada. Valida el complemento y la autorización correspondiente.\n\nSi ves IC con complemento O, están declarando que son Operador Económico Autorizado (OEA). Valida que estén en el padrón de OEA.\n\nSi ves SO, están declarando que son Socio Comercial Certificado. Valida que el RFC esté listado en el padrón oficial.\n\nSi ves RO, están aplicando revisión en origen. Verifica que la empresa tenga autorización vigente del SAT.\n\nSi ves A3, están regularizando mercancías. Valida que haya documentos de soporte como actas, inventarios o resoluciones.`,
    contexts: {
      PROVIDED: buildBaseContext(pedimento),
      EXTERNAL: {
        'Anexo 22, Apéndice 8': {
          data: [
            { name: 'Catálogo de identificadores', value: 'IM, MS, PC, RC, AF, PP, CI, IC, SO, RO, A3' },
          ],
        },
        'Listado PROSEC vigente': {
          data: [
            { name: 'RFCs inscritos PROSEC', value: 'Catálogo oficial SAT' },
          ],
        },
        'Padrón CIVA vigente': {
          data: [
            { name: 'RFCs con certificación IVA/IEPS', value: 'Catálogo oficial SAT' },
          ],
        },
        'Padrón OEA vigente': {
          data: [
            { name: 'RFCs con autorización OEA', value: 'Catálogo oficial SAT' },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

export async function cuadroDeLiquidacion({
  pedimento,
  traceId,
}: {
  pedimento: Pedimento;
  traceId: string;
}) {
  const validations = await Promise.all([
    validateDTA(traceId, pedimento),
    validatePRV(traceId, pedimento),
    validateIVA(traceId, pedimento),
    validateIGI(traceId, pedimento),
    validateIEPS(traceId, pedimento),
    validateCuotasCompensatorias(traceId, pedimento),
    validateIdentificadoresPedimentoRiskAnalysis(traceId, pedimento),
  ]);

  return {
    sectionName: 'Identificadores y cuadro',
    validations,
  } as const;
} 