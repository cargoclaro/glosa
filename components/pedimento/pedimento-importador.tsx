import { cn } from '@/shared/utils/cn';
import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoImportadorProps {
  datosImportador: {
    rfc: string;
    curp: string;
    razon_social: string;
    domicilio: string;
  };
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoImportador: React.FC<PedimentoImportadorProps> = ({
  datosImportador,
  tabs = [],
  onClick,
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
    if (tabInfoSelected.name !== section) {
      return '';
    }

    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
      ? 'bg-green-100/50'
      : 'bg-yellow-100/50';
  };

  return (
    <div
      className={cn(
        'mb-4 w-full border border-gray-400 cursor-pointer',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Datos de factura'),
        getHighlightFill('Datos de factura')
      )}
      onClick={() => onClick('Datos de factura')}
    >
      <div className="grid grid-cols-1 gap-0">
        <div className="bg-gray-200 text-center text-xs py-1 uppercase font-semibold border-b border-gray-400 py-0.5 text-[11px]">
          DATOS DEL IMPORTADOR/EXPORTADOR
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold col-span-1 py-0.5 text-[10px]">
          RFC:
        </div>
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-3 py-0.5 text-[10px]">
          {datosImportador.rfc || ''}
        </div>
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold col-span-2 py-0.5 text-[10px]">
          NOMBRE, DENOMINACION O RAZON SOCIAL:
        </div>
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-6 py-0.5 text-[10px]">
          {datosImportador.razon_social}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold col-span-1 py-0.5 text-[10px]">
          CURP:
        </div>
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-11 py-0.5 text-[10px]">
          {datosImportador.curp || ''}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center bg-gray-100 text-xs uppercase font-semibold col-span-2 py-0.5 text-[10px]">
          DOMICILIO:
        </div>
        <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal col-span-10 py-0.5 text-[10px]">
          {datosImportador.domicilio || ''}
        </div>
      </div>
    </div>
  );
};

export default PedimentoImportador;
