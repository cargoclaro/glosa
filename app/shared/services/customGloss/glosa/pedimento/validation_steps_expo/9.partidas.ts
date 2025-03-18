import { CustomGlossTabContextType } from '@prisma/client';
import { traceable } from 'langsmith/traceable';
import type { Cfdi } from '../../../data-extraction/mkdown_schemas';
import type { Pedimento } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

// Función para validar preferencia arancelaria y certificado de origen
async function validatePreferenciaArancelaria(pedimento: Pedimento) {
  // Extraer partidas con información de preferencia arancelaria
  const partidas = pedimento.partidas || [];

  // Extraer identificadores a nivel pedimento para certificados de origen
  const identificadoresPedimento = pedimento.identificadores_pedimento || [];

  const validation = {
    name: 'Preferencia arancelaria y certificado de origen',
    description:
      'Verificación de que la preferencia arancelaria declarada esté respaldada por el certificado de origen correspondiente según el tratado aplicable',
    prompt:
      'Verificación de preferencia arancelaria y certificado de origen:\n\n1. Regla general:\n   - Si existe preferencia arancelaria, debe existir certificado de origen\n\n2. Por tipo de tratado:\n   a) T-MEC:\n      - Verificar certificado de origen correspondiente\n   b) Unión Europea:\n      - Verificar método de acreditación:\n        i. Declaración en factura:\n           - Si valor < 6,000 EUR: Declaración en factura es válida\n           - Si valor > 6,000 EUR: Debe incluir número de exportador autorizado\n        ii. Certificado de circulación:\n           - Válido sin importar el valor de factura\n           - Requerido si no hay número de exportador en declaración.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Partidas', value: partidas },
            { name: 'Identificadores', value: identificadoresPedimento },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar coherencia de UMC y cantidad UMC
async function validateCoherenciaUMC(pedimento: Pedimento, cfdi?: Cfdi) {
  // Extraer partidas con información de UMC
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Coherencia de UMC y cantidad UMC',
    description:
      'Verificación de que las unidades de medida comercial y sus cantidades declaradas en el pedimento coincidan con las del CFDI',
    prompt:
      'Los campos UMC y cantidad UMC deben coincidir con los valores en el CFDI.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar coherencia de peso
async function validateCoherenciaPeso(pedimento: Pedimento, cfdi?: Cfdi) {
  // Extraer peso bruto del pedimento
  const pesoBrutoPedimento = pedimento.encabezado_del_pedimento?.peso_bruto;

  // Extraer partidas con información de peso
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Coherencia de peso',
    description:
      'Verificación de que el peso total de las partidas coincida con el peso bruto declarado en el pedimento y con el peso declarado en el CFDI',
    prompt:
      'El peso de las partidas debe coincidir con el peso bruto del pedimento y el peso declarado en el CFDI.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Peso bruto', value: pesoBrutoPedimento },
            { name: 'Partidas', value: partidas },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar cálculo del prorrateo y DTA
async function validateCalculoDTA(pedimento: Pedimento) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Cálculo del prorrateo y DTA',
    description:
      'Verificación de que el cálculo del prorrateo y DTA coincida con los valores declarados en el pedimento',
    prompt:
      'El prorrateo y el DTA calculados deben coincidir con los declarados. En el caso de DTA en cuota fija, divide el DTA entre el número de secuencias.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar cálculo de contribuciones
async function validateCalculoContribuciones(
  pedimento: Pedimento,
  cfdi?: Cfdi
) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Cálculo de contribuciones',
    description:
      'Verificación de que los valores declarados en las contribuciones coincidan con los calculados según la normativa',
    prompt:
      'Los valores de precio pagado, precio unitario, valor aduana, IGI y DTA deben coincidir con los calculados. En exportación, verificar que el valor comercial coincida con el total del CFDI.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar coincidencia de permisos e identificadores
async function validatePermisosIdentificadores(pedimento: Pedimento) {
  // Extraer identificadores a nivel pedimento
  const identificadoresPedimento = pedimento.identificadores_pedimento || [];

  // Extraer partidas con identificadores
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Coincidencia de permisos e identificadores',
    description:
      'Verificación de que los permisos e identificadores declarados en el pedimento sean válidos para exportación',
    prompt:
      'Los permisos e identificadores en el pedimento deben existir en Taxfinder y ser apropiados para una operación de exportación.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Identificadores', value: identificadoresPedimento },
            { name: 'Partidas', value: partidas },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar regulaciones arancelarias
async function validateRegulacionesArancelarias(pedimento: Pedimento) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Regulaciones arancelarias',
    description:
      'Verificación de regulaciones arancelarias aplicables a la mercancía en exportación',
    prompt:
      'Verifica si existen regulaciones arancelarias que apliquen a la mercancía en un contexto de exportación.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

// Función para validar regulaciones no arancelarias
async function validateRegulacionesNoArancelarias(pedimento: Pedimento) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Regulaciones no arancelarias',
    description:
      'Verificación de regulaciones no arancelarias aplicables a la mercancía en exportación, como permisos de SEMARNAT, COFEPRIS u otras dependencias',
    prompt:
      'Verifica si existen regulaciones no arancelarias que apliquen a la mercancía en un contexto de exportación, como permisos de SEMARNAT, COFEPRIS u otras dependencias para productos de exportación.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
      },
    },
  } as const;

  return await glosar(validation);
}

export const tracedPartidas = traceable(
  async ({ pedimento, cfdi }: { pedimento: Pedimento; cfdi?: Cfdi }) => {
    const validationsPromise = await Promise.all([
      validatePreferenciaArancelaria(pedimento),
      validateCoherenciaUMC(pedimento, cfdi),
      validateCoherenciaPeso(pedimento, cfdi),
      validateCalculoDTA(pedimento),
      validateCalculoContribuciones(pedimento, cfdi),
      validatePermisosIdentificadores(pedimento),
      validateRegulacionesArancelarias(pedimento),
      validateRegulacionesNoArancelarias(pedimento),
    ]);

    return {
      sectionName: 'Partidas',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S9: Partidas' }
);
