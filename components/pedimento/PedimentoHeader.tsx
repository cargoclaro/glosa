import type React from 'react';
import type { Pedimento } from '../../types/pedimento';

interface PedimentoHeaderProps {
  pedimento: Pedimento;
  page: number;
  totalPages: number;
}

const PedimentoHeader: React.FC<PedimentoHeaderProps> = ({
  pedimento,
  page,
  totalPages,
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(num);
  };

  if (page !== 1) {
    return null; // Don't show header on page 2
  }

  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 0 } as React.CSSProperties}
    >
      <div className="grid grid-cols-12 gap-0">
        <div className="pedimento-section-title col-span-12">PEDIMENTO</div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-3">
          NUM. PEDIMENTO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-3">
          {pedimento.encabezado_del_pedimento.num_pedimento}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2">T.OPER</div>
        <div className="pedimento-cell pedimento-value col-span-1">
          {pedimento.encabezado_del_pedimento.tipo_oper}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2">
          CVE. PEDIMENTO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-1">
          {pedimento.encabezado_del_pedimento.cve_pedim}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-1">
          DESTINO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-1">
          {pedimento.encabezado_del_pedimento.destino_origen}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2">
          TIPO CAMBIO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-2">
          {pedimento.encabezado_del_pedimento.tipo_cambio.toFixed(5)}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2">
          PESO BRUTO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-2">
          {pedimento.encabezado_del_pedimento.peso_bruto.toFixed(3)}
        </div>
        <div className="pedimento-cell pedimento-label col-span-1">
          ADUANA E/S:
        </div>
        <div className="pedimento-cell pedimento-value col-span-1">
          {pedimento.encabezado_del_pedimento.aduana_entrada_salida}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-6 border-gray-400 border-r">
          <div className="pedimento-section-title">MEDIOS DE TRANSPORTE</div>
          <div className="grid grid-cols-3 gap-0 border-gray-400 border-b">
            <div className="pedimento-cell pedimento-label text-center">
              ENTRADA/SALIDA:
            </div>
            <div className="pedimento-cell pedimento-label text-center">
              ARRIBO:
            </div>
            <div className="pedimento-cell pedimento-label text-center">
              SALIDA:
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0">
            <div className="pedimento-cell pedimento-value text-center">
              {pedimento.medios_transporte.entrada_salida || '-'}
            </div>
            <div className="pedimento-cell pedimento-value text-center">
              {pedimento.medios_transporte.arribo || '-'}
            </div>
            <div className="pedimento-cell pedimento-value text-center">
              {pedimento.medios_transporte.salida || '-'}
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="grid grid-cols-2 gap-0 border-gray-400 border-b">
            <div className="pedimento-cell pedimento-label">VALOR DOLARES:</div>
            <div className="pedimento-cell pedimento-value text-right">
              {formatNumber(pedimento.valores.valor_dolares)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0 border-gray-400 border-b">
            <div className="pedimento-cell pedimento-label">VALOR ADUANA:</div>
            <div className="pedimento-cell pedimento-value text-right">
              {formatNumber(pedimento.valores.valor_aduana)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="pedimento-cell pedimento-label">
              PRECIO PAGADO/VALOR COMERCIAL:
            </div>
            <div className="pedimento-cell pedimento-value text-right">
              {formatNumber(pedimento.valores.precio_pagado_valor_comercial)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-t">
        <div className="col-span-12 py-1 text-right text-xs italic">
          Página {page} de {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PedimentoHeader;
