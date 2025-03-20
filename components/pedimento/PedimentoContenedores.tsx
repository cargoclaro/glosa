import type React from 'react';

interface PedimentoContenedoresProps {
  numero: string;
  tipo: string;
}

const PedimentoContenedores: React.FC<PedimentoContenedoresProps> = ({
  numero,
  tipo,
}) => {
  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 3 } as React.CSSProperties}
    >
      <div className="border border-gray-400">
        <div className="pedimento-cell pedimento-header bg-gray-200 text-center font-bold">
          CONTENEDORES/ CARRO DE FERROCARRIL/ NÚMERO ECONÓMICO DEL VEHÍCULO
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="pedimento-cell pedimento-header col-span-3 border-gray-400 border-r font-bold">
            NÚMERO (GUÍA)
          </div>
          <div className="pedimento-cell pedimento-header col-span-3 border-gray-400 border-r font-bold">
            TIPO
          </div>
          <div className="pedimento-cell pedimento-header col-span-6 font-bold">
            ID (CONTENEDOR)
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="pedimento-cell pedimento-value col-span-3 border-gray-400 border-r">
            {numero || 'XXXX'}
          </div>
          <div className="pedimento-cell pedimento-value col-span-3 border-gray-400 border-r">
            {tipo || ''}
          </div>
          <div className="pedimento-cell pedimento-value col-span-6">
            {/* ID value can be added here if needed in the future */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoContenedores;
