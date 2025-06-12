import type { Pedimento } from '@/shared/services/customGloss/extract-and-structure/schemas';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { Button } from '~/ui/button';
import PedimentoContenedores from './pedimento-contenedores';
import PedimentoDecrementables from './pedimento-decrementables';
import PedimentoHeader from './pedimento-header';
import PedimentoIdentificadores from './pedimento-identificadores';
import PedimentoImportador from './pedimento-importador';
import PedimentoIncrementables from './pedimento-incrementables';
import PedimentoMarcasBultos from './pedimento-marcas-bultos';
import PedimentoPartidas from './pedimento-partidas';
import PedimentoProveedor from './pedimento-proveedor';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface PedimentoViewerProps {
  pedimento: Pedimento;
  className?: string;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoViewer = ({
  pedimento,
  className,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}: PedimentoViewerProps) => {
  // Constants for partidas pagination
  const PARTIDAS_PER_PAGE = 2;

  // State for active page
  const [activeTab, setActiveTab] = useState<string>('page1');

  // Calculate total pages based on partidas length
  const totalPartidasPages = useMemo(() => {
    if (!pedimento.partidas || pedimento.partidas.length === 0) {
      return 0;
    }
    return Math.ceil(pedimento.partidas.length / PARTIDAS_PER_PAGE);
  }, [pedimento.partidas]);

  // Calculate total pages (base pages + partida pages)
  const totalPages = 2 + (totalPartidasPages > 0 ? totalPartidasPages - 1 : 0);

  // Get current page number
  const currentPage = useMemo(() => {
    if (activeTab === 'page1') {
      return 1;
    }
    if (activeTab === 'page2') {
      return 2;
    }
    // For partida pages (page3, page4, etc.)
    const pageNum = Number.parseInt(activeTab.replace('page', ''));
    return pageNum;
  }, [activeTab]);

  // Get current partidas for display based on current page
  const currentPartidas = useMemo(() => {
    if (!pedimento.partidas || pedimento.partidas.length === 0) {
      return [];
    }
    if (currentPage <= 2) {
      return pedimento.partidas.slice(0, PARTIDAS_PER_PAGE);
    }

    const startIdx = PARTIDAS_PER_PAGE + (currentPage - 3) * PARTIDAS_PER_PAGE;
    const endIdx = startIdx + PARTIDAS_PER_PAGE;
    return pedimento.partidas.slice(startIdx, endIdx);
  }, [pedimento.partidas, currentPage]);

  // Calcular el índice de inicio global para la página actual
  const currentStartIndex = useMemo(() => {
    if (currentPage <= 2) {
      return 0; // Primera página de partidas empieza en índice 0
    }
    // Para páginas 3 en adelante
    return PARTIDAS_PER_PAGE + (currentPage - 3) * PARTIDAS_PER_PAGE;
  }, [currentPage]);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setActiveTab(`page${currentPage + 1}`);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setActiveTab(`page${currentPage - 1}`);
    }
  };

  const goToFirstPage = () => {
    setActiveTab('page1');
  };

  const goToLastPage = () => {
    setActiveTab(`page${totalPages}`);
  };

  // Determine if next/prev buttons should be enabled
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  // Transform liquidaciones from pedimento to match our component's expected structure
  const liquidacionData = {
    conceptos:
      pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.liquidaciones?.map(
        (item, index) => ({
          concepto: item.concepto || '',
          fp: item.fp?.toString() || '0',
          importe: item.importe || 0,
          key: `liquidacion-${index}`,
        })
      ) || [],
    totales: {
      efectivo:
        pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.totales
          ?.efectivo || 0,
      otros:
        pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.totales
          ?.otros || 0,
      total:
        pedimento.encabezadoPrincipalDelPedimento.cuadroDeLiquidacion.totales
          ?.total || 0,
    },
  };

  return (
    <div
      className={cn('relative flex w-full flex-col overflow-hidden', className)}
    >
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border-[1px] border-blue-500 bg-white shadow-xl transition-all duration-500">
        <div className="overflow-x-auto p-3">
          {currentPage === 1 && (
            <div className="flex w-full flex-col gap-2">
              <div className="w-full">
                <PedimentoHeader
                  pedimento={pedimento}
                  page={currentPage}
                  totalPages={totalPages}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoImportador
                  datosImportador={{
                    rfc:
                      pedimento.encabezadoPrincipalDelPedimento.datosImportador
                        .rfc || '',
                    curp:
                      pedimento.encabezadoPrincipalDelPedimento.datosImportador
                        .curp || '',
                    razon_social:
                      pedimento.encabezadoPrincipalDelPedimento.datosImportador
                        .razonSocial || '',
                    domicilio:
                      pedimento.encabezadoPrincipalDelPedimento.datosImportador
                        .domicilio || '',
                  }}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoIncrementables
                  incrementables={{
                    val_seguros:
                      pedimento.encabezadoPrincipalDelPedimento.incrementables
                        .valorSeguros || 0,
                    seguros:
                      pedimento.encabezadoPrincipalDelPedimento.incrementables
                        .seguros || 0,
                    fletes:
                      pedimento.encabezadoPrincipalDelPedimento.incrementables
                        .fletes || 0,
                    embalajes:
                      pedimento.encabezadoPrincipalDelPedimento.incrementables
                        .embalajes || 0,
                    otros_incrementables:
                      pedimento.encabezadoPrincipalDelPedimento.incrementables
                        .otrosIncrementables || 0,
                  }}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoDecrementables
                  decrementables={{
                    transporte_decrementables:
                      pedimento.encabezadoPrincipalDelPedimento.decrementables
                        .transporteDecrementables || 0,
                    seguro_decrementables:
                      pedimento.encabezadoPrincipalDelPedimento.decrementables
                        .seguroDecrementables || 0,
                    carga_decrementables:
                      pedimento.encabezadoPrincipalDelPedimento.decrementables
                        .cargaDecrementables || 0,
                    descarga_decrementables:
                      pedimento.encabezadoPrincipalDelPedimento.decrementables
                        .descargaDecrementables || 0,
                    otros_decrementables:
                      pedimento.encabezadoPrincipalDelPedimento.decrementables
                        .otrosDecrementables || 0,
                  }}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoMarcasBultos
                  marcasNumerosBultos={
                    pedimento.encabezadoPrincipalDelPedimento
                      .marcasNumerosBultos?.marcas || ''
                  }
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoIdentificadores
                  identificadoresNivelPedimento={{
                    clave_seccion_aduanera:
                      pedimento.encabezadoPrincipalDelPedimento
                        .aduanaEntradaOSalida ?? '-',
                  }}
                  identificadoresPedimento={pedimento.identificadoresPedimento.map(
                    (id, index) => ({
                      clave: id.clave || '',
                      complemento_1: id.complemento1 || '',
                      complemento_2: id.complemento2 || '',
                      complemento_3: id.complemento3 || '',
                      key: `identificador-${index}`,
                    })
                  )}
                  fechaEntrada={pedimento.encabezadoPrincipalDelPedimento.fechas.entrada?.toString()}
                  fechaPago={pedimento.encabezadoPrincipalDelPedimento.fechas.presentacion?.toString()}
                  // Generate tasas from partidas contribuciones if available
                  tasas={
                    pedimento.partidas?.[0]?.contribuciones?.map((c, index) => ({
                      contrib: c.contribucion || '',
                      cve_t_tasa: c.tipoDeTasa || '',
                      tasa: c.tasa?.toString() || '0',
                      key: `tasa-${index}`,
                    })) || []
                  }
                  liquidacion={liquidacionData}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="flex w-full flex-col gap-2">
              <div className="w-full">
                <PedimentoProveedor
                  datosDelProveedorOComprador={
                    pedimento.datosDelProveedorOComprador
                  }
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoContenedores
                  numero={
                    pedimento
                      .contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo
                      ?.numero || ''
                  }
                  tipo={
                    pedimento
                      .contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo
                      ?.tipo || ''
                  }
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div
                className={cn(
                  'mb-4 w-full cursor-pointer border border-gray-400',
                  'overflow-hidden rounded-md border-2',
                  getHighlightBorder('Datos del transporte', tabs),
                  getHighlightFill('Datos del transporte', tabInfoSelected)
                )}
                onClick={() => onClick('Datos del transporte')}
              >
                <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
                  <div className="col-span-12 bg-gray-200 py-0.5 text-center font-semibold text-[10px] uppercase">
                    NUMERO (GUIA/ORDEN EMBARQUE)/ID:
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-0">
                  <div className="col-span-12 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
                    {pedimento
                      .guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte
                      ?.numeroMaster || ''}
                  </div>
                </div>
              </div>
              {/* Show only first batch of partidas on page 2 */}
              {pedimento.partidas && pedimento.partidas.length > 0 && (
                <div className="w-full">
                  <PedimentoPartidas
                    partidas={currentPartidas}
                    tabs={tabs}
                    onClick={onClick}
                    tabInfoSelected={tabInfoSelected}
                    startIndex={currentStartIndex}
                  />
                </div>
              )}
            </div>
          )}

          {/* Additional pages for partidas (page 3 and beyond) */}
          {currentPage > 2 && pedimento.partidas && (
            <div className="flex w-full flex-col gap-2">
              <div className="w-full">
                <PedimentoHeader
                  pedimento={pedimento}
                  page={currentPage}
                  totalPages={totalPages}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoPartidas
                  partidas={currentPartidas}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                  startIndex={currentStartIndex}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page navigation */}
      <div className="container mx-auto mt-1 flex items-center justify-center space-x-2 px-2 py-2">
        {/* First page button */}
        <Button
          variant="outline"
          className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
          onClick={goToFirstPage}
          disabled={!canGoPrev}
        >
          <ChevronFirst className="h-3 w-3" />
        </Button>

        {/* Previous page button */}
        {canGoPrev && (
          <Button
            variant="outline"
            className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
            onClick={goToPrevPage}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Anterior
          </Button>
        )}

        {/* Page indicator */}
        <span className="text-gray-600 text-xs">
          Página {currentPage} de {totalPages}
        </span>

        {/* Next page button */}
        {canGoNext && (
          <Button
            variant="default"
            className="flex h-8 items-center bg-zinc-800 py-1 text-xs transition-all duration-300 hover:bg-zinc-700"
            onClick={goToNextPage}
          >
            Siguiente
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}

        {/* Last page button */}
        <Button
          variant="outline"
          className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        >
          <ChevronLast className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default PedimentoViewer;
