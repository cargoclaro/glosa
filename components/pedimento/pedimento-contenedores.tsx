import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface PedimentoContenedoresProps {
  numero: string;
  tipo: string;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoContenedores: React.FC<PedimentoContenedoresProps> = ({
  numero,
  tipo,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  return (
    <div 
      className={cn(
        'mb-4 w-full border border-gray-400 cursor-pointer',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Datos del transporte', tabs),
        getHighlightFill('Datos del transporte', tabInfoSelected)
      )}
      onClick={() => onClick('Datos del transporte')}
    >
      <div className="border border-gray-400">
        <div className="flex min-h-6 items-center border-gray-400 border-gray-400 border-r border-b bg-gray-200 bg-gray-200 px-2 py-0.5 py-1 text-center text-center font-bold font-semibold text-[10px] text-black text-xs text-xs uppercase tracking-wider last:border-r-0">
          CONTENEDORES/ CARRO DE FERROCARRIL/ NÚMERO ECONÓMICO DEL VEHÍCULO
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-gray-400 border-gray-400 border-r border-r border-b bg-gray-200 px-2 py-0.5 py-1 text-center font-bold font-semibold text-[10px] text-black text-xs text-xs uppercase tracking-wider last:border-r-0">
            NÚMERO (GUÍA)
          </div>
          <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-gray-400 border-gray-400 border-r border-r border-b bg-gray-200 px-2 py-0.5 py-1 text-center font-bold font-semibold text-[10px] text-black text-xs text-xs uppercase tracking-wider last:border-r-0">
            TIPO
          </div>
          <div className="col-span-6 flex min-h-6 items-center border-gray-400 border-gray-400 border-r border-b bg-gray-200 px-2 py-0.5 py-1 text-center font-bold font-semibold text-[10px] text-black text-xs text-xs uppercase tracking-wider last:border-r-0">
            ID (CONTENEDOR)
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-gray-400 border-r border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {numero || ''}
          </div>
          <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-gray-400 border-r border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {tipo || ''}
          </div>
          <div className="col-span-6 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {/* ID value can be added here if needed in the future */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoContenedores;
