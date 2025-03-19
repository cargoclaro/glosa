
import React from "react";

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
  datosFactura
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="pedimento-section" style={{ "--animation-order": 1 } as React.CSSProperties}>
      <div className="border border-gray-400">
        {/* Main header with gray background */}
        <div className="bg-gray-200 text-center text-xs py-1 border-b border-gray-400 uppercase font-semibold">
          DATOS DEL PROVEEDOR O COMPRADOR
        </div>
        
        {/* Header row */}
        <div className="grid grid-cols-12 gap-0 border-b border-gray-400 bg-white">
          <div className="col-span-2 pedimento-cell text-xs py-1 uppercase font-semibold">ID FISCAL:</div>
          <div className="col-span-5 pedimento-cell text-xs py-1 uppercase font-semibold">NOMBRE, DENOMINACION O RAZON SOCIAL:</div>
          <div className="col-span-4 pedimento-cell text-xs py-1 uppercase font-semibold">DOMICILIO:</div>
          <div className="col-span-1 pedimento-cell text-xs py-1 uppercase font-semibold">VINCULACION</div>
        </div>
        
        {/* Data row */}
        <div className="grid grid-cols-12 gap-0 border-b border-gray-400">
          <div className="col-span-2 pedimento-cell text-xs py-1">{idFiscal || ""}</div>
          <div className="col-span-5 pedimento-cell text-xs py-1">{nombreRazonSocial || ""}</div>
          <div className="col-span-4 pedimento-cell text-xs py-1">{domicilio || ""}</div>
          <div className="col-span-1 pedimento-cell text-xs py-1 text-center">{vinculacion || ""}</div>
        </div>

        {/* Facturas section - column headers */}
        <div className="grid grid-cols-7 gap-0 border-b border-gray-400 bg-white">
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">NUM.FACTURA</div>
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">FECHA</div>
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">INCOTERM</div>
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">MONEDA FACT</div>
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">VAL.MON.FACT</div>
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">FACTOR MON.FACT</div>
          <div className="pedimento-cell text-xs py-1 text-center uppercase font-semibold">VAL.DOLARES</div>
        </div>
        
        {/* Facturas data rows */}
        {datosFactura.map((factura, index) => (
          <div key={index} className="grid grid-cols-7 gap-0 border-b border-gray-400">
            <div className="pedimento-cell text-xs py-1">{factura.num_factura || ""}</div>
            <div className="pedimento-cell text-xs py-1 text-center">{factura.fecha_factura || ""}</div>
            <div className="pedimento-cell text-xs py-1 text-center">{factura.incoterm || ""}</div>
            <div className="pedimento-cell text-xs py-1 text-center">{factura.moneda_factura || ""}</div>
            <div className="pedimento-cell text-xs py-1 text-right">{formatNumber(factura.valor_moneda_factura)}</div>
            <div className="pedimento-cell text-xs py-1 text-right">{factura.factor_moneda_factura?.toFixed(8) || ""}</div>
            <div className="pedimento-cell text-xs py-1 text-right">{formatNumber(factura.valor_dolares_factura)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedimentoProveedor;
