import { Pedimento, Cove, CartaSesion, Cfdi } from "../../../data-extraction/schemas";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { traceable } from "langsmith/traceable";

export async function validateRfcFormat(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
  // Extract RFC values from documents
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const rfcCfdi = cfdi?.emisor?.rfc;
  
  const validation = {
    name: "Validación de los RFC",
    description: "Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Existencia real:\n• Consultar el RFC ante el SAT (servicio web)\n\n3. Consistencia entre documentos:\n• RFC del importador debe ser idéntico en Pedimento, COVE y Carta 3.1.8\n• Si hay Cesión de Derechos, el RFC de la comercializadora debe coincidir con el RFC del importador en la Carta 3.1.8",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: "RFC", value: rfcPedimento }]
        },
        cove: {
          data: [{ name: "RFC destinatario", value: rfcCove }]
        },
        cfdi: {
          data: [{ name: "RFC emisor", value: rfcCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateCesionDerechos(pedimento: Pedimento, cartaSesion?: CartaSesion, cfdi?: Cfdi) {
  // Extract values from documents
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const rfcComercializadora = cartaSesion?.assignee?.identification_rfc;
  const rfcExportadorCfdi = cfdi?.emisor?.rfc;
  const fechaEmisionCesion = cartaSesion?.fecha_emision;
  
  const validation = {
    name: "Validación de cesión de derechos y carta 3.1.8",
    description: "Si existe Cesión de Derechos:\n\nComparar:\n• RFC comercializadora vs. RFC importador en Carta 3.1.8\n• Fecha de emisión de la Cesión debe ser anterior a Fecha de entrada del Pedimento\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [{ name: "Fecha de entrada", value: fechaEntradaPedimento }]
        },
        cesionDeDerechos: {
          data: [
            { name: "RFC comercializadora", value: rfcComercializadora },
            { name: "Fecha de emisión", value: fechaEmisionCesion },
            { name: "Existe cesión de derechos", value: !!cartaSesion }
          ]
        },
        cfdi: {
          data: [{ name: "RFC exportador", value: rfcExportadorCfdi }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateDatosImportador(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
  // Extract values from documents
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const rfcCfdi = cfdi?.emisor?.rfc;
  
  const domicilioPedimento = pedimento.datos_importador?.domicilio;
  const domicilioCove = cove?.datos_generales_destinatario?.domicilio;
  const domicilioCoveCompleto = domicilioCove ?
    [
      domicilioCove.calle,
      domicilioCove.numero_exterior,
      domicilioCove.colonia,
      domicilioCove.codigo_postal,
      domicilioCove.pais
    ].filter(Boolean).join(' ') : '';
  const domicilioCfdi = cfdi?.emisor?.domicilio;
  
  const razonSocialPedimento = pedimento.datos_importador?.razon_social;
  const razonSocialCove = cove?.datos_generales_destinatario?.nombre_razon_social;
  const razonSocialCfdi = cfdi?.emisor?.nombre;
  
  const validation = {
    name: "Validación de datos del exportador",
    description: "Validar que los siguientes campos coincidan literalmente entre documentos:\n\n• RFC: Debe coincidir entre Pedimento, CFDI y COVE (considerando exportador y comprador en exportación)\n• Domicilio fiscal: Debe coincidir entre Pedimento y CFDI para el exportador\n• Razón social: Debe coincidir entre Pedimento, CFDI y COVE",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "RFC", value: rfcPedimento },
            { name: "Domicilio", value: domicilioPedimento },
            { name: "Razón social", value: razonSocialPedimento }
          ]
        },
        cove: {
          data: [
            { name: "RFC", value: rfcCove },
            { name: "Domicilio", value: domicilioCoveCompleto },
            { name: "Razón social", value: razonSocialCove }
          ]
        },
        cfdi: {
          data: [
            { name: "RFC", value: rfcCfdi },
            { name: "Domicilio", value: domicilioCfdi },
            { name: "Razón social", value: razonSocialCfdi },
            { name: "Existe CFDI", value: !!cfdi }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateDatosProveedor(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
  // Extract values from documents
  const nombreProveedorPedimento = pedimento.nombre_razon_social;
  const nombreProveedorCove = cove?.datos_generales_proveedor?.nombre_razon_social;
  const nombreProveedorCfdi = cfdi?.receptor?.nombre;
  
  const domicilioProveedorPedimento = pedimento.domicilio;
  const domicilioProveedorCove = cove?.datos_generales_proveedor?.domicilio;
  const domicilioProveedorCoveCompleto = domicilioProveedorCove ?
    [
      domicilioProveedorCove.calle,
      domicilioProveedorCove.numero_exterior,
      domicilioProveedorCove.colonia,
      domicilioProveedorCove.codigo_postal,
      domicilioProveedorCove.pais
    ].filter(Boolean).join(' ') : '';
  const domicilioProveedorCfdi = cfdi?.receptor?.domicilio;
  
  const idProveedorPedimento = pedimento.id_fiscal;
  const idProveedorCove = cove?.datos_generales_proveedor?.identificador;
  const idProveedorCfdi = cfdi?.receptor?.rfc;
  
  const validation = {
    name: "Validación de datos comerciales del comprador",
    description: "Validar lo siguiente:\n\n• El valor comercial del pedimento debe ser exactamente el valor indicado en el CFDI (emitido en pesos mexicanos).\n• Los datos de facturación (número de folio fiscal del CFDI) deben coincidir entre Pedimento y CFDI.\n• Si se utiliza información de comercializadora, esta debe coincidir con la indicada en la cesión de derechos.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Nombre/Razón social", value: nombreProveedorPedimento },
            { name: "Domicilio", value: domicilioProveedorPedimento },
            { name: "ID Fiscal", value: idProveedorPedimento }
          ]
        },
        cove: {
          data: [
            { name: "Nombre/Razón social", value: nombreProveedorCove },
            { name: "Domicilio", value: domicilioProveedorCoveCompleto },
            { name: "ID Fiscal", value: idProveedorCove }
          ]
        },
        cfdi: {
          data: [
            { name: "Nombre/Razón social", value: nombreProveedorCfdi },
            { name: "Domicilio", value: domicilioProveedorCfdi },
            { name: "RFC", value: idProveedorCfdi },
            { name: "Existe CFDI", value: !!cfdi }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateFechasYFolios(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
  // Extract values from documents
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const fechaExpedicionCove = cove?.fecha_expedicion;
  const fechaExpedicionCfdi = cfdi?.fecha_emision;
  
  const numeroCovePedimento = pedimento.cove;
  const numeroCove = cove?.acuse_valor;
  
  // Para CFDI necesitamos el folio fiscal
  const numeroFolioCfdi = cfdi?.folio_fiscal;

  const validation = {
    name: "Validación de fechas de emisión, números de folio y COVE",
    description: "Verificar que:\n\n• La fecha de emisión del CFDI sea menor o igual a la fecha de presentación ante aduana (fecha de entrada en expo).\n• La fecha del COVE coincida con la fecha del CFDI.\n• El número (folio fiscal) del CFDI sea único y coincida en Pedimento y en el documento COVE.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Fecha de entrada", value: fechaEntradaPedimento },
            { name: "Número de COVE", value: numeroCovePedimento }
          ]
        },
        cove: {
          data: [
            { name: "Fecha de expedición", value: fechaExpedicionCove },
            { name: "Número de COVE", value: numeroCove }
          ]
        },
        cfdi: {
          data: [
            { name: "Fecha de expedición", value: fechaExpedicionCfdi },
            { name: "Folio fiscal", value: numeroFolioCfdi }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateMonedaYEquivalencia(pedimento: Pedimento, cove: Cove, cfdi?: Cfdi) {
 // Moneda
 const monedaPedimento = pedimento.datos_factura?.[0]?.moneda_factura;
 const monedaCove = cove?.datos_mercancia?.tipo_moneda;
 const monedaCfdi = cfdi?.moneda;

 // Valores DOF
 const factorDof = 1.5;
 const tipoCambioDOF = 17.1234;

    // Extract values from documents
  const valorDolaresPedimento = pedimento.datos_factura?.[0]?.valor_dolares_factura;
  const valorDolaresCove = cove?.datos_mercancia?.valor_total_dolares;
  const valorDolaresCfdi = cfdi?.total;
  
  // Valor factura from pedimento:
  const valorFactura = pedimento.datos_factura?.[0]?.valor_moneda_factura;
  const factorMonedaFactura = pedimento.datos_factura?.[0]?.factor_moneda_factura;
  
  const validation = {
    name: "Validación de moneda y factor de equivalencia",
    description: "Validar los siguientes aspectos:\n\n• En exportación, el CFDI debe emitirse en pesos mexicanos y la moneda declarada en el COVE debe coincidir.\n\n• Para obtener el valor en dólares, se debe dividir el valor comercial (de la factura en pesos) entre el tipo de cambio correspondiente al día anterior a la presentación ante aduana.\n\n• Se permite una tolerancia máxima de ±0.5% en esta conversión.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: "Moneda", value: monedaPedimento },
            { name: "Valor en dólares", value: valorDolaresPedimento },
            { name: "Valor factura", value: valorFactura },
            { name: "Factor moneda factura", value: factorMonedaFactura }
          ]
        },
        cove: {
          data: [
            { name: "Moneda", value: monedaCove },
            { name: "Valor en dólares", value: valorDolaresCove }
          ]
        },
        cfdi: {
          data: [
            { name: "Moneda", value: monedaCfdi },
            { name: "Valor total", value: valorDolaresCfdi }
          ]
        },
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        DOF: {
          data: [
            { name: "Factor DOF", value: factorDof },
            { name: "Tipo de cambio DOF", value: tipoCambioDOF }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export const tracedRfcFormat = traceable(
  async (pedimento: Pedimento, cove: Cove, cfdi?: Cfdi, cartaSesion?: CartaSesion) =>
    Promise.all([
      validateRfcFormat(pedimento, cove, cfdi),
      validateCesionDerechos(pedimento, cartaSesion, cfdi),
      validateDatosImportador(pedimento, cove, cfdi),
      validateDatosProveedor(pedimento, cove, cfdi),
      validateFechasYFolios(pedimento, cove, cfdi),
      validateMonedaYEquivalencia(pedimento, cove, cfdi)
    ]),
  { name: "Pedimento S6: Datos de factura" }
);

