
import React from "react";
import { Pedimento } from "../../types/pedimento";

interface PedimentoEncabezadoProps {
  pedimento: Pedimento;
}

const PedimentoEncabezado: React.FC<PedimentoEncabezadoProps> = ({ pedimento }) => {
  const { encabezado_del_pedimento } = pedimento;
  
  return (
    <div className="pedimento-section" style={{ "--animation-order": 1 } as React.CSSProperties}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <div>
          <div className="pedimento-cell pedimento-header">DESTINO:</div>
          <div className="pedimento-cell pedimento-value">{encabezado_del_pedimento.destino_origen}</div>
        </div>
        <div>
          <div className="pedimento-cell pedimento-header">TIPO CAMBIO:</div>
          <div className="pedimento-cell pedimento-value">{encabezado_del_pedimento.tipo_cambio?.toFixed(5)}</div>
        </div>
        <div>
          <div className="pedimento-cell pedimento-header">PESO BRUTO:</div>
          <div className="pedimento-cell pedimento-value">{encabezado_del_pedimento.peso_bruto?.toFixed(3)}</div>
        </div>
        <div>
          <div className="pedimento-cell pedimento-header">ADUANA E/S:</div>
          <div className="pedimento-cell pedimento-value">{encabezado_del_pedimento.aduana_entrada_salida}</div>
        </div>
      </div>
      <div className="grid grid-cols-1">
        <div className="pedimento-cell pedimento-header">RÉGIMEN:</div>
        <div className="pedimento-cell pedimento-value">{encabezado_del_pedimento.regimen}</div>
      </div>
    </div>
  );
};

export default PedimentoEncabezado;
