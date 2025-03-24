import { traceable } from 'langsmith/traceable';
import type { Carta318 } from '../../../data-extraction/mkdown_schemas/carta-318';
import type { Invoice } from '../../../data-extraction/mkdown_schemas/invoice';
import type { TransportDocument } from '../../../data-extraction/mkdown_schemas/transport-document';
import type { Pedimento } from '../../../data-extraction/schemas';
import { getExchangeRate } from '../../exchange-rate';
import { glosar } from '../../validation-result';
import { apendice14 } from '../../anexo-22/apendice-14';

// TODO: Agregar DOF

async function validateTransportDocumentEntryDate(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument
) {
  const pedimentoEntryDate = pedimento.fecha_entrada_presentacion;
  const transportDocmkdown = transportDocument?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const validation = {
    name: 'Fecha de entrada del documento de transporte',
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
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const fechaEntrada = pedimento.fecha_entrada_presentacion;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
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
  invoice?: Invoice,
  transportDocument?: TransportDocument,
  carta318?: Carta318
) {
  const incoterm = pedimento.datos_factura?.incoterm;
  const valSeguros = pedimento.incrementables?.valor_seguros;
  const precioPagadoValorComercial =
    pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Val. Seguros',
    description:
      'Valida que el valor asegurado declarado en el pedimento coincida con el valor comercial',
    prompt:
      'El Val. Seguros es el valor que se asegura y debe ser igual al precio pagado / valor comercial del pedimento. Verifica si este valor está correctamente declarado comparando con la documentación disponible. Ten en cuenta que los incoterms pueden afectar la inclusión de los seguros en el valor de aduana.',
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

async function validateSeguros(
  traceId: string,
  pedimento: Pedimento,
  invoice?: Invoice,
  transportDocument?: TransportDocument,
  carta318?: Carta318
) {
  const incoterm = pedimento.datos_factura?.incoterm;
  const seguros = pedimento.incrementables?.seguros;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
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
  invoice?: Invoice,
  transportDocument?: TransportDocument,
  carta318?: Carta318
) {
  const incoterm = pedimento.datos_factura?.incoterm;
  const fletes = pedimento.incrementables?.fletes;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
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
  invoice?: Invoice,
  transportDocument?: TransportDocument,
  carta318?: Carta318
) {
  const incoterm = pedimento.datos_factura?.incoterm;
  const embalajes = pedimento.incrementables?.embalajes;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
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
  invoice?: Invoice,
  transportDocument?: TransportDocument,
  carta318?: Carta318
) {
  const incoterm = pedimento.datos_factura?.incoterm;
  const otrosIncrementables = pedimento.incrementables?.otros_incrementables;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
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
  invoice?: Invoice,
  carta318?: Carta318
) {
  const valorDolares = pedimento.valores?.valor_dolares;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const valorAduana = pedimento.valores?.valor_aduana;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor en dólares del pedimento',
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
  invoice?: Invoice,
  carta318?: Carta318
) {
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const valorAduana = pedimento.valores?.valor_aduana;
  const incrementables = pedimento.incrementables;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor comercial del pedimento',
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
  invoice?: Invoice,
  carta318?: Carta318
) {
  const valorAduana = pedimento.valores?.valor_aduana;
  const valorComercial = pedimento.valores?.precio_pagado_valor_comercial;
  const incrementables = pedimento.incrementables;
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor aduana del pedimento',
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

export const tracedTransportDocumentEntryDate = traceable(
  async ({
    pedimento,
    invoice,
    transportDocument,
    carta318,
    traceId,
  }: {
    pedimento: Pedimento;
    invoice?: Invoice;
    transportDocument?: TransportDocument;
    carta318?: Carta318;
    traceId: string;
  }) => {
    const validationsPromise = await Promise.all([
      validateTransportDocumentEntryDate(traceId, pedimento, transportDocument),
      validateTipoCambio(traceId, pedimento),
      validateValSeguros(traceId, pedimento, invoice, transportDocument, carta318),
      validateSeguros(traceId, pedimento, invoice, transportDocument, carta318),
      validateFletes(traceId, pedimento, invoice, transportDocument, carta318),
      validateEmbalajes(traceId, pedimento, invoice, transportDocument, carta318),
      validateOtrosIncrementables(traceId, pedimento, invoice, transportDocument, carta318),
      validateValorDolares(traceId, pedimento, invoice, carta318),
      validateValorComercial(traceId, pedimento, invoice, carta318),
      validateValorAduana(traceId, pedimento, invoice, carta318),
    ]);

    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S4: Operación monetaria' }
);
