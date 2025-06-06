import type { CFDI, Pedimento } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

// Función para validar preferencia arancelaria y certificado de origen
async function validatePreferenciaArancelaria(
  traceId: string,
  pedimento: Pedimento
) {
  // Extraer partidas con información de preferencia arancelaria
  const partidas = pedimento.partidas || [];

  // Extraer identificadores a nivel pedimento para certificados de origen
  const identificadoresPedimento = pedimento.identificadoresPedimento || [];

  const validation = {
    name: 'Preferencia arancelaria y certificado de origen',
    description:
      'Verificación de que la preferencia arancelaria declarada esté respaldada por el certificado de origen correspondiente según el tratado aplicable',
    prompt:
      'Verificación de preferencia arancelaria y certificado de origen:\n\n1. Regla general:\n   - Si existe preferencia arancelaria, debe existir certificado de origen\n\n2. Por tipo de tratado:\n   a) T-MEC:\n      - Verificar certificado de origen correspondiente\n   b) Unión Europea:\n      - Verificar método de acreditación:\n        i. Declaración en factura:\n           - Si valor < 6,000 EUR: Declaración en factura es válida\n           - Si valor > 6,000 EUR: Debe incluir número de exportador autorizado\n        ii. Certificado de circulación:\n           - Válido sin importar el valor de factura\n           - Requerido si no hay número de exportador en declaración.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Partidas', value: partidas },
            { name: 'Identificadores', value: identificadoresPedimento },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Función para validar coherencia de UMC y cantidad UMC
async function validateCoherenciaUMC(
  traceId: string,
  pedimento: Pedimento,
  cfdi?: CFDI
) {
  // Extraer partidas con información de UMC
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Coherencia de UMC y cantidad UMC',
    description:
      'Verificación de que las unidades de medida comercial y sus cantidades declaradas en el pedimento coincidan con las del CFDI',
    prompt:
      'Los campos UMC y cantidad UMC deben coincidir con los valores en el CFDI.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Función para validar coherencia de peso
async function validateCoherenciaPeso(
  traceId: string,
  pedimento: Pedimento,
  cfdi?: CFDI
) {
  // Extraer peso bruto del pedimento
  const pesoBrutoPedimento =
    pedimento.encabezadoPrincipalDelPedimento.pesoBruto;

  // Extraer partidas con información de peso
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Coherencia de peso',
    description:
      'Verificación de que el peso total de las partidas coincida con el peso bruto declarado en el pedimento y con el peso declarado en el CFDI',
    prompt:
      'El peso de las partidas debe coincidir con el peso bruto del pedimento y el peso declarado en el CFDI.',
    contexts: {
      PROVIDED: {
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

  return await glosar(validation, traceId);
}

// Función para validar cálculo del prorrateo y DTA
async function validateCalculoDTA(traceId: string, pedimento: Pedimento) {
  // Extraer partidas con contribuciones
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Cálculo del prorrateo y DTA',
    description:
      'Verificación de que el cálculo del prorrateo y DTA coincida con los valores declarados en el pedimento',
    prompt:
      'El prorrateo y el DTA calculados deben coincidir con los declarados. En el caso de DTA en cuota fija, divide el DTA entre el número de secuencias.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Función para validar cálculo de contribuciones
async function validateCalculoContribuciones(
  traceId: string,
  pedimento: Pedimento,
  cfdi?: CFDI
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
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Función para validar coincidencia de permisos e identificadores
async function validatePermisosIdentificadores(
  traceId: string,
  pedimento: Pedimento
) {
  // Extraer identificadores a nivel pedimento
  const identificadoresPedimento = pedimento.identificadoresPedimento || [];

  // Extraer partidas con identificadores
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Coincidencia de permisos e identificadores',
    description:
      'Verificación de que los permisos e identificadores declarados en el pedimento sean válidos para exportación',
    prompt:
      'Los permisos e identificadores en el pedimento deben existir en Taxfinder y ser apropiados para una operación de exportación.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Identificadores', value: identificadoresPedimento },
            { name: 'Partidas', value: partidas },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Función para validar regulaciones arancelarias
async function validateRegulacionesArancelarias(
  traceId: string,
  pedimento: Pedimento
) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Regulaciones arancelarias',
    description:
      'Verificación de regulaciones arancelarias aplicables a la mercancía en exportación',
    prompt:
      'Verifica si existen regulaciones arancelarias que apliquen a la mercancía en un contexto de exportación.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Función para validar regulaciones no arancelarias
async function validateRegulacionesNoArancelarias(
  traceId: string,
  pedimento: Pedimento
) {
  // Extraer partidas con fracciones arancelarias
  const partidas = pedimento.partidas || [];

  const validation = {
    name: 'Regulaciones no arancelarias',
    description:
      'Verificación de regulaciones no arancelarias aplicables a la mercancía en exportación, como permisos de SEMARNAT, COFEPRIS u otras dependencias',
    prompt:
      'Verifica si existen regulaciones no arancelarias que apliquen a la mercancía en un contexto de exportación, como permisos de SEMARNAT, COFEPRIS u otras dependencias para productos de exportación.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Partidas', value: partidas }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function partidas({
  pedimento,
  cfdi,
  traceId,
}: { pedimento: Pedimento; cfdi?: CFDI; traceId: string }) {
  const validationsPromise = await Promise.all([
    validatePreferenciaArancelaria(traceId, pedimento),
    validateCoherenciaUMC(traceId, pedimento, cfdi),
    validateCoherenciaPeso(traceId, pedimento, cfdi),
    validateCalculoDTA(traceId, pedimento),
    validateCalculoContribuciones(traceId, pedimento, cfdi),
    validatePermisosIdentificadores(traceId, pedimento),
    validateRegulacionesArancelarias(traceId, pedimento),
    validateRegulacionesNoArancelarias(traceId, pedimento),
  ]);

  return {
    sectionName: 'Partidas',
    validations: validationsPromise,
  };
}
