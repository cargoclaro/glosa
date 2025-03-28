import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface PedimentoProveedorProps {
  idFiscal: string;
  nombreRazonSocial: string;
  domicilio: string;
  vinculacion: string;
  datosFactura: {
    num_factura: string;
    fecha_factura: string;
    incoterm: string;
    moneda_factura: string;
    valor_moneda_factura: number;
    factor_moneda_factura: number;
    valor_dolares_factura: number;
  };
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoProveedor: React.FC<PedimentoProveedorProps> = ({
  idFiscal,
  nombreRazonSocial,
  domicilio,
  vinculacion,
  datosFactura,
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
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className={cn(
          'mb-4 w-full cursor-pointer border border-gray-400',
          'overflow-hidden rounded-md border-2',
          getHighlightBorder('Datos de factura', tabs),
          getHighlightFill('Datos de factura', tabInfoSelected)
        )}
        onClick={() => onClick('Datos de factura')}
      >
        <div className="border border-gray-400">
          {/* Main header with gray background */}
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 text-center font-semibold text-[10px] uppercase">
            DATOS DEL PROVEEDOR O COMPRADOR
          </div>

          {/* Header row */}
          <div className="grid grid-cols-12 gap-0 border-gray-400 border-b bg-white">
            <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
              ID FISCAL:
            </div>
            <div className="col-span-5 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
              NOMBRE, DENOMINACION O RAZON SOCIAL:
            </div>
            <div className="col-span-4 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
              DOMICILIO:
            </div>
            <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
              VINCULACION
            </div>
          </div>

          {/* Data row */}
          <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
            <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
              {idFiscal || ''}
            </div>
            <div className="col-span-5 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
              {nombreRazonSocial || ''}
            </div>
            <div className="col-span-4 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
              {domicilio || ''}
            </div>
            <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
              {vinculacion || ''}
            </div>
          </div>

          {/* Facturas section - column headers */}
          <div className="grid grid-cols-7 gap-0 border-gray-400 border-b bg-white">
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              NUM.FACTURA
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              FECHA
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              INCOTERM
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              MONEDA FACT
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              VAL.MON.FACT
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              FACTOR MON.FACT
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] text-xs uppercase last:border-r-0">
              VAL.DOLARES
            </div>
          </div>

          {/* Factura data row */}
          <div className="grid grid-cols-7 gap-0 border-gray-400 border-b">
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
              {datosFactura.num_factura || ''}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
              {datosFactura.fecha_factura || ''}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
              {datosFactura.incoterm || ''}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
              {datosFactura.moneda_factura || ''}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right text-[10px] text-xs last:border-r-0">
              {formatNumber(datosFactura.valor_moneda_factura)}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right text-[10px] text-xs last:border-r-0">
              {datosFactura.factor_moneda_factura?.toFixed(8) || ''}
            </div>
            <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right text-[10px] text-xs last:border-r-0">
              {formatNumber(datosFactura.valor_dolares_factura)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoProveedor;
