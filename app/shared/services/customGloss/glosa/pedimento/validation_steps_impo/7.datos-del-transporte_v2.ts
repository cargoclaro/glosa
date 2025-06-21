import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';
import { apendice3 } from '../../anexo-22/apendice-3';
import { apendice10 } from '../../anexo-22/apendice-10';

export async function datosDelTransporte({
  pedimento,
  transportDocument,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  traceId: string;
}) {
  // Extract transport data from pedimento
  const tipoTransporte = pedimento.contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo?.tipo;
  const tipoTransporteEntradaSalida = pedimento.encabezadoPrincipalDelPedimento.mediosTransporte.entradaSalida;
  const tipoDeOperacion = pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const numeroGuiaEmbarque = pedimento.guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte?.numeroMaster;
  const observaciones = pedimento.observacionesANivelPedimento;
  
  // Extract markdown representation
  const transportDocumentMkdown = transportDocument?.markdown_representation;

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Datos del transporte',
    sectionPromptName: 'glosa/pedimento/impo/07-datos-transporte',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Tipo de transporte', value: tipoTransporte },
            { name: 'Tipo de transporte (entrada/salida)', value: tipoTransporteEntradaSalida },
            { name: 'Tipo de operación', value: tipoDeOperacion },
            { name: 'Número de guía/embarque', value: numeroGuiaEmbarque },
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
            { name: 'Apéndice 3 - Medios de transporte', value: JSON.stringify(apendice3) },
            { name: 'Apéndice 10 - Claves de tipo de contenedor', value: JSON.stringify(apendice10) },
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
      sectionName: 'Datos del transporte',
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