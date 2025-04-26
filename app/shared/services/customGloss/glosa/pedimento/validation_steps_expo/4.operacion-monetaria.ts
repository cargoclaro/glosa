import type { OCR } from '~/lib/utils';
import type {
  CFDI,
  Cove,
  Pedimento,
} from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

// TODO: Agregar DOF y Dia de salida
// TODO: Multiples mercancias, se tienen que sumar los valores de todas las mercancias

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

async function validateValorComercial(
  traceId: string,
  pedimento: Pedimento,
  cove: Cove,
  cfdi?: CFDI
) {
  const valorComercialPedimento =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const tipoCambioPedimento =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;

  // TODO: Do this in a loop, instead of just checking the first mercancia
  const valorComercialCOVE = cove.mercancias[0]?.datosDeLaMercancia?.valorTotal;
  const monedaCOVE = cove.mercancias[0]?.datosDeLaMercancia?.tipoMoneda;

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
          data: [{ name: 'CFDI', value: cfdi }],
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
  cfdi?: CFDI
) {
  const valorDolaresPedimento =
    pedimento.encabezadoPrincipalDelPedimento.valores.valorDolares;
  const valorComercialPedimento =
    pedimento.encabezadoPrincipalDelPedimento.valores
      .precioPagadoOValorComercial;
  const tipoCambioPedimento =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;

  // TODO: Do this in a loop, instead of just checking the first mercancia
  const valorComercialCOVE = cove.mercancias[0]?.datosDeLaMercancia?.valorTotal;
  const monedaCOVE = cove.mercancias[0]?.datosDeLaMercancia?.tipoMoneda;

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
          data: [{ name: 'CFDI', value: cfdi }],
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

export async function operacionMonetaria({
  pedimento,
  cove,
  transportDocument,
  cfdi,
  traceId,
}: {
  pedimento: Pedimento;
  cove: Cove;
  transportDocument?: OCR;
  cfdi?: CFDI;
  traceId: string;
}) {
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
}
