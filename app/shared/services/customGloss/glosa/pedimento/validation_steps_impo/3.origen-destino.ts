import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice15 } from '../../anexo-22/apendice-15';
import { glosar } from '../../validation-result';

async function validateClaveApendice15(traceId: string, pedimento: Pedimento) {
  const claveDestinoOrigen = pedimento.encabezadoPrincipalDelPedimento.destino;
  const observaciones = pedimento.observacionesANivelPedimento;

  const validation = {
    name: 'Destino/Origen',
    prompt: 'La clave de destino/origen debe existir en el Apéndice 15',
    description: 'La clave de destino/origen debe existir en el Apéndice 15',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Clave de destino/origen', value: claveDestinoOrigen },
            { name: 'Observaciones', value: observaciones },
          ],
        },
      },
      EXTERNAL: {
        Apendices: {
          data: [{ name: 'Apéndice 15', value: JSON.stringify(apendice15) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}

// We are waiting on a catalog of allowed aduana entries/exits given a transport type
/* async function validateAduanaSeccion(traceId: string, pedimento: Pedimento) {
  const aduanaEntradaOSalida = pedimento.encabezadoPrincipalDelPedimento.aduanaEntradaOSalida;
  const entradaSalida = pedimento.encabezadoPrincipalDelPedimento.mediosTransporte.entradaSalida;

  const validation = {
    name: 'Aduana Entrada/Salida',
    prompt: 'El tipo de transporte debe ser permitido en la aduana de entrada/salida',
    description: 'El tipo de transporte debe ser permitido en la aduana de entrada/salida',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Aduana de entrada/salida', value: aduanaEntradaOSalida },
            { name: 'Tipo de transporte', value: entradaSalida },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
} */

// TODO: We need to support multiple facturas, and cartas regla 318, also we dont' need an AI call
/* async function validateIncoterms(traceId: string, pedimento: Pedimento['datosDelProveedorOComprador'][number]['facturas'][number], factura: Factura, CartaRegla318?: CartaRegla318) {
  const incotermPedimento = pedimento.incoterm;
  const incotermFactura = factura.payment_terms;
  const incotermCartaRegla318 = CartaRegla318?.termino_facturacion;

  const validation = {
    name: 'Incoterms',
    prompt: 'Los incoterms deben ser consistentes entre el pedimento, la factura y la carta regla 318',
    description: 'Los incoterms deben ser consistentes entre el pedimento, la factura y la carta regla 318',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Incoterm del pedimento', value: incotermPedimento },
          ],
        },
        factura: {
          data: [
            { name: 'Incoterm de la factura', value: incotermFactura },
          ],
        },
        cartaRegla318: {
          data: [
            { name: 'Incoterm de la carta regla 318', value: incotermCartaRegla318 },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
} */

// We are waiting on a catalog of allowed aduana entries/exits given a transport type
/* async function validateFraccionContraAduana(traceId: string, pedimento: Pedimento, partida: Partida) {
  const aduanaEntradaOSalida = pedimento.encabezadoPrincipalDelPedimento.aduanaEntradaOSalida;
  const fraccion = partida.fraccion;

  const validation = {
    name: 'Fracción contra aduana',
    prompt: 'La fraccion contra aduana debe ser permitida en la aduana de entrada/salida',
    description: 'La fraccion contra aduana debe ser permitida en la aduana de entrada/salida',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Aduana de entrada/salida', value: aduanaEntradaOSalida },
            { name: 'Fracción', value: fraccion },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
} */

export async function claveApendice15({
  pedimento,
  traceId,
}: {
  pedimento: Pedimento;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateClaveApendice15(traceId, pedimento),
  ]);

  return {
    sectionName: 'Clave de destino/origen',
    validations: validationsPromise,
  };
}


// TODO: Agregar analisis de riesgo, se comparan los número de aduana con el medio de transporte. 
// Prompt: Tu tarea es revisar que el medio de transporte sea coherente con la clave de la aduana. Los valores dados son del pedimento y del apéndice x donde se lista el nombre de la aduana. Solamente hay una excepción si el tipo de operación es TRA (tránsito), donde si es posible que exista una aduana distinta al medio de transporte. En este caso solamente marca una advertencia, que argumente por que si puede ser válido este caso.
// Contexto: Número de aduana del pedimento, medio de transporte comparada con el apendice. 

// TODO: Validar que el incoterm sea el mismo entre el pedimento, factura, carta regla 318, COVE y Carta de instrucciones, si hay multiples facturas marcar como correcto. .
// Contexto: Incoterm del pedimento, incoterm de la factura, incoterm de la carta regla 318, incoterm de la COVE y incoterm de la carta de instrucciones.

// TODO: Agregar análisis de riesgo, se debe revisar si el tipo de transporte declarado en el pedimento es coherente con el incoterm. 
// Prompt: Usando la tabla de incoterms con sus respectivos tipos de transporte permitidos, valida si el incoterm declarado corresponde con el medio de transporte del pedimento. 
// Si el tipo de transporte del pedimento no está entre los permitidos por el incoterm, marca un error.
// Contexto: Incoterm del pedimento, tipo de transporte declarado, tabla de incoterms con tipo de transporte permitido incoterms-logic.json.

// TODO: Agregar analisis de riesgo, se compara la fracción arancelaria con el tipo de aduana. POR REVISAR CON EQUIPO DE EDUARDO. 

