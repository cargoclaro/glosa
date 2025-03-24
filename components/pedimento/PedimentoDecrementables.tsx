import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoDecrementablesProps {
  decrementables: {
    transporte_decrementables: number;
    seguro_decrementables: number;
    carga_decrementables: number;
    descarga_decrementables: number;
    otros_decrementables: number;
  };
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoDecrementables: React.FC<PedimentoDecrementablesProps> = ({
  decrementables,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return '0';
    return num.toString();
  };

  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 6 } as React.CSSProperties}
    >
      <div className="pedimento-section-title text-[11px] py-0.5">VALOR DECREMENTABLES</div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-header py-0.5 text-[10px]">TRANSPORTE DECREMENTABLES</div>
        <div className="pedimento-header py-0.5 text-[10px]">SEGURO DECREMENTABLES</div>
        <div className="pedimento-header py-0.5 text-[10px]">CARGA DECREMENTABLES</div>
        <div className="pedimento-header py-0.5 text-[10px]">DESCARGA DECREMENTABLES</div>
        <div className="pedimento-header py-0.5 text-[10px]">OTROS DECREMENTABLES</div>
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(decrementables.transporte_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(decrementables.seguro_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(decrementables.carga_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(decrementables.descarga_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(decrementables.otros_decrementables)}
        </div>
      </div>
    </div>
  );
};

export default PedimentoDecrementables;
