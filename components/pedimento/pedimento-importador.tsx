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
        'mb-4 w-full cursor-pointer border border-gray-400',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Datos de factura'),
        getHighlightFill('Datos de factura')
      )}
      onClick={() => onClick('Datos de factura')}
    >
      <div className="grid grid-cols-1 gap-0">
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
          DATOS DEL IMPORTADOR/EXPORTADOR
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          RFC:
        </div>
        <div className="col-span-3 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {datosImportador.rfc || ''}
        </div>
        <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          NOMBRE, DENOMINACION O RAZON SOCIAL:
        </div>
        <div className="col-span-6 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {datosImportador.razon_social}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          CURP:
        </div>
        <div className="col-span-11 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {datosImportador.curp || ''}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r bg-gray-100 px-2 py-0.5 font-semibold text-[10px] text-xs text-xs uppercase last:border-r-0">
          DOMICILIO:
        </div>
        <div className="col-span-10 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
          {datosImportador.domicilio || ''}
        </div>
      </div>
    </div>
  );
};

export default PedimentoImportador;
