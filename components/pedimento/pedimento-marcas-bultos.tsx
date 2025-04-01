import type React from 'react';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoMarcasBultosProps {
  marcasNumerosBultos: string;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoMarcasBultos: React.FC<PedimentoMarcasBultosProps> = ({
  marcasNumerosBultos,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  return (
    <div
      className={cn(
        'mb-4 w-full border border-gray-400 cursor-pointer',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Pesos y bultos', tabs),
        getHighlightFill('Pesos y bultos', tabInfoSelected)
      )}
      onClick={() => onClick('Pesos y bultos')}
    >
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
        MARCAS, NÚMEROS Y TOTAL DE BULTOS
      </div>
      <div className="flex min-h-6 items-center border-gray-400 px-2 py-0.5 font-normal text-[10px] text-xs">
        {marcasNumerosBultos || '—'}
      </div>
    </div>
  );
};

export default PedimentoMarcasBultos; 