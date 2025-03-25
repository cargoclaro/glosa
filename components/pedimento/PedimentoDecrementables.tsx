import { cn } from '@/shared/utils/cn';
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
  // Helper functions to determine highlight styles
  const getHighlightBorder = (section: string) => {
    const tab = tabs.find((tab) => tab.name === section);
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
    if (num === null || num === undefined) return '0';
    return num.toString();
  };

  return (
    <div
      className={cn(
        'pedimento-section cursor-pointer',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Operación monetaria'),
        getHighlightFill('Operación monetaria')
      )}
      style={{ '--animation-order': 6 } as React.CSSProperties}
      onClick={() => onClick('Operación monetaria')}
    >
      <div className="pedimento-section-title py-0.5 text-[11px]">
        VALOR DECREMENTABLES
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-header py-0.5 text-[10px]">
          TRANSPORTE DECREMENTABLES
        </div>
        <div className="pedimento-header py-0.5 text-[10px]">
          SEGURO DECREMENTABLES
        </div>
        <div className="pedimento-header py-0.5 text-[10px]">
          CARGA DECREMENTABLES
        </div>
        <div className="pedimento-header py-0.5 text-[10px]">
          DESCARGA DECREMENTABLES
        </div>
        <div className="pedimento-header py-0.5 text-[10px]">
          OTROS DECREMENTABLES
        </div>
      </div>
      <div className="grid grid-cols-5 gap-0">
        <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
          {formatNumber(decrementables.transporte_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
          {formatNumber(decrementables.seguro_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
          {formatNumber(decrementables.carga_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
          {formatNumber(decrementables.descarga_decrementables)}
        </div>
        <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
          {formatNumber(decrementables.otros_decrementables)}
        </div>
      </div>
    </div>
  );
};

export default PedimentoDecrementables;
