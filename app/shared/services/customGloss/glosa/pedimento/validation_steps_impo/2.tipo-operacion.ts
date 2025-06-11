import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice2 } from '../../anexo-22/apendice-2';
import { apendice16 } from '../../anexo-22/apendice-16';
import { glosar } from '../../validation-result';

/**
 * Validates that the operation type is consistent with the origin/destination
 * If destination is Mexico, operation type should be IMP (import)
 */
async function validateCoherenciaOrigenDestino(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  const tipoOperacion =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const observaciones = pedimento.observacionesANivelPedimento;

  const transportDocumentmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Tipo Operación',
    description:
      'Valida que el tipo de operación sea consistente con el origen y destino de las mercancías',
    prompt:
      'El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir IMP (importación) si destino es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocumentmkdown },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}

/**
 * Validates that the pedimento key is valid for the operation type according to Appendix 2
 */
async function validateClavePedimento(traceId: string, pedimento: Pedimento) {
  const tipoOperacion =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const clavePedimento =
    pedimento.encabezadoPrincipalDelPedimento.claveDePedimento;
  const observaciones = pedimento.observacionesANivelPedimento;

  const validation = {
    name: 'Clave de pedimento',
    description:
      'Valida que la clave de pedimento sea válida para el tipo de operación según el Apéndice 2',
    prompt:
      'La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Clave de pedimento', value: clavePedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
      },
      EXTERNAL: {
        'Anexo 22 -> Apendices': {
          data: [{ name: 'Apéndice 2', value: JSON.stringify(apendice2) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}

/**
 * Validates that the regime is valid for the operation type according to Appendix 16
 */
async function validateRegimen(traceId: string, pedimento: Pedimento) {
  const tipoOperacion =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const regimen = pedimento.encabezadoPrincipalDelPedimento.regimen;
  const observaciones = pedimento.observacionesANivelPedimento;

  const validation = {
    name: 'Régimen',
    description:
      'Valida que el régimen sea válido para el tipo de operación según el Apéndice 16',
    prompt:
      'El régimen debe ser válido para el tipo de operación según el Apéndice 16',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Régimen', value: regimen },
            { name: 'Observaciones', value: observaciones },
          ],
        },
      },
      EXTERNAL: {
        'Anexo 22 -> Apendices': {
          data: [{ name: 'Apéndice 16', value: JSON.stringify(apendice16) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o-mini');
}

export async function tipoOperacion({
  pedimento,
  transportDocument,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateCoherenciaOrigenDestino(traceId, pedimento, transportDocument),
    validateClavePedimento(traceId, pedimento),
    validateRegimen(traceId, pedimento),
  ]);

  return {
    sectionName: 'Tipo de operación',
    validations: validationsPromise,
  };
}


// TODO: Agregar la carta de instrucciones y contrastar valores
// TODO: Agregar comparación con las fracciones arancelarias que se declaran en el pedimento. ej. analisis de riesgo, donde mercancias historicas distintas a las declaradas con este regimen, tipo de operacion y clave de pedimento.
