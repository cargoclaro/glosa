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
Verifica el "Valor Seguros" (campo 318) declarado en el pedimento; este campo representa la suma asegurada en MXN.

Reglas por Incoterm (según Apéndice 14):

• CIP y CIF  →  El seguro ya está incluido, por lo tanto "Valor Seguros" debe ser 0. Cualquier monto distinto indica duplicidad.

• EXW, FCA, FAS, FOB, CFR, CPT, DAP, DPU, DDP  →  El seguro NO está incluido en el precio, así que es opcional declarar un monto en "Valor Seguros" respaldado por póliza/certificado.
  – Si el soporte existe y el campo está en 0 ⇒ omisión.
  – Si el campo tiene monto y no existe soporte ⇒ falta de respaldo.
  – Diferencias ±5 % entre soporte y declarado ⇒ discrepancia.

Múltiples facturas:
– Mismo Incoterm → Suma los valores asegurados y compara con el global (±5 %).
– Distintos Incoterms → Valida cada factura con la regla anterior y después la suma global.

Convierte los montos a MXN usando el tipo de cambio del pedimento.
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
Verifica el campo "Seguros" (costo del seguro) declarado en el pedimento.

Reglas por Incoterm:

• CIP y CIF  →  El costo del seguro ya va incluido; el campo "Seguros" debe ser 0. Cualquier monto adicional es duplicidad.

• EXW, FCA, FAS, FOB, CFR, CPT, DAP, DPU, DDP  →  El seguro no está incluido en el precio, por lo que debe declararse un monto.
  – Si los documentos soporte (póliza, factura, carta 318) muestran un cargo y el campo está en 0 ⇒ omisión.
  – Si el campo tiene monto sin soporte ⇒ falta de respaldo.
  – Diferencias >3 % entre soporte y declarado ⇒ discrepancia.

Múltiples facturas:
– Mismo Incoterm → Suma los cargos soportados y compara con el valor global (±3 %).
– Incoterms diversos → Aplica la regla por factura y luego compara la suma total (±3 %).

Convierte siempre los cargos a MXN con el tipo de cambio del pedimento.
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
Verifica el campo "Fletes" (costo de transporte internacional) declarado en el pedimento.

Reglas por Incoterm:

• Incoterms que INCLUYEN flete: CFR, CIF, CPT, CIP, DAP, DPU, DDP → "Fletes" debe ser 0. Cualquier monto adicional es duplicidad.

• Incoterms SIN flete: EXW, FCA, FAS, FOB →
  – Debe declararse un monto en "Fletes" respaldado por BL/AWB, factura de naviera, carta 318, etc.
  – Si el soporte existe y el campo está en 0 ⇒ omisión.
  – Si el campo tiene monto sin soporte ⇒ falta de respaldo.
  – Diferencias >3 % entre soporte y declarado ⇒ discrepancia.

Múltiples facturas → Suma y tolera ±3 %.

Convierte siempre los cargos a MXN con el tipo de cambio del pedimento.
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
Revisa "Otros Incrementables" (gastos distintos a fletes, seguros y embalajes).

1. Cada cargo declarado debe tener soporte documental (factura, carta 318, contrato, etc.).
2. Verifica que no duplique costos ya cubiertos por el Incoterm:
   – CFR/CIF/CPT/CIP incluyen el transporte principal.
   – DAP/DPU/DDP incluyen transporte y entrega en destino.
3. Si documentos muestran cargo no declarado ⇒ omisión. Si el pedimento declara cargo sin soporte ⇒ falta de respaldo.
4. Diferencias ±3 % entre soporte y declarado.

Para múltiples facturas, aplica la regla por factura y valida la suma global (±3 %).

Convierte montos a MXN con el tipo de cambio del pedimento.
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



