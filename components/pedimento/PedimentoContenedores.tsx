import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoContenedoresProps {
  numero: string;
  tipo: string;
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoContenedores: React.FC<PedimentoContenedoresProps> = ({
  numero,
  tipo,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 3 } as React.CSSProperties}
    >
      <div className="border border-gray-400">
        <div className="pedimento-cell pedimento-header bg-gray-200 text-center font-bold py-0.5 text-[10px]">
          CONTENEDORES/ CARRO DE FERROCARRIL/ NÚMERO ECONÓMICO DEL VEHÍCULO
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="pedimento-cell pedimento-header col-span-3 border-gray-400 border-r font-bold py-0.5 text-[10px]">
            NÚMERO (GUÍA)
          </div>
          <div className="pedimento-cell pedimento-header col-span-3 border-gray-400 border-r font-bold py-0.5 text-[10px]">
            TIPO
          </div>
          <div className="pedimento-cell pedimento-header col-span-6 font-bold py-0.5 text-[10px]">
            ID (CONTENEDOR)
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="pedimento-cell pedimento-value col-span-3 border-gray-400 border-r py-0.5 text-[10px]">
            {numero || ''}
          </div>
          <div className="pedimento-cell pedimento-value col-span-3 border-gray-400 border-r py-0.5 text-[10px]">
            {tipo || ''}
          </div>
          <div className="pedimento-cell pedimento-value col-span-6 py-0.5 text-[10px]">
            {/* ID value can be added here if needed in the future */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoContenedores;
