import React from 'react';

interface ConceptoProps {
  concepto: string;
  fp: string;
  importe: number;
}

interface TotalesProps {
  efectivo: number;
  otros: number;
  total: number;
}

interface LiquidacionTableProps {
  liquidacion: {
    conceptos: ConceptoProps[];
    totales: TotalesProps;
  };
}

const LiquidacionTable: React.FC<LiquidacionTableProps> = ({ liquidacion }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-12 gap-0">
      <div className="col-span-9">
        <div className="grid grid-cols-3 gap-0">
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
            CONCEPTO
          </div>
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
            F.P.
          </div>
          <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
            IMPORTE
          </div>

          {liquidacion.conceptos.map((concepto, index) => (
            <React.Fragment key={index}>
              <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
                {concepto.concepto}
              </div>
              <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
                {concepto.fp}
              </div>
              <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
                {formatNumber(concepto.importe)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="col-span-3">
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
          TOTALES
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            EFECTIVO
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
            {formatNumber(liquidacion.totales.efectivo)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            OTROS
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
            {formatNumber(liquidacion.totales.otros)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
            TOTAL
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right font-normal text-[10px] text-xs text-xs last:border-r-0">
            {formatNumber(liquidacion.totales.total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidacionTable;
