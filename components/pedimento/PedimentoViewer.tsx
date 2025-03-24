import { useState } from 'react';
import { cn } from '~/lib/utils';
import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
import PedimentoContenedores from './PedimentoContenedores';
import PedimentoDecrementables from './PedimentoDecrementables';
import PedimentoHeader from './PedimentoHeader';
import PedimentoIdentificadores from './PedimentoIdentificadores';
import PedimentoImportador from './PedimentoImportador';
import PedimentoIncrementables from './PedimentoIncrementables';
import PedimentoPartidas from './PedimentoPartidas';
import PedimentoProveedor from './PedimentoProveedor';
import type { CustomGlossTabTable } from '~/db/schema';
import { Button } from "@/shared/components/ui/button";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PedimentoViewerProps {
  pedimento: Pedimento;
  className?: string;
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoViewer = ({ 
  pedimento, 
  className,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false }
}: PedimentoViewerProps) => {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2'>('page1');
  const totalPages = 2;
  
  // Navigation functions
  const goToNextPage = () => {
    if (activeTab === 'page1') {
      setActiveTab('page2');
    }
  };

  const goToPrevPage = () => {
    if (activeTab === 'page2') {
      setActiveTab('page1');
    }
  };

  const goToFirstPage = () => {
    setActiveTab('page1');
  };

  const goToLastPage = () => {
    setActiveTab('page2');
  };

  // Determine if next/prev buttons should be enabled
  const canGoNext = activeTab === 'page1';
  const canGoPrev = activeTab === 'page2';
  
  // Get current page number for display
  const currentPage = activeTab === 'page1' ? 1 : 2;

  // Transform liquidaciones from pedimento to match our component's expected structure
  const liquidacionData = {
    conceptos: pedimento.liquidaciones?.map(item => ({
      concepto: item.concepto || '',
      fp: item.fp?.toString() || '0',
      importe: item.importe || 0,
    })) || [],
    totales: {
      // Calculate totals based on liquidaciones
      efectivo: pedimento.liquidaciones?.reduce((sum, item) => sum + (item.importe || 0), 0) || 0,
      otros: 0,
      total: pedimento.liquidaciones?.reduce((sum, item) => sum + (item.importe || 0), 0) || 0,
    },
  };

  return (
    <div className={cn('flex w-full flex-col overflow-hidden relative', className)}>
      <div className="glass-card mx-auto w-full max-w-4xl overflow-hidden rounded-xl shadow-xl transition-all duration-500">
        <div className="overflow-x-auto p-3">
          {activeTab === 'page1' && (
            <div className="flex w-full flex-col gap-2">
              <div className="w-full">
                <PedimentoHeader
                  pedimento={pedimento}
                  page={1}
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
                  fechaEntrada={pedimento.fecha_entrada_presentacion ? pedimento.fecha_entrada_presentacion.toString() : undefined}
                  fechaPago={pedimento.fecha_entrada_presentacion ? pedimento.fecha_entrada_presentacion.toString() : undefined}
                  // Generate tasas from partidas contribuciones if available
                  tasas={pedimento.partidas?.[0]?.contribuciones?.map(c => ({
                    contrib: c.con || '',
                    cve_t_tasa: c.t_t || '',
                    tasa: c.tasa?.toString() || '0',
                  })) || []}
                  liquidacion={liquidacionData}
                  tabs={tabs}
                  onClick={onClick}
                  tabInfoSelected={tabInfoSelected}
                />
              </div>
            </div>
          )}

          {activeTab === 'page2' && (
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
                    moneda_factura: pedimento.datos_factura.moneda_factura || '',
                    valor_moneda_factura: pedimento.datos_factura.valor_moneda_factura || 0,
                    factor_moneda_factura: pedimento.datos_factura.factor_moneda_factura || 0,
                    valor_dolares_factura: pedimento.datos_factura.valor_dolares_factura || 0,
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
              <div
                className="pedimento-section w-full border border-gray-400"
                style={{ '--animation-order': 4 } as React.CSSProperties}
              >
                <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
                  <div className="col-span-12 bg-gray-200 py-0.5 text-center font-semibold text-[10px] uppercase">
                    NUMERO (GUIA/ORDEN EMBARQUE)/ID:
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-0">
                  <div className="pedimento-cell col-span-12 py-0.5 text-[10px]">
                    {pedimento.no_guia_embarque_id}
                  </div>
                </div>
              </div>
              {pedimento.partidas && (
                <div className="w-full">
                  <PedimentoPartidas 
                    partidas={pedimento.partidas}
                    tabs={tabs}
                    onClick={onClick}
                    tabInfoSelected={tabInfoSelected}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Page navigation */}
      <div className="container mx-auto px-2 py-1 flex justify-center items-center space-x-1 mt-0.5">
        {/* First page button */}
        <Button 
          variant="outline" 
          className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-0.5 h-6 text-[10px]"
          onClick={goToFirstPage}
          disabled={!canGoPrev}
        >
          <ChevronFirst className="h-2.5 w-2.5" />
        </Button>

        {/* Previous page button */}
        {canGoPrev && (
          <Button 
            variant="outline" 
            className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-0.5 h-6 text-[10px]" 
            onClick={goToPrevPage}
          >
            <ArrowLeft className="mr-0.5 h-2.5 w-2.5" />
            Anterior
          </Button>
        )}

        {/* Page indicator */}
        <span className="text-[10px] text-gray-600">
          Página {currentPage} de {totalPages}
        </span>

        {/* Next page button */}
        {canGoNext && (
          <Button 
            variant="default" 
            className="bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 flex items-center py-0.5 h-6 text-[10px]" 
            onClick={goToNextPage}
          >
            Siguiente
            <ArrowRight className="ml-0.5 h-2.5 w-2.5" />
          </Button>
        )}

        {/* Last page button */}
        <Button 
          variant="outline" 
          className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-0.5 h-6 text-[10px]"
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        >
          <ChevronLast className="h-2.5 w-2.5" />
        </Button>
      </div>
    </div>
  );
};

export default PedimentoViewer;
