import React from "react";
import { Pedimento } from "../../types/pedimento";

interface PedimentoHeaderProps {
  pedimento: Pedimento;
  page: number;
  totalPages: number;
}

const PedimentoHeader: React.FC<PedimentoHeaderProps> = ({ pedimento, page, totalPages }) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(num);
  };

  if (page !== 1) {
    return null; // Don't show header on page 2
  }

  return (
    <div className="pedimento-section" style={{ "--animation-order": 0 } as React.CSSProperties}>
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-12 pedimento-section-title">
          PEDIMENTO
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-0 border-b border-gray-400">
        <div className="col-span-3 pedimento-cell pedimento-label">NUM. PEDIMENTO:</div>
        <div className="col-span-3 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.num_pedimento}</div>
        <div className="col-span-2 pedimento-cell pedimento-label">T.OPER</div>
        <div className="col-span-1 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.tipo_oper}</div>
        <div className="col-span-2 pedimento-cell pedimento-label">CVE. PEDIMENTO:</div>
        <div className="col-span-1 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.cve_pedim}</div>
      </div>
      
      <div className="grid grid-cols-12 gap-0 border-b border-gray-400">
        <div className="col-span-1 pedimento-cell pedimento-label">DESTINO:</div>
        <div className="col-span-1 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.destino_origen}</div>
        <div className="col-span-2 pedimento-cell pedimento-label">TIPO CAMBIO:</div>
        <div className="col-span-2 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.tipo_cambio.toFixed(5)}</div>
        <div className="col-span-2 pedimento-cell pedimento-label">PESO BRUTO:</div>
        <div className="col-span-2 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.peso_bruto.toFixed(3)}</div>
        <div className="col-span-1 pedimento-cell pedimento-label">ADUANA E/S:</div>
        <div className="col-span-1 pedimento-cell pedimento-value">{pedimento.encabezado_del_pedimento.aduana_entrada_salida}</div>
      </div>
      
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-6 border-r border-gray-400">
          <div className="pedimento-section-title">MEDIOS DE TRANSPORTE</div>
          <div className="grid grid-cols-3 gap-0 border-b border-gray-400">
            <div className="pedimento-cell pedimento-label text-center">ENTRADA/SALIDA:</div>
            <div className="pedimento-cell pedimento-label text-center">ARRIBO:</div>
            <div className="pedimento-cell pedimento-label text-center">SALIDA:</div>
          </div>
          <div className="grid grid-cols-3 gap-0">
            <div className="pedimento-cell pedimento-value text-center">{pedimento.medios_transporte.entrada_salida || "-"}</div>
            <div className="pedimento-cell pedimento-value text-center">{pedimento.medios_transporte.arribo || "-"}</div>
            <div className="pedimento-cell pedimento-value text-center">{pedimento.medios_transporte.salida || "-"}</div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="grid grid-cols-2 gap-0 border-b border-gray-400">
            <div className="pedimento-cell pedimento-label">VALOR DOLARES:</div>
            <div className="pedimento-cell pedimento-value text-right">{formatNumber(pedimento.valores.valor_dolares)}</div>
          </div>
          <div className="grid grid-cols-2 gap-0 border-b border-gray-400">
            <div className="pedimento-cell pedimento-label">VALOR ADUANA:</div>
            <div className="pedimento-cell pedimento-value text-right">{formatNumber(pedimento.valores.valor_aduana)}</div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="pedimento-cell pedimento-label">PRECIO PAGADO/VALOR COMERCIAL:</div>
            <div className="pedimento-cell pedimento-value text-right">{formatNumber(pedimento.valores.precio_pagado_valor_comercial)}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-0 border-t border-gray-400">
        <div className="col-span-12 text-right text-xs py-1 italic">
          Página {page} de {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PedimentoHeader;
