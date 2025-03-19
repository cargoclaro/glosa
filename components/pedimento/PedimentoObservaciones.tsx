
import React from "react";

interface PedimentoObservacionesProps {
  observaciones: string;
}

const PedimentoObservaciones: React.FC<PedimentoObservacionesProps> = ({ observaciones }) => {
  if (!observaciones) {
    return null;
  }

  return (
    <div className="pedimento-section" style={{ "--animation-order": 5 } as React.CSSProperties}>
      <div className="border border-gray-400">
        <div className="pedimento-cell pedimento-header bg-gray-200 text-center">OBSERVACIONES</div>
        <div className="pedimento-cell pedimento-value whitespace-pre-line">{observaciones}</div>
      </div>
    </div>
  );
};

export default PedimentoObservaciones;
