
import React from "react";

interface PedimentoTransporteProps {
  mediosTransporte: {
    entrada_salida: string;
    arribo: string;
    salida: string;
  };
}

const PedimentoTransporte: React.FC<PedimentoTransporteProps> = ({ mediosTransporte }) => {
  return (
    <div className="pedimento-section" style={{ "--animation-order": 2 } as React.CSSProperties}>
      <div className="border border-gray-400">
        <div className="pedimento-cell pedimento-header bg-gray-200 text-center font-bold">
          MEDIOS DE TRANSPORTE
        </div>
        
        <div className="grid grid-cols-3 gap-0">
          <div className="pedimento-cell pedimento-header text-center font-bold">ENTRADA/SALIDA:</div>
          <div className="pedimento-cell pedimento-header text-center font-bold">ARRIBO:</div>
          <div className="pedimento-cell pedimento-header text-center font-bold">SALIDA:</div>
        </div>
        
        <div className="grid grid-cols-3 gap-0">
          <div className="pedimento-cell pedimento-value text-center">{mediosTransporte.entrada_salida || "-"}</div>
          <div className="pedimento-cell pedimento-value text-center">{mediosTransporte.arribo || "-"}</div>
          <div className="pedimento-cell pedimento-value text-center">{mediosTransporte.salida || "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoTransporte;
