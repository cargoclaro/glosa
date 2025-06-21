import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';
import { apendice2 } from '../../anexo-22/apendice-2';
import { apendice16 } from '../../anexo-22/apendice-16';

export async function tipoOperacion({
  pedimento,
  transportDocument,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  traceId: string;
}) {
  const tipoOperacion = pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const clavePedimento = pedimento.encabezadoPrincipalDelPedimento.claveDePedimento;
  const regimen = pedimento.encabezadoPrincipalDelPedimento.regimen;
  const observaciones = pedimento.observacionesANivelPedimento;
  const transportDocumentMkdown = transportDocument?.markdown_representation;

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Tipo de operación',
    sectionPromptName: 'glosa/pedimento/impo/02-tipo-operacion',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Tipo de operación', value: tipoOperacion },
            { name: 'Clave de pedimento', value: clavePedimento },
            { name: 'Régimen', value: regimen },
            { name: 'Observaciones', value: observaciones },
          ]
        },
        ...(transportDocument ? {
          'documento-transporte': {
            data: [
              { name: 'Documento de transporte', value: transportDocumentMkdown },
            ]
          }
        } : {})
      },
      EXTERNAL: {
        'anexo-22': {
          data: [
            { name: 'Apéndice 2 - Claves de pedimento', value: JSON.stringify(apendice2) },
            { name: 'Apéndice 16 - Regímenes', value: JSON.stringify(apendice16) },
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
      sectionName: 'Tipo de operación',
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