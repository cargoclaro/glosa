import { CustomGlossTabContextType } from '@prisma/client';
import { traceable } from 'langsmith/traceable';
import type {
  Pedimento,
  TransportDocument,
} from '../../../data-extraction/schemas';
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
  transportDoc?: TransportDocument
) {
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const origen = transportDoc?.origin_country;
  const destino = transportDoc?.destination_country;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  const validation = {
    name: 'Coherencia con origen/destino',
    description:
      'Validación de que el tipo de operación sea consistente con el origen y destino de las mercancías',
    prompt:
      'El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir EXP (exportación) si origen es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        documentoDeTransporte: {
          data: [
            { name: 'País de origen', value: origen },
            { name: 'País de destino', value: destino },
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
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const clavePedimento = pedimento.encabezado_del_pedimento?.cve_pedim;

  const validation = {
    name: 'Validación de clave de pedimento',
    description:
      'Verificación de que la clave de pedimento corresponda al tipo de operación',
    prompt:
      'La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Clave de pedimento', value: clavePedimento },
          ],
        },
      },
      [CustomGlossTabContextType.EXTERNAL]: {
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
  const tipoOperacion = pedimento.encabezado_del_pedimento?.tipo_oper;
  const regimen = pedimento.encabezado_del_pedimento?.regimen;

  const validation = {
    name: 'Validación de régimen',
    description:
      'Verificación de que el régimen aduanero sea compatible con el tipo de operación',
    prompt:
      'El régimen debe ser válido para el tipo de operación según el Apéndice 16',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Régimen', value: regimen },
          ],
        },
      },
      [CustomGlossTabContextType.EXTERNAL]: {
        apendices: {
          data: [{ name: 'Apéndice 16', value: JSON.stringify(apendice16) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export const tracedTipoOperacion = traceable(
  async ({
    pedimento,
    transportDoc,
    traceId,
  }: { pedimento: Pedimento; transportDoc?: TransportDocument; traceId: string }) => {
    const validationsPromise = await Promise.all([
      validateCoherenciaOrigenDestino(traceId, pedimento, transportDoc),
      validateClavePedimento(traceId, pedimento),
      validateRegimen(traceId, pedimento),
    ]);

    return {
      sectionName: 'Tipo de operación',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S2: Tipo de operación' }
);
