import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice14 } from '../../anexo-22/apendice-14';
import { getExchangeRate } from '../../exchange-rate';
import incotermLogic from '../../incoterms-logic.json';
import { glosar } from '../../validation-result';


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

async function validateValSeguros(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const valSeguros =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.valorSeguros;
  const precioPagadoValorComercial =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const clavePedimento =
    pedimento.encabezadoPrincipalDelPedimento.claveDePedimento;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;
  const incoterms = incotermLogic;

  const PROMPT_COMMON = (scenario: string) => `
  Eres un verificador aduanero experto. Devuelves JSON.
  Escenario detectado: ${scenario}

  ⚠️  Reglas comunes (siempre):
  1. Usa Apéndice 14 para validar Incoterm ↔ Seguro.
  2. Convierte USD→MXN con el TC indicado.
  3. Devuelve:
    { "escenario": "...", "facturas":[ ... ] }
  `;

   const PROMPT_ONE_N = `
  Caso: una sola factura con un único Incoterm.  
  “Valor Seguros” es el total de mercancía asegurada.
  
  – Si el Incoterm tiene incluye_seguro = true (CIP, CIF), espera que “Valor Seguros” exista y sea coherente con el valor comercial; si falta o es irrisorio ⇒ ERROR (omisión).  
  – Si el Incoterm tiene incluye_seguro = false, la presencia de “Valor Seguros” es opcional. Cuando exista, compara contra la póliza o certificado; acepta ±5 %.  
  `;
  
  /* ONE_N – varias facturas con el mismo Incoterm */
   const PROMPT_ONE_ONE = `
  Escenario: varias facturas, mismo Incoterm.
  
  1. Confirma que todas citen exactamente el mismo Incoterm; diferencia ⇒ ERROR.  
  2. Si incluye_seguro = true (CIP, CIF)  
     · “Valor Seguros” debe cubrir el valor comercial global; si falta ⇒ ERROR (omisión).  
  3. Si incluye_seguro = false  
     · “Valor Seguros” es opcional; cuando exista, la suma de valores asegurados de pólizas o certificados debe coincidir ±5 %.  
  `;
  
  /* N_N – varias facturas con Incoterms distintos */
   const PROMPT_N_N = `
  Escenario: varias facturas con Incoterms distintos.
  
  • Verifica compatibilidad de modo de transporte; mezcla incompatible ⇒ ERROR.  
  • Para facturas CIP / CIF (incluye_seguro = true), cada una debe aportar un valor asegurado coherente; ausencia ⇒ ERROR (omisión).  
  • Para los demás Incoterms, el valor asegurado es opcional:  
    – Si se declara, contrástalo con el valor comercial y póliza individual ±5 %.  
  • Compara la suma de valores asegurados individuales con “Valor Seguros” total; diferencia >5 % ⇒ DISCREPANCIA_GLOBAL.
  `;

  const facturas = pedimento.datosDelProveedorOComprador?.[0]?.facturas || [];
  const numberOfFacturas = facturas.length;

  let allIncotermsAreSame = true;
  if (numberOfFacturas > 1) {
    const firstIncoterm = facturas[0]?.incoterm;
    if (firstIncoterm !== undefined) {
      allIncotermsAreSame = facturas
        .slice(1)
        .every((factura) => factura?.incoterm === firstIncoterm);
    } else {
      allIncotermsAreSame = false;
    }
  }

  let scenario = '';
  let specificPrompt = '';

  if (numberOfFacturas === 1) {
    scenario = 'solo hay 1 factura';
    specificPrompt = PROMPT_ONE_ONE;
  } else if (numberOfFacturas > 1 && allIncotermsAreSame) {
    scenario = 'varias facturas con el mismo Incoterm';
    specificPrompt = PROMPT_ONE_N;
  } else if (numberOfFacturas > 1 && !allIncotermsAreSame) {
    scenario = 'varias facturas con distintos Incoterms';
    specificPrompt = PROMPT_N_N;
  } else {
    scenario = 'no se encontraron facturas o el escenario es desconocido';
    specificPrompt = 'No se puede aplicar una validación específica sin información de facturas.';
  }

  const fullPrompt = `${PROMPT_COMMON(scenario)}
${specificPrompt}`;

  const validation = {
    name: 'Val. Seguros',
    description:
      "Verifica que el campo 'Val. Seguros' (valor total de las mercancías aseguradas en MXN) cumpla con los lineamientos de llenado.",
    prompt: fullPrompt,
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
            { name: 'Clave de Pedimento', value: clavePedimento },
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
        'Apendice 14 (Incoterms)': {
          data: [
            { name: 'Definiciones Incoterm (Apendice 14)', value: apendice14 },
          ],
        },
        'Incoterms con Transporte y Seguro': {
          data: [
            { name: 'Incoterms', value: incoterms },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'o3-mini');
}

async function validateSeguros(
  traceId: string,
  pedimento: Pedimento,
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const seguros =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.seguros;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Seguros',
    description:
      'Valida que el valor de seguros declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:`Valida el campo “Seguros” (costo de seguro incrementable) y señala riesgo de **omisión** o **duplicidad**.

      • Clasifica el escenario:  
        – ONE_ONE (1 factura) · ONE_N (múltiples facturas, mismo Incoterm) · N_N (múltiples facturas, Incoterms distintos).

      • Para cada factura extrae cualquier cargo de seguro presente en Carta 318, Factura o Documento de transporte y conviértelo a MXN con el tipo de cambio del pedimento.

      • Incoterm CIP / CIF → el seguro está incluido en el precio:  
        – Si “Seguros” > 0 o los documentos añaden un cargo, emite advertencia de **duplicidad** (fundamenta en Apéndice 14).  
        – Si “Seguros” = 0 y no hay cargo documentado, considera correcto.

      • Incoterms distintos de CIP / CIF → el seguro debe declararse aparte:  
        – Si “Seguros” = 0 o no existe cargo en documentos, marca **omisión de incrementable**.  
        – Si se declara monto, compara con la suma de cargos documentados (±3 %); si la diferencia supera el margen, marca **discrepancia**.  
        – Si se declara monto sin respaldo documental, marca **sin respaldo**.

      • ONE_N → confirma que todas las facturas usan el mismo Incoterm; discrepancia = error.  
      • N_N  → verifica que los Incoterms sean compatibles con el mismo modo de transporte o “cualquier”; mezcla incompatible = error, luego aplica la regla anterior por factura y compara la suma de cargos con “Seguros” total (±3 %).

      • Póliza global anual: si observaciones o documentos la mencionan, acepta que no haya cargos individuales siempre que “Seguros” muestre un prorrateo razonable; de lo contrario, marca omisión o falta de respaldo.

      Cita Apéndice 14 y la documentación que respalde cada conclusión.
      `,
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
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const fletes =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.fletes;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Fletes',
    description:
      'Valida que el valor de fletes declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
`
Valida el campo “Fletes” (costo de transporte incrementable) y detecta riesgo de **omisión** o **duplicidad** tomando la lógica de Incoterms provista.

• Clasifica el escenario: ONE_ONE · ONE_N · N_N.

• Extrae en cada factura cualquier cargo de flete documentado (Carta 318, Factura, BL/AWB/CMR) y conviértelo a MXN con el tipo de cambio del pedimento.

• Aplica las reglas según la tabla:

  – Incoterms con **incluye_flete = true**  
    CIF, CIP, CFR, CPT, DAP, DPU, DDP  
    · El flete ya forma parte del precio.  
    · Si “Fletes” > 0 o el documento muestra un cargo extra ⇒ ADVERTENCIA por **duplicidad**.

  – Incoterms con **incluye_flete = false**  
    EXW, FCA, FAS, FOB  
    · El flete debe declararse aparte (incrementable_flete = “sí”).  
    · Si “Fletes” = 0 o no hay cargo documentado ⇒ ERROR por **omisión de incrementable**.  
    · Si se declara monto, compara con la suma de cargos documentados (±3 %); diferencia mayor ⇒ ERROR por **discrepancia**.  
    · Si se declara monto sin respaldo documental ⇒ ERROR por **sin respaldo**.

• ONE_N → asegúrate de que todas las facturas citen el mismo Incoterm; cualquier diferencia = ERROR_INCONSISTENTE.

• N_N → verifica compatibilidad del modo de transporte:  
  · FAS, FOB, CFR y CIF son marítimos; mezclar con FCA (cualquier) es válido, pero mezclar marítimo con EXW terrestre puramente se acepta solo si alguno está marcado “cualquier”.  Si hay mezcla incompatible ⇒ ERROR_TRANSPORTE.  
  · Después aplica la regla anterior por factura y comprueba que la suma de cargos documentados coincida con “Fletes” total (±3 %).

• Contrato marco/póliza global de flete: si las observaciones lo mencionan, acepta que no existan cargos individuales siempre que “Fletes” muestre un prorrateo razonable; si no, marca omisión o falta de respaldo.

Cita siempre la fila de la tabla de Incoterms o el documento que respalde cada advertencia o error.
`,
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
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const embalajes =
    pedimento.encabezadoPrincipalDelPedimento.incrementables.embalajes;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Embalajes',
    description:
      'Valida que el valor de embalajes declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      `
Valida el campo “Embalajes” (costo de material y mano de obra de empaque) y detecta riesgo de **omisión**, **duplicidad** o **falta de respaldo**.

• Clasifica el escenario: ONE_ONE · ONE_N · N_N.

• Para cada factura, localiza cualquier cargo de embalaje en Carta 318, Factura o Documento de transporte y conviértelo a MXN con el tipo de cambio del pedimento.

• Regla Incoterm-Embalaje (aplica a **todos** los Incoterms; el vendedor debe asumir embalaje básico conforme a las reglas 9 A/9 B):  
  – Si los documentos **no** desglosan un cargo de embalaje y el pedimento declara un valor > 0 en “Embalajes” ⇒ ADVERTENCIA de **duplicidad** (el costo ya está incluido en el precio).  
  – Si los documentos **sí** muestran un cargo separado y “Embalajes” = 0 ⇒ ERROR por **omisión de incrementable**.  
  – Si ambos muestran monto, compara la suma documentada con el valor en el pedimento; tolera ±3 %.  
     · Diferencia > 3 % ⇒ ERROR por **discrepancia**.  
     · Si el pedimento declara monto y los documentos no coinciden en absoluto ⇒ ERROR por **sin respaldo**.

• ONE_N → comprueba que todas las facturas usen el mismo Incoterm; discrepancia = ERROR.  
• N_N  → mezcla de modos de transporte no afecta embalaje; aplica la regla factura por factura y verifica que la suma documentada coincida con “Embalajes” total ±3 %.

• Contrato o póliza global de embalaje especial: si observaciones la mencionan, acepta que los documentos no muestren cargos individuales siempre que “Embalajes” presente un prorrateo razonable; de lo contrario, marca omisión o sin respaldo.

Cita la cláusula 9 A/9 B de los Incoterms 2020 o la documentación correspondiente para justificar cada advertencia o error.
`,
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
  invoice?: OCR,
  transportDocument?: OCR,
  carta318?: OCR
) {
  const incoterm =
    pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  const otrosIncrementables =
    pedimento.encabezadoPrincipalDelPedimento.incrementables
      .otrosIncrementables;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const observaciones = pedimento.observacionesANivelPedimento;
  const carta318mkdown = carta318?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Otros incrementables',
    description:
      'Valida que el valor de otros incrementables declarado en el pedimento coincida con los documentos que lo avalan',
    prompt:
      `
Valida el campo “Otros incrementables” (cualquier gasto distinto de flete, seguro o embalaje) y detecta riesgo de **omisión**, **duplicidad** o **sin respaldo**.

• Clasifica el escenario: ONE_ONE · ONE_N · N_N.

• Para cada factura identifica cargos tales como: gastos de carga/descarga, maniobras, regalías, licencias, almacenaje previo al despacho, inspecciones especiales, documentos adicionales, etc. Extrae el monto, convierte a MXN con el tipo de cambio del pedimento y etiqueta cada concepto.

• Lógica general — independientemente del Incoterm:  
  – Si los documentos muestran cargos y el pedimento declara “Otros incrementables” = 0 ⇒ ERROR por **omisión**.  
  – Si el pedimento declara un monto y los documentos no muestran ningún cargo justificable ⇒ ERROR por **sin respaldo**.  
  – Si ambos declaran monto, compara la suma documentada con el valor en el pedimento; tolerancia ±3 %.  
    · Diferencia > 3 % ⇒ ERROR por **discrepancia**.  
    · Monto exacto o dentro del margen ⇒ OK.

• Ajuste por Incoterm:  
  – Cuando un Incoterm incluya implícitamente cierto servicio (ej. inspección de exportación bajo FOB, despacho en origen bajo FCA), no debería añadirse como “Otros incrementables”.  
    · Si se detecta un cargo adicional por un servicio ya cubierto por el vendedor según Incoterm, emite ADVERTENCIA por **duplicidad** y cita Apéndice 14.  
  – Si el servicio corresponde al comprador según el Incoterm y no se refleja en “Otros incrementables”, marca omisión.

• ONE_N → confirma que todas las facturas usen el mismo Incoterm; discrepancia = ERROR.  
• N_N  → mezcla de modos transporte no afecta “Otros incrementables”; aplica la regla por factura y verifica que la suma documentada coincida con el total del pedimento ±3 %.

• Contrato marco o tarifa anual: si observaciones indican un acuerdo global para algún servicio (ej. inspección fitosanitaria anual), acepta ausencia de cargos individuales siempre que “Otros incrementables” refleje un prorrateo razonable; de lo contrario, marca omisión o falta de respaldo.

Cita la cláusula pertinente del Incoterm o la línea exacta del documento que justifique cada advertencia o error.
`,
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
  invoice?: OCR,
  carta318?: OCR
) {
  const valorDolares =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorDolares;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const valorAduana =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const observaciones = pedimento.observacionesANivelPedimento;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Valor dólares',
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

  const validation = {
    name: 'Precio pagado',
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
  invoice?: OCR,
  carta318?: OCR
) {
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
    name: 'Valor aduana',
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

export async function operacionMonetaria({
  pedimento,
  invoice,
  transportDocument,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  invoice?: OCR;
  transportDocument?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateTransportDocumentEntryDate(traceId, pedimento, transportDocument),
    validateTipoCambio(traceId, pedimento),
    validateValSeguros(
      traceId,
      pedimento,
      invoice,
      transportDocument,
      carta318
    ),
    validateSeguros(traceId, pedimento, invoice, transportDocument, carta318),
    validateFletes(traceId, pedimento, invoice, transportDocument, carta318),
    validateEmbalajes(traceId, pedimento, invoice, transportDocument, carta318),
    validateOtrosIncrementables(
      traceId,
      pedimento,
      invoice,
      transportDocument,
      carta318
    ),
    validateValorDolares(traceId, pedimento, invoice, carta318),
    validateValorComercial(traceId, pedimento, invoice, carta318),
    validateValorAduana(traceId, pedimento, invoice, carta318),
  ]);

  return {
    sectionName: 'Operación monetaria',
    validations: validationsPromise,
  };
}



