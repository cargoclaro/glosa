import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';
import { apendice14 } from '../../anexo-22/apendice-14';
import { getExchangeRate } from '../../exchange-rate';
import incotermLogic from '../../incoterms-logic.json';

export async function operacionMonetaria({
  pedimento,
  invoice,
  transportDocument,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  invoice?: OCR;
  transportDocument?: OCR;
  carta318?: OCR;
  traceId: string;
}) {
  // Extract all necessary data from pedimento
  const encabezado = pedimento.encabezadoPrincipalDelPedimento;
  const pedimentoEntryDate = encabezado.fechas.entrada;
  const tipoCambio = encabezado.tipoDeCambio;
  const valSeguros = encabezado.incrementables.valorSeguros;
  const seguros = encabezado.incrementables.seguros;
  const fletes = encabezado.incrementables.fletes;
  const embalajes = encabezado.incrementables.embalajes;
  const otrosIncrementables = encabezado.incrementables.otrosIncrementables;
  const valorDolares = encabezado.valores.valorDolares;
  const valorComercial = encabezado.valores.precioPagadoOValorComercial;
  const valorAduana = encabezado.valores.valorAduana;
  const clavePedimento = encabezado.claveDePedimento;
  const observaciones = pedimento.observacionesANivelPedimento;
  
  // Get incoterm from first supplier/buyer and first invoice
  const incoterm = pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.incoterm;
  
  // Extract markdown representations from documents
  const transportDocumentMkdown = transportDocument?.markdown_representation;
  const invoiceMkdown = invoice?.markdown_representation;
  const carta318Mkdown = carta318?.markdown_representation;
  
  // Get exchange rate from DOF
  const tipoCambioDOF = await getExchangeRate(new Date(pedimentoEntryDate ?? new Date()));

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Operación monetaria',
    sectionPromptName: 'glosa/pedimento/impo/04-operacion-monetaria',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Fecha de entrada', value: pedimentoEntryDate },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Val. Seguros', value: valSeguros },
            { name: 'Seguros', value: seguros },
            { name: 'Fletes', value: fletes },
            { name: 'Embalajes', value: embalajes },
            { name: 'Otros incrementables', value: otrosIncrementables },
            { name: 'Valor dólares', value: valorDolares },
            { name: 'Precio pagado / valor comercial', value: valorComercial },
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Clave de pedimento', value: clavePedimento },
            { name: 'Incoterm', value: incoterm },
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
        ...(invoice ? {
          factura: {
            data: [
              { name: 'Factura', value: invoiceMkdown },
            ]
          }
        } : {}),
        ...(carta318 ? {
          'carta-318': {
            data: [
              { name: 'Carta 318', value: carta318Mkdown },
            ]
          }
        } : {})
      },
      EXTERNAL: {
        'tipo-cambio-dof': {
          data: [
            { name: 'Tipo de cambio DOF', value: tipoCambioDOF },
          ]
        },
        'anexo-22': {
          data: [
            { name: 'Apéndice 14 - Incoterms', value: apendice14 },
            { name: 'Lógica de Incoterms con transporte y seguro', value: JSON.stringify(incotermLogic) },
          ]
        }
      }
    }
  };

  try {
    const result = await performSectionValidation(sectionInput, traceId, 'o3-mini');
    
    return {
      sectionName: result.sectionName,
      validations: result.validations,
    };
  } catch (error) {
    console.error('Error in section validation:', error);
    
    // Fallback to return error structure
    return {
      sectionName: 'Operación monetaria',
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