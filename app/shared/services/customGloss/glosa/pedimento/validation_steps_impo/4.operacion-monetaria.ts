import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice14 } from '../../anexo-22/apendice-14';
import { getExchangeRate } from '../../exchange-rate';
import incotermLogic from '../../incoterms-logic.json';
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
  const incoterms = incotermLogic;
  const fechaEntrada = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const tipoCambioDOF = await getExchangeRate(new Date(fechaEntrada ?? new Date()));

  const validation = {
    name: 'Val. Seguros',
    description:
      "Verifica que el campo 'Val. Seguros' (valor total de las mercancías aseguradas en MXN) cumpla con los lineamientos de llenado.",
    prompt: `
Revisa el "Valor Seguros" declarado (total asegurado de la mercancía).

Existen dos casos según el Incoterm:

1. Si es CIP o CIF (seguro incluido):
   - "Valor Seguros" debe existir y cubrir al menos el valor comercial total.
   - Si falta o es muy bajo, indica omisión o insuficiencia.

2. Para otros Incoterms:
   - "Valor Seguros" es opcional.
   - Si existe, compáralo con pólizas o certificados (±5% permitido).

Casos especiales con múltiples facturas:

- Mismo Incoterm: verifica uniformidad y suma valores asegurados individuales para comparar con el declarado global (±5%).
- Distintos Incoterms: revisa coherencia individual por factura según reglas anteriores. Luego compara la suma total contra el valor global declarado (±5%).

Siempre convierte montos documentados a MXN con el tipo de cambio indicado.
`,
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
        'Tipo de cambio DOF': {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF }],
        },
        'Apendice 14 (Incoterms)': {
          data: [
            { name: 'Definiciones Incoterm (Apendice 14)', value: apendice14 },
          ],
        },
        'Incoterms con Transporte y Seguro': {
          data: [
            { name: 'Incoterms', value: incoterms },
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
  const fechaEntrada = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const tipoCambioDOF = await getExchangeRate(new Date(fechaEntrada ?? new Date()));

  const validation = {
    name: 'Seguros',
    description:
      'Valida que el valor de seguros declarado en el pedimento coincida con los documentos que lo avalan',
    prompt: `
Revisa que el campo "Seguros" del pedimento coincida con los documentos soporte.

Existen dos casos según el Incoterm:

1. Si es CIP o CIF (seguro incluido en precio):
   - "Seguros" debe ser 0. Si se declara monto adicional, indica duplicidad.

2. Para todos los demás Incoterms:
   - Debe existir un monto declarado.
   - Si los documentos indican cargos y no aparecen en "Seguros", señala omisión.
   - Si "Seguros" muestra montos no respaldados por documentos, señala falta de soporte.
   - Diferencias superiores al 3% indican discrepancia.

Casos especiales con múltiples facturas:

- Si todas las facturas tienen el mismo Incoterm, confirma consistencia y suma cargos para comparar con el valor declarado (±3%).
- Si las facturas tienen Incoterms diferentes, verifica que sean compatibles en términos de transporte y aplica las reglas anteriores factura por factura. Al final, suma los cargos para comparar contra el valor declarado global (±3%).

Siempre convierte montos documentados a MXN con el tipo de cambio indicado.
`,
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
        'Tipo de cambio DOF': {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF }],
        },
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
  const fechaEntradaF = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const tipoCambioDOF_F = await getExchangeRate(new Date(fechaEntradaF ?? new Date()));

  const validation = {
    name: 'Fletes',
    description:
      'Valida que el valor de fletes declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
`
Revisa que el campo "Fletes" del pedimento coincida con documentos soporte.

Existen dos casos según el Incoterm:

1. Incoterms con flete incluido (CIF, CIP, CFR, CPT, DAP, DPU, DDP):
   - "Fletes" debe ser 0; si declara monto adicional indica duplicidad.

2. Incoterms sin flete incluido (EXW, FCA, FAS, FOB):
   - Debe existir un monto en "Fletes".
   - Si documentos muestran flete y pedimento no, señala omisión.
   - Diferencias mayores al 3% indican discrepancia.

Casos especiales con múltiples facturas:

- Si todas las facturas usan el mismo Incoterm, confirma uniformidad y suma cargos documentados para compararlos con el monto declarado global (±3%).
- Con Incoterms distintos, verifica compatibilidad de transporte, luego aplica reglas factura por factura y compara suma total contra el valor declarado (±3%).

Siempre convierte montos documentados a MXN con el tipo de cambio indicado.
`,
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
        'Tipo de cambio DOF': {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF_F }],
        },
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
  const fechaEntradaE = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const tipoCambioDOF_E = await getExchangeRate(new Date(fechaEntradaE ?? new Date()));

  const validation = {
    name: 'Embalajes',
    description:
      'Valida que el valor de embalajes declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      `
Revisa que "Embalajes" declarado en pedimento coincida con documentos soporte.

- Si documentos muestran cargos de embalaje y pedimento no los declara, señala omisión.
- Si pedimento declara embalajes sin soporte documental, señala falta de respaldo.
- Si ambos muestran montos, diferencias mayores al 3% indican discrepancia.

Casos especiales con múltiples facturas:

- Mismo Incoterm: verifica uniformidad y suma cargos individuales para comparar contra el monto declarado global (±3%).
- Diferentes Incoterms: revisa cada factura por separado con reglas anteriores, luego compara suma total documentada contra el monto declarado global (±3%).

Si existe contrato global mencionado en observaciones, verifica distribución razonable.

Siempre convierte montos documentados a MXN con el tipo de cambio indicado.
`,
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
        'Tipo de cambio DOF': {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF_E }],
        },
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
  const fechaEntradaO = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const tipoCambioDOF_O = await getExchangeRate(new Date(fechaEntradaO ?? new Date()));

  const validation = {
    name: 'Otros incrementables',
    description:
      'Valida que el valor de otros incrementables declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      `
Revisa "Otros Incrementables" (gastos distintos a fletes, seguros, embalajes).

- Si documentos indican cargos y pedimento no, señala omisión.
- Si pedimento muestra cargos sin respaldo documental, señala falta de soporte.
- Diferencias mayores al 3% indican discrepancia.
- Si algún cargo adicional ya está cubierto por el Incoterm según documentación externa (Apéndice 14), señala duplicidad.

Casos especiales con múltiples facturas:

- Mismo Incoterm: confirma uniformidad y suma cargos documentados para comparar contra el monto declarado global (±3%).
- Distintos Incoterms: revisa individualmente cada factura usando las reglas anteriores, luego compara suma total documentada con monto declarado global (±3%).

Si existe acuerdo global mencionado en observaciones, verifica distribución razonable.

Siempre convierte montos documentados a MXN con el tipo de cambio indicado.
`,
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
        'Tipo de cambio DOF': {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF_O }],
        },
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



