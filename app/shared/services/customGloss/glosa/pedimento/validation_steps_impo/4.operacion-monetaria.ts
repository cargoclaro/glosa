import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { Factura } from '../../../extract-and-structure/schemas/factura';
import { apendice14 } from '../../anexo-22/apendice-14';
import { getExchangeRate } from '../../exchange-rate';
import incotermLogic from '../../incoterms-logic.json';
import { glosar } from '../../validation-result';
import { 
  mapFacturasWithCoves,
  type FacturaCoveMapping 
} from '../../utils/document-mapping';
import type { Cove } from '../../../extract-and-structure/schemas';

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

function getScenarioType(mappings: FacturaCoveMapping[], incoterms: (string | null)[]): 
  'single_invoice' | 'multiple_single_incoterm' | 'multiple_different_incoterms' {
  if (mappings.length === 1) return 'single_invoice';
  const uniqueIncoterms = new Set(incoterms.filter(Boolean));
  return uniqueIncoterms.size === 1 ? 'multiple_single_incoterm' : 'multiple_different_incoterms';
}

function getPromptForValidationType(tipo: string, incoterms: (string | null)[], mappings: FacturaCoveMapping[]): string {
  const scenarioType = getScenarioType(mappings, incoterms);
  const mappingsCount = mappings.length;
  
  // Prompts específicos para una factura (escenario 1)
  if (scenarioType === 'single_invoice') {
    const singleInvoicePrompts = {
      valSeguros: `
Revisa la documentación de comercio para verificar los siguientes criterios relacionados con los Incoterms y los valores de seguro:

Validación de Compatibilidad entre Seguro e Incoterm:
• Confirma si el Incoterm utilizado es CIP o CIF.
• Si el Incoterm es CIP o CIF pero se incluye un valor de seguro, marca una advertencia.
• Justifica la advertencia utilizando la guía del Apéndice 14, explicando por qué no debería aparecer un valor de seguro con ese Incoterm.

Verificación de la Coherencia del Valor del Seguro:
• Si el Incoterm es válido, verifica que el valor del seguro sea aproximadamente correcto.
• Compara el valor declarado del seguro con el monto indicado en la documentación adjunta.
• Convierte monedas extranjeras (por ejemplo, USD) a Pesos Mexicanos (MXN) para mantener la coherencia. Usa tasas de cambio aproximadas.
• Asegúrate de que el valor convertido tenga sentido en el contexto del documento.
• Ejemplo: Si se indica "Insurance: 25 USD" y en el pedimento aparece "Seguro: 550 MXN", esto es aceptable.`,

      seguros: `
Revisa la documentación de comercio para verificar los siguientes criterios relacionados con los Incoterms y los valores de seguro:

Validación de Compatibilidad entre Seguro e Incoterm:
• Confirma si el Incoterm utilizado es CIP o CIF.
• Si el Incoterm es CIP o CIF pero se incluye un valor de seguro, marca una advertencia.
• Justifica la advertencia utilizando la guía del Apéndice 14, explicando por qué no debería aparecer un valor de seguro con ese Incoterm.

Verificación de la Coherencia del Valor del Seguro:
• Si el Incoterm es válido, verifica que el valor del seguro sea aproximadamente correcto.
• Compara el valor declarado del seguro con el monto indicado en la documentación adjunta.
• Convierte monedas extranjeras (por ejemplo, USD) a Pesos Mexicanos (MXN) para mantener la coherencia. Usa tasas de cambio aproximadas.
• Asegúrate de que el valor convertido tenga sentido en el contexto del documento.
• Ejemplo: Si se indica "Insurance: 25 USD" y en el pedimento aparece "Seguro: 550 MXN", esto es aceptable.`,

      fletes: `
Revisa la documentación de comercio para verificar los siguientes criterios relacionados con los Incoterms y los valores de flete:

Validación de Compatibilidad entre Flete e Incoterm:
• Si el Incoterm utilizado es uno de los siguientes:
  - EXW (Ex Works)
  - FCA (Free Carrier)
  - FAS (Free Alongside Ship)
  - FOB (Free On Board)
• Y se está declarando un valor de flete, marca como correcto.
• Justifica explicando que, bajo estos Incoterms, el comprador asume responsabilidad sobre el transporte principal, por lo tanto debería incluirse un valor de flete en la documentación.

Verificación de la Coherencia del Flete:
• Si el Incoterm es válido, verifica que el valor del flete sea aproximadamente correcto.
• Compara el valor declarado del flete con el monto indicado en la documentación adjunta.
• Convierte monedas extranjeras (por ejemplo, USD) a Pesos Mexicanos (MXN) para mantener la coherencia. Usa tasas de cambio aproximadas.
• Asegúrate de que el valor convertido tenga sentido en el contexto del documento.
• Ejemplo: Si se indica "Freight: 100 USD" y en el pedimento aparece "Flete: 2200 MXN", esto es aceptable.`,

      embalajes: `
Valida que el valor de embalajes coincida con lo declarado en factura, Carta 318 o documento de transporte. 

• Aplica tipo de cambio para conversiones de moneda.
• Si no hay valor de embalajes en los documentos, marcar como correcto.
• Verifica consistencia entre el valor declarado en el pedimento y los documentos soporte.`,

      otrosIncrementables: `
Valida otros incrementables (distintos de fletes, seguros y embalajes) en documentos y en relación con el Incoterm.

• Verifica que cada cargo tenga soporte documental.
• Asegúrate de que no se dupliquen costos ya cubiertos por el Incoterm.
• Aplica conversiones de moneda cuando sea necesario.`
    };

    return singleInvoicePrompts[tipo as keyof typeof singleInvoicePrompts] || '';
  }

  // Prompts para múltiples facturas (escenarios 2 y 3)
  const multipleInvoicePrompts = {
    valSeguros: scenarioType === 'multiple_single_incoterm' ? `
Verifica el "Valor Seguros" (campo 318) con múltiples facturas que tienen el mismo Incoterm.

Con ${mappingsCount} facturas y Incoterm único:
1. Aplica la regla del Incoterm a todas las facturas
2. Suma los valores de seguro de todas las facturas
3. Compara la suma total con el valor global declarado (±5%)

Reglas por Incoterm:
• CIP y CIF → El seguro está incluido, "Valor Seguros" debe ser 0 para todas
• EXW, FCA, FAS, FOB, CFR, CPT, DAP, DPU, DDP → Suma todos los valores declarados

Convierte a MXN usando el tipo de cambio del pedimento.` : `
Verifica el "Valor Seguros" (campo 318) con múltiples facturas que tienen diferentes Incoterms.

Con ${mappingsCount} facturas y múltiples Incoterms:
1. Aplica reglas por factura según su Incoterm específico
2. Suma los valores válidos de cada factura
3. Compara la suma total con el valor global (±5%)

Reglas por Incoterm:
• CIP y CIF → El seguro está incluido, no sumar
• EXW, FCA, FAS, FOB, CFR, CPT, DAP, DPU, DDP → Incluir en la suma

Convierte a MXN usando el tipo de cambio del pedimento.`,

    seguros: scenarioType === 'multiple_single_incoterm' ? `
Verifica "Seguros" con múltiples facturas que comparten el mismo Incoterm.

Con ${mappingsCount} facturas e Incoterm único:
1. El Incoterm aplica uniformemente a todas las facturas
2. Suma los cargos de seguro de todas las facturas
3. Compara con el valor global (±3%)

Reglas por Incoterm:
• CIP y CIF → Costo incluido, "Seguros" debe ser 0
• Otros → Suma todos los cargos documentados` : `
Verifica "Seguros" con múltiples facturas que tienen diferentes Incoterms.

Con ${mappingsCount} facturas y múltiples Incoterms:
1. Evalúa cada factura según su Incoterm específico
2. Suma solo los cargos válidos por Incoterm
3. Compara suma total con valor global (±3%)

Reglas aplicadas individualmente por factura.`,

    fletes: scenarioType === 'multiple_single_incoterm' ? `
Verifica "Fletes" con múltiples facturas bajo el mismo Incoterm.

Con ${mappingsCount} facturas e Incoterm único:
1. Aplica regla del Incoterm a todas las facturas
2. Si Incoterm incluye flete → valor debe ser 0
3. Si Incoterm no incluye flete → suma todos los valores (±3%)

Reglas por Incoterm:
• CFR, CIF, CPT, CIP, DAP, DPU, DDP → "Fletes" debe ser 0
• EXW, FCA, FAS, FOB → Suma todos los fletes` : `
Verifica "Fletes" con múltiples facturas que tienen diferentes Incoterms.

Con ${mappingsCount} facturas y múltiples Incoterms:
1. Evalúa cada factura según su Incoterm
2. Suma solo fletes de facturas que requieren declaración
3. Compara suma con valor global (±3%)`,

    embalajes: `
Revisa "Embalajes" considerando ${mappingsCount} facturas.

${scenarioType === 'multiple_single_incoterm' ? 
'Con mismo Incoterm: suma todos los cargos de embalaje y compara (±3%).' :
'Con diferentes Incoterms: suma cargos de embalaje de todas las facturas (±3%).'}

Validaciones:
- Cargos documentados vs valor declarado
- Consistencia entre facturas y pedimento`,

    otrosIncrementables: `
Revisa "Otros Incrementables" con ${mappingsCount} facturas.

${scenarioType === 'multiple_single_incoterm' ? 
'Mismo Incoterm: valida que otros cargos no dupliquen costos incluidos.' :
'Diferentes Incoterms: valida por factura y suma total.'}

1. Cada cargo debe tener soporte documental
2. No duplicar costos cubiertos por Incoterms
3. Suma total debe coincidir (±3%)`
  };

  return multipleInvoicePrompts[tipo as keyof typeof multipleInvoicePrompts] || '';
}

