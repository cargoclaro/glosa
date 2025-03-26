import { traceable } from 'langsmith/traceable';
import type { Carta318 } from '../../../data-extraction/mkdown_schemas/carta-318';
import type { CartaSesion } from '../../../data-extraction/mkdown_schemas/carta-sesion';
import type { Invoice } from '../../../data-extraction/mkdown_schemas/invoice';
import type { Cove, Pedimento } from '../../../data-extraction/schemas';
import { getExchangeRate } from '../../exchange-rate';
import { glosar } from '../../validation-result';

async function validateRfcFormat(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  carta318?: Carta318
) {
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const validation = {
    name: 'Validación de los RFC',
    description:
      'Valida el formato y consistencia de los RFC entre el pedimento, COVE y carta 3.1.8',
    prompt:
      'Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Consistencia entre documentos:\n• RFC del importador debe ser idéntico en Pedimento, COVE y Carta 3.1.8\n• Si hay Cesión de Derechos, el RFC de la comercializadora debe coincidir con el RFC del importador en la Carta 3.1.8',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'RFC', value: rfcPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        COVE: {
          data: [{ name: 'RFC', value: rfcCove }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}

async function validateCesionDerechos(
  traceId: string,
  pedimento: Pedimento,
  cartaSesion?: CartaSesion,
  carta318?: Carta318
) {
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const cartaSesionmkdown = cartaSesion?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const validation = {
    name: 'Validación de cesión de derechos y carta 3.1.8',
    description:
      'Valida que los datos de la cesión de derechos coincidan con la carta 3.1.8 y que las fechas sean correctas',
    prompt:
      'Si existe Cesión de Derechos:\n\nComparar:\n• RFC comercializadora vs. RFC importador en Carta 3.1.8\n• Fecha de emisión de la Cesión debe ser anterior a Fecha de entrada del Pedimento\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Fecha de entrada', value: fechaEntradaPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Carta sesión': {
          data: [
            { name: 'Carta sesión', value: cartaSesionmkdown },
            { name: 'Existe cesión de derechos', value: !!cartaSesion },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateDatosImportador(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  carta318?: Carta318
) {
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const domicilioPedimento = pedimento.datos_importador?.domicilio;
  const domicilioCove = cove?.datos_generales_destinatario?.domicilio;
  const razonSocialPedimento = pedimento.datos_importador?.razon_social;
  const razonSocialCove =
    cove?.datos_generales_destinatario?.nombre_razon_social;

  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numero_exterior,
        domicilioCove.numero_interior,
        domicilioCove.colonia,
        domicilioCove.localidad,
        domicilioCove.municipio,
        domicilioCove.entidad_federativa,
        domicilioCove.codigo_postal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const validation = {
    name: 'Validación de datos del importador',
    description:
      'Valida que los datos del importador coincidan entre el pedimento, COVE y carta 3.1.8',
    prompt:
      'Validar que los siguientes campos coincidan, no importa tanto que litaralmente esten identicos:\n\nRFC: Debe coincidir entre Pedimento, Carta 3.1.8 y COVE.\nDomicilio fiscal: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y Factura (importador).\nRazón social: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y COVE.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. Discrepancias grandes, se marcan como error.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'RFC', value: rfcPedimento },
            { name: 'Domicilio', value: domicilioPedimento },
            { name: 'Razón social', value: razonSocialPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        COVE: {
          data: [
            { name: 'RFC', value: rfcCove },
            { name: 'Domicilio', value: domicilioCoveCompleto },
            { name: 'Razón social', value: razonSocialCove },
          ],
        },
        'Carta 318': {
          data: [
            { name: 'Carta 318', value: carta318mkdown },
            { name: 'Existe carta 3.1.8', value: !!carta318 },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateDatosProveedor(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  carta318?: Carta318
) {
  const nombreProveedorPedimento = pedimento.nombre_razon_social;
  const nombreProveedorCove =
    cove?.datos_generales_proveedor?.nombre_razon_social;
  const domicilioProveedorPedimento = pedimento.domicilio;
  const domicilioProveedorCove = cove?.datos_generales_proveedor?.domicilio;
  const idProveedorCove = cove?.datos_generales_proveedor?.identificador;

  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const domicilioProveedorCoveCompleto = domicilioProveedorCove
    ? [
        domicilioProveedorCove.calle,
        domicilioProveedorCove.numero_exterior,
        domicilioProveedorCove.colonia,
        domicilioProveedorCove.codigo_postal,
        domicilioProveedorCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const validation = {
    name: 'Validación de datos comerciales del proveedor',
    description:
      'Valida que los datos del proveedor (tax ID, domicilio y razón social) coincidan entre el pedimento, COVE y carta 318',
    prompt:
      'Validar que los siguientes campos coincidan entre documentos:\n\nTAX ID: Debe coincidir entre Pedimento, Carta 3.1.8 y COVE.\nDomicilio fiscal: Debe coincidir entre Pedimento, Carta 3.1.8 y Factura.\nRazón social: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y COVE.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. La idea es verificar que el tax id, domicilio y razón social, sea el mismo entre los documentos.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Nombre/Razón social', value: nombreProveedorPedimento },
            { name: 'Domicilio', value: domicilioProveedorPedimento },
            { name: 'ID Fiscal', value: pedimento.id_fiscal },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        COVE: {
          data: [
            { name: 'Nombre/Razón social', value: nombreProveedorCove },
            { name: 'Domicilio', value: domicilioProveedorCoveCompleto },
            { name: 'ID Fiscal', value: idProveedorCove },
          ],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateFechasYFolios(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  invoice?: Invoice,
  carta318?: Carta318
) {
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const fechaExpedicionCove = cove?.fecha_expedicion;

  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const validation = {
    name: 'Validación de fechas de emisión',
    description:
      'Valida que las fechas de emisión de los documentos sean consistentes',
    prompt:
      'Verificar secuencias lógicas\n\nFechas:\n• Fecha emisión Factura debe ser menor o igual a la Fecha entrada Pedimento\n• Fecha COVE debe ser igual a la Fecha Factura\n\n• Las facturas normalmente vienen en formato americano, YYYY/MM/DD, el pedimento y COVE viene en formato mexicano, DD/MM/YYYY, siempre revisa detalladamente los documentos propocionados',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Fecha de entrada', value: fechaEntradaPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        COVE: {
          data: [{ name: 'Fecha de expedición', value: fechaExpedicionCove }],
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

async function validateMonedaYEquivalencia(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  carta318?: Carta318,
  invoice?: Invoice
) {
  const monedaPedimento = pedimento.datos_factura?.moneda_factura;
  const monedaCove = cove?.datos_mercancia?.[0]?.tipo_moneda;
  const valorDolaresPedimento = pedimento.datos_factura?.valor_dolares_factura;
  const valorDolaresCoveTotal = cove?.datos_mercancia?.reduce(
    (sum, item) => sum + (item?.valor_total_dolares || 0),
    0
  );
  const valorFactura = pedimento.datos_factura?.valor_moneda_factura;
  const factorMonedaFactura = pedimento.datos_factura?.factor_moneda_factura;
  const fechaEntrada = pedimento.fecha_entrada_presentacion;

  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;

  const factorDof = 1;
  const tipoCambioDOF = await getExchangeRate(
    new Date(fechaEntrada ?? new Date())
  );

  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const validation = {
    name: 'Validación de moneda y factor de equivalencia',
    description:
      'Valida que la moneda y los valores declarados coincidan entre los documentos y que el factor de conversión sea correcto',
    prompt:
      'Validar los siguientes aspectos:\n\nMoneda:\n• La moneda declarada debe coincidir entre:\n  - Factura\n  - COVE\n  - Carta 3.1.8\n\nCálculo en USD:\n• El valor en dólares del pedimento debe ser igual a:\n  - Valor de Factura multiplicado por Factor DOF\n• Se permite una tolerancia máxima de ±0.5%\n\nFactor DOF:\n• Debe corresponder al tipo de cambio publicado el día de la fecha de emisión de la Factura',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Moneda', value: monedaPedimento },
            { name: 'Valor en dólares', value: valorDolaresPedimento },
            { name: 'Valor factura', value: valorFactura },
            { name: 'Factor moneda factura', value: factorMonedaFactura },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        COVE: {
          data: [
            { name: 'Moneda', value: monedaCove },
            { name: 'Valor total en dólares', value: valorDolaresCoveTotal },
          ],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
      EXTERNAL: {
        'Tipo de cambio DOF': {
          data: [
            { name: 'Factor DOF', value: factorDof },
            { name: 'Tipo de cambio DOF', value: tipoCambioDOF },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

export const tracedDatosDeFactura = traceable(
  async ({
    pedimento,
    cove,
    carta318,
    invoice,
    cartaSesion,
    traceId,
  }: {
    pedimento: Pedimento;
    cove: Cove;
    carta318?: Carta318;
    invoice?: Invoice;
    cartaSesion?: CartaSesion;
    traceId: string;
  }) => {
    const validationsPromise = await Promise.all([
      validateRfcFormat(traceId, pedimento, cove, carta318),
      validateCesionDerechos(traceId, pedimento, cartaSesion, carta318),
      validateDatosImportador(traceId, pedimento, cove, carta318),
      validateDatosProveedor(traceId, pedimento, cove, carta318),
      validateFechasYFolios(traceId, pedimento, cove, invoice, carta318),
      validateMonedaYEquivalencia(traceId, pedimento, cove, carta318, invoice),
    ]);

    return {
      sectionName: 'Datos de factura',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S6: Datos de factura' }
);
