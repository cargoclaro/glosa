import { Pedimento, Cove } from "../../../data-extraction/schemas";
import { Carta318 } from "../../../data-extraction/mkdown_schemas/carta-318";
import { CartaSesion } from "../../../data-extraction/mkdown_schemas/carta-sesion";
import { Invoice } from "../../../data-extraction/mkdown_schemas/invoice";
import { glosar } from "../../validation-result";
import { CustomGlossTabContextType } from "@prisma/client";
import { traceable } from "langsmith/traceable";
import { getExchangeRate } from "../../exchange-rate";

export async function validateRfcFormat(pedimento: Pedimento, cove: Cove, carta318?: Carta318) {
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de los RFC",
    description: "Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Consistencia entre documentos:\n• RFC del importador debe ser idéntico en Pedimento, COVE y Carta 3.1.8\n• Si hay Cesión de Derechos, el RFC de la comercializadora debe coincidir con el RFC del importador en la Carta 3.1.8",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "RFC", value: rfcPedimento },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "COVE": {
          data: [{ name: "RFC", value: rfcCove }]
        },
        "Carta 318": {
          data: [{ name: "Carta 318", value: carta318mkdown }]
        }
      }
    }
  } as const;

  return await glosar(validation, "gemini-2.0-flash");
}

export async function validateCesionDerechos(pedimento: Pedimento, cartaSesion?: CartaSesion, carta318?: Carta318) {
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const cartaSesionmkdown = cartaSesion?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de cesión de derechos y carta 3.1.8",
    description: "Si existe Cesión de Derechos:\n\nComparar:\n• RFC comercializadora vs. RFC importador en Carta 3.1.8\n• Fecha de emisión de la Cesión debe ser anterior a Fecha de entrada del Pedimento\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Fecha de entrada", value: fechaEntradaPedimento },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "Carta sesión": {
          data: [
            { name: "Carta sesión", value: cartaSesionmkdown },
            { name: "Existe cesión de derechos", value: !!cartaSesion }
          ]
        },
        "Carta 318": {
          data: [{ name: "Carta 318", value: carta318mkdown }]
        }
      }
    }
  } as const;

  return await glosar(validation, "o3-mini");
}

