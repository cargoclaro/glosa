import { CustomGlossTabContextType } from '@prisma/client';
import { traceable } from 'langsmith/traceable';
import type {
  CartaSesion,
  Cfdi,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove, Pedimento } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

async function validateRfcFormat(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  cfdi?: Cfdi
) {
  // Extract RFC values from documents
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Validación de los RFC',
    description:
      'Verificación del formato correcto de los RFC y su consistencia entre los diferentes documentos aduaneros',
    prompt:
      'Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Existencia real:\n• Consultar el RFC ante el SAT (servicio web)\n\n3. Consistencia entre documentos:\n• RFC del importador debe ser idéntico en Pedimento, COVE y Carta 3.1.8\n• Si hay Cesión de Derechos, el RFC de la comercializadora debe coincidir con el RFC del importador en la Carta 3.1.8',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'RFC', value: rfcPedimento }],
        },
        cove: {
          data: [{ name: 'RFC destinatario', value: rfcCove }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateCesionDerechos(
  traceId: string,
  pedimento: Pedimento,
  cartaSesion?: CartaSesion,
  cfdi?: Cfdi
) {
  // Extract values from documents
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const cfdiMkdown = cfdi?.markdown_representation;
  const cartaSesionMkdown = cartaSesion?.markdown_representation;

  const validation = {
    name: 'Validación de cesión de derechos y carta 3.1.8',
    description:
      'Verificación de la consistencia entre la cesión de derechos y la carta 3.1.8, incluyendo RFC y fechas de emisión',
    prompt:
      'Si existe Cesión de Derechos:\n\nComparar:\n• RFC comercializadora vs. RFC importador en Carta 3.1.8\n• Fecha de emisión de la Cesión debe ser anterior a Fecha de entrada del Pedimento\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: 'Fecha de entrada', value: fechaEntradaPedimento }],
        },
        cesionDeDerechos: {
          data: [{ name: 'Cesión de derechos', value: cartaSesionMkdown }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
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
  cfdi?: Cfdi
) {
  // Extract values from documents
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;

  const domicilioPedimento = pedimento.datos_importador?.domicilio;
  const domicilioCove = cove?.datos_generales_destinatario?.domicilio;
  const domicilioCoveCompleto = domicilioCove
    ? [
        domicilioCove.calle,
        domicilioCove.numero_exterior,
        domicilioCove.colonia,
        domicilioCove.codigo_postal,
        domicilioCove.pais,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  const razonSocialPedimento = pedimento.datos_importador?.razon_social;
  const razonSocialCove =
    cove?.datos_generales_destinatario?.nombre_razon_social;

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Validación de datos del exportador',
    description:
      'Verificación de la coincidencia de RFC, domicilio fiscal y razón social del exportador entre el pedimento, CFDI y COVE',
    prompt:
      'Validar que los siguientes campos coincidan literalmente entre documentos:\n\n• RFC: Debe coincidir entre Pedimento, CFDI y COVE (considerando exportador y comprador en exportación)\n• Domicilio fiscal: Debe coincidir entre Pedimento y CFDI para el exportador\n• Razón social: Debe coincidir entre Pedimento, CFDI y COVE',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'RFC', value: rfcPedimento },
            { name: 'Domicilio', value: domicilioPedimento },
            { name: 'Razón social', value: razonSocialPedimento },
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
          data: [{ name: 'CFDI', value: cfdiMkdown }],
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
  cfdi?: Cfdi
) {
  // Extract values from documents
  const nombreProveedorPedimento = pedimento.nombre_razon_social;
  const nombreProveedorCove =
    cove?.datos_generales_proveedor?.nombre_razon_social;

  const domicilioProveedorPedimento = pedimento.domicilio;
  const domicilioProveedorCove = cove?.datos_generales_proveedor?.domicilio;
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

  const idProveedorPedimento = pedimento.id_fiscal;
  const idProveedorCove = cove?.datos_generales_proveedor?.identificador;

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Validación de datos comerciales del comprador',
    description:
      'Verificación de la coincidencia del valor comercial y datos de facturación entre el pedimento y el CFDI',
    prompt:
      'Validar lo siguiente:\n\n• El valor comercial del pedimento debe ser exactamente el valor indicado en el CFDI (emitido en pesos mexicanos).\n• Los datos de facturación (número de folio fiscal del CFDI) deben coincidir entre Pedimento y CFDI.\n• Si se utiliza información de comercializadora, esta debe coincidir con la indicada en la cesión de derechos.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Nombre/Razón social', value: nombreProveedorPedimento },
            { name: 'Domicilio', value: domicilioProveedorPedimento },
            { name: 'ID Fiscal', value: idProveedorPedimento },
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
          data: [{ name: 'CFDI', value: cfdiMkdown }],
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
  cfdi?: Cfdi
) {
  // Extract values from documents
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const fechaExpedicionCove = cove?.fecha_expedicion;

  const numeroCovePedimento = pedimento.cove;
  const numeroCove = cove?.acuse_valor;

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Validación de fechas de emisión, números de folio y COVE',
    description:
      'Verificación de la consistencia entre fechas de emisión de documentos, folios fiscales y números de COVE',
    prompt:
      'Verificar que:\n\n• La fecha de emisión del CFDI sea menor o igual a la fecha de presentación ante aduana (fecha de entrada en expo).\n• La fecha del COVE coincida con la fecha del CFDI.\n• El número (folio fiscal) del CFDI sea único y coincida en Pedimento y en el documento COVE.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Fecha de entrada', value: fechaEntradaPedimento },
            { name: 'Número de COVE', value: numeroCovePedimento },
          ],
        },
        cove: {
          data: [
            { name: 'Fecha de expedición', value: fechaExpedicionCove },
            { name: 'Número de COVE', value: numeroCove },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
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
  cfdi?: Cfdi
) {
  // Moneda
  const monedaPedimento = pedimento.datos_factura?.[0]?.moneda_factura;
  const monedaCove = cove?.datos_mercancia?.[0]?.tipo_moneda;

  // Valores DOF
  const factorDof = 1.5;
  const tipoCambioDOF = 17.1234;

  // Extract values from documents
  const valorDolaresPedimento =
    pedimento.datos_factura?.[0]?.valor_dolares_factura;
  const valorDolaresCove = cove?.datos_mercancia?.[0]?.valor_total_dolares;

  // Valor factura from pedimento:
  const valorFactura = pedimento.datos_factura?.[0]?.valor_moneda_factura;
  const factorMonedaFactura =
    pedimento.datos_factura?.[0]?.factor_moneda_factura;

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Validación de moneda y factor de equivalencia',
    description:
      'Verificación de la moneda utilizada en el CFDI, su coincidencia con el COVE y la correcta conversión a dólares',
    prompt:
      'Validar los siguientes aspectos:\n\n• En exportación, el CFDI debe emitirse en pesos mexicanos y la moneda declarada en el COVE debe coincidir.\n\n• Para obtener el valor en dólares, se debe dividir el valor comercial (de la factura en pesos) entre el tipo de cambio correspondiente al día anterior a la presentación ante aduana.\n\n• Se permite una tolerancia máxima de ±0.5% en esta conversión.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Moneda', value: monedaPedimento },
            { name: 'Valor en dólares', value: valorDolaresPedimento },
            { name: 'Valor factura', value: valorFactura },
            { name: 'Factor moneda factura', value: factorMonedaFactura },
          ],
        },
        cove: {
          data: [
            { name: 'Moneda', value: monedaCove },
            { name: 'Valor en dólares', value: valorDolaresCove },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
      [CustomGlossTabContextType.EXTERNAL]: {
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

export const tracedRfcFormat = traceable(
  async ({
    pedimento,
    cove,
    cfdi,
    cartaSesion,
    traceId,
  }: {
    pedimento: Pedimento;
    cove: Cove;
    cfdi?: Cfdi;
    cartaSesion?: CartaSesion;
    traceId: string;
  }) => {
    const validationsPromise = await Promise.all([
      validateRfcFormat(traceId, pedimento, cove, cfdi),
      validateCesionDerechos(traceId, pedimento, cartaSesion, cfdi),
      validateDatosImportador(traceId, pedimento, cove, cfdi),
      validateDatosProveedor(traceId, pedimento, cove, cfdi),
      validateFechasYFolios(traceId, pedimento, cove, cfdi),
      validateMonedaYEquivalencia(traceId, pedimento, cove, cfdi),
    ]);

    return {
      sectionName: 'Datos de factura',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S6: Datos de factura' }
);
