import { traceable } from 'langsmith/traceable';
import type { Pedimento } from '../../../data-extraction/schemas';
import { apendice15 } from '../../anexo-22/apendice-15';
import { glosar } from '../../validation-result';

async function validateClaveApendice15(traceId: string, pedimento: Pedimento) {
  const claveDestinoOrigen = pedimento.encabezado_del_pedimento?.destino_origen;

  const validation = {
    name: 'Validación de clave',
    description:
      'Verificación de que la clave de destino/origen exista en el Apéndice 15',
    prompt: 'La clave de destino/origen debe existir en el Apéndice 15',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Clave de destino/origen', value: claveDestinoOrigen },
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

  return await glosar(validation, traceId);
}

export const tracedClaveApendice15 = traceable(
  async ({ pedimento, traceId }: { pedimento: Pedimento; traceId: string }) => {
    const validationsPromise = await Promise.all([
      validateClaveApendice15(traceId, pedimento),
    ]);

    return {
      sectionName: 'Clave de destino/origen',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S3: Clave de destino/origen' }
);
