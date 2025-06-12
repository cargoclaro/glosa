import type { Pedimento } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

async function validateLongitud(pedimento: Pedimento, traceId: string) {
  const numeroPedimento =
    pedimento.encabezadoPrincipalDelPedimento.numeroDePedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const longitud = numeroPedimentoSinEspacios.length;

  const validation = {
    name: 'Num. Pedimento (15 dígitos)',
    description: 'Valida que el número de pedimento tenga 15 dígitos',
    prompt: 'El número de pedimento debe contar con 15 dígitos.',
    contexts: {
      INFERRED: {
        pedimento: {
          data: [
            {
              name: 'Número de pedimento sin espacios',
              value: numeroPedimentoSinEspacios,
            },
            {
              name: 'Longitud',
              value: longitud,
            },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}

async function validateAñoPedimento(pedimento: Pedimento, traceId: string) {
  const numeroPedimento =
    pedimento.encabezadoPrincipalDelPedimento.numeroDePedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const añoPedimento = numeroPedimentoSinEspacios.slice(0, 2);
  const añoActual = new Date().getFullYear();

  const validation = {
    name: 'Num. Pedimento (Año)',
    description:
      'Valida que los primeros dos dígitos del pedimento correspondan al año actual',
    prompt:
      'El año del pedimento (inferido por los dígitos 1 y 2 del número del pedimento) debe ser iguales al año actual, deben de hacer sentido. ',
    contexts: {
      INFERRED: {
        Pedimento: {
          data: [
            { name: 'Año actual', value: añoActual },
            { name: 'Año del pedimento', value: añoPedimento },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o');
}

export async function numeroDePedimento({
  pedimento,
  traceId,
}: {
  pedimento: Pedimento;
  traceId: string;
}) {
  const validations = await Promise.all([
    validateLongitud(pedimento, traceId),
    validateAñoPedimento(pedimento, traceId),
  ]);

  return {
    sectionName: 'Número de pedimento',
    validations,
  };
}


// TODO: Se queda igual