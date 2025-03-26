import { cn } from '@/shared/utils/cn';
import type React from 'react';
import IdentificadoresTable from './identificadores/identificadores-table';
import LiquidacionTable from './liquidacion/liquidacion-table';
import TasasTable from './tasas/tasas-table';

import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoIdentificadoresProps {
  identificadoresNivelPedimento: {
    clave_seccion_aduanera: string;
    marcas_numeros_bultos: string;
  };
  identificadoresPedimento: Array<{
    clave: string;
    complemento_1: string;
    complemento_2: string;
    complemento_3: string;
  }>;
  fechaEntrada?: string;
  fechaPago?: string;
  tasas?: Array<{
    contrib: string;
    cve_t_tasa: string;
    tasa: string;
  }>;
  liquidacion: {
    conceptos: Array<{
      concepto: string;
      fp: string;
      importe: number;
    }>;
    totales: {
      efectivo: number;
      otros: number;
      total: number;
    };
  };
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoIdentificadores: React.FC<PedimentoIdentificadoresProps> = ({
  identificadoresNivelPedimento,
  identificadoresPedimento,
  fechaEntrada,
  fechaPago,
  tasas = [],
  liquidacion,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  // Helper functions to determine highlight styles
  const getHighlightBorder = (section: string) => {
    const tab = tabs.find((tab) => tab.name === section);
    return tab?.isCorrect || tab?.isVerified
      ? 'border-green-500'
      : 'border-yellow-400';
  };

  const getHighlightFill = (section: string) => {
    if (tabInfoSelected.name !== section) {
      return '';
    }

    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
      ? 'bg-green-100/50'
      : 'bg-yellow-100/50';
  };

  return (
    <div
      className={cn(
        'mb-4 w-full border border-gray-400 cursor-pointer',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Clave de destino/origen'),
        getHighlightFill('Clave de destino/origen')
      )}
      onClick={() => onClick('Clave de destino/origen')}
    >
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-4">
          <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
            CÓDIGO DE ACEPTACIÓN:
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            &nbsp;
          </div>
        </div>
        <div className="col-span-4">
          <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
            CODIGO DE BARRAS
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            &nbsp;
          </div>
        </div>
        <div className="col-span-4">
          <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
            CLAVE DE LA SECCION ADUANERA DE DESPACHO:
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-center text-[10px]">
            {identificadoresNivelPedimento.clave_seccion_aduanera}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-12 gap-0">
        <div className="col-span-8">
          <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
            MARCAS, NUMEROS Y TOTAL DE BULTOS:
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            {identificadoresNivelPedimento.marcas_numeros_bultos}
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex h-full flex-col">
            <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">1/2</div>
            <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal flex flex-1 items-center justify-center py-0.5 text-center text-[10px]">
              2
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-0">
        <div className="col-span-1">
          <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
            FECHAS
          </div>
          <div className="grid grid-cols-1 gap-0">
            <div className="grid grid-cols-3 gap-0">
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold col-span-1 py-0.5 text-[10px]">
                ENTRADA
              </div>
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-2 py-0.5 text-[10px]">
                {fechaEntrada}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0">
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold col-span-1 py-0.5 text-[10px]">
                PAGO
              </div>
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-2 py-0.5 text-[10px]">
                {fechaPago}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
            TASAS A NIVEL PEDIMENTO
          </div>
          <TasasTable tasas={tasas} />
        </div>
      </div>

      <div className="mt-2">
        <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
          IDENTIFICADORES
        </div>
        <IdentificadoresTable identificadores={identificadoresPedimento} />
      </div>

      <div className="mt-2">
        <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
          LIQUIDACIÓN
        </div>
        <LiquidacionTable liquidacion={liquidacion} />
      </div>
    </div>
  );
};

export default PedimentoIdentificadores;
