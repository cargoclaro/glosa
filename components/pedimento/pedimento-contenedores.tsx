import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

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
}) => {
  return (
    <div
      className="mb-4 w-full border border-gray-400"
    >
      <div className="border border-gray-400">
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 bg-gray-200 py-0.5 text-center font-bold text-[10px]">
          CONTENEDORES/ CARRO DE FERROCARRIL/ NÚMERO ECONÓMICO DEL VEHÍCULO
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 col-span-3 border-gray-400 border-r py-0.5 font-bold text-[10px]">
            NÚMERO (GUÍA)
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 col-span-3 border-gray-400 border-r py-0.5 font-bold text-[10px]">
            TIPO
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 col-span-6 py-0.5 font-bold text-[10px]">
            ID (CONTENEDOR)
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-3 border-gray-400 border-r py-0.5 text-[10px]">
            {numero || ''}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-3 border-gray-400 border-r py-0.5 text-[10px]">
            {tipo || ''}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-6 py-0.5 text-[10px]">
            {/* ID value can be added here if needed in the future */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoContenedores;
