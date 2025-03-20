import { traceable } from 'langsmith/traceable';
import type { Pedimento } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

async function validateLongitud(traceId: string, pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const longitud = numeroPedimentoSinEspacios.length;

  const validation = {
    name: 'Longitud',
    description: 'Validación de la longitud del número de pedimento',
    prompt: 'El número de pedimento debe contar con 15 dígitos',
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

  return await glosar(validation, traceId);
}

async function validateAñoPedimento(traceId: string, pedimento: Pedimento) {
  const numeroPedimento = pedimento.encabezado_del_pedimento?.num_pedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const añoActual = new Date().getFullYear();

  const validation = {
    name: 'Año del pedimento',
    description: 'Validación del año en el número de pedimento',
    prompt:
      'El año del pedimento (inferido por los dígitos 1 y 2 del número del pedimento) debe ser iguales al año actual',
    contexts: {
      INFERRED: {
        codigo: {
          data: [
            {
              name: 'Año actual',
              value: añoActual,
            },
            {
              name: 'Número de pedimento sin espacios',
              value: numeroPedimentoSinEspacios,
            },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export const tracedNumeroDePedimento = traceable(
  async ({ pedimento, traceId }: { pedimento: Pedimento; traceId: string }) => {
    const validationsPromise = await Promise.all([
      validateLongitud(traceId, pedimento),
      validateAñoPedimento(traceId, pedimento),
    ]);

    return {
      sectionName: 'Número de pedimento',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S1: Número de pedimento' }
);
