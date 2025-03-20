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
          <div className="pedimento-header">CONCEPTO</div>
          <div className="pedimento-header">F.P.</div>
          <div className="pedimento-header">IMPORTE</div>

          {liquidacion.conceptos.map((concepto, index) => (
            <React.Fragment key={index}>
              <div className="pedimento-cell pedimento-value">
                {concepto.concepto}
              </div>
              <div className="pedimento-cell pedimento-value text-center">
                {concepto.fp}
              </div>
              <div className="pedimento-cell pedimento-value text-right">
                {formatNumber(concepto.importe)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="col-span-3">
        <div className="pedimento-header">TOTALES</div>
        <div className="grid grid-cols-2 gap-0">
          <div className="pedimento-cell pedimento-label">EFECTIVO</div>
          <div className="pedimento-cell pedimento-value text-right">
            {formatNumber(liquidacion.totales.efectivo)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="pedimento-cell pedimento-label">OTROS</div>
          <div className="pedimento-cell pedimento-value text-right">
            {formatNumber(liquidacion.totales.otros)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="pedimento-cell pedimento-label">TOTAL</div>
          <div className="pedimento-cell pedimento-value text-right">
            {formatNumber(liquidacion.totales.total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidacionTable;
