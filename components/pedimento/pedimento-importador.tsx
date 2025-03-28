import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

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
  return (
    <div
      className={cn(
        'mb-4 w-full cursor-pointer border border-gray-400',
        'overflow-hidden rounded-md border-2',
        getHighlightBorder('Datos de factura', tabs),
        getHighlightFill('Datos de factura', tabInfoSelected)
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
