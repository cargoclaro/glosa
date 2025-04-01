import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface PedimentoHeaderProps {
  pedimento: Pedimento;
  page: number;
  totalPages: number;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoHeader: React.FC<PedimentoHeaderProps> = ({
  pedimento,
  page,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(num);
  };

  if (page !== 1) {
    return null; // Don't show header on page 2
  }

  return (
    <div className="mb-4 w-full border border-gray-400 rounded-md overflow-hidden">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-12 border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
          PEDIMENTO
        </div>
      </div>

      {/* Número de Pedimento Section */}
      <div className="grid grid-cols-12 gap-0">
        <div
          className={cn(
            'col-span-5 grid cursor-pointer grid-cols-5',
            'overflow-hidden rounded-md border-2 border-green-400',
            getHighlightBorder('Número de pedimento', tabs),
            getHighlightFill('Número de pedimento', tabInfoSelected)
          )}
          onClick={() => onClick('Número de pedimento')}
        >
          <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            NUM. PEDIMENTO:
          </div>
          <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.num_pedimento}
          </div>
        </div>

        {/* T.OPER */}
        <div
          className={cn(
            'col-span-2 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2 border-green-400',
            getHighlightBorder('Tipo de operación', tabs),
            getHighlightFill('Tipo de operación', tabInfoSelected)
          )}
          onClick={() => onClick('Tipo de operación')}
        >
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            T.OPER
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.tipo_oper}
          </div>
        </div>

        {/* CVE. PEDIMENTO */}
        <div
          className={cn(
            'col-span-3 grid cursor-pointer grid-cols-3',
            'overflow-hidden rounded-md border-2 border-green-400',
            getHighlightBorder('Tipo de operación', tabs),
            getHighlightFill('Tipo de operación', tabInfoSelected)
          )}
          onClick={() => onClick('Tipo de operación')}
        >
          <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            CVE. PEDIMENTO:
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.cve_pedim}
          </div>
        </div>

        {/* REGIMEN */}
        <div
          className={cn(
            'col-span-2 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2 border-green-400',
            getHighlightBorder('Tipo de operación', tabs),
            getHighlightFill('Tipo de operación', tabInfoSelected)
          )}
          onClick={() => onClick('Tipo de operación')}
        >
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            REGIMEN:
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            IMD
          </div>
        </div>
      </div>

      {/* Destino and Operación Monetaria Section */}
      <div className="grid grid-cols-12 gap-0">
        {/* Destino/Origen */}
        <div
          className={cn(
            'col-span-2 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2 border-green-400',
            getHighlightBorder('Clave de destino/origen', tabs),
            getHighlightFill('Clave de destino/origen', tabInfoSelected)
          )}
          onClick={() => onClick('Clave de destino/origen')}
        >
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            DESTINO:
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.destino_origen}
          </div>
        </div>

        {/* Operación Monetaria - Tipo Cambio */}
        <div
          className={cn(
            'col-span-4 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2 border-yellow-400',
            getHighlightBorder('Operación monetaria', tabs),
            getHighlightFill('Operación monetaria', tabInfoSelected)
          )}
          onClick={() => onClick('Operación monetaria')}
        >
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            TIPO CAMBIO:
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.tipo_cambio?.toFixed(5) || '-'}
          </div>
        </div>

        {/* Pesos y Bultos - Peso Bruto */}
        <div
          className={cn(
            'col-span-4 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2 border-yellow-400',
            getHighlightBorder('Pesos y bultos', tabs),
            getHighlightFill('Pesos y bultos', tabInfoSelected)
          )}
          onClick={() => onClick('Pesos y bultos')}
        >
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            PESO BRUTO:
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.peso_bruto?.toFixed(3) || '-'}
          </div>
        </div>

        {/* ADUANA E/S */}
        <div
          className={cn(
            'col-span-2 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2 border-yellow-400',
            getHighlightBorder('Aduana de entrada/salida', tabs),
            getHighlightFill('Aduana de entrada/salida', tabInfoSelected)
          )}
          onClick={() => onClick('Aduana de entrada/salida')}
        >
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-1 py-0.5 font-semibold text-[8px] text-xs uppercase last:border-r-0">
            ADUANA E/S:
          </div>
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {pedimento.encabezado_del_pedimento.aduana_entrada_salida}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Transporte section */}
        <div
          className={cn(
            'col-span-6 cursor-pointer',
            'overflow-hidden rounded-md border-2 border-yellow-400',
            getHighlightBorder('Datos del transporte', tabs),
            getHighlightFill('Datos del transporte', tabInfoSelected)
          )}
          onClick={() => onClick('Datos del transporte')}
        >
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            MEDIOS DE TRANSPORTE
          </div>
          <div className="grid grid-cols-3 gap-0 border-gray-400 border-b">
            <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 text-center font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
              ENTRADA/SALIDA:
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 text-center font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
              ARRIBO:
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 text-center font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
              SALIDA:
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0">
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
              {pedimento.medios_transporte.entrada_salida || '-'}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
              {pedimento.medios_transporte.arribo || '-'}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
              {pedimento.medios_transporte.salida || '-'}
            </div>
          </div>
        </div>

        {/* Valor section */}
        <div
          className={cn(
            'col-span-6 cursor-pointer',
            'overflow-hidden rounded-md border-2 border-yellow-400',
            getHighlightBorder('Operación monetaria', tabs),
            getHighlightFill('Operación monetaria', tabInfoSelected)
          )}
          onClick={() => onClick('Operación monetaria')}
        >
          <div className="grid grid-cols-2 gap-0 border-gray-400 border-b">
            <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
              VALOR DOLARES:
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
              {formatNumber(pedimento.valores.valor_dolares || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0 border-gray-400 border-b">
            <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
              VALOR ADUANA:
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
              {formatNumber(pedimento.valores.valor_aduana || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
              PRECIO PAGADO/VALOR COMERCIAL:
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
              {formatNumber(
                pedimento.valores.precio_pagado_valor_comercial || 0
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoHeader;
