import { traceable } from 'langsmith/traceable';
import type {
  Cfdi,
  TransportDocument,
} from '../../../data-extraction/mkdown_schemas';
import type { Cove, Pedimento } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

// TODO: Agregar DOF y Dia de salida
// TODO: Multiples mercancias, se tienen que sumar los valores de todas las mercancias

async function validateFechaSalida(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument
) {
  const pedimentoExitDate = pedimento.fecha_entrada_presentacion;
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
  const tipoCambio = pedimento.encabezado_del_pedimento?.tipo_cambio;
  const fechaSalida = pedimento.fecha_entrada_presentacion;
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

async function validateValorComercial(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  cfdi?: Cfdi
) {
  const valorComercialPedimento =
    pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambioPedimento = pedimento.encabezado_del_pedimento?.tipo_cambio;

  const valorComercialCOVE = cove.datos_mercancia[0]?.valor_total;
  const monedaCOVE = cove.datos_mercancia[0]?.tipo_moneda;

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Valor comercial',
    description:
      'Verificación de que el valor comercial del pedimento coincida con el CFDI y COVE',
    prompt:
      'El valor comercial del pedimento debe ser el mismo que el valor comercial del CFDI y el valor comercial en el COVE. Si el valor en el cfdi o en el cove es en dolares, se debe de convertir a pesos mexicanos usando el tipo de cambio del pedimento.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Valor comercial', value: valorComercialPedimento },
            { name: 'Tipo de cambio', value: tipoCambioPedimento },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
        cove: {
          data: [
            { name: 'Valor comercial', value: valorComercialCOVE },
            { name: 'Moneda', value: monedaCOVE },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateValorDolares(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  cfdi?: Cfdi
) {
  const valorDolaresPedimento = pedimento.valores?.valor_dolares;
  const valorComercialPedimento =
    pedimento.valores?.precio_pagado_valor_comercial;
  const tipoCambioPedimento = pedimento.encabezado_del_pedimento?.tipo_cambio;

  const valorComercialCOVE = cove.datos_mercancia[0]?.valor_total;
  const monedaCOVE = cove.datos_mercancia[0]?.tipo_moneda;

  const cfdiMkdown = cfdi?.markdown_representation;

  const validation = {
    name: 'Valor dolares',
    description:
      'Verificación de que el valor en dólares del pedimento sea consistente con el valor comercial y tipo de cambio',
    prompt:
      'El valor en dólares del pedimento se calcula dividiendo el valor comercial entre el tipo de cambio del pedimento. Si el valor en el CFDI o en el COVE está en dólares, debe coincidir con el valor en dólares del pedimento.',
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
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
        cove: {
          data: [
            { name: 'Valor comercial', value: valorComercialCOVE },
            { name: 'Moneda', value: monedaCOVE },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export const tracedOperacionMonetaria = traceable(
  async ({
    pedimento,
    cove,
    transportDocument,
    cfdi,
    traceId,
  }: {
    pedimento: Pedimento;
    cove: Cove;
    transportDocument?: TransportDocument;
    cfdi?: Cfdi;
    traceId: string;
  }) => {
    const validationsPromise = await Promise.all([
      validateFechaSalida(traceId, pedimento, transportDocument),
      validateTipoCambio(traceId, pedimento),
      validateValorComercial(traceId, pedimento, cove, cfdi),
      validateValorDolares(traceId, pedimento, cove, cfdi),
    ]);

    return {
      sectionName: 'Operación monetaria',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S4: Operación monetaria' }
);
