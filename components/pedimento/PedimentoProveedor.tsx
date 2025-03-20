import type React from 'react';

interface PedimentoProveedorProps {
  idFiscal: string;
  nombreRazonSocial: string;
  domicilio: string;
  vinculacion: string;
  datosFactura: Array<{
    num_factura: string;
    fecha_factura: string;
    incoterm: string;
    moneda_factura: string;
    valor_moneda_factura: number;
    factor_moneda_factura: number;
    valor_dolares_factura: number;
  }>;
}

const PedimentoProveedor: React.FC<PedimentoProveedorProps> = ({
  idFiscal,
  nombreRazonSocial,
  domicilio,
  vinculacion,
  datosFactura,
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 1 } as React.CSSProperties}
    >
      <div className="border border-gray-400">
        {/* Main header with gray background */}
        <div className="border-gray-400 border-b bg-gray-200 py-1 text-center font-semibold text-xs uppercase">
          DATOS DEL PROVEEDOR O COMPRADOR
        </div>

        {/* Header row */}
        <div className="grid grid-cols-12 gap-0 border-gray-400 border-b bg-white">
          <div className="pedimento-cell col-span-2 py-1 font-semibold text-xs uppercase">
            ID FISCAL:
          </div>
          <div className="pedimento-cell col-span-5 py-1 font-semibold text-xs uppercase">
            NOMBRE, DENOMINACION O RAZON SOCIAL:
          </div>
          <div className="pedimento-cell col-span-4 py-1 font-semibold text-xs uppercase">
            DOMICILIO:
          </div>
          <div className="pedimento-cell col-span-1 py-1 font-semibold text-xs uppercase">
            VINCULACION
          </div>
        </div>

        {/* Data row */}
        <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
          <div className="pedimento-cell col-span-2 py-1 text-xs">
            {idFiscal || ''}
          </div>
          <div className="pedimento-cell col-span-5 py-1 text-xs">
            {nombreRazonSocial || ''}
          </div>
          <div className="pedimento-cell col-span-4 py-1 text-xs">
            {domicilio || ''}
          </div>
          <div className="pedimento-cell col-span-1 py-1 text-center text-xs">
            {vinculacion || ''}
          </div>
        </div>

        {/* Facturas section - column headers */}
        <div className="grid grid-cols-7 gap-0 border-gray-400 border-b bg-white">
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            NUM.FACTURA
          </div>
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            FECHA
          </div>
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            INCOTERM
          </div>
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            MONEDA FACT
          </div>
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            VAL.MON.FACT
          </div>
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            FACTOR MON.FACT
          </div>
          <div className="pedimento-cell py-1 text-center font-semibold text-xs uppercase">
            VAL.DOLARES
          </div>
        </div>

        {/* Facturas data rows */}
        {datosFactura.map((factura, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-0 border-gray-400 border-b"
          >
            <div className="pedimento-cell py-1 text-xs">
              {factura.num_factura || ''}
            </div>
            <div className="pedimento-cell py-1 text-center text-xs">
              {factura.fecha_factura || ''}
            </div>
            <div className="pedimento-cell py-1 text-center text-xs">
              {factura.incoterm || ''}
            </div>
            <div className="pedimento-cell py-1 text-center text-xs">
              {factura.moneda_factura || ''}
            </div>
            <div className="pedimento-cell py-1 text-right text-xs">
              {formatNumber(factura.valor_moneda_factura)}
            </div>
            <div className="pedimento-cell py-1 text-right text-xs">
              {factura.factor_moneda_factura?.toFixed(8) || ''}
            </div>
            <div className="pedimento-cell py-1 text-right text-xs">
              {formatNumber(factura.valor_dolares_factura)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedimentoProveedor;
