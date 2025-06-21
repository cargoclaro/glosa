import type { OCR } from '~/lib/utils';
import type {
  Partida,
  Pedimento,
} from '../../../extract-and-structure/schemas';
import type { Cove, PackingList } from '../../../extract-and-structure/schemas';
import { performSectionValidation, type SectionValidationInput } from '../../validation-service';
import { apendice7 } from '../../anexo-22/apendice-7';
import { getSmartcodeInfo } from '../../gsmartcode';

export async function partidas({
  pedimento,
  invoice,
  cove,
  carta318,
  partida,
  packing,
  partidaNumber,
  traceId,
}: {
  pedimento: Pedimento;
  invoice?: OCR;
  cove?: Cove;
  carta318?: OCR;
  partida: Partida;
  packing?: PackingList;
  partidaNumber: number;
  traceId: string;
}) {
  // Extract partida data
  const fraccion = partida.fraccion;
  const nico = partida.subdivisionONumeroDeIdentificacionComercial;
  const partidasUMT = partida.unidadDeMedidaDeTarifa || '';
  const partidasUMC = partida.unidadDeMedidaComercial || '';
  const partidasPaisVentaCompra = partida.paisDeVentaOCompra || '';
  const partidasPaisOrigen = partida.paisDeOrigenODestino || '';
  const descripcionPartida = partida.descripcion || '';
  const valorAduana = partida.valorEnAduanaOValorEnUSD || 0;
  const valorComercial = partida.importeDePrecioPagadoOValorComercial || 0;
  const importePrecioUnitario = partida.precioUnitario || 0;
  const cantidadUMC = partida.cantidadUnidadDeMedidaComercial || 0;
  const cantidadUMT = partida.cantidadUnidadDeMedidaDeTarifa || 0;
  const numerosSerie: string[] = [];
  const observacionesPartida = partida.observacionesANivelPartida;
  const identificadoresPartida = partida.identificadores || [];
  
  // Extract pedimento data
  const observaciones = pedimento.observacionesANivelPedimento;
  const tipoCambio = pedimento.encabezadoPrincipalDelPedimento.tipoDeCambio;
  const factorMoneda = pedimento.datosDelProveedorOComprador[0]?.facturas[0]?.factorMoneda;
  const identificadoresPedimento = pedimento.identificadoresPedimento || [];
  const clavePedimento = pedimento.encabezadoPrincipalDelPedimento.claveDePedimento;
  const destinoPedimento = pedimento.encabezadoPrincipalDelPedimento.destino;
  
  // Get COVE data (checking first merchandise as fallback)
  const claveUmcCove = cove?.mercancias[0]?.datosDeLaMercancia?.claveUMC;
  const descripcionCove = cove?.mercancias[0]?.datosDeLaMercancia?.descripcionGenericaDeLaMercancia;
  const numerosSerieCove = cove?.mercancias[0]?.descripcionDeLaMercancia?.numeroDeSerie || [];
  
  // Get SmartCode info
  let fraccionExiste = false;
  let fraccionInfo = null;
  let unidadMedida = null;
  let tasaGeneral = null;
  let tarifasCompletas = null;
  
  if (nico && fraccion) {
    try {
      fraccionInfo = await getSmartcodeInfo({ fraccion, nico });
      fraccionExiste = !!fraccionInfo;
      unidadMedida = fraccionInfo?.unidadMedida;
      tasaGeneral = (fraccionInfo as any)?.tarifas?.adValoremImportacion || null;
      tarifasCompletas = (fraccionInfo as any)?.tarifas || null;
    } catch (error) {
      console.warn(`Error getting SmartCode info for ${fraccion}/${nico}:`, error);
    }
  }
  
  // Extract contribuciones data for calculations
  const contribuciones = partida.contribuciones || [];
  const tasaIGI = contribuciones.find(c => c.contribucion === 'IGI/IGE')?.tasa || 0;
  const tasaIVA = contribuciones.find(c => c.contribucion === 'IVA')?.tasa || 16;
  
  // Calculate values for validation
  const valorAduanaTotal = pedimento.encabezadoPrincipalDelPedimento.valores.valorAduana || 0;
  const valorComercialTotal = pedimento.encabezadoPrincipalDelPedimento.valores.precioPagadoOValorComercial || 0;
  const prorrateo = valorComercialTotal !== 0 ? valorAduanaTotal / valorComercialTotal : null;
  
  // Extract markdown representations
  const invoiceMarkdown = invoice?.markdown_representation;
  const carta318Markdown = carta318?.markdown_representation;

  // Prepare the contexts for section validation
  const sectionInput: SectionValidationInput = {
    sectionName: `Partida ${partidaNumber}`,
    sectionPromptName: 'glosa/pedimento/impo/09-partidas',
    contexts: {
      PROVIDED: {
        partida: {
          data: [
            { name: 'Número de partida', value: partidaNumber },
            { name: 'Fracción arancelaria', value: fraccion },
            { name: 'NICO', value: nico },
            { name: 'UMT', value: partidasUMT },
            { name: 'UMC', value: partidasUMC },
            { name: 'País de venta/compra', value: partidasPaisVentaCompra },
            { name: 'País de origen', value: partidasPaisOrigen },
            { name: 'Descripción', value: descripcionPartida },
            { name: 'Valor aduana', value: valorAduana },
            { name: 'Valor comercial', value: valorComercial },
            { name: 'Importe precio unitario', value: importePrecioUnitario },
            { name: 'Cantidad UMC', value: cantidadUMC },
            { name: 'Cantidad UMT', value: cantidadUMT },
            { name: 'Números de serie', value: JSON.stringify(numerosSerie, null, 2) },
            { name: 'Identificadores partida', value: JSON.stringify(identificadoresPartida, null, 2) },
            { name: 'Observaciones partida', value: observacionesPartida },
            { name: 'Contribuciones', value: JSON.stringify(contribuciones, null, 2) },
            { name: 'Tasa IGI', value: tasaIGI },
            { name: 'Tasa IVA', value: tasaIVA },
          ]
        },
        pedimento: {
          data: [
            { name: 'Observaciones', value: observaciones },
            { name: 'Tipo de cambio', value: tipoCambio },
            { name: 'Factor moneda', value: factorMoneda },
            { name: 'Identificadores pedimento', value: JSON.stringify(identificadoresPedimento, null, 2) },
            { name: 'Clave pedimento', value: clavePedimento },
            { name: 'Destino', value: destinoPedimento },
            { name: 'Valor aduana total', value: valorAduanaTotal },
            { name: 'Valor comercial total', value: valorComercialTotal },
            { name: 'Prorrateo', value: prorrateo },
          ]
        },
        ...(cove ? {
          cove: {
            data: [
              { name: 'Clave UMC COVE', value: claveUmcCove },
              { name: 'Descripción COVE', value: descripcionCove },
              { name: 'Números de serie COVE', value: JSON.stringify(numerosSerieCove, null, 2) },
            ]
          }
        } : {}),
        ...(invoice ? {
          factura: {
            data: [
              { name: 'Factura', value: invoiceMarkdown },
            ]
          }
        } : {}),
        ...(carta318 ? {
          'carta-318': {
            data: [
              { name: 'Carta 318', value: carta318Markdown },
            ]
          }
        } : {}),
        ...(packing ? {
          'packing-list': {
            data: [
              { name: 'Packing List', value: JSON.stringify(packing, null, 2) },
            ]
          }
        } : {})
      },
      EXTERNAL: {
        gsmartcode: {
          data: [
            { name: 'Fracción existe', value: fraccionExiste ? 'Sí' : 'No' },
            { name: 'Información fracción', value: JSON.stringify(fraccionInfo, null, 2) },
            { name: 'Unidad de medida', value: JSON.stringify(unidadMedida, null, 2) },
            { name: 'Tasa general', value: tasaGeneral },
            { name: 'Tarifas completas', value: JSON.stringify(tarifasCompletas, null, 2) },
          ]
        },
        'anexo-22': {
          data: [
            { name: 'Apéndice 7 - Claves de unidades de medida', value: JSON.stringify(apendice7) },
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
      sectionName: `Partida ${partidaNumber}`,
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