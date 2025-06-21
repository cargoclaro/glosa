import type { Pedimento } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';
import { apendice15 } from '../../anexo-22/apendice-15';

export async function claveApendice15({
  pedimento,
  traceId,
}: {
  pedimento: Pedimento;
  traceId: string;
}) {
  const claveDestinoOrigen = pedimento.encabezadoPrincipalDelPedimento.destino;
  const observaciones = pedimento.observacionesANivelPedimento;

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Clave de destino/origen',
    sectionPromptName: 'glosa/pedimento/impo/03-origen-destino',
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
        'anexo-22': {
          data: [
            { name: 'Apéndice 15 - Claves de países', value: JSON.stringify(apendice15) },
          ],
        },
      },
    }
  };

  try {
    const result = await performSectionValidation(sectionInput, traceId, 'gpt-4o-mini');
    
    return {
      sectionName: result.sectionName,
      validations: result.validations,
    };
  } catch (error) {
    console.error('Error in section validation:', error);
    
    // Fallback to return error structure
    return {
      sectionName: 'Clave de destino/origen',
      validations: [{
        name: 'Error de validación',
        description: 'Error al realizar la validación de la sección',
        result: {
          isValid: false,
          description: `Error al validar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          summary: 'Error en el proceso de validación',
          contextSummary: 'No se pudo completar la validación',
          actionsToTake: ['Revisar logs del sistema', 'Contactar soporte técnico'],
        },
        contexts: sectionInput.contexts,
      }],
    };
  }
}