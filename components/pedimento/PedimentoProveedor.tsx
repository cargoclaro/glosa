import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '@/shared/utils/cn';

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
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoProveedor: React.FC<PedimentoProveedorProps> = ({
  idFiscal,
  nombreRazonSocial,
  domicilio,
  vinculacion,
  datosFactura,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  // Helper functions to determine highlight styles
  const getHighlightBorder = (section: string) => {
    const tab = tabs.find(tab => tab.name === section);
    return tab?.isCorrect || tab?.isVerified 
      ? 'border-green-500' 
      : 'border-yellow-400';
  };

  const getHighlightFill = (section: string) => {
    if (tabInfoSelected.name !== section) return '';
    
    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified 
      ? 'bg-green-100/50' 
      : 'bg-yellow-100/50';
  };

  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div
      className={cn(
        "pedimento-section cursor-pointer",
        "border-2",
        getHighlightBorder('Datos de factura'),
        getHighlightFill('Datos de factura')
      )}
      style={{ '--animation-order': 1 } as React.CSSProperties}
      onClick={() => onClick('Datos de factura')}
    >
      <div className="border border-gray-400">
        {/* Main header with gray background */}
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 text-center font-semibold text-[10px] uppercase">
          DATOS DEL PROVEEDOR O COMPRADOR
        </div>

        {/* Header row */}
        <div className="grid grid-cols-12 gap-0 border-gray-400 border-b bg-white">
          <div className="pedimento-cell col-span-2 py-0.5 font-semibold text-[10px] uppercase">
            ID FISCAL:
          </div>
          <div className="pedimento-cell col-span-5 py-0.5 font-semibold text-[10px] uppercase">
            NOMBRE, DENOMINACION O RAZON SOCIAL:
          </div>
          <div className="pedimento-cell col-span-4 py-0.5 font-semibold text-[10px] uppercase">
            DOMICILIO:
          </div>
          <div className="pedimento-cell col-span-1 py-0.5 font-semibold text-[10px] uppercase">
            VINCULACION
          </div>
        </div>

        {/* Data row */}
        <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
          <div className="pedimento-cell col-span-2 py-0.5 text-[10px]">
            {idFiscal || ''}
          </div>
          <div className="pedimento-cell col-span-5 py-0.5 text-[10px]">
            {nombreRazonSocial || ''}
          </div>
          <div className="pedimento-cell col-span-4 py-0.5 text-[10px]">
            {domicilio || ''}
          </div>
          <div className="pedimento-cell col-span-1 py-0.5 text-center text-[10px]">
            {vinculacion || ''}
          </div>
        </div>

        {/* Facturas section - column headers */}
        <div className="grid grid-cols-7 gap-0 border-gray-400 border-b bg-white">
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            NUM.FACTURA
          </div>
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            FECHA
          </div>
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            INCOTERM
          </div>
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            MONEDA FACT
          </div>
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            VAL.MON.FACT
          </div>
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            FACTOR MON.FACT
          </div>
          <div className="pedimento-cell py-0.5 text-center font-semibold text-[10px] uppercase">
            VAL.DOLARES
          </div>
        </div>

        {/* Factura data row */}
        <div className="grid grid-cols-7 gap-0 border-gray-400 border-b">
          <div className="pedimento-cell py-0.5 text-[10px]">
            {datosFactura.num_factura || ''}
          </div>
          <div className="pedimento-cell py-0.5 text-center text-[10px]">
            {datosFactura.fecha_factura || ''}
          </div>
          <div className="pedimento-cell py-0.5 text-center text-[10px]">
            {datosFactura.incoterm || ''}
          </div>
          <div className="pedimento-cell py-0.5 text-center text-[10px]">
            {datosFactura.moneda_factura || ''}
          </div>
          <div className="pedimento-cell py-0.5 text-right text-[10px]">
            {formatNumber(datosFactura.valor_moneda_factura)}
          </div>
          <div className="pedimento-cell py-0.5 text-right text-[10px]">
            {datosFactura.factor_moneda_factura?.toFixed(8) || ''}
          </div>
          <div className="pedimento-cell py-0.5 text-right text-[10px]">
            {formatNumber(datosFactura.valor_dolares_factura)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedimentoProveedor;
