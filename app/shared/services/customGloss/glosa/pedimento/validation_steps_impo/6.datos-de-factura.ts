import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { getExchangeRate } from '../../exchange-rate';
import { glosar } from '../../validation-result';

async function validateRfcFormat(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  facturaIndex: number,
  carta318?: OCR
) {
  const rfcPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.rfc;
  const rfcCove = cove?.datosGeneralesDelDestinatario?.taxIdSinTaxIdRfcCurp;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observacionesANivelPedimento;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const validation = {
    name: 'RFC',
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
            { name: 'Número de factura', value: numeroFactura },
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
  facturaIndex: number,
  cartaSesion?: OCR,
  carta318?: OCR
) {
  const fechaEntradaPedimento =
    pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const cartaSesionmkdown = cartaSesion?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observacionesANivelPedimento;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const validation = {
    name: 'Cesión de derechos',
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
            { name: 'Número de factura', value: numeroFactura },
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
  facturaIndex: number,
  carta318?: OCR
) {
  const rfcPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.rfc;
  const rfcCove = cove?.datosGeneralesDelDestinatario?.taxIdSinTaxIdRfcCurp;
  const domicilioPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.domicilio;
  const domicilioCove = cove?.domicilioDelDestinatario;
  const razonSocialPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.razonSocial;
  const razonSocialCove =
    cove?.datosGeneralesDelDestinatario.nombresORazonSocial;

  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observacionesANivelPedimento;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numeroExterior,
        domicilioCove.numeroInterior,
        domicilioCove.colonia,
        domicilioCove.localidad,
        domicilioCove.municipio,
        domicilioCove.entidadFederativa,
        domicilioCove.codigoPostal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const validation = {
    name: 'Datos importador',
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
            { name: 'Número de factura', value: numeroFactura },
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
  facturaIndex: number,
  carta318?: OCR
) {
  const nombreProveedorPedimento =
    pedimento.datosDelProveedorOComprador[0]?.nombreRazonSocial;
  const nombreProveedorCove =
    cove?.datosGeneralesDelProveedor.nombresORazonSocial;
  const domicilioProveedorPedimento =
    pedimento.datosDelProveedorOComprador[0]?.domicilio;
  const domicilioProveedorCove = cove?.domicilioDelProveedor;
  const idProveedorCove =
    cove?.datosGeneralesDelProveedor?.taxIdSinTaxIdRfcCurp;

  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observacionesANivelPedimento;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const domicilioProveedorCoveCompleto = domicilioProveedorCove
    ? [
        domicilioProveedorCove.calle,
        domicilioProveedorCove.numeroExterior,
        domicilioProveedorCove.colonia,
        domicilioProveedorCove.codigoPostal,
        domicilioProveedorCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const validation = {
    name: 'Datos proveedor',
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
            {
              name: 'ID Fiscal',
              value: pedimento.datosDelProveedorOComprador[0]?.idFiscal,
            },
            { name: 'Observaciones', value: observaciones },
            { name: 'Número de factura', value: numeroFactura },
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
  facturaIndex: number,
  invoice?: OCR,
  carta318?: OCR
) {
  const fechaEntradaPedimento =
    pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const fechaExpedicionCove = cove?.datosDelAcuseDeValor.fechaExpedicion;

  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observacionesANivelPedimento;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;
  const fechaFactura = factura?.fecha;

  const validation = {
    name: 'Fechas de emisión',
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
            { name: 'Número de factura', value: numeroFactura },
            { name: 'Fecha factura pedimento', value: fechaFactura },
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
  facturaIndex: number,
  tipoCambioDOF: number,
  carta318?: OCR,
  invoice?: OCR
) {
  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const monedaPedimento = factura?.moneda;
  const valorDolaresPedimento = factura?.valorDolares;
  const valorFactura = factura?.valorMoneda;
  const factorMonedaFactura = factura?.factorMoneda;
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  // TODO: Do this in a loop, instead of just checking the first mercancia
  const monedaCove = cove?.mercancias[0]?.datosDeLaMercancia?.tipoMoneda;
  const valorDolaresCoveTotal = cove?.mercancias?.reduce(
    (sum, item) => sum + (item?.datosDeLaMercancia?.valorTotalEnDolares || 0),
    0
  );

  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;

  const factorDof = 1;

  const observaciones = pedimento.observacionesANivelPedimento;

  const validation = {
    name: 'Moneda y factor de equivalencia',
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
            { name: 'Número de factura', value: numeroFactura },
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

export async function datosDeFactura({
  pedimento,
  cove,
  carta318,
  invoice,
  cartaSesion,
  traceId,
}: {
  pedimento: Pedimento;
  cove: Cove;
  carta318?: OCR;
  invoice?: OCR;
  cartaSesion?: OCR;
  traceId: string;
}) {
  // Obtener todas las facturas del pedimento
  const facturas = pedimento.datosDelProveedorOComprador[0]?.facturas || [];
  
  if (facturas.length === 0) {
    return {
      sectionName: 'Datos de factura',
      validations: [],
    };
  }

  // Obtener el tipo de cambio UNA SOLA VEZ para todas las facturas
  const fechaEntrada = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const exchangeRateResult = await getExchangeRate(
    new Date(fechaEntrada ?? new Date())
  );
  
  // Si hay error obteniendo el tipo de cambio, usar un valor por defecto y continuar
  const tipoCambioDOF = exchangeRateResult.isOk() 
    ? parseFloat(exchangeRateResult.value) 
    : 20.0; // Valor por defecto en caso de error

  // Procesar cada factura individualmente
  const facturaValidationsPromises = facturas.map(async (_, facturaIndex) => {
    const validationsPromise = await Promise.all([
      validateRfcFormat(traceId, pedimento, cove, facturaIndex, carta318),
      validateCesionDerechos(traceId, pedimento, facturaIndex, cartaSesion, carta318),
      validateDatosImportador(traceId, pedimento, cove, facturaIndex, carta318),
      validateDatosProveedor(traceId, pedimento, cove, facturaIndex, carta318),
      validateFechasYFolios(traceId, pedimento, cove, facturaIndex, invoice, carta318),
      validateMonedaYEquivalencia(traceId, pedimento, cove, facturaIndex, tipoCambioDOF, carta318, invoice),
    ]);

    const numeroFactura = facturas[facturaIndex]?.numeroDeCFDIODocumentoEquivalente || `${facturaIndex + 1}`;
    
    return {
      sectionName: `Datos de factura ${numeroFactura}`,
      validations: validationsPromise,
    };
  });

  // Paralelizar el procesamiento de todas las facturas
  const allFacturaValidations = await Promise.all(facturaValidationsPromises);
  
  return allFacturaValidations;
}


