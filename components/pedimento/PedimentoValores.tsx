
import React from "react";

interface PedimentoValoresProps {
  valores: {
    valor_dolares: number;
    valor_aduana: number;
    precio_pagado_valor_comercial: number;
  };
}

const PedimentoValores: React.FC<PedimentoValoresProps> = ({ valores }) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="pedimento-section" style={{ "--animation-order": 3 } as React.CSSProperties}>
      <div className="border border-gray-400">
        <div className="grid grid-cols-2 gap-0">
          <div className="pedimento-cell pedimento-header border-b-0">VALOR DOLARES:</div>
          <div className="pedimento-cell pedimento-value text-right border-b-0">{formatNumber(valores.valor_dolares)}</div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="pedimento-cell pedimento-header border-b-0 border-t-0">VALOR ADUANA:</div>
          <div className="pedimento-cell pedimento-value text-right border-b-0 border-t-0">{formatNumber(valores.valor_aduana)}</div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="pedimento-cell pedimento-header border-t-0">PRECIO PAGADO/VALOR COMERCIAL:</div>
          <div className="pedimento-cell pedimento-value text-right border-t-0">{formatNumber(valores.precio_pagado_valor_comercial)}</div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoValores;
