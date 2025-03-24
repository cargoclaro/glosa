import type React from 'react';
import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoHeaderProps {
  pedimento: Pedimento;
  page: number;
  totalPages: number;
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoHeader: React.FC<PedimentoHeaderProps> = ({
  pedimento,
  page,
  totalPages,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) { return '-'; }
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
        <div className="pedimento-section-title col-span-12 text-[11px] py-0.5">PEDIMENTO</div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-3 py-0.5 text-[10px]">
          NUM. PEDIMENTO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-3 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.num_pedimento}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2 py-0.5 text-[10px]">T.OPER</div>
        <div className="pedimento-cell pedimento-value col-span-1 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.tipo_oper}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2 py-0.5 text-[10px]">
          CVE. PEDIMENTO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-1 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.cve_pedim}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-1 py-0.5 text-[10px]">
          DESTINO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-1 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.destino_origen}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2 py-0.5 text-[10px]">
          TIPO CAMBIO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-2 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.tipo_cambio?.toFixed(5) || '-'}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2 py-0.5 text-[10px]">
          PESO BRUTO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-2 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.peso_bruto?.toFixed(3) || '-'}
        </div>
        <div className="pedimento-cell pedimento-label col-span-1 py-0.5 text-[10px]">
          ADUANA E/S:
        </div>
        <div className="pedimento-cell pedimento-value col-span-1 py-0.5 text-[10px]">
          {pedimento.encabezado_del_pedimento.aduana_entrada_salida}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-6 border-gray-400 border-r">
          <div className="pedimento-section-title text-[11px] py-0.5">MEDIOS DE TRANSPORTE</div>
          <div className="grid grid-cols-3 gap-0 border-gray-400 border-b">
            <div className="pedimento-cell pedimento-label text-center py-0.5 text-[10px]">
              ENTRADA/SALIDA:
            </div>
            <div className="pedimento-cell pedimento-label text-center py-0.5 text-[10px]">
              ARRIBO:
            </div>
            <div className="pedimento-cell pedimento-label text-center py-0.5 text-[10px]">
              SALIDA:
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0">
            <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
              {pedimento.medios_transporte.entrada_salida || '-'}
            </div>
            <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
              {pedimento.medios_transporte.arribo || '-'}
            </div>
            <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
              {pedimento.medios_transporte.salida || '-'}
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="grid grid-cols-2 gap-0 border-gray-400 border-b">
            <div className="pedimento-cell pedimento-label py-0.5 text-[10px]">VALOR DOLARES:</div>
            <div className="pedimento-cell pedimento-value text-right py-0.5 text-[10px]">
              {formatNumber(pedimento.valores.valor_dolares || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0 border-gray-400 border-b">
            <div className="pedimento-cell pedimento-label py-0.5 text-[10px]">VALOR ADUANA:</div>
            <div className="pedimento-cell pedimento-value text-right py-0.5 text-[10px]">
              {formatNumber(pedimento.valores.valor_aduana || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="pedimento-cell pedimento-label py-0.5 text-[10px]">
              PRECIO PAGADO/VALOR COMERCIAL:
            </div>
            <div className="pedimento-cell pedimento-value text-right py-0.5 text-[10px]">
              {formatNumber(pedimento.valores.precio_pagado_valor_comercial || 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-t">
        <div className="col-span-12 py-0.5 text-right text-[9px] italic">
          Página {page} de {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PedimentoHeader;
