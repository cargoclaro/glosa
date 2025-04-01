import type React from 'react';
import { cn } from '~/lib/utils';
import IdentificadoresTable from './identificadores/identificadores-table';
import LiquidacionTable from './liquidacion/liquidacion-table';
import TasasTable from './tasas/tasas-table';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoIdentificadoresProps {
  identificadoresNivelPedimento: {
    clave_seccion_aduanera: string;
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
  identificadoresPedimento,
  fechaEntrada,
  fechaPago,
  tasas = [],
  liquidacion,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  return (
    <div className="mb-4 w-full">
      <div className="mt-2 grid grid-cols-2 gap-0">
        <div 
          className={cn(
            'col-span-1 cursor-pointer border border-gray-400 overflow-hidden rounded-md border-2',
            getHighlightBorder('Operacion monetaria', tabs),
            getHighlightFill('Operacion monetaria', tabInfoSelected)
          )}
          onClick={() => onClick('Operacion monetaria')}
        >
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