// Validaciones específicas para Escenario 2: Múltiples facturas, mismo Incoterm
async function validateIncotermUnico(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const facturasIncoterms = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || [];
  const facturaDetails = mappings.map(mapping => ({
    name: `Factura ${mapping.factura.invoice_number}`,
    value: {
      incoterm: mapping.factura.payment_terms,
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Incoterm único',
    description: 'Confirma que todas las facturas declaran exactamente el mismo Incoterm',
    prompt: 'Confirma que todas las facturas declaran exactamente el mismo Incoterm que aparece en el pedimento y la carta 3.1.8. Si cualquier factura usa un Incoterm distinto, marca error y lista las facturas conflictivas. Si coinciden, continúa con las demás validaciones.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Incoterm', value: facturasIncoterms[0] },
            { name: 'Clave de pedimento', value: pedimento.encabezadoPrincipalDelPedimento.claveDePedimento },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
      },
      EXTERNAL: {
        'Apéndice 14': {
          data: [{ name: 'Definiciones Incoterm', value: apendice14 }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValSegurosPorFactura(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  carta318?: OCR
) {
  const facturasIncoterms = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || [];
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const valorSeguros = pedimento.encabezadoPrincipalDelPedimento.incrementables.valorSeguros;
  const observaciones = pedimento.observacionesANivelPedimento;

  const facturaDetails = mappings.map(mapping => ({
    name: `Val. Seguros - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorSeguro: getIncrementablesFromFactura(mapping.factura, 'valSeguros'),
      moneda: mapping.factura.currency_code
    }
  }));

  const validation = {
    name: 'Val. Seguros por factura',
    description: 'Valida el valor de seguros declarado en cada factura individual',
    prompt: `Para cada factura:
1. Si el Incoterm es CIP o CIF y se declara un valor de seguro, genera advertencia.
2. Compara el valor de seguro declarado contra lo que aparece en la factura / carta 318.
3. Convierte la moneda a MXN con el tipo de cambio del pedimento y valida que el monto tenga sentido.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Val. Seguros', value: valorSeguros },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
            { name: 'Incoterm', value: facturasIncoterms[0] },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
        },
      },
      EXTERNAL: {
        'Apéndice 14': {
          data: [{ name: 'Apéndice 14', value: apendice14 }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateSegurosPedimentoVsSuma(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const seguros = pedimento.encabezadoPrincipalDelPedimento.incrementables.seguros;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;

  const facturaDetails = mappings.map(mapping => ({
    name: `Seguros MXN - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorSeguroMXN: getIncrementablesFromFactura(mapping.factura, 'seguros')?.valor || 0,
    }
  }));

  const validation = {
    name: 'Seguros pedimento vs suma facturas',
    description: 'Compara el valor de seguros del pedimento contra la suma de todas las facturas',
    prompt: `Suma el valor de seguro de todas las facturas (en MXN).
El resultado debe ser igual al valor "Seguros" del pedimento (tolerancia ±1%).
Si difiere, marca error y muestra la diferencia.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Seguros', value: seguros },
            { name: 'Tipo de cambio', value: tipoCambio },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
        Observaciones: {
          data: [{ name: 'Observaciones', value: observaciones }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateFletesEscenario2(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  transportDocument?: OCR,
  carta318?: OCR
) {
  const facturasIncoterms = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || [];
  const fletes = pedimento.encabezadoPrincipalDelPedimento.incrementables.fletes;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;

  const facturaDetails = mappings.map(mapping => ({
    name: `Fletes - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorFlete: getIncrementablesFromFactura(mapping.factura, 'fletes'),
      moneda: mapping.factura.currency_code
    }
  }));

  const validation = {
    name: 'Fletes',
    description: 'Valida los fletes según el Incoterm y suma de facturas',
    prompt: `Para Incoterms EXW, FCA, FAS, FOB el flete debe existir.
Verifica por factura el valor.
Convierte a MXN y compara con el total de flete en el pedimento.
Tolerancia ±1%.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Fletes', value: fletes },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Incoterm', value: facturasIncoterms[0] },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
        },
        'Documento transporte': {
          data: [{ name: 'Documento transporte', value: transportDocument?.markdown_representation }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateEmbalajesEscenario2(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  transportDocument?: OCR,
  carta318?: OCR
) {
  const embalajes = pedimento.encabezadoPrincipalDelPedimento.incrementables.embalajes;

  const facturaDetails = mappings.map(mapping => ({
    name: `Embalajes - Factura ${mapping.factura.invoice_number}`,
    value: {
      embalajes: getIncrementablesFromFactura(mapping.factura, 'embalajes'),
      moneda: mapping.factura.currency_code
    }
  }));

  const validation = {
    name: 'Embalajes',
    description: 'Valida la suma de embalajes de todas las facturas',
    prompt: `Suma valores de embalajes de todas las facturas.
Debe coincidir con el pedimento.
Si no hay valor, marcar como correcto.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [{ name: 'Embalajes', value: embalajes }],
        },
        'Facturas': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
        },
        'Documento transporte': {
          data: [{ name: 'Documento transporte', value: transportDocument?.markdown_representation }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateOtrosIncrementablesEscenario2(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const otrosIncrementables = pedimento.encabezadoPrincipalDelPedimento.incrementables.otrosIncrementables;
  const observaciones = pedimento.observacionesANivelPedimento;

  const facturaDetails = mappings.map(mapping => ({
    name: `Otros incrementables - Factura ${mapping.factura.invoice_number}`,
    value: {
      otrosIncrementables: getIncrementablesFromFactura(mapping.factura, 'otrosIncrementables')
    }
  }));

  const validation = {
    name: 'Otros incrementables',
    description: 'Valida otros incrementables según Incoterm y suma de facturas',
    prompt: `Valida que los otros incrementables en el pedimento sean la suma de los declarados en cada factura y que correspondan al Incoterm.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [{ name: 'Otros incrementables', value: otrosIncrementables }],
        },
        'Facturas': {
          data: facturaDetails,
        },
        Observaciones: {
          data: [{ name: 'Observaciones', value: observaciones }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValorDolaresEscenario2(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const valorDolares = pedimento.encabezadoPrincipalDelPedimento.valores.valorDolares;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const valorAduana = pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const observaciones = pedimento.observacionesANivelPedimento;

  const facturaDetails = mappings.map(mapping => ({
    name: `Valor comercial USD - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorComercialUSD: mapping.factura.currency_code === 'USD' ? mapping.factura.total_amount : null
    }
  }));

  const validation = {
    name: 'Valor dólares',
    description: 'Valida que el valor dólares sea igual a la suma de facturas en USD',
    prompt: `Suma valores comerciales de las facturas en USD.
El resultado debe ser igual a Valor Aduana ÷ Tipo cambio (±2 dec.).`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Valor en dólares', value: valorDolares },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Valor aduana', value: valorAduana },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
        Observaciones: {
          data: [{ name: 'Observaciones', value: observaciones }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValorAduanaEscenario2(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const valorAduana = pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const valorComercial = pedimento.encabezadoPrincipalDelPedimento.valores.precioPagadoOValorComercial;
  const incrementables = pedimento.encabezadoPrincipalDelPedimento.incrementables;

  const facturaDetails = mappings.map(mapping => ({
    name: `Valores - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorComercial: mapping.factura.valor_comercial || mapping.factura.total_amount,
      incrementables: mapping.factura.incrementables
    }
  }));

  const validation = {
    name: 'Valor aduana',
    description: 'Valida que valor aduana sea la suma correcta de comercial más incrementables',
    prompt: `Valor Aduana = suma(Valor comercial facturas) + suma(Incrementables).
Verifica y reporta diferencias.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Valor comercial', value: valorComercial },
            { name: 'Incrementables', value: incrementables },
          ],
        },
        'Facturas': {
          data: facturaDetails,
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

// Validaciones específicas para Escenario 3: Múltiples facturas con diferentes Incoterms
async function validateIncotermVsMedioTransporte(
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
Marca error si no corresponde.`,
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
      EXTERNAL: {
        'Apéndice 14': {
          data: [{ name: 'Definiciones Incoterm', value: apendice14 }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateIncotermPorFactura(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  carta318?: OCR
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
    description: 'Confirma que el Incoterm de cada factura coincida con su carta 3.1.8',
    prompt: `Confirma que el Incoterm de cada factura coincida con el de su carta 3.1.8.
Lista discrepancias.`,
    contexts: {
      PROVIDED: {
        'Facturas': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Incoterms por factura', value: carta318?.markdown_representation }],
        },
        Pedimento: {
          data: [
            { name: 'Incoterm global', value: incotermGlobalPedimento },
          ],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateProrrateoIncrementables(
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
Si no, marca error y muestra la partida afectada.`,
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
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValSegurosPorFacturaEscenario3(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  carta318?: OCR
) {
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const valorSeguros = pedimento.encabezadoPrincipalDelPedimento.incrementables.valorSeguros;
  const observaciones = pedimento.observacionesANivelPedimento;

  const facturaDetails = mappings.map(mapping => ({
    name: `Val. Seguros individual - Factura ${mapping.factura.invoice_number}`,
    value: {
      incotermFactura: mapping.factura.payment_terms,
      valorSeguro: getIncrementablesFromFactura(mapping.factura, 'valSeguros'),
      moneda: mapping.factura.currency_code,
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Val. Seguros por factura',
    description: 'Valida el valor de seguros por factura según su Incoterm específico',
    prompt: `Para cada factura evalúa individualmente:
1. Si su Incoterm es CIP o CIF y declara valor de seguro, genera advertencia.
2. Compara el valor declarado contra la factura/carta 318.
3. Convierte moneda a MXN y valida coherencia.
Aplicado factura por factura según su Incoterm específico.

IMPORTANTE: Evalúa TODAS las facturas (${mappings.length} facturas), no solo la primera.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Val. Seguros total', value: valorSeguros },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Observaciones', value: observaciones },
            { name: 'Total de facturas a evaluar', value: mappings.length },
          ],
        },
        'Facturas individuales': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
        },
      },
      EXTERNAL: {
        'Apéndice 14': {
          data: [{ name: 'Apéndice 14', value: apendice14 }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateFletesPorFacturaEscenario3(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  transportDocument?: OCR,
  carta318?: OCR
) {
  const fletes = pedimento.encabezadoPrincipalDelPedimento.incrementables.fletes;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;

  const facturaDetails = mappings.map(mapping => ({
    name: `Fletes individual - Factura ${mapping.factura.invoice_number}`,
    value: {
      incotermFactura: mapping.factura.payment_terms,
      valorFlete: getIncrementablesFromFactura(mapping.factura, 'fletes'),
      moneda: mapping.factura.currency_code,
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Fletes por factura',
    description: 'Valida fletes por factura según su Incoterm individual',
    prompt: `Evalúa cada factura según su Incoterm específico:
• Para EXW, FCA, FAS, FOB → flete debe existir y estar documentado
• Para CFR, CIF, CPT, CIP, DAP, DPU, DDP → flete incluido, no debe declararse
Convierte a MXN y valida coherencia factura por factura.

IMPORTANTE: Evalúa TODAS las facturas (${mappings.length} facturas), no solo la primera.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Fletes total', value: fletes },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Total de facturas a evaluar', value: mappings.length },
          ],
        },
        'Facturas individuales': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
        },
        'Documento transporte': {
          data: [{ name: 'Documento transporte', value: transportDocument?.markdown_representation }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateEmbalajesPorFacturaEscenario3(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  transportDocument?: OCR,
  carta318?: OCR
) {
  const embalajes = pedimento.encabezadoPrincipalDelPedimento.incrementables.embalajes;

  const facturaDetails = mappings.map(mapping => ({
    name: `Embalajes individual - Factura ${mapping.factura.invoice_number}`,
    value: {
      embalajes: getIncrementablesFromFactura(mapping.factura, 'embalajes'),
      moneda: mapping.factura.currency_code,
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Embalajes por factura',
    description: 'Valida embalajes por factura individual',
    prompt: `Evalúa embalajes factura por factura:
• Verifica valores documentados vs declarados
• Suma individual de cada factura
• Valida consistencia con documentos soporte
Tolerancia individual por factura.

IMPORTANTE: Evalúa TODAS las facturas (${mappings.length} facturas), no solo la primera.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Embalajes total', value: embalajes },
            { name: 'Total de facturas a evaluar', value: mappings.length },
          ],
        },
        'Facturas individuales': {
          data: facturaDetails,
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
        },
        'Documento transporte': {
          data: [{ name: 'Documento transporte', value: transportDocument?.markdown_representation }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateOtrosIncrementablesPorFacturaEscenario3(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const otrosIncrementables = pedimento.encabezadoPrincipalDelPedimento.incrementables.otrosIncrementables;
  const observaciones = pedimento.observacionesANivelPedimento;

  const facturaDetails = mappings.map(mapping => ({
    name: `Otros incrementables individual - Factura ${mapping.factura.invoice_number}`,
    value: {
      incotermFactura: mapping.factura.payment_terms,
      otrosIncrementables: getIncrementablesFromFactura(mapping.factura, 'otrosIncrementables'),
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const validation = {
    name: 'Otros incrementables por factura',
    description: 'Valida otros incrementables por factura según su Incoterm específico',
    prompt: `Evalúa otros incrementables factura por factura:
• Cada cargo debe tener soporte documental individual
• No debe duplicar costos cubiertos por el Incoterm específico de cada factura
• Valida aplicación correcta según Incoterm individual
• Suma coherencia total vs individual

IMPORTANTE: Evalúa TODAS las facturas (${mappings.length} facturas), no solo la primera.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Otros incrementables total', value: otrosIncrementables },
            { name: 'Total de facturas a evaluar', value: mappings.length },
          ],
        },
        'Facturas individuales': {
          data: facturaDetails,
        },
        Observaciones: {
          data: [{ name: 'Observaciones', value: observaciones }],
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateValorAduanaGlobalEscenario3(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[]
) {
  const valorAduanaTotal = pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const partidas = pedimento.partidas || [];

  const facturaDetails = mappings.map(mapping => ({
    name: `Valor comercial + Incrementables - Factura ${mapping.factura.invoice_number}`,
    value: {
      valorComercial: mapping.factura.valor_comercial || mapping.factura.total_amount,
      incrementablesProrrateados: 'Calculado según prorrateo',
      numeroFactura: mapping.factura.invoice_number
    }
  }));

  const partidaDetails = partidas.map((partida, index) => ({
    name: `Valor Aduana - Partida ${index + 1}`,
    value: {
      valorAduanaPartida: partida.valorEnAduanaOValorEnUSD,
      fraccionArancelaria: partida.fraccion
    }
  }));

  const validation = {
    name: 'Valor aduana global',
    description: 'Valida que suma de partidas sea igual al valor aduana total y coherencia con facturas',
    prompt: `Suma Valor Aduana de todas las partidas.
Debe ser igual al Valor Aduana total del pedimento (tolerancia ±1%).
Además, valida que Valor Aduana total = Σ(Valor comercial factura + Incrementables prorrateados).

IMPORTANTE: Considera TODAS las facturas (${mappings.length} facturas) en el cálculo.`,
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Valor aduana total', value: valorAduanaTotal },
            { name: 'Total de facturas a evaluar', value: mappings.length },
          ],
        },
        'Partidas': {
          data: partidaDetails,
        },
        'Facturas con prorrateo': {
          data: facturaDetails,
        },
      },
    },
  };

  return await glosar(validation, traceId, 'o3-mini');
}

// Función original para escenario 1 y 3
async function validateMultipleFacturasIncoterms(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  validationType: 'valSeguros' | 'seguros' | 'fletes' | 'embalajes' | 'otrosIncrementables',
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  // Detectar escenario y usar validaciones específicas para escenario 2
  const facturasIncoterms = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || [];
  const scenarioType = getScenarioType(mappings, facturasIncoterms);
  
  if (scenarioType === 'multiple_single_incoterm') {
    // Para escenario 2, usar las validaciones específicas
         switch (validationType) {
       case 'valSeguros':
         return await validateValSegurosPorFactura(traceId, pedimento, mappings, carta318);
       case 'seguros':
         return await validateSegurosPedimentoVsSuma(traceId, pedimento, mappings);
       case 'fletes':
         return await validateFletesEscenario2(traceId, pedimento, mappings, transportDocument, carta318);
       case 'embalajes':
         return await validateEmbalajesEscenario2(traceId, pedimento, mappings, transportDocument, carta318);
       case 'otrosIncrementables':
         return await validateOtrosIncrementablesEscenario2(traceId, pedimento, mappings);
     }
  }

  // Para escenarios 1 y 3, mantener lógica original
  const fechaEntrada = pedimento.encabezadoPrincipalDelPedimento.fechas.entrada;
  const tipoCambioDOF = await getExchangeRate(new Date(fechaEntrada ?? new Date()));
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  
  // Obtener el valor específico según el tipo de validación
  const getValorFromPedimento = () => {
    const incrementables = pedimento.encabezadoPrincipalDelPedimento.incrementables;
    switch (validationType) {
      case 'valSeguros': return incrementables.valorSeguros;
      case 'seguros': return incrementables.seguros;
      case 'fletes': return incrementables.fletes;
      case 'embalajes': return incrementables.embalajes;
      case 'otrosIncrementables': return incrementables.otrosIncrementables;
    }
  };

  const valorDeclarado = getValorFromPedimento();
  
  // Crear contexto de mappings
  const mappingDetails = mappings.map((mapping) => ({
    name: `${validationType} - Factura ${mapping.factura.invoice_number}`,
    value: {
      incotermFactura: mapping.factura.payment_terms,
      valorFactura: mapping.factura.total_amount,
      monedaFactura: mapping.factura.currency_code,
      incrementablesFactura: getIncrementablesFromFactura(mapping.factura, validationType),
      matchType: mapping.matchType,
      confidence: mapping.confidence
    }
  }));

  // Para una factura, usar contextos más específicos
  const contexts = scenarioType === 'single_invoice' ? {
    PROVIDED: {
      Pedimento: {
        data: [
          { name: validationType === 'valSeguros' ? 'Val. Seguros' : validationType.charAt(0).toUpperCase() + validationType.slice(1), value: valorDeclarado },
          { name: 'Tipo de cambio', value: tipoCambio },
          ...(validationType === 'valSeguros' ? [
            { name: 'Precio pagado / valor comercial', value: pedimento.encabezadoPrincipalDelPedimento.valores.precioPagadoOValorComercial },
            { name: 'Clave de pedimento', value: pedimento.encabezadoPrincipalDelPedimento.claveDePedimento }
          ] : []),
          { name: 'Observaciones', value: observaciones },
          { name: 'Incoterm', value: facturasIncoterms[0] },
        ],
      },
      'Carta 318': {
        data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
      },
      Factura: {
        data: [{ name: 'Factura', value: invoice?.markdown_representation }],
      },
      'Documento de transporte': {
        data: [{ name: 'Documento de transporte', value: transportDocument?.markdown_representation }],
      },
      COVE: {
        data: [{ name: 'COVE', value: mappings[0]?.cove }],
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
  } : {
    // Contextos para múltiples facturas (escenario 3)
    PROVIDED: {
      Pedimento: {
        data: [
          { name: `${validationType}`, value: valorDeclarado },
          { name: 'Tipo de cambio', value: tipoCambio },
          { name: 'Observaciones', value: observaciones },
          { name: 'Incoterms de facturas', value: facturasIncoterms },
        ],
      },
      'Mappings de facturas': {
        data: mappingDetails,
      },
      'Carta 318': {
        data: [{ name: 'Carta 318', value: carta318?.markdown_representation }],
      },
      Factura: {
        data: [{ name: 'Factura', value: invoice?.markdown_representation }],
      },
      'Documento de transporte': {
        data: [{ name: 'Documento de transporte', value: transportDocument?.markdown_representation }],
      },
    },
    EXTERNAL: {
      'Tipo de cambio DOF': {
        data: [{ name: 'Tipo de cambio DOF', value: tipoCambioDOF }],
      },
      'Apendice 14 (Incoterms)': {
        data: [{ name: 'Definiciones Incoterm (Apendice 14)', value: apendice14 }],
      },
      'Incoterms con Transporte y Seguro': {
        data: [{ name: 'Incoterms', value: incotermLogic }],
      },
    },
  };

  const validation = {
    name: scenarioType === 'single_invoice' ? 
      (validationType === 'valSeguros' ? 'Val. Seguros' : validationType.charAt(0).toUpperCase() + validationType.slice(1)) :
      `${validationType} (Múltiples facturas)`,
    description: scenarioType === 'single_invoice' ?
      `Validación de ${validationType} para una factura con Incoterm específico` :
      `Valida ${validationType} considerando múltiples facturas y sus incoterms`,
    prompt: getPromptForValidationType(validationType, facturasIncoterms, mappings),
    contexts,
  };

  return await glosar(validation as any, traceId, 'o3-mini');
}

function getIncrementablesFromFactura(factura: Factura, tipo: string) {
  if (!factura.incrementables) return null;
  
  switch (tipo) {
    case 'seguros': 
    case 'valSeguros': 
      return factura.incrementables.seguros;
    case 'fletes': 
      return factura.incrementables.fletes;
    case 'embalajes': 
      return factura.incrementables.embalajes;
    case 'otrosIncrementables': 
      return factura.incrementables.otros;
    default: 
      return null;
  }
}

async function validateValSeguros(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  return await validateMultipleFacturasIncoterms(
    traceId, pedimento, mappings, 'valSeguros', invoice, transportDocument, carta318
  );
}

async function validateSeguros(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  return await validateMultipleFacturasIncoterms(
    traceId, pedimento, mappings, 'seguros', invoice, transportDocument, carta318
  );
}

async function validateFletes(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  return await validateMultipleFacturasIncoterms(
    traceId, pedimento, mappings, 'fletes', invoice, transportDocument, carta318
  );
}

async function validateEmbalajes(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  return await validateMultipleFacturasIncoterms(
    traceId, pedimento, mappings, 'embalajes', invoice, transportDocument, carta318
  );
}

async function validateOtrosIncrementables(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  return await validateMultipleFacturasIncoterms(
    traceId, pedimento, mappings, 'otrosIncrementables', invoice, transportDocument, carta318
  );
}

async function validateValorDolares(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  carta318?: OCR
) {
  const scenarioType = getScenarioType(mappings, pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || []);
  
  // Para escenario 2, usar validación específica
  if (scenarioType === 'multiple_single_incoterm') {
    return await validateValorDolaresEscenario2(traceId, pedimento, mappings);
  }

  const valorDolares =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorDolares;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const valorAduana =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const observaciones = pedimento.observacionesANivelPedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  
  if (scenarioType === 'single_invoice') {
    const validation = {
      name: 'Valor dólares',
      description: 'Valida que el valor en dólares del pedimento sea igual al valor aduana dividido entre el tipo de cambio',
      prompt: 'El valor en dólares debe ser igual a Valor Aduana ÷ Tipo de cambio y coincidir con el valor comercial más incrementables en USD. Redondeado a 2 decimales.',
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
  } else {
    // Escenario 3: Múltiples facturas con diferentes incoterms
    const facturaDetails = mappings.map(mapping => ({
      name: `Valor USD - Factura ${mapping.factura.invoice_number}`,
      value: {
        valorFactura: mapping.factura.total_amount,
        monedaFactura: mapping.factura.currency_code,
        valorUSD: mapping.factura.currency_code === 'USD' ? mapping.factura.total_amount : null,
        matchType: mapping.matchType
      }
    }));
    
    const validation = {
      name: 'Valor dólares (Múltiples facturas)',
      description: 'Valida que el valor en dólares del pedimento sea igual al valor aduana dividido entre el tipo de cambio considerando múltiples facturas',
      prompt: `El valor en dólares declarado debe ser igual al valor aduana dividido entre el tipo de cambio (Valor USD = Valor Aduana MXN ÷ Tipo de Cambio). 
      
      Con múltiples facturas (${mappings.length} mapeadas):
      1. Si todas las facturas están en USD: suma directa de valores USD
      2. Si hay facturas en MXN: convierte usando el tipo de cambio del pedimento
      3. El total debe coincidir con el valor dólares declarado (±2 decimales)
      
      Valida únicamente que el cálculo del valor dólares sea correcto.`,
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
          'Múltiples facturas': {
            data: facturaDetails,
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
}

async function validateValorComercial(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
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

  const scenarioType = getScenarioType(mappings, pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || []);

  if (scenarioType === 'single_invoice') {
    const validation = {
      name: 'Precio pagado',
      description: 'Valida que el valor comercial sea consistente con factura y cálculo de valor aduana',
      prompt: 'El valor comercial = Valor Aduana - Total Incrementables. Debe coincidir con el valor comercial de la factura (±2%) y debe ser ≤ valor aduana.',
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
    };
    return await glosar(validation, traceId, 'o3-mini');
  } else {
    // Mantener lógica existente para múltiples facturas
    const facturaDetails = mappings.map(mapping => ({
      name: `Valor comercial - Factura ${mapping.factura.invoice_number}`,
      value: {
        valorFactura: mapping.factura.total_amount,
        monedaFactura: mapping.factura.currency_code,
        valorComercialFactura: mapping.factura.valor_comercial || mapping.factura.total_amount,
        matchType: mapping.matchType
      }
    }));

    const totalFacturas = mappings.reduce((sum, mapping) => 
      sum + (mapping.factura.valor_comercial || mapping.factura.total_amount), 0);

    const validation = {
      name: 'Precio pagado (Múltiples facturas)',
      description:
        'Valida que el valor comercial sea consistente con múltiples facturas y el cálculo de valor aduana',
      prompt:
        `El valor comercial representa el precio pagado por la mercancía sin incluir incrementables.
        
        Con múltiples facturas (${mappings.length} mapeadas):
        1. Valor Comercial = Valor Aduana - Total Incrementables
        2. Debe ser ≤ valor aduana
        3. Debe coincidir con la suma de valores comerciales de todas las facturas
        4. Tolerancia: redondeos mínimos hacia arriba son aceptables
        
        Total de facturas: ${totalFacturas}
        Valor comercial declarado: ${valorComercial || 0}`,
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
          'Múltiples facturas': {
            data: facturaDetails,
          },
          'Resumen facturas': {
            data: [
              { name: 'Total valor comercial facturas', value: totalFacturas },
              { name: 'Diferencia vs pedimento', value: Math.abs(totalFacturas - (valorComercial || 0)) },
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
    };
    return await glosar(validation, traceId, 'o3-mini');
  }
}

async function validateValorAduana(
  traceId: string,
  pedimento: Pedimento,
  mappings: FacturaCoveMapping[],
  invoice?: OCR,
  carta318?: OCR
) {
  const scenarioType = getScenarioType(mappings, pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || []);
  
  // Para escenario 2, usar validación específica
  if (scenarioType === 'multiple_single_incoterm') {
    return await validateValorAduanaEscenario2(traceId, pedimento, mappings);
  }

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
    name: scenarioType === 'single_invoice' ? 'Valor aduana' : 'Valor aduana (Múltiples facturas)',
    description: scenarioType === 'single_invoice' ? 
      'Valida que el valor aduana sea la base correcta para contribuciones' :
      'Valida que el valor aduana sea la base correcta para contribuciones considerando múltiples facturas',
    prompt: scenarioType === 'single_invoice' ?
      'El valor aduana = Valor Comercial + Total Incrementables. Debe ser ≥ valor comercial y la diferencia debe corresponder exactamente a los incrementables.' :
      `El valor aduana es la base para calcular contribuciones.
      
      Fórmula: Valor Aduana = Valor Comercial + Total Incrementables
      
      Con múltiples facturas (${mappings.length} mapeadas):
      1. Debe ser ≥ valor comercial
      2. La diferencia debe corresponder exactamente a los incrementables declarados
      3. Considera incrementables documentados en todas las facturas, carta 318 y documentos de transporte
      4. Ajustes en observaciones deben estar justificados`,
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
        ...(scenarioType !== 'single_invoice' && {
          'Múltiples facturas': {
            data: mappings.map(mapping => ({
              name: `Incrementables - Factura ${mapping.factura.invoice_number}`,
              value: {
                incrementablesFactura: mapping.factura.incrementables,
                decrementablesFactura: mapping.factura.decrementables,
                valorFactura: mapping.factura.total_amount,
                monedaFactura: mapping.factura.currency_code
              }
            })),
          },
        }),
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  };

  return await glosar(validation as any, traceId, 'o3-mini');
}

export async function operacionMonetaria({
  pedimento,
  coves,
  facturas,
  invoice,
  transportDocument,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  coves: Cove[];
  facturas?: Factura[];
  invoice?: OCR;
  transportDocument?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  // Mapear facturas con COVEs si están disponibles
  const mappingResult = mapFacturasWithCoves(facturas || [], coves);
  const facturasIncoterms = pedimento.datosDelProveedorOComprador?.[0]?.facturas?.map(f => f.incoterm) || [];
  const scenarioType = getScenarioType(mappingResult.mappings, facturasIncoterms);
  
  // Validaciones base comunes a todos los escenarios
  const baseValidations = [
    validateTransportDocumentEntryDate(traceId, pedimento, transportDocument),
    validateTipoCambio(traceId, pedimento),
  ];

  // Validaciones específicas según escenario
  if (scenarioType === 'multiple_single_incoterm') {
    // Escenario 2: Múltiples facturas, mismo Incoterm - 8 validaciones específicas
    const escenario2Validations = [
      validateIncotermUnico(traceId, pedimento, mappingResult.mappings),
      validateValSegurosPorFactura(traceId, pedimento, mappingResult.mappings, carta318),
      validateSegurosPedimentoVsSuma(traceId, pedimento, mappingResult.mappings),
      validateFletesEscenario2(traceId, pedimento, mappingResult.mappings, transportDocument, carta318),
      validateEmbalajesEscenario2(traceId, pedimento, mappingResult.mappings, transportDocument, carta318),
      validateOtrosIncrementablesEscenario2(traceId, pedimento, mappingResult.mappings),
      validateValorDolaresEscenario2(traceId, pedimento, mappingResult.mappings),
      validateValorAduanaEscenario2(traceId, pedimento, mappingResult.mappings),
    ];
    
    const validationsPromise = await Promise.all([...baseValidations, ...escenario2Validations]);
    
    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  } else if (scenarioType === 'multiple_different_incoterms') {
    // Escenario 3: Múltiples facturas con diferentes Incoterms - 8 validaciones específicas
    const escenario3Validations = [
      validateIncotermVsMedioTransporte(traceId, pedimento, mappingResult.mappings, transportDocument),
      validateIncotermPorFactura(traceId, pedimento, mappingResult.mappings, carta318),
      validateProrrateoIncrementables(traceId, pedimento, mappingResult.mappings),
      validateValSegurosPorFacturaEscenario3(traceId, pedimento, mappingResult.mappings, carta318),
      validateFletesPorFacturaEscenario3(traceId, pedimento, mappingResult.mappings, transportDocument, carta318),
      validateEmbalajesPorFacturaEscenario3(traceId, pedimento, mappingResult.mappings, transportDocument, carta318),
      validateOtrosIncrementablesPorFacturaEscenario3(traceId, pedimento, mappingResult.mappings),
      validateValorAduanaGlobalEscenario3(traceId, pedimento, mappingResult.mappings),
    ];
    
    const validationsPromise = await Promise.all([...baseValidations, ...escenario3Validations]);
    
    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  } else {
    // Escenario 1: Una factura - validaciones originales
    const validationsPromise = await Promise.all([
      ...baseValidations,
      validateValSeguros(
        traceId,
        pedimento,
        mappingResult.mappings,
        invoice,
        transportDocument,
        carta318
      ),
      validateSeguros(traceId, pedimento, mappingResult.mappings, invoice, transportDocument, carta318),
      validateFletes(traceId, pedimento, mappingResult.mappings, invoice, transportDocument, carta318),
      validateEmbalajes(traceId, pedimento, mappingResult.mappings, invoice, transportDocument, carta318),
      validateOtrosIncrementables(
        traceId,
        pedimento,
        mappingResult.mappings,
        invoice,
        transportDocument,
        carta318
      ),
      validateValorDolares(traceId, pedimento, mappingResult.mappings, invoice, carta318),
      validateValorComercial(traceId, pedimento, mappingResult.mappings, invoice, carta318),
      validateValorAduana(traceId, pedimento, mappingResult.mappings, invoice, carta318),
    ]);

    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  }
}



