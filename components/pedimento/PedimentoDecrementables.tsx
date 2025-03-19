import React from "react";

interface PedimentoDecrementablesProps {
  decrementables: {
    transporte_decrementables: number;
    seguro_decrementables: number;
    carga_decrementables: number;
    descarga_decrementables: number;
    otros_decrementables: number;
  };
}

const PedimentoDecrementables: React.FC<PedimentoDecrementablesProps> = ({ decrementables }) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return "0";
    return num.toString();
  };

  return (
    <div className="pedimento-section" style={{ "--animation-order": 6 } as React.CSSProperties}>
      <div className="pedimento-section-title">VALOR DECREMENTABLES</div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-header">TRANSPORTE DECREMENTABLES</div>
        <div className="pedimento-header">SEGURO DECREMENTABLES</div>
        <div className="pedimento-header">CARGA DECREMENTABLES</div>
        <div className="pedimento-header">DESCARGA DECREMENTABLES</div>
        <div className="pedimento-header">OTROS DECREMENTABLES</div>
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(decrementables.transporte_decrementables)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(decrementables.seguro_decrementables)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(decrementables.carga_decrementables)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(decrementables.descarga_decrementables)}</div>
        <div className="pedimento-cell pedimento-value text-center">{formatNumber(decrementables.otros_decrementables)}</div>
      </div>
    </div>
  );
};

export default PedimentoDecrementables;