export async function validateDatosImportador(pedimento: Pedimento, cove: Cove, carta318?: Carta318) {
  const rfcPedimento = pedimento.datos_importador?.rfc;
  const rfcCove = cove?.datos_generales_destinatario?.rfc_destinatario;
  const domicilioPedimento = pedimento.datos_importador?.domicilio;
  const domicilioCove = cove?.datos_generales_destinatario?.domicilio;
  const razonSocialPedimento = pedimento.datos_importador?.razon_social;
  const razonSocialCove = cove?.datos_generales_destinatario?.nombre_razon_social;
  
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const domicilioCoveCompleto = domicilioCove ?
    [
      domicilioCove.calle,
      domicilioCove.numero_exterior,
      domicilioCove.colonia,
      domicilioCove.codigo_postal,
      domicilioCove.pais
    ].filter(Boolean).join(' ') : '';
  
  const validation = {
    name: "Validación de datos del importador",
    description: "Validar que los siguientes campos coincidan literalmente entre documentos:\n\nRFC: Debe coincidir entre Pedimento, Carta 3.1.8 y COVE.\nDomicilio fiscal: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y Factura (importador).\nRazón social: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y COVE.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. Cualquier discrepancia en otros documentos se marca como error.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "RFC", value: rfcPedimento },
            { name: "Domicilio", value: domicilioPedimento },
            { name: "Razón social", value: razonSocialPedimento },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "COVE": {
          data: [
            { name: "RFC", value: rfcCove },
            { name: "Domicilio", value: domicilioCoveCompleto },
            { name: "Razón social", value: razonSocialCove }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown },
            { name: "Existe carta 3.1.8", value: !!carta318 }
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateDatosProveedor(pedimento: Pedimento, cove: Cove, carta318?: Carta318) {
  const nombreProveedorPedimento = pedimento.nombre_razon_social;
  const nombreProveedorCove = cove?.datos_generales_proveedor?.nombre_razon_social;
  const domicilioProveedorPedimento = pedimento.domicilio;
  const domicilioProveedorCove = cove?.datos_generales_proveedor?.domicilio;
  const idProveedorPedimento = pedimento.id_fiscal;
  const idProveedorCove = cove?.datos_generales_proveedor?.identificador;
  
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const domicilioProveedorCoveCompleto = domicilioProveedorCove ?
    [
      domicilioProveedorCove.calle,
      domicilioProveedorCove.numero_exterior,
      domicilioProveedorCove.colonia,
      domicilioProveedorCove.codigo_postal,
      domicilioProveedorCove.pais
    ].filter(Boolean).join(' ') : '';
  
  const validation = {
    name: "Validación de datos comerciales del proveedor",
    description: "Validar que los siguientes campos coincidan entre documentos:\n\nTAX ID: Debe coincidir entre Pedimento, Carta 3.1.8 y COVE.\nDomicilio fiscal: Debe coincidir entre Pedimento, Carta 3.1.8 y Factura.\nRazón social: Debe coincidir entre Pedimento, Carta 3.1.8 (implícito) y COVE.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. La idea es verificar que el tax id, domicilio y razón social, sea el mismo entre los documentos.",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Nombre/Razón social", value: nombreProveedorPedimento },
            { name: "Domicilio", value: domicilioProveedorPedimento },
            { name: "ID Fiscal", value: idProveedorPedimento },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "COVE": {
          data: [
            { name: "Nombre/Razón social", value: nombreProveedorCove },
            { name: "Domicilio", value: domicilioProveedorCoveCompleto },
            { name: "ID Fiscal", value: idProveedorCove }
          ]
        },
        "Carta 318": {
          data: [
            { name: "Carta 318", value: carta318mkdown },
          ]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateFechasYFolios(pedimento: Pedimento, cove: Cove, invoice?: Invoice, carta318?: Carta318) {
  const fechaEntradaPedimento = pedimento.fecha_entrada_presentacion;
  const fechaExpedicionCove = cove?.fecha_expedicion;
  const numeroCovePedimento = pedimento.cove;
  const numeroCove = cove?.acuse_valor;
  
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de fechas de emisión, números de folio y COVE",
    description: "Verificar secuencias lógicas y coincidencias exactas:\n\nFechas:\n• Fecha emisión Factura debe ser menor o igual a la Fecha entrada Pedimento\n• Fecha COVE debe ser igual a la Fecha Factura\n\nNúmeros:\n• Número COVE en el Pedimento debe ser igual al Número COVE en el COVE\n• Número Factura debe ser único y no repetido en otras operaciones",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Fecha de entrada", value: fechaEntradaPedimento },
            { name: "Número COVE", value: numeroCovePedimento },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "COVE": {
          data: [
            { name: "Fecha de expedición", value: fechaExpedicionCove },
            { name: "Número COVE", value: numeroCove }
          ]
        },
        "Factura": {
          data: [{ name: "Factura", value: invoicemkdown }]
        },
        "Carta 318": {
          data: [{ name: "Carta 318", value: carta318mkdown }]
        }
      }
    }
  } as const;

  return await glosar(validation);
}

export async function validateMonedaYEquivalencia(pedimento: Pedimento, cove: Cove, carta318?: Carta318, invoice?: Invoice) {
  const monedaPedimento = pedimento.datos_factura?.[0]?.moneda_factura;
  const monedaCove = cove?.datos_mercancia?.tipo_moneda;
  const valorDolaresPedimento = pedimento.datos_factura?.[0]?.valor_dolares_factura;
  const valorDolaresCove = cove?.datos_mercancia?.valor_total_dolares;
  const valorFactura = pedimento.datos_factura?.[0]?.valor_moneda_factura;
  const factorMonedaFactura = pedimento.datos_factura?.[0]?.factor_moneda_factura;
  const fechaEntrada = pedimento.fecha_entrada_presentacion;
  
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  
  const factorDof = 1;
  const tipoCambioDOF = await getExchangeRate(new Date(fechaEntrada ?? new Date()));
  
  const observaciones = pedimento.observaciones_a_nivel_pedimento;
  
  const validation = {
    name: "Validación de moneda y factor de equivalencia",
    description: "Validar los siguientes aspectos:\n\nMoneda:\n• La moneda declarada debe coincidir entre:\n  - Factura\n  - COVE\n  - Carta 3.1.8\n\nCálculo en USD:\n• El valor en dólares del pedimento debe ser igual a:\n  - Valor de Factura multiplicado por Factor DOF\n• Se permite una tolerancia máxima de ±0.5%\n\nFactor DOF:\n• Debe corresponder al tipo de cambio publicado el día de la fecha de emisión de la Factura",
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        "Pedimento": {
          data: [
            { name: "Moneda", value: monedaPedimento },
            { name: "Valor en dólares", value: valorDolaresPedimento },
            { name: "Valor factura", value: valorFactura },
            { name: "Factor moneda factura", value: factorMonedaFactura },
            { name: "Observaciones", value: observaciones }
          ]
        },
        "COVE": {
          data: [
            { name: "Moneda", value: monedaCove },
            { name: "Valor en dólares", value: valorDolaresCove }
          ]
        },
        "Factura": {
          data: [{ name: "Factura", value: invoicemkdown }]
        },
        "Carta 318": {
          data: [{ name: "Carta 318", value: carta318mkdown }]
        }
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        "Tipo de cambio DOF": {
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

export const tracedDatosDeFactura = traceable(
  async ({ pedimento, cove, carta318, invoice, cartaSesion }: { pedimento: Pedimento; cove: Cove; carta318?: Carta318; invoice?: Invoice; cartaSesion?: CartaSesion }) => {
    const validationsPromise = await Promise.all([
      validateRfcFormat(pedimento, cove, carta318),
      validateCesionDerechos(pedimento, cartaSesion, carta318),
      validateDatosImportador(pedimento, cove, carta318),
      validateDatosProveedor(pedimento, cove, carta318),
      validateFechasYFolios(pedimento, cove, invoice, carta318),
      validateMonedaYEquivalencia(pedimento, cove, carta318, invoice)
    ]);
    
    return {
      sectionName: "Datos de factura",
      validations: validationsPromise
    };
  },
  { name: "Pedimento S6: Datos de factura" }
);
