import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
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
import PedimentoPartidas from './pedimento-partidas';
import PedimentoProveedor from './pedimento-proveedor';

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
      pedimento.cuadro_de_liquidacion.liquidaciones?.map((item) => ({
        concepto: item.concepto || '',
        fp: item.fp?.toString() || '0',
        importe: item.importe || 0,
      })) || [],
    totales: {
      efectivo: pedimento.cuadro_de_liquidacion.totales?.efectivo || 0,
      otros: pedimento.cuadro_de_liquidacion.totales?.otros || 0,
      total: pedimento.cuadro_de_liquidacion.totales?.total || 0,
    },
  };

  return (
    <div
      className={cn('relative flex w-full flex-col overflow-hidden', className)}
    >
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-500">
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
                    rfc: pedimento.datos_importador.rfc || '',
                    curp: pedimento.datos_importador.curp || '',
                    razon_social: pedimento.datos_importador.razon_social || '',
                    domicilio: pedimento.datos_importador.domicilio || '',
                  }}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoIncrementables
                  incrementables={{
                    val_seguros: pedimento.incrementables.valor_seguros || 0,
                    seguros: pedimento.incrementables.seguros || 0,
                    fletes: pedimento.incrementables.fletes || 0,
                    embalajes: pedimento.incrementables.embalajes || 0,
                    otros_incrementables:
                      pedimento.incrementables.otros_incrementables || 0,
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
                      pedimento.decrementables.transporte_decrementables || 0,
                    seguro_decrementables:
                      pedimento.decrementables.seguro_decrementables || 0,
                    carga_decrementables:
                      pedimento.decrementables.carga_decrementables || 0,
                    descarga_decrementables:
                      pedimento.decrementables.descarga_decrementables || 0,
                    otros_decrementables:
                      pedimento.decrementables.otros_decrementables || 0,
                  }}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoIdentificadores
                  identificadoresNivelPedimento={{
                    clave_seccion_aduanera:
                      pedimento.identificadores_nivel_pedimento
                        .clave_seccion_aduanera || '',
                    marcas_numeros_bultos:
                      pedimento.identificadores_nivel_pedimento
                        .marcas_numeros_bultos || '',
                  }}
                  identificadoresPedimento={pedimento.identificadores_pedimento.map(
                    (id) => ({
                      clave: id.clave || '',
                      complemento_1: id.complemento_1 || '',
                      complemento_2: id.complemento_2 || '',
                      complemento_3: id.complemento_3 || '',
                    })
                  )}
                  fechaEntrada={
                    pedimento.fecha_entrada_presentacion
                      ? pedimento.fecha_entrada_presentacion.toString()
                      : undefined
                  }
                  fechaPago={
                    pedimento.fecha_entrada_presentacion
                      ? pedimento.fecha_entrada_presentacion.toString()
                      : undefined
                  }
                  // Generate tasas from partidas contribuciones if available
                  tasas={
                    pedimento.partidas?.[0]?.contribuciones?.map((c) => ({
                      contrib: c.con || '',
                      cve_t_tasa: c.t_t || '',
                      tasa: c.tasa?.toString() || '0',
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
                  idFiscal={pedimento.id_fiscal || ''}
                  nombreRazonSocial={pedimento.nombre_razon_social || ''}
                  domicilio={pedimento.domicilio || ''}
                  vinculacion={pedimento.vinculacion || ''}
                  datosFactura={{
                    num_factura: pedimento.datos_factura.num_factura || '',
                    fecha_factura: pedimento.datos_factura.fecha_factura || '',
                    incoterm: pedimento.datos_factura.incoterm || '',
                    moneda_factura:
                      pedimento.datos_factura.moneda_factura || '',
                    valor_moneda_factura:
                      pedimento.datos_factura.valor_moneda_factura || 0,
                    factor_moneda_factura:
                      pedimento.datos_factura.factor_moneda_factura || 0,
                    valor_dolares_factura:
                      pedimento.datos_factura.valor_dolares_factura || 0,
                  }}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="w-full">
                <PedimentoContenedores
                  numero={pedimento.tipo_contenedor_vehiculo || ''}
                  tipo=""
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
              <div className="mb-4 w-full w-full border border border-gray-400 border-gray-400">
                <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
                  <div className="col-span-12 bg-gray-200 py-0.5 text-center font-semibold text-[10px] uppercase">
                    NUMERO (GUIA/ORDEN EMBARQUE)/ID:
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-0">
                  <div className="col-span-12 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
                    {pedimento.no_guia_embarque_id}
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
