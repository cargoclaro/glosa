import type { OCR } from '~/lib/utils';
import type {
  CFDI,
  Cove,
  Pedimento,
} from '../../../extract-and-structure/schemas';
import type { Factura } from '../../../extract-and-structure/schemas/factura';
import { glosar } from '../../validation-result';
import { 
  mapFacturasWithCoves,
  aggregateValoresFromMappings,
  type FacturaCoveMapping 
} from '../../utils/document-mapping';

function getScenarioType(mappings: FacturaCoveMapping[], incoterms: (string | null)[]): 
  'single_invoice' | 'multiple_single_incoterm' | 'multiple_different_incoterms' {
  if (mappings.length === 1) return 'single_invoice';
  const uniqueIncoterms = new Set(incoterms.filter(Boolean));
  return uniqueIncoterms.size === 1 ? 'multiple_single_incoterm' : 'multiple_different_incoterms';
}

// TODO: Agregar DOF y Dia de salida

async function validateFechaSalida(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  const pedimentoExitDate =
    pedimento.encabezadoPrincipalDelPedimento.fechas.presentacion;
  const fechaoperador = '24/07/2025'; //Temporary hardcoded value

  const validation = {
    name: 'Fecha de salida',
    description:
      'Validación de que la fecha de salida del pedimento coincida con la fecha proporcionada por el operador de carga',
    prompt:
      'La fecha de salida del pedimento debe ser la fecha de salida dada por el operador de la carga.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Fecha de salida', value: pedimentoExitDate }],
        },
        documentoDeTransporte: {
          data: [{ name: 'Transport Document', value: transportDocument }],
        },
        operador: {
          data: [{ name: 'Fecha de salida', value: fechaoperador }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateTipoCambio(traceId: string, pedimento: Pedimento) {
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const fechaSalida =
    pedimento.encabezadoPrincipalDelPedimento.fechas.presentacion;
  // TODO: Replace with actual DOF API integration
  const tipoCambioDOF = 17.1234; // Temporary hardcoded value

  const validation = {
    name: 'Tipo de cambio',
    description:
      'Verificación de que el tipo de cambio coincida con el publicado en el DOF',
    prompt:
      'El tipo de cambio debe ser exactamente igual al publicado en el DOF el día hábil anterior a la fecha de entrada.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Fecha de salida', value: fechaSalida },
          ],
        },
      },
      EXTERNAL: {
        dof: {
          data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateValoresComerciales(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  cfdi?: CFDI
) {
  const valorComercialPedimento =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const tipoCambioPedimento =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;

  const scenarioType = getScenarioType(mappings, []);

  if (scenarioType === 'single_invoice') {
    const validation = {
      name: 'Valor comercial',
      description: 'Verificación de que el valor comercial del pedimento coincida con el de la factura/CFDI y COVE',
      prompt: 'El valor comercial debe ser igual al valor de la factura y debe coincidir entre factura, CFDI y COVE. Aplica tipo de cambio para conversiones si es necesario.',
      contexts: {
        PROVIDED: {
          pedimento: {
            data: [
              { name: 'Valor comercial', value: valorComercialPedimento },
              { name: 'Tipo de cambio', value: tipoCambioPedimento },
            ],
          },
          cfdi: {
            data: [{ name: 'CFDI', value: cfdi }],
          },
          factura: {
            data: [{ name: 'Factura', value: mappings[0]?.factura }],
          },
          cove: {
            data: [{ name: 'COVE', value: mappings[0]?.cove }],
          },
        },
      },
    } as const;
    return await glosar(validation, traceId);
  } else {
    // Mantener lógica existente para múltiples facturas
    const valoresAgregados = aggregateValoresFromMappings(
      mappings,
      tipoCambioPedimento
    );

    const mappingDetails = mappings.map((mapping) => ({
      name: `Factura ${mapping.factura.invoice_number} vs COVE ${mapping.cove.datosDelAcuseDeValor.numeroDeFactura}`,
      value: {
        valorFactura: mapping.factura.total_amount,
        monedaFactura: mapping.factura.currency_code,
        valorTotalCove: mapping.cove.mercancias.reduce(
          (sum: number, m) => sum + (m.datosDeLaMercancia?.valorTotal || 0), 0
        ),
        monedaCove: mapping.cove.mercancias[0]?.datosDeLaMercancia?.tipoMoneda,
        matchType: mapping.matchType,
        confidence: mapping.confidence
      }
    }));

    const validation = {
      name: 'Valor comercial (Múltiples documentos)',
      description:
        'Verificación de que el valor comercial del pedimento coincida con la suma de valores en CFDIs y COVEs',
      prompt:
        `El valor comercial del pedimento debe ser consistente con la suma de valores de todas las facturas/CFDIs y COVEs. 
        
        Considera lo siguiente:
        1. Si hay múltiples facturas mapeadas con COVEs, suma todos los valores
        2. Convierte a pesos mexicanos usando el tipo de cambio del pedimento cuando sea necesario
        3. Los valores deben coincidir dentro de un margen razonable (±2%)
        4. Si hay documentos no mapeados, explica el impacto en la validación
        
        Datos del mapeo:
        - Total de mappings: ${mappings.length}
        - Valor comercial agregado (COVEs): ${valoresAgregados.valorComercialTotal}
        - Valor comercial agregado (Facturas): ${valoresAgregados.valorComercialFacturasTotal}`,
      contexts: {
        PROVIDED: {
          pedimento: {
            data: [
              { name: 'Valor comercial', value: valorComercialPedimento },
              { name: 'Tipo de cambio', value: tipoCambioPedimento },
            ],
          },
          cfdi: {
            data: [{ name: 'CFDI', value: cfdi }],
          },
          mappingsFacturaCove: {
            data: mappingDetails,
          },
          resumenMappings: {
            data: [
              { name: 'Número de mappings', value: mappings.length },
              { name: 'Valor comercial total (COVEs)', value: valoresAgregados.valorComercialTotal },
              { name: 'Valor comercial total (Facturas)', value: valoresAgregados.valorComercialFacturasTotal },
            ],
          },
        },
      },
    } as const;
    return await glosar(validation, traceId);
  }
}

async function validateValoresDolares(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  cfdi?: CFDI
) {
  const valorDolaresPedimento =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorDolares;
  const valorComercialPedimento =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const tipoCambioPedimento =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;

  const scenarioType = getScenarioType(mappings, []);

  if (scenarioType === 'single_invoice') {
    const validation = {
      name: 'Valor dólares',
      description: 'Verificación de que el valor en dólares del pedimento sea consistente con el valor comercial y el tipo de cambio',
      prompt: 'El valor en dólares debe ser igual a Valor Comercial ÷ Tipo de cambio. Redondeado a 2 decimales.',
      contexts: {
        PROVIDED: {
          pedimento: {
            data: [
              { name: 'Valor en dólares', value: valorDolaresPedimento },
              { name: 'Valor comercial', value: valorComercialPedimento },
              { name: 'Tipo de cambio', value: tipoCambioPedimento },
            ],
          },
          cfdi: {
            data: [{ name: 'CFDI', value: cfdi }],
          },
          factura: {
            data: [{ name: 'Factura', value: mappings[0]?.factura }],
          },
        },
      },
    } as const;
    return await glosar(validation, traceId);
  } else {
    // Mantener lógica existente para múltiples facturas
    const valoresAgregados = aggregateValoresFromMappings(
      mappings,
      tipoCambioPedimento
    );

    const mappingDetails = mappings.map((mapping) => ({
      name: `Valores USD - Factura ${mapping.factura.invoice_number}`,
      value: {
        valorDolaresFactura: mapping.factura.currency_code === 'USD' ? mapping.factura.total_amount : null,
        valorDolaresCove: mapping.cove.mercancias.reduce(
          (sum: number, m) => sum + (m.datosDeLaMercancia?.valorTotalEnDolares || 0), 0
        ),
        monedaCove: mapping.cove.mercancias[0]?.datosDeLaMercancia?.tipoMoneda,
      }
    }));

    const validation = {
      name: 'Valor dólares (Múltiples documentos)',
      description:
        'Verificación de que el valor en dólares del pedimento sea consistente con los documentos y el tipo de cambio',
      prompt:
        `El valor en dólares del pedimento se debe calcular de la siguiente manera:
        1. Si es una sola operación: Valor comercial ÷ Tipo de cambio
        2. Si hay múltiples facturas/COVEs: Suma de todos los valores en USD + conversión de valores en MXN
        
        Valida:
        - Que el cálculo sea correcto (Valor USD = Valor Comercial MXN ÷ Tipo de Cambio)
        - Que coincida con valores en USD directos de facturas y COVEs
        - Que la suma de todos los mappings sea consistente con el valor declarado
        
        Resumen de mappings: ${mappings.length} documentos mapeados
        Valor total en dólares agregado: ${valoresAgregados.valorDolaresTotal}`,
      contexts: {
        PROVIDED: {
          pedimento: {
            data: [
              { name: 'Valor en dólares', value: valorDolaresPedimento },
              { name: 'Valor comercial', value: valorComercialPedimento },
              { name: 'Tipo de cambio', value: tipoCambioPedimento },
            ],
          },
          cfdi: {
            data: [{ name: 'CFDI', value: cfdi }],
          },
          mappingsValoresDolares: {
            data: mappingDetails,
          },
          resumenValores: {
            data: [
              { name: 'Valor dólares agregado (cálculo)', value: valoresAgregados.valorDolaresTotal },
              { name: 'Valor comercial agregado', value: valoresAgregados.valorComercialTotal },
              { name: 'Valor dólares esperado (comercial/TC)', value: valoresAgregados.valorComercialTotal / tipoCambioPedimento },
            ],
          },
        },
      },
    } as const;
    return await glosar(validation, traceId);
  }
}

async function validateDocumentMapping(
  traceId: string,
  mappingResult: { 
    mappings: FacturaCoveMapping[]; 
    unmapped: {
      facturasNoMapeadas: Array<{ factura: Factura; index: number; reason: string }>;
      covesNoMapeados: Array<{ cove: Cove; index: number; reason: string }>;
    }; 
    summary: {
      totalFacturas: number;
      totalCoves: number;
      mappingsExactos: number;
      mappingsParciales: number;
      facturasNoMapeadas: number;
      covesNoMapeados: number;
    };
  }
) {
  const validation = {
    name: 'Mapeo de documentos',
    description:
      'Verificación de que las facturas y COVEs estén correctamente correlacionados',
    prompt:
      `Evalúa el mapeo entre facturas y COVEs:
      
      1. Verifica que los números de factura coincidan entre documentos
      2. Identifica documentos no mapeados y evalúa si es problemático
      3. Revisa la confianza en los mappings parciales
      4. Sugiere acciones para documentos no correlacionados
      
      Estadísticas del mapeo:
      - Mappings exactos: ${mappingResult.summary.mappingsExactos}
      - Mappings parciales: ${mappingResult.summary.mappingsParciales}
      - Facturas no mapeadas: ${mappingResult.summary.facturasNoMapeadas}
      - COVEs no mapeados: ${mappingResult.summary.covesNoMapeados}`,
    contexts: {
      PROVIDED: {
        mappingsExitosos: {
          data: mappingResult.mappings.map(m => ({
            name: `${m.factura.invoice_number} → ${m.cove.datosDelAcuseDeValor.numeroDeFactura}`,
            value: {
              matchType: m.matchType,
              confidence: m.confidence,
              valorFactura: m.factura.total_amount,
              monedaFactura: m.factura.currency_code
            }
          })),
        },
        facturasNoMapeadas: {
          data: mappingResult.unmapped.facturasNoMapeadas.map((f) => ({
            name: `Factura sin COVE: ${f.factura.invoice_number}`,
            value: {
              valorFactura: f.factura.total_amount,
              monedaFactura: f.factura.currency_code,
              razon: f.reason
            }
          })),
        },
        covesNoMapeados: {
          data: mappingResult.unmapped.covesNoMapeados.map((c) => ({
            name: `COVE sin factura: ${c.cove.datosDelAcuseDeValor.numeroDeFactura}`,
            value: {
              idCove: c.cove.datosDelAcuseDeValor.idCove,
              razon: c.reason
            }
          })),
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

// Validaciones específicas para escenario 3: Múltiples facturas con diferentes Incoterms (Exportación)
async function validateIncotermVsMedioTransporteExpo(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  transportDocument?: OCR
) {
  const medioTransportePedimento = pedimento.encabezadoPrincipalDelPedimento.mediosTransporte.entradaSalida;
  
  const facturaDetails = mappings.map(mapping => ({
    name: `Factura ${mapping.factura.invoice_number}`,
    value: {
      incoterm: mapping.factura.payment_terms,
      medioTransporte: 'N/A', // Se extraería del parsing de la factura
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Incoterm vs Medio de transporte',
    description: 'Verifica que cada Incoterm sea válido con el medio de transporte declarado',
    prompt: `Para cada factura verifica que su Incoterm sea válido con el medio de transporte declarado.
Ejemplo: FOB solo aplica a transporte marítimo.
Marca error si no corresponde.

IMPORTANTE: Evalúa TODAS las facturas (${mappings.length} facturas), no solo la primera.`,
    contexts: {
      PROVIDED: {
        'Facturas': {
          data: facturaDetails,
        },
        'Documento de transporte': {
          data: [
            { name: 'Medio de transporte BL/AWB/CMR', value: transportDocument?.markdown_representation },
          ],
        },
        Pedimento: {
          data: [
            { name: 'Medio de transporte', value: medioTransportePedimento },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateIncotermPorFacturaExpo(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const incotermGlobalPedimento = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm)[0] || null;
  
  const facturaDetails = mappings.map(mapping => ({
    name: `Incoterm - Factura ${mapping.factura.invoice_number}`,
    value: {
      incotermFactura: mapping.factura.payment_terms,
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Incoterm por factura',
    description: 'Confirma que el Incoterm de cada factura coincida con su documentación',
    prompt: `Confirma que el Incoterm de cada factura sea consistente con la documentación.
Lista discrepancias.

IMPORTANTE: Evalúa TODAS las facturas (${mappings.length} facturas), no solo la primera.`,
    contexts: {
      PROVIDED: {
        'Facturas': {
          data: facturaDetails,
        },
        Pedimento: {
          data: [
            { name: 'Incoterm global', value: incotermGlobalPedimento },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateProrrateoIncrementablesExpo(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const incrementablesTotales = pedimento.encabezadoPrincipalDelPedimento.incrementables;
  const partidas = pedimento.partidas || [];
  
  const facturaDetails = mappings.map(mapping => ({
    name: `Valor comercial - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorComercial: mapping.factura.valor_comercial || mapping.factura.total_amount,
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const partidaDetails = partidas.map((partida, index) => ({
    name: `Partida ${index + 1}`,
    value: {
      fraccionArancelaria: partida.fraccion,
      valorComercialPartida: partida.importeDePrecioPagadoOValorComercial,
      valorAduanaPartida: partida.valorEnAduanaOValorEnUSD
    }
  }));

  const validation = {
    name: 'Prorrateo de incrementables',
    description: 'Distribuye incrementables entre facturas según valor comercial y valida en partidas',
    prompt: `Distribuye (prorratea) los incrementables del pedimento entre las facturas según su valor comercial.
Luego, por cada partida compara Valor Aduana partida vs Valor Comercial partida.
Si Valor Aduana > Valor Comercial, indica que el prorrateo se aplicó; marca como correcto.
Si no, marca error y muestra la partida afectada.

IMPORTANTE: Considera TODAS las facturas (${mappings.length} facturas) en el cálculo.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Incrementables totales flete', value: incrementablesTotales.fletes },
            { name: 'Incrementables totales seguro', value: incrementablesTotales.seguros },
            { name: 'Incrementables totales embalajes', value: incrementablesTotales.embalajes },
            { name: 'Incrementables totales otros', value: incrementablesTotales.otrosIncrementables },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
        'Partidas': {
          data: partidaDetails,
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function operacionMonetaria({
  pedimento,
  coves,
  facturas,
  transportDocument,
  cfdi,
  traceId,
}: {
  pedimento: Pedimento;
  coves: Cove[];
  facturas?: Factura[];
  transportDocument?: OCR;
  cfdi?: CFDI;
  traceId: string;
}) {
  // Mapear facturas con COVEs
  const mappingResult = mapFacturasWithCoves(facturas || [], coves);
  const facturasIncoterms = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || [];
  const scenarioType = getScenarioType(mappingResult.mappings, facturasIncoterms);
  
  // Validaciones base comunes a todos los escenarios
  const baseValidations = [
    validateFechaSalida(traceId, pedimento, transportDocument),
    validateTipoCambio(traceId, pedimento),
    validateDocumentMapping(traceId, mappingResult),
  ];

  if (scenarioType === 'multiple_different_incoterms') {
    // Escenario 3: Múltiples facturas con diferentes Incoterms - validaciones específicas para exportación
    const escenario3Validations = [
      validateIncotermVsMedioTransporteExpo(traceId, pedimento, mappingResult.mappings, transportDocument),
      validateIncotermPorFacturaExpo(traceId, pedimento, mappingResult.mappings),
      validateProrrateoIncrementablesExpo(traceId, pedimento, mappingResult.mappings),
      validateValoresComerciales(traceId, pedimento, mappingResult.mappings, cfdi),
      validateValoresDolares(traceId, pedimento, mappingResult.mappings, cfdi),
    ];
    
    const validationsPromise = await Promise.all([...baseValidations, ...escenario3Validations]);
    
    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  } else {
    // Escenarios 1 y 2: validaciones originales (una factura o múltiples facturas mismo incoterm)
    const validationsPromise = await Promise.all([
      ...baseValidations,
      validateValoresComerciales(traceId, pedimento, mappingResult.mappings, cfdi),
      validateValoresDolares(traceId, pedimento, mappingResult.mappings, cfdi),
    ]);

    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  }
}
