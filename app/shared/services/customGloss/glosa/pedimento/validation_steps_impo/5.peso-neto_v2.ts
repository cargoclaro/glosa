import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { PackingList } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';

export async function pesosYBultos({
  pedimento,
  transportDocument,
  packingList,
  invoice,
  acuseTransporte,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  packingList?: PackingList;
  invoice?: OCR;
  acuseTransporte?: OCR;
  traceId: string;
}) {
  // Extract data from pedimento
  const pesoBrutoPedimento = pedimento.encabezadoPrincipalDelPedimento.pesoBruto;
  const bultosPedimento = pedimento.encabezadoPrincipalDelPedimento.marcasNumerosBultos?.totalDeBultos;
  const observaciones = pedimento.observacionesANivelPedimento;
  
  // Extract markdown representations
  const transportDocumentMkdown = transportDocument?.markdown_representation;
  const invoiceMkdown = invoice?.markdown_representation;
  const acuseTransporteMkdown = acuseTransporte?.markdown_representation;

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Pesos y bultos',
    sectionPromptName: 'glosa/pedimento/impo/05-pesos-bultos',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Peso bruto', value: pesoBrutoPedimento },
            { name: 'Número de bultos', value: bultosPedimento },
            { name: 'Observaciones', value: observaciones },
          ]
        },
        ...(transportDocument ? {
          'documento-transporte': {
            data: [
              { name: 'Documento de transporte', value: transportDocumentMkdown },
            ]
          }
        } : {}),
        ...(packingList ? {
          'lista-empaque': {
            data: [
              { name: 'Lista de empaque', value: JSON.stringify(packingList, null, 2) },
            ]
          }
        } : {}),
        ...(invoice ? {
          factura: {
            data: [
              { name: 'Factura', value: invoiceMkdown },
            ]
          }
        } : {}),
        ...(acuseTransporte ? {
          'acuse-transporte': {
            data: [
              { name: 'Acuse de transporte', value: acuseTransporteMkdown },
            ]
          }
        } : {})
      },
      EXTERNAL: {
        'ley-aduanera': {
          data: [
            {
              name: 'Artículo 20, Sección 7',
              value: 'El peso bruto declarado en el pedimento deberá coincidir con el documento de transporte, lista de empaque, factura, certificado de peso del almacén o acuse de transporte.',
            },
          ],
        },
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
      sectionName: 'Pesos y bultos',
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