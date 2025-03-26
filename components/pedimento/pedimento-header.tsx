import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
import { cn } from '@/shared/utils/cn';
import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

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
  totalPages,
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

  // Helper functions to determine highlight styles
  const getHighlightBorder = (section: string) => {
    const tab = tabs.find((tab) => tab.name === section);
    return tab?.isCorrect || tab?.isVerified
      ? 'border-green-500'
      : 'border-yellow-400';
  };

  const getHighlightFill = (section: string) => {
    if (tabInfoSelected.name !== section) {
      return '';
    }

    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
      ? 'bg-green-100/50'
      : 'bg-yellow-100/50';
  };

  if (page !== 1) {
    return null; // Don't show header on page 2
  }

  return (
    <div className="mb-4 w-full border border-gray-400">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-12 border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
          PEDIMENTO
        </div>
      </div>

      {/* Número de Pedimento Section */}
      <div
        className={cn(
          'grid cursor-pointer grid-cols-12 gap-0 border-gray-400 border-b',
          'overflow-hidden rounded-md border-2',
          getHighlightBorder('Número de pedimento'),
          getHighlightFill('Número de pedimento')
        )}
        onClick={() => onClick('Número de pedimento')}
      >
        <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          NUM. PEDIMENTO:
        </div>
        <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {pedimento.encabezado_del_pedimento.num_pedimento}
        </div>
        <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          T.OPER
        </div>
        <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {pedimento.encabezado_del_pedimento.tipo_oper}
        </div>
        <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          CVE. PEDIMENTO:
        </div>
        <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {pedimento.encabezado_del_pedimento.cve_pedim}
        </div>
      </div>

      {/* Destino and Operación Monetaria Section */}
      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        {/* Destino/Origen */}
        <div
          className={cn(
            'col-span-2 grid cursor-pointer grid-cols-2',
            'overflow-hidden rounded-md border-2',
            getHighlightBorder('Clave de destino/origen'),
            getHighlightFill('Clave de destino/origen')
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
            'overflow-hidden rounded-md border-2',
            getHighlightBorder('Operación monetaria'),
            getHighlightFill('Operación monetaria')
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
            'overflow-hidden rounded-md border-2',
            getHighlightBorder('Pesos y bultos'),
            getHighlightFill('Pesos y bultos')
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

        <div className="col-span-2 grid grid-cols-2">
          <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
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
            'col-span-6 cursor-pointer border-gray-400 border-r',
            'overflow-hidden rounded-md border-2',
            getHighlightBorder('Datos del transporte'),
            getHighlightFill('Datos del transporte')
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
            'overflow-hidden rounded-md border-2',
            getHighlightBorder('Operación monetaria'),
            getHighlightFill('Operación monetaria')
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

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-t">
        <div className="col-span-12 py-0.5 text-right text-[9px] italic">
          Página {page} de {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PedimentoHeader;
