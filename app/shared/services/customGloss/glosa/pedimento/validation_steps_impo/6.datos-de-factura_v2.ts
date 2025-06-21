import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Cove } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';
import { getExchangeRate } from '../../exchange-rate';
import { getCurrencyEquivalenceFactor } from '../../gsmartcode';

// Helper function to get Spanish month name
const getSpanishMonth = (date: Date): string => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[date.getMonth()] ?? 'Enero';
};

async function processSingleFactura({
  pedimento,
  cove,
  factura,
  tipoCambioDOF,
  carta318,
  invoice,
  cartaSesion,
  traceId,
}: {
  pedimento: Pedimento;
  cove: Cove;
  factura: any;
  tipoCambioDOF: number;
  carta318?: OCR;
  invoice?: OCR;
  cartaSesion?: OCR;
  traceId: string;
}) {
  // Extract importador data
  const rfcPedimento = pedimento.encabezadoPrincipalDelPedimento.datosImportador.rfc;
  const rfcCove = cove?.datosGeneralesDelDestinatario?.taxIdSinTaxIdRfcCurp;
  const domicilioPedimento = pedimento.encabezadoPrincipalDelPedimento.datosImportador.domicilio;
  const razonSocialPedimento = pedimento.encabezadoPrincipalDelPedimento.datosImportador.razonSocial;
  const razonSocialCove = cove?.datosGeneralesDelDestinatario.nombresORazonSocial;
  
  // Extract proveedor data
  const nombreProveedorPedimento = pedimento.datosDelProveedorOComprador[0]?.nombreRazonSocial;
  const nombreProveedorCove = cove?.datosGeneralesDelProveedor.nombresORazonSocial;
  const domicilioProveedorPedimento = pedimento.datosDelProveedorOComprador[0]?.domicilio;
  const idProveedorCove = cove?.datosGeneralesDelProveedor?.taxIdSinTaxIdRfcCurp;
  
  // Build COVE addresses
  const domicilioCove = cove?.domicilioDelDestinatario;
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
      ].filter(Boolean).join(' ')
    : '';
    
  const domicilioProveedorCove = cove?.domicilioDelProveedor;
  const domicilioProveedorCoveCompleto = domicilioProveedorCove
    ? [
        domicilioProveedorCove.calle,
        domicilioProveedorCove.numeroExterior,
        domicilioProveedorCove.colonia,
        domicilioProveedorCove.codigoPostal,
        domicilioProveedorCove.pais,
      ].filter(Boolean).join(' ')
    : '';
  
  // Extract dates and other data
  const fechaEntradaPedimento = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const fechaExpedicionCove = cove?.datosDelAcuseDeValor.fechaExpedicion;
  const observaciones = pedimento.observacionesANivelPedimento;
  
  // Extract factura specific data
  const numeroFactura = factura?.numeroDeCFDIODocumentoEquivalente;
  const fechaFactura = factura?.fecha;
  const monedaPedimento = factura?.moneda;
  const valorDolaresPedimento = factura?.valorDolares;
  const valorFactura = factura?.valorMoneda;
  const factorMonedaFactura = factura?.factorMoneda;
  
  // Get currency data from COVE
  const monedaCove = cove?.mercancias[0]?.datosDeLaMercancia?.tipoMoneda;
  const valorDolaresCoveTotal = cove?.mercancias?.reduce(
    (sum, item) => sum + (item?.datosDeLaMercancia?.valorTotalEnDolares || 0),
    0
  );
  
  // Get currency equivalence factor if needed
  const supportedExchangeRateCurrencies = ['USD', 'EUR', 'GBP'];
  let factorEquivalencia: number | null = null;
  
  if (factura?.moneda && !supportedExchangeRateCurrencies.includes(factura.moneda)) {
    const facturaDate = factura?.fecha ? new Date(factura.fecha) : new Date(fechaEntradaPedimento ?? new Date());
    const monthSpanish = getSpanishMonth(facturaDate);
    const year = facturaDate.getFullYear().toString();
    
    try {
      const currencyEquivalence = await getCurrencyEquivalenceFactor({
        currencyCode: factura.moneda,
        month: monthSpanish,
        year: year,
      });
      factorEquivalencia = currencyEquivalence?.equivalenceFactor || null;
    } catch (error) {
      console.warn(`Error fetching currency equivalence for ${factura.moneda}:`, error);
      factorEquivalencia = null;
    }
  }
  
  // Extract markdown representations
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const cartaSesionmkdown = cartaSesion?.markdown_representation;

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: `Datos de factura ${numeroFactura}`,
    sectionPromptName: 'glosa/pedimento/impo/06-datos-factura',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Número de factura', value: numeroFactura },
            { name: 'RFC importador', value: rfcPedimento },
            { name: 'Domicilio importador', value: domicilioPedimento },
            { name: 'Razón social importador', value: razonSocialPedimento },
            { name: 'Nombre proveedor', value: nombreProveedorPedimento },
            { name: 'Domicilio proveedor', value: domicilioProveedorPedimento },
            { name: 'ID fiscal proveedor', value: pedimento.datosDelProveedorOComprador[0]?.idFiscal },
            { name: 'Fecha de entrada', value: fechaEntradaPedimento },
            { name: 'Fecha factura', value: fechaFactura },
            { name: 'Moneda', value: monedaPedimento },
            { name: 'Valor en dólares', value: valorDolaresPedimento },
            { name: 'Valor factura', value: valorFactura },
            { name: 'Factor moneda factura', value: factorMonedaFactura },
            { name: 'Observaciones', value: observaciones },
          ]
        },
        cove: {
          data: [
            { name: 'RFC destinatario', value: rfcCove },
            { name: 'Domicilio destinatario', value: domicilioCoveCompleto },
            { name: 'Razón social destinatario', value: razonSocialCove },
            { name: 'Nombre proveedor', value: nombreProveedorCove },
            { name: 'Domicilio proveedor', value: domicilioProveedorCoveCompleto },
            { name: 'ID fiscal proveedor', value: idProveedorCove },
            { name: 'Fecha expedición', value: fechaExpedicionCove },
            { name: 'Moneda', value: monedaCove },
            { name: 'Valor total en dólares', value: valorDolaresCoveTotal },
          ]
        },
        ...(carta318 ? {
          'carta-318': {
            data: [
              { name: 'Carta 318', value: carta318mkdown },
              { name: 'Existe carta 3.1.8', value: true },
            ]
          }
        } : {}),
        ...(invoice ? {
          factura: {
            data: [
              { name: 'Factura', value: invoicemkdown },
            ]
          }
        } : {}),
        ...(cartaSesion ? {
          'carta-sesion': {
            data: [
              { name: 'Carta sesión', value: cartaSesionmkdown },
              { name: 'Existe cesión de derechos', value: true },
            ]
          }
        } : {})
      },
      EXTERNAL: {
        'factores-conversion': {
          data: [
            { name: 'Factor de equivalencia moneda (GSmartCode)', value: factorEquivalencia },
            { name: 'Tipo de cambio DOF (respaldo)', value: tipoCambioDOF },
          ]
        }
      }
    }
  };

  try {
    const result = await performSectionValidation(sectionInput, traceId, 'o3-mini');
    
    return {
      sectionName: result.sectionName,
      validations: result.validations,
    };
  } catch (error) {
    console.error('Error in section validation:', error);
    
    return {
      sectionName: `Datos de factura ${numeroFactura}`,
      validations: [{
        name: 'Error de validación',
        description: 'Error al realizar la validación de la sección',
        result: {
          isValid: false,
          description: `Error al validar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          summary: 'Error en el proceso de validación',
          contextSummary: 'No se pudo completar la validación',
          actionsToTake: ['Revisar logs del sistema', 'Contactar soporte técnico'],
        },
        contexts: sectionInput.contexts,
      }],
    };
  }
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
  // Get all invoices from pedimento
  const facturas = pedimento.datosDelProveedorOComprador[0]?.facturas || [];
  
  if (facturas.length === 0) {
    return {
      sectionName: 'Datos de factura',
      validations: [],
    };
  }

  // Get exchange rate ONCE for all invoices
  const fechaEntrada = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const exchangeRateResult = await getExchangeRate(
    new Date(fechaEntrada ?? new Date())
  );
  
  // If error getting exchange rate, use default and continue
  const tipoCambioDOF = exchangeRateResult.isOk() 
    ? parseFloat(exchangeRateResult.value) 
    : 20.0;

  // Process each invoice individually
  const facturaValidationsPromises = facturas.map(async (factura) => {
    return processSingleFactura({
      pedimento,
      cove,
      factura,
      tipoCambioDOF,
      carta318,
      invoice,
      cartaSesion,
      traceId,
    });
  });

  // Parallelize processing of all invoices
  const allFacturaValidations = await Promise.all(facturaValidationsPromises);
  
  return allFacturaValidations;
}