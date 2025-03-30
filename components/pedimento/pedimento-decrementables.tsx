import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface PedimentoDecrementablesProps {
  decrementables: {
    transporte_decrementables: number;
    seguro_decrementables: number;
    carga_decrementables: number;
    descarga_decrementables: number;
    otros_decrementables: number;
  };
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoDecrementables: React.FC<PedimentoDecrementablesProps> = ({
  decrementables,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) {
      return '0';
    }
    return num.toString();
  };

  return (
    <div
      className={cn(
        'mb-4 w-full cursor-pointer border border-gray-400',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Operación monetaria', tabs),
        getHighlightFill('Operación monetaria', tabInfoSelected)
      )}
      onClick={() => onClick('Operación monetaria')}
    >
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
        VALOR DECREMENTABLES
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
          TRANSPORTE DECREMENTABLES
        </div>
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
          SEGURO DECREMENTABLES
        </div>
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
          CARGA DECREMENTABLES
        </div>
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
          DESCARGA DECREMENTABLES
        </div>
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
          OTROS DECREMENTABLES
        </div>
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
          {formatNumber(decrementables.transporte_decrementables)}
        </div>
        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
          {formatNumber(decrementables.seguro_decrementables)}
        </div>
        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
          {formatNumber(decrementables.carga_decrementables)}
        </div>
        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
          {formatNumber(decrementables.descarga_decrementables)}
        </div>
        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
          {formatNumber(decrementables.otros_decrementables)}
        </div>
      </div>
    </div>
  );
};

export default PedimentoDecrementables;
