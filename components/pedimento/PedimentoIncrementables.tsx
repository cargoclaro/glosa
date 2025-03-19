import React from "react";

interface PedimentoIncrementablesProps {
  incrementables: {
    val_seguros: number;
    seguros: number;
    fletes: number;
    embalajes: number;
    otros_incrementables: number;
  };
}

const PedimentoIncrementables: React.FC<PedimentoIncrementablesProps> = ({ incrementables }) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return "0";
    return num.toString();
  };

  return (
    <div className="pedimento-section" style={{ "--animation-order": 5 } as React.CSSProperties}>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-header">VAL.SEGUROS</div>
        <div className="pedimento-header">SEGUROS</div>
        <div className="pedimento-header">FLETES</div>
        <div className="pedimento-header">EMBALAJES</div>
        <div className="pedimento-header">OTROS INCREMENTABLES</div>
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(incrementables.val_seguros)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(incrementables.seguros)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(incrementables.fletes)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(incrementables.embalajes)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(incrementables.otros_incrementables)}</div>
      </div>
    </div>
  );
};

export default PedimentoIncrementables;
