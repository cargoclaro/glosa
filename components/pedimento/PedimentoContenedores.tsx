
import React from "react";

interface PedimentoContenedoresProps {
  numero: string;
  tipo: string;
}

const PedimentoContenedores: React.FC<PedimentoContenedoresProps> = ({ 
  numero, 
  tipo 
}) => {
  return (
    <div className="pedimento-section" style={{ "--animation-order": 3 } as React.CSSProperties}>
      <div className="border border-gray-400">
        <div className="pedimento-cell pedimento-header bg-gray-200 text-center font-bold">
          CONTENEDORES/ CARRO DE FERROCARRIL/ NÚMERO ECONÓMICO DEL VEHÍCULO
        </div>
        
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-3 pedimento-cell pedimento-header font-bold border-r border-gray-400">
            NÚMERO (GUÍA)
          </div>
          <div className="col-span-3 pedimento-cell pedimento-header font-bold border-r border-gray-400">
            TIPO
          </div>
          <div className="col-span-6 pedimento-cell pedimento-header font-bold">
            ID (CONTENEDOR)
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-3 pedimento-cell pedimento-value border-r border-gray-400">
            {numero || "XXXX"}
          </div>
          <div className="col-span-3 pedimento-cell pedimento-value border-r border-gray-400">
            {tipo || ""}
          </div>
          <div className="col-span-6 pedimento-cell pedimento-value">
            {/* ID value can be added here if needed in the future */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoContenedores;
