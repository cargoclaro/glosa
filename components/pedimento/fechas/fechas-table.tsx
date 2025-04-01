import type React from 'react';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from '../utils/highlight-styles';
import type { CustomGlossTabTable } from '~/db/schema';

interface FechasTableProps {
  fechaEntrada?: string;
  fechaPago?: string;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const FechasTable: React.FC<FechasTableProps> = ({
  fechaEntrada,
  fechaPago,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  // The tab name must match exactly what is used throughout the application
  const tabName = 'Operación monetaria';
  
  return (
    <div 
      className={cn(
        'cursor-pointer border border-gray-400 overflow-hidden rounded-md border-2',
        getHighlightBorder(tabName, tabs),
        getHighlightFill(tabName, tabInfoSelected)
      )}
      onClick={() => onClick(tabName)}
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
  );
};

export default FechasTable; 