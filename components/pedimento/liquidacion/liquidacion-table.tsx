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
          <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">CONCEPTO</div>
          <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">F.P.</div>
          <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">IMPORTE</div>

          {liquidacion.conceptos.map((concepto, index) => (
            <React.Fragment key={index}>
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
                {concepto.concepto}
              </div>
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-center text-[10px]">
                {concepto.fp}
              </div>
              <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-right text-[10px]">
                {formatNumber(concepto.importe)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="col-span-3">
        <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">TOTALES</div>
        <div className="grid grid-cols-2 gap-0">
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold py-0.5 text-[10px]">
            EFECTIVO
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-right text-[10px]">
            {formatNumber(liquidacion.totales.efectivo)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold py-0.5 text-[10px]">
            OTROS
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-right text-[10px]">
            {formatNumber(liquidacion.totales.otros)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold py-0.5 text-[10px]">
            TOTAL
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-right text-[10px]">
            {formatNumber(liquidacion.totales.total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidacionTable;
