import type { OCR } from '~/lib/utils';
import type {
  CFDI,
  Cove,
  Pedimento,
} from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

async function validateRfcFormat(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  facturaIndex: number,
  cfdi?: CFDI
) {
  // Extract RFC values from documents
  const rfcPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.rfc;
  // Se supone que este valor siempre es el RFC en la exportación
  const rfcCove = cove?.datosGeneralesDelDestinatario?.taxIdSinTaxIdRfcCurp;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const validation = {
    name: 'Validación de los RFC',
    description:
      'Verificación del formato correcto de los RFC y su consistencia entre los diferentes documentos aduaneros',
    prompt:
      'Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Existencia real:\n• Consultar el RFC ante el SAT (servicio web)\n\n3. Consistencia entre documentos:\n• RFC del importador debe ser idéntico en Pedimento, COVE y Carta 3.1.8\n• Si hay Cesión de Derechos, el RFC de la comercializadora debe coincidir con el RFC del importador en la Carta 3.1.8',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'RFC', value: rfcPedimento },
            { name: 'Número de factura', value: numeroFactura },
          ],
        },
        cove: {
          data: [{ name: 'RFC destinatario', value: rfcCove }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateCesionDerechos(
  traceId: string,
  pedimento: Pedimento,
  facturaIndex: number,
  cartaSesion?: OCR,
  cfdi?: CFDI
) {
  // Extract values from documents
  const fechaEntradaPedimento =
    pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const cartaSesionMkdown = cartaSesion?.markdown_representation;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const validation = {
    name: 'Validación de cesión de derechos y carta 3.1.8',
    description:
      'Verificación de la consistencia entre la cesión de derechos y la carta 3.1.8, incluyendo RFC y fechas de emisión',
    prompt:
      'Si existe Cesión de Derechos:\n\nComparar:\n• RFC comercializadora vs. RFC importador en Carta 3.1.8\n• Fecha de emisión de la Cesión debe ser anterior a Fecha de entrada del Pedimento\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Fecha de entrada', value: fechaEntradaPedimento },
            { name: 'Número de factura', value: numeroFactura },
          ],
        },
        cesionDeDerechos: {
          data: [{ name: 'Cesión de derechos', value: cartaSesionMkdown }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateDatosImportador(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  facturaIndex: number,
  cfdi?: CFDI
) {
  // Extract values from documents
  const rfcPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.rfc;
  // Se supone que este valor siempre es el RFC en la exportación
  const rfcCove = cove?.datosGeneralesDelDestinatario?.taxIdSinTaxIdRfcCurp;

  const domicilioPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.domicilio;
  const domicilioCove = cove.domicilioDelDestinatario;
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numeroExterior,
        domicilioCove.colonia,
        domicilioCove.codigoPostal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const razonSocialPedimento =
    pedimento.encabezadoPrincipalDelPedimento.datosImportador.razonSocial;
  const razonSocialCove =
    cove.datosGeneralesDelDestinatario.nombresORazonSocial;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const validation = {
    name: 'Validación de datos del exportador',
    description:
      'Verificación de la coincidencia de RFC, domicilio fiscal y razón social del exportador entre el pedimento, CFDI y COVE',
    prompt:
      'Validar que los siguientes campos coincidan literalmente entre documentos:\n\n• RFC: Debe coincidir entre Pedimento, CFDI y COVE (considerando exportador y comprador en exportación)\n• Domicilio fiscal: Debe coincidir entre Pedimento y CFDI para el exportador\n• Razón social: Debe coincidir entre Pedimento, CFDI y COVE',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'RFC', value: rfcPedimento },
            { name: 'Domicilio', value: domicilioPedimento },
            { name: 'Razón social', value: razonSocialPedimento },
            { name: 'Número de factura', value: numeroFactura },
          ],
        },
        cove: {
          data: [
            { name: 'RFC', value: rfcCove },
            { name: 'Domicilio', value: domicilioCoveCompleto },
            { name: 'Razón social', value: razonSocialCove },
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

async function validateDatosProveedor(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  facturaIndex: number,
  cfdi?: CFDI
) {
  // Extract values from documents
  const nombreProveedorPedimento =
    pedimento.datosDelProveedorOComprador[0]?.nombreRazonSocial;
  const nombreProveedorCove =
    cove?.datosGeneralesDelProveedor.nombresORazonSocial;

  const domicilioProveedorPedimento =
    pedimento.datosDelProveedorOComprador[0]?.domicilio;
  const domicilioProveedorCove = cove.domicilioDelProveedor;
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

  const idProveedorPedimento =
    pedimento.datosDelProveedorOComprador[0]?.idFiscal;
  // Se supone que este valor siempre es el RFC en la exportación
  const idProveedorCove =
    cove?.datosGeneralesDelProveedor?.taxIdSinTaxIdRfcCurp;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  const validation = {
    name: 'Validación de datos comerciales del comprador',
    description:
      'Verificación de la coincidencia del valor comercial y datos de facturación entre el pedimento y el CFDI',
    prompt:
      'Validar lo siguiente:\n\n• El valor comercial del pedimento debe ser exactamente el valor indicado en el CFDI (emitido en pesos mexicanos).\n• Los datos de facturación (número de folio fiscal del CFDI) deben coincidir entre Pedimento y CFDI.\n• Si se utiliza información de comercializadora, esta debe coincidir con la indicada en la cesión de derechos.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Nombre/Razón social', value: nombreProveedorPedimento },
            { name: 'Domicilio', value: domicilioProveedorPedimento },
            { name: 'ID Fiscal', value: idProveedorPedimento },
            { name: 'Número de factura', value: numeroFactura },
          ],
        },
        cove: {
          data: [
            { name: 'Nombre/Razón social', value: nombreProveedorCove },
            { name: 'Domicilio', value: domicilioProveedorCoveCompleto },
            { name: 'ID Fiscal', value: idProveedorCove },
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

async function validateFechasYFolios(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  facturaIndex: number,
  cfdi?: CFDI
) {
  // Extract values from documents
  const fechaEntradaPedimento =
    pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const fechaExpedicionCove = cove?.datosDelAcuseDeValor.fechaExpedicion;

  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  const numeroCovePedimento = factura?.numeroDeCFDIODocumentoEquivalente;
  const fechaFactura = factura?.fecha;
  const numeroCove = cove?.datosDelAcuseDeValor.numeroDeFactura;

  const validation = {
    name: 'Validación de fechas de emisión, números de folio y COVE',
    description:
      'Verificación de la consistencia entre fechas de emisión de documentos, folios fiscales y números de COVE',
    prompt:
      'Verificar que:\n\n• La fecha de emisión del CFDI sea menor o igual a la fecha de presentación ante aduana (fecha de entrada en expo).\n• La fecha del COVE coincida con la fecha del CFDI.\n• El número (folio fiscal) del CFDI sea único y coincida en Pedimento y en el documento COVE.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Fecha de entrada', value: fechaEntradaPedimento },
            { name: 'Número de COVE', value: numeroCovePedimento },
            { name: 'Fecha factura pedimento', value: fechaFactura },
          ],
        },
        cove: {
          data: [
            { name: 'Fecha de expedición', value: fechaExpedicionCove },
            { name: 'Número de COVE', value: numeroCove },
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

async function validateMonedaYEquivalencia(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  facturaIndex: number,
  tipoCambioDOF: number,
  cfdi?: CFDI
) {
  const factura = pedimento.datosDelProveedorOComprador[0]?.facturas[facturaIndex];
  // Moneda
  const monedaPedimento = factura?.moneda;
  const valorDolaresPedimento = factura?.valorDolares;
  const valorFactura = factura?.valorMoneda;
  const factorMonedaFactura = factura?.factorMoneda;
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;

  // TODO: Do this in a loop, instead of just checking the first mercancia
  const monedaCove = cove.mercancias[0]?.datosDeLaMercancia?.tipoMoneda;
  const valorDolaresCove =
    cove.mercancias[0]?.datosDeLaMercancia?.valorTotalEnDolares;

  // Valores DOF
  const factorDof = 1.5;

  const validation = {
    name: 'Validación de moneda y factor de equivalencia',
    description:
      'Verificación de la moneda utilizada en el CFDI, su coincidencia con el COVE y la correcta conversión a dólares',
    prompt:
      'Validar los siguientes aspectos:\n\n• En exportación, el CFDI debe emitirse en pesos mexicanos y la moneda declarada en el COVE debe coincidir.\n\n• Para obtener el valor en dólares, se debe dividir el valor comercial (de la factura en pesos) entre el tipo de cambio correspondiente al día anterior a la presentación ante aduana.\n\n• Se permite una tolerancia máxima de ±0.5% en esta conversión.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Moneda', value: monedaPedimento },
            { name: 'Valor en dólares', value: valorDolaresPedimento },
            { name: 'Valor factura', value: valorFactura },
            { name: 'Factor moneda factura', value: factorMonedaFactura },
            { name: 'Número de factura', value: numeroFactura },
          ],
        },
        cove: {
          data: [
            { name: 'Moneda', value: monedaCove },
            { name: 'Valor en dólares', value: valorDolaresCove },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
      EXTERNAL: {
        DOF: {
          data: [
            { name: 'Factor DOF', value: factorDof },
            { name: 'Tipo de cambio DOF', value: tipoCambioDOF },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function datosDeFactura({
  pedimento,
  cove,
  cfdi,
  cartaSesion,
  traceId,
}: {
  pedimento: Pedimento;
  cove: Cove;
  cfdi?: CFDI;
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

  // Procesar cada factura individualmente
  const facturaValidationsPromises = facturas.map(async (_, facturaIndex) => {
    const validationsPromise = await Promise.all([
      validateRfcFormat(traceId, pedimento, cove, facturaIndex, cfdi),
      validateCesionDerechos(traceId, pedimento, facturaIndex, cartaSesion, cfdi),
      validateDatosImportador(traceId, pedimento, cove, facturaIndex, cfdi),
      validateDatosProveedor(traceId, pedimento, cove, facturaIndex, cfdi),
      validateFechasYFolios(traceId, pedimento, cove, facturaIndex, cfdi),
      validateMonedaYEquivalencia(traceId, pedimento, cove, facturaIndex, 17.1234, cfdi), // Usando valor estático para expo
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
