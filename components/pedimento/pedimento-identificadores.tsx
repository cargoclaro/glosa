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
        'mb-4 w-full cursor-pointer border border-gray-400',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Clave de destino/origen'),
        getHighlightFill('Clave de destino/origen')
      )}
      onClick={() => onClick('Clave de destino/origen')}
    >
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-4">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            CÓDIGO DE ACEPTACIÓN:
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            &nbsp;
          </div>
        </div>
        <div className="col-span-4">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            CODIGO DE BARRAS
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            &nbsp;
          </div>
        </div>
        <div className="col-span-4">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            CLAVE DE LA SECCION ADUANERA DE DESPACHO:
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
            {identificadoresNivelPedimento.clave_seccion_aduanera}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-12 gap-0">
        <div className="col-span-8">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            MARCAS, NUMEROS Y TOTAL DE BULTOS:
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {identificadoresNivelPedimento.marcas_numeros_bultos}
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex h-full flex-col">
            <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
              1/2
            </div>
            <div className="flex flex min-h-6 flex-1 items-center items-center justify-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
              2
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-0">
        <div className="col-span-1">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            FECHAS
          </div>
          <div className="grid grid-cols-1 gap-0">
            <div className="grid grid-cols-3 gap-0">
              <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
                ENTRADA
              </div>
              <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
                {fechaEntrada}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0">
              <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
                PAGO
              </div>
              <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
                {fechaPago}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            TASAS A NIVEL PEDIMENTO
          </div>
          <TasasTable tasas={tasas} />
        </div>
      </div>

      <div className="mt-2">
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
          IDENTIFICADORES
        </div>
        <IdentificadoresTable identificadores={identificadoresPedimento} />
      </div>

      <div className="mt-2">
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
          LIQUIDACIÓN
        </div>
        <LiquidacionTable liquidacion={liquidacion} />
      </div>
    </div>
  );
};

export default PedimentoIdentificadores;
