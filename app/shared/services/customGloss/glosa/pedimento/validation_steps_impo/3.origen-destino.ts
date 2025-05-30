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

// We are waiting on confirmation if COVE's have incoterms
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
