import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice14 } from '../../anexo-22/apendice-14';
import { getExchangeRate } from '../../exchange-rate';
import { glosar } from '../../validation-result';


async function validateTransportDocumentEntryDate(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  const pedimentoEntryDate =
    pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const transportDocmkdown = transportDocument?.markdown_representation;
  const observaciones = pedimento.observacionesANivelPedimento;

  const validation = {
    name: 'Fecha de entrada',
    description:
      'Valida que la fecha del documento de transporte no sea posterior al pedimento',
    prompt:
      'La fecha de entrada del documento de transporte debe ser anterior o igual a la fecha de entrada del pedimento. Es importante notar que la fecha de entrada no es la misma que la fecha de entrega. La fecha de entrada se refiere a la fecha en que la mercancía ingresa al territorio nacional.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Fecha de entrada', value: pedimentoEntryDate },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateTipoCambio(traceId: string, pedimento: Pedimento) {
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const fechaEntrada = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const observaciones = pedimento.observacionesANivelPedimento;
  const tipoCambioDOF = await getExchangeRate(
    new Date(fechaEntrada ?? new Date())
  );
  const validation = {
    name: 'Tipo de cambio',
    description: 'Valida que el tipo de cambio coincida con el DOF',
    prompt:
      'El tipo de cambio del pedimento debe ser exactamente igual al publicado en el DOF el día hábil anterior a la fecha de entrada del pedimento.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Fecha de entrada', value: fechaEntrada },
            { name: 'Observaciones', value: observaciones },
          ],
        },
      },
      EXTERNAL: {
        'Tipo de cambio DOF': {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}


// TODO: Quitar las validaciones siguiente y agregarlas en sus respectivos archivos 4.1. 


async function validateValSeguros(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const valSeguros =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.valorSeguros;
  const precioPagadoValorComercial =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const clavePedimento =
    pedimento.encabezadoPrincipalDelPedimento.claveDePedimento;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const PROMPT_COMMON = (scenario: string) => `
  Eres un verificador aduanero experto. Devuelves JSON.
  Escenario detectado: ${scenario}

  ⚠️  Reglas comunes (siempre):
  1. Usa Apéndice 14 para validar Incoterm ↔ Seguro.
  2. Convierte USD→MXN con el TC indicado.
  3. Devuelve:
    { "escenario": "...", "facturas":[ ... ] }
  `;

  const PROMPT_ONE_ONE = `
- - Caso: una sola factura y un solo Incoterm.
- Si el Incoterm es CIP o CIF y “Val. Seguros” > 0 ➜ ADVERTENCIA (seguro ya incluido, Apéndice 14).
- De lo contrario, compara “Val. Seguros” con cualquier monto de seguro en la factura; convierte USD→MXN usando el tipo de cambio y acepta ±3 %.
- Verifica que “Val. Seguros” sea numérico, ≤12 dígitos y dos decimales.
- Aplica excepciones de llenado si la clave de pedimento lo permite.
`;

  const PROMPT_ONE_N = `
- Realiza la validación documental con base en las siguientes reglas: (1) Confirma que todas las facturas declaren el mismo Incoterm; si se detecta alguna discrepancia, indícalo como error. (2) Si el Incoterm común es CIP o CIF y el valor global de “Val. Seguros” es mayor que cero, emite una advertencia de inconsistencia conforme al Apéndice 14. (3) Examina cada factura individualmente para extraer cualquier monto de seguro declarado, conviértelo a MXN usando el tipo de cambio correspondiente y compáralo con su parte proporcional del valor global declarado en “Val. Seguros”. (4) Asegura que la suma de los seguros individuales coincida con el valor global de “Val. Seguros”, permitiendo una variación máxima de ±3 %. (5) Verifica que el formato de todos los campos “Val. Seguros” sea numérico y correcto.
`;

  const PROMPT_N_N = `
- Verifica que todos los Incoterms presentes compartan el mismo modo de transporte o estén marcados como “cualquier”; si se detecta una mezcla incompatible, marca el error. Aplica la regla Incoterm-Seguro por factura: si el Incoterm incluye seguro y el monto seguro es mayor que cero, emite una advertencia; si es cero, la declaración es correcta. Para Incoterms sin seguro, si se declara un seguro, valida que su proporción respecto al valor comercial esté entre 0.1 % y 5 %; si está fuera de ese rango, marca el error. Evalúa la coherencia global sumando todos los montos de seguro a nivel factura y compara contra el total declarado en “Val. Seguros”; si la diferencia excede ±5 %, señala la discrepancia. Considera las responsabilidades asociadas al validar seguros y compatibilidades.
`;

  const facturas = pedimento.datosDelProveedorOComprador?.[0]?.facturas || [];
  const numberOfFacturas = facturas.length;

  let allIncotermsAreSame = true;
  if (numberOfFacturas > 1) {
    const firstIncoterm = facturas[0]?.incoterm;
    if (firstIncoterm !== undefined) {
      allIncotermsAreSame = facturas
        .slice(1)
        .every((factura) => factura?.incoterm === firstIncoterm);
    } else {
      allIncotermsAreSame = false;
    }
  }

  let scenario = '';
  let specificPrompt = '';

  if (numberOfFacturas === 1) {
    scenario = 'solo hay 1 factura';
    specificPrompt = PROMPT_ONE_ONE;
  } else if (numberOfFacturas > 1 && allIncotermsAreSame) {
    scenario = 'varias facturas con el mismo Incoterm';
    specificPrompt = PROMPT_ONE_N;
  } else if (numberOfFacturas > 1 && !allIncotermsAreSame) {
    scenario = 'varias facturas con distintos Incoterms';
    specificPrompt = PROMPT_N_N;
  } else {
    scenario = 'no se encontraron facturas o el escenario es desconocido';
    specificPrompt = 'No se puede aplicar una validación específica sin información de facturas.';
  }

  const fullPrompt = `${PROMPT_COMMON(scenario)}
${specificPrompt}`;

  const validation = {
    name: 'Val. Seguros',
    description:
      "Verifica que el campo 'Val. Seguros' (valor total de las mercancías aseguradas en MXN) cumpla con los lineamientos de llenado.",
    prompt: fullPrompt,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Val. Seguros', value: valSeguros },
            { name: 'Tipo de cambio', value: tipoCambio },
            {
              name: 'Precio pagado / valor comercial',
              value: precioPagadoValorComercial,
            },
            { name: 'Clave de Pedimento', value: clavePedimento },
            { name: 'Observaciones', value: observaciones },
            { name: 'Incoterm', value: incoterm },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Apendice 14 (Incoterms)': {
          data: [
            { name: 'Definiciones Incoterm (Apendice 14)', value: apendice14 },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateSeguros(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const seguros =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.seguros;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Seguros',
    description:
      'Valida que el valor de seguros declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      'Los seguros son incrementables que deben coincidir con los documentos que los avalan. Si hay un valor en dólares de seguros en la carta 318, factura o documento de transporte, se debe multiplicar por el tipo de cambio del pedimento para obtener el valor en pesos mexicanos y poder compararlo contra el valor de seguros declarado en el pedimento. Ten en cuenta que los incoterms pueden afectar la inclusión de los seguros en el valor de aduana.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Seguros', value: seguros },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
            { name: 'Incoterm', value: incoterm },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Apendice 14': {
          data: [{ name: 'Apendice 14', value: apendice14 }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateFletes(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const fletes =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.fletes;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Fletes',
    description:
      'Valida que el valor de fletes declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      'Los fletes son incrementables que deben coincidir con los documentos que los avalan. Si hay un valor en dólares de fletes en la carta 318, factura o documento de transporte, se debe multiplicar por el tipo de cambio del pedimento para obtener el valor en pesos mexicanos y poder compararlo contra el valor de fletes declarado en el pedimento. Los incoterms pueden afectar la inclusión de los fletes en el valor de aduana.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Fletes', value: fletes },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
            { name: 'Incoterm', value: incoterm },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Apendice 14': {
          data: [{ name: 'Apendice 14', value: apendice14 }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateEmbalajes(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const embalajes =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.embalajes;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Embalajes',
    description:
      'Valida que el valor de embalajes declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      'Los embalajes son incrementables que deben coincidir con los documentos que los avalan. Si hay un valor en dólares de embalajes en la carta 318, factura o documento de transporte, se debe multiplicar por el tipo de cambio del pedimento para obtener el valor en pesos mexicanos y poder compararlo contra el valor de embalajes declarado en el pedimento. Ten en cuenta que los incoterms pueden afectar la inclusión de los embalajes en el valor de aduana.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Embalajes', value: embalajes },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
            { name: 'Incoterm', value: incoterm },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Apendice 14': {
          data: [{ name: 'Apendice 14', value: apendice14 }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateOtrosIncrementables(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const otrosIncrementables =
    pedimento.encabezadoPrincipalDelPedimento.incrementables
      .otrosIncrementables;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Otros incrementables',
    description:
      'Valida que el valor de otros incrementables declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      'Otros incrementables son los valores de algun tipo de servicio que no sea fletes, seguros o embalajes. Ten en cuenta que los incoterms pueden afectar la inclusión de los otros incrementables en el valor de aduana.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Otros incrementables', value: otrosIncrementables },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
            { name: 'Incoterm', value: incoterm },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Apendice 14': {
          data: [{ name: 'Apendice 14', value: apendice14 }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValorDolares(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  carta318?: OCR
) {
  const valorDolares =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorDolares;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const valorAduana =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const observaciones = pedimento.observacionesANivelPedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor dólares',
    description:
      'Valida que el valor en dólares del pedimento sea igual al valor aduana dividido entre el tipo de cambio',
    prompt:
      'El valor en dólares declarado en el pedimento debe ser igual al valor aduana dividido entre el tipo de cambio (Valor USD = Valor Aduana MXN ÷ Tipo de Cambio). Este valor debe coincidir con el valor comercial de la factura más los incrementables convertidos a USD, y estar redondeado a 2 decimales usando el tipo de cambio del pedimento. Solamente valida que el valor dólares este bien, los ya se analizaron. ',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Valor en dólares', value: valorDolares },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValorComercial(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  carta318?: OCR
) {
  const valorComercial =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const valorAduana =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const incrementables =
    pedimento.encabezadoPrincipalDelPedimento.incrementables;
  const observaciones = pedimento.observacionesANivelPedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Precio pagado',
    description:
      'Valida que el valor comercial sea igual al valor aduana menos los incrementables y que coincida con el valor de la factura',
    prompt:
      'El valor comercial representa el precio pagado por la mercancía sin incluir incrementables (Valor Comercial = Valor Aduana - Total Incrementables) o el valor de la factura sin los incrementables. debe ser menor o igual al valor aduana. La diferencia entre el valor aduana y el valor comercial debe corresponder exactamente a la suma de los incrementables declarados (fletes, seguros y otros), considerando cualquier decrementables aplicado y debe ser consistente con el valor declarado en la factura comercial. Si existe un redondo hacía arriba en el valor declarado en el pedimento que sea mínimo marcalo como valido, donde hay más peligro es declarar menos. ',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Valor comercial', value: valorComercial },
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Incrementables', value: incrementables },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValorAduana(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  carta318?: OCR
) {
  const valorAduana =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const valorComercial =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const incrementables =
    pedimento.encabezadoPrincipalDelPedimento.incrementables;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor aduana',
    description:
      'Valida que el valor aduana sea igual al valor en dólares más incrementables multiplicado por el tipo de cambio',
    prompt:
      'El valor aduana es la base para el cálculo de contribuciones y debe calcularse como el valor dolares más los incrementables multiplicado por el tipo de cambio (Valor Aduana = (Valor Dolares + Total Incrementables) × Tipo de Cambio). Este valor debe ser mayor o igual al valor comercial, y la diferencia debe corresponder exactamente a los incrementables declarados en el pedimento, carta 318 y documentos de transporte, considerando los decrementables aplicados y cualquier ajuste documentado en las observaciones.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Valor comercial', value: valorComercial },
            { name: 'Incrementables', value: incrementables },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

export async function operacionMonetaria({
  pedimento,
  invoice,
  transportDocument,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  invoice?: OCR;
  transportDocument?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateTransportDocumentEntryDate(traceId, pedimento, transportDocument),
    validateTipoCambio(traceId, pedimento),
    validateValSeguros(
      traceId,
      pedimento,
      invoice,
      transportDocument,
      carta318
    ),
    validateSeguros(traceId, pedimento, invoice, transportDocument, carta318),
    validateFletes(traceId, pedimento, invoice, transportDocument, carta318),
    validateEmbalajes(traceId, pedimento, invoice, transportDocument, carta318),
    validateOtrosIncrementables(
      traceId,
      pedimento,
      invoice,
      transportDocument,
      carta318
    ),
    validateValorDolares(traceId, pedimento, invoice, carta318),
    validateValorComercial(traceId, pedimento, invoice, carta318),
    validateValorAduana(traceId, pedimento, invoice, carta318),
  ]);

  return {
    sectionName: 'Operación monetaria',
    validations: validationsPromise,
  };
}
