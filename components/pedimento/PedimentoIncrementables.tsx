import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoIncrementablesProps {
  incrementables: {
    val_seguros: number;
    seguros: number;
    fletes: number;
    embalajes: number;
    otros_incrementables: number;
  };
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoIncrementables: React.FC<PedimentoIncrementablesProps> = ({
  incrementables,
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
      style={{ '--animation-order': 5 } as React.CSSProperties}
    >
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-header py-0.5 text-[10px]">VAL.SEGUROS</div>
        <div className="pedimento-header py-0.5 text-[10px]">SEGUROS</div>
        <div className="pedimento-header py-0.5 text-[10px]">FLETES</div>
        <div className="pedimento-header py-0.5 text-[10px]">EMBALAJES</div>
        <div className="pedimento-header py-0.5 text-[10px]">OTROS INCREMENTABLES</div>
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(incrementables.val_seguros)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(incrementables.seguros)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(incrementables.fletes)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(incrementables.embalajes)}
        </div>
        <div className="pedimento-cell pedimento-value text-center py-0.5 text-[10px]">
          {formatNumber(incrementables.otros_incrementables)}
        </div>
      </div>
    </div>
  );
};

export default PedimentoIncrementables;
