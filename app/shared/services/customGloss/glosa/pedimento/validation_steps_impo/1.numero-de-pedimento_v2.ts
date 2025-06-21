import type { Pedimento } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';

export async function numeroDePedimento({
  pedimento,
  traceId,
}: {
  pedimento: Pedimento;
  traceId: string;
}) {
  const numeroPedimento = pedimento.encabezadoPrincipalDelPedimento.numeroDePedimento;
  const numeroPedimentoSinEspacios = numeroPedimento?.replace(/\s+/g, '') || '';
  const longitud = numeroPedimentoSinEspacios.length;
  const añoPedimento = numeroPedimentoSinEspacios.slice(0, 2);
  const añoActual = new Date().getFullYear();

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Número de pedimento',
    sectionPromptName: 'glosa/pedimento/impo/01-numero-pedimento',
    contexts: {
      INFERRED: {
        pedimento: {
          data: [
            { name: 'Número de pedimento', value: numeroPedimento },
            { name: 'Número de pedimento sin espacios', value: numeroPedimentoSinEspacios },
            { name: 'Longitud', value: longitud },
            { name: 'Año del pedimento', value: añoPedimento },
            { name: 'Año actual', value: añoActual },
          ]
        }
      }
    }
  };

  try {
    const result = await performSectionValidation(sectionInput, traceId, 'gpt-4o');
    
    return {
      sectionName: result.sectionName,
      validations: result.validations,
    };
  } catch (error) {
    console.error('Error in section validation:', error);
    
    // Fallback to return error structure
    return {
      sectionName: 'Número de pedimento',
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