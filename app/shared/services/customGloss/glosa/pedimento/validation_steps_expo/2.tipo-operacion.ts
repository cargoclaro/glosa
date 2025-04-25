import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice2 } from '../../anexo-22/apendice-2';
import { apendice16 } from '../../anexo-22/apendice-16';
import { glosar } from '../../validation-result';

/**
 * Validates that the operation type is consistent with the origin/destination
 * If origin is Mexico, operation type should be EXP (export)
 */
async function validateCoherenciaOrigenDestino(
  traceId: string,
  pedimento: Pedimento,
  transportDoc?: OCR
) {
  const tipoOperacion =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const observaciones = pedimento.observacionesANivelPedimento;

  const validation = {
    name: 'Coherencia con origen/destino',
    description:
      'Validación de que el tipo de operación sea consistente con el origen y destino de las mercancías',
    prompt:
      'El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir EXP (exportación) si origen es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        documentoDeTransporte: {
          data: [
            { name: 'Markdown', value: transportDoc?.markdown_representation },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

/**
 * Validates that the pedimento key is valid for the operation type according to Appendix 2
 */
async function validateClavePedimento(traceId: string, pedimento: Pedimento) {
  const tipoOperacion =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const clavePedimento =
    pedimento.encabezadoPrincipalDelPedimento.claveDePedimento;

  const validation = {
    name: 'Validación de clave de pedimento',
    description:
      'Verificación de que la clave de pedimento corresponda al tipo de operación',
    prompt:
      'La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Clave de pedimento', value: clavePedimento },
          ],
        },
      },
      EXTERNAL: {
        apendices: {
          data: [{ name: 'Apéndice 2', value: JSON.stringify(apendice2) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

/**
 * Validates that the regime is valid for the operation type according to Appendix 16
 */
async function validateRegimen(traceId: string, pedimento: Pedimento) {
  const tipoOperacion =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const regimen = pedimento.encabezadoPrincipalDelPedimento.regimen;

  const validation = {
    name: 'Validación de régimen',
    description:
      'Verificación de que el régimen aduanero sea compatible con el tipo de operación',
    prompt:
      'El régimen debe ser válido para el tipo de operación según el Apéndice 16',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Régimen', value: regimen },
          ],
        },
      },
      EXTERNAL: {
        apendices: {
          data: [{ name: 'Apéndice 16', value: JSON.stringify(apendice16) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function tipoOperacion({
  pedimento,
  transportDoc,
  traceId,
}: {
  pedimento: Pedimento;
  transportDoc?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateCoherenciaOrigenDestino(traceId, pedimento, transportDoc),
    validateClavePedimento(traceId, pedimento),
    validateRegimen(traceId, pedimento),
  ]);

  return {
    sectionName: 'Tipo de operación',
    validations: validationsPromise,
  };
}
