import { useState } from 'react';
import { cn } from '~/lib/utils';
import type { Pedimento } from '~/types/pedimento';
import PedimentoContenedores from './PedimentoContenedores';
import PedimentoDecrementables from './PedimentoDecrementables';
import PedimentoHeader from './PedimentoHeader';
import PedimentoIdentificadores from './PedimentoIdentificadores';
import PedimentoImportador from './PedimentoImportador';
import PedimentoIncrementables from './PedimentoIncrementables';
import PedimentoPartidas from './PedimentoPartidas';
import PedimentoProveedor from './PedimentoProveedor';

interface PedimentoViewerProps {
  pedimento: Pedimento;
  className?: string;
}

const PedimentoViewer = ({ pedimento, className }: PedimentoViewerProps) => {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2'>('page1');
  const totalPages = 2;

  // Mock liquidation data (in a real app, this would come from the pedimento)
  const liquidacionData = {
    conceptos: [
      { concepto: 'DTA', fp: '0', importe: 1967 },
      { concepto: 'IVA', fp: '0', importe: 39644 },
      { concepto: 'PRV', fp: '0', importe: 290 },
      { concepto: 'IVA PRV', fp: '0', importe: 46 },
    ],
    totales: {
      efectivo: 41947,
      otros: 0,
      total: 41947,
    },
  };

  return (
    <div className={cn('flex w-full flex-col overflow-hidden', className)}>
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('page1')}
          className={cn(
            'rounded-md px-6 py-2 transition-all duration-300 ease-in-out',
            activeTab === 'page1'
              ? 'bg-black text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Página 1
        </button>
        <button
          onClick={() => setActiveTab('page2')}
          className={cn(
            'rounded-md px-6 py-2 transition-all duration-300 ease-in-out',
            activeTab === 'page2'
              ? 'bg-black text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Página 2
        </button>
      </div>

      <div className="glass-card mx-auto w-full max-w-4xl overflow-hidden rounded-xl shadow-xl transition-all duration-500">
        <div className="overflow-x-auto p-6">
          {activeTab === 'page1' && (
            <div className="flex w-full flex-col gap-4">
              <div className="w-full">
                <PedimentoHeader
                  pedimento={pedimento}
                  page={1}
                  totalPages={totalPages}
                />
              </div>
              <div className="w-full">
                <PedimentoImportador
                  datosImportador={{
                    rfc: pedimento.datos_importador.rfc,
                    curp: pedimento.datos_importador.curp,
                    razon_social: pedimento.datos_importador.razon_social,
                    domicilio: pedimento.datos_importador.domicilio,
                  }}
                />
              </div>
              <div className="w-full">
                <PedimentoIncrementables
                  incrementables={{
                    val_seguros: pedimento.incrementables.val_seguros,
                    seguros: pedimento.incrementables.seguros,
                    fletes: pedimento.incrementables.fletes,
                    embalajes: pedimento.incrementables.embalajes,
                    otros_incrementables:
                      pedimento.incrementables.otros_incrementables,
                  }}
                />
              </div>
              <div className="w-full">
                <PedimentoDecrementables
                  decrementables={{
                    transporte_decrementables:
                      pedimento.decrementables.transporte_decrementables,
                    seguro_decrementables:
                      pedimento.decrementables.seguro_decrementables,
                    carga_decrementables:
                      pedimento.decrementables.carga_decrementables,
                    descarga_decrementables:
                      pedimento.decrementables.descarga_decrementables,
                    otros_decrementables:
                      pedimento.decrementables.otros_decrementables,
                  }}
                />
              </div>
              <div className="w-full">
                <PedimentoIdentificadores
                  identificadoresNivelPedimento={{
                    clave_seccion_aduanera:
                      pedimento.identificadores_nivel_pedimento
                        .clave_seccion_aduanera,
                    marcas_numeros_bultos:
                      pedimento.identificadores_nivel_pedimento
                        .marcas_numeros_bultos,
                  }}
                  identificadoresPedimento={pedimento.identificadores_pedimento.map(
                    (id) => ({
                      clave: id.clave,
                      complemento_1: id.complemento_1,
                      complemento_2: id.complemento_2,
                      complemento_3: id.complemento_3,
                    })
                  )}
                  fechaEntrada={pedimento.fecha_entrada_presentacion}
                  fechaPago={pedimento.fecha_entrada_presentacion} // Using the same date as example
                  liquidacion={liquidacionData}
                />
              </div>
            </div>
          )}

          {activeTab === 'page2' && (
            <div className="flex w-full flex-col gap-4">
              <div className="w-full">
                <PedimentoProveedor
                  idFiscal={pedimento.id_fiscal}
                  nombreRazonSocial={pedimento.nombre_razon_social}
                  domicilio={pedimento.domicilio}
                  vinculacion={pedimento.vinculacion}
                  datosFactura={pedimento.datos_factura.map((factura) => ({
                    num_factura: factura.num_factura,
                    fecha_factura: factura.fecha_factura,
                    incoterm: factura.incoterm,
                    moneda_factura: factura.moneda_factura,
                    valor_moneda_factura: factura.valor_moneda_factura,
                    factor_moneda_factura: factura.factor_moneda_factura,
                    valor_dolares_factura: factura.valor_dolares_factura,
                  }))}
                />
              </div>
              <div className="w-full">
                <PedimentoContenedores
                  numero={pedimento.tipo_contenedor_vehiculo || 'XXXX'}
                  tipo=""
                />
              </div>
              <div
                className="pedimento-section w-full border border-gray-400"
                style={{ '--animation-order': 4 } as React.CSSProperties}
              >
                <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
                  <div className="col-span-12 bg-gray-200 py-1 text-center font-semibold text-xs uppercase">
                    NUMERO (GUIA/ORDEN EMBARQUE)/ID:
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-0">
                  <div className="pedimento-cell col-span-12 py-1 text-xs">
                    {pedimento.no_guia_embarque_id}
                  </div>
                </div>
              </div>
              {pedimento.partidas && (
                <div className="w-full">
                  <PedimentoPartidas partidas={pedimento.partidas} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedimentoViewer;
