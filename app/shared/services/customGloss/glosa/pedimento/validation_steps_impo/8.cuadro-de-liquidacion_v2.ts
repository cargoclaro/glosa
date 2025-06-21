import type { Pedimento } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';

export async function cuadroDeLiquidacion({
  pedimento,
  traceId,
}: {
  pedimento: Pedimento;
  traceId: string;
}) {
  // Extract all necessary data from pedimento
  const valorAduana = pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana;
  const liquidaciones = pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.liquidaciones;
  const identificadores = pedimento.identificadoresPedimento;
  
  // Find specific liquidation lines for reference
  const igiLinea = liquidaciones.find((l) => l.concepto.toUpperCase().includes('IGI'));

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: 'Identificadores y cuadro',
    sectionPromptName: 'glosa/pedimento/impo/08-cuadro-liquidacion',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Liquidaciones', value: JSON.stringify(liquidaciones, null, 2) },
            { name: 'Identificadores a nivel pedimento', value: JSON.stringify(identificadores, null, 2) },
            { name: 'IGI declarado', value: igiLinea?.importe ?? 'N/D' },
          ]
        }
      },
      EXTERNAL: {
        'regulaciones-2025': {
          data: [
            { name: 'Cuota fija DTA 2025', value: '$445 MXN' },
            { name: 'Cuota fija Prevalidación 2025', value: '$290 MXN' },
            { name: 'Tasa general IVA', value: '16%' },
            { name: 'Tasa IVA prevalidación', value: '16% sobre $290 = $46 MXN' },
          ]
        },
        'catalogos-oficiales': {
          data: [
            { name: 'Catálogo de identificadores', value: 'IM, MS, PC, RC, AF, PP, CI, IC, SO, RO, A3 - Anexo 22, Apéndice 8' },
            { name: 'RFCs inscritos PROSEC', value: 'Catálogo oficial SAT' },
            { name: 'RFCs con certificación IVA/IEPS', value: 'Padrón CIVA vigente SAT' },
            { name: 'RFCs con autorización OEA', value: 'Padrón OEA vigente SAT' },
          ]
        },
        'decretos-dof': {
          data: [
            { name: 'Lista de decretos IGI', value: '18 nov 2022; 6 y 16 ene; 18 mayo; 23 junio; 15 ago; 27 dic 2023; 22 abr, 8 mayo, 19 dic 2024' },
            { name: 'Ley IEPS art.2', value: 'Cuotas actualizadas por SHCP cada año' },
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
      sectionName: 'Identificadores y cuadro',
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