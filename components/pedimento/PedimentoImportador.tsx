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
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoImportador: React.FC<PedimentoImportadorProps> = ({
  datosImportador,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 4 } as React.CSSProperties}
    >
      <div className="grid grid-cols-1 gap-0">
        <div className="pedimento-section-title text-[11px] py-0.5">
          DATOS DEL IMPORTADOR/EXPORTADOR
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-1 py-0.5 text-[10px]">RFC:</div>
        <div className="pedimento-cell pedimento-value col-span-3 py-0.5 text-[10px]">
          {datosImportador.rfc || ''}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2 py-0.5 text-[10px]">
          NOMBRE, DENOMINACION O RAZON SOCIAL:
        </div>
        <div className="pedimento-cell pedimento-value col-span-6 py-0.5 text-[10px]">
          {datosImportador.razon_social}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-1 py-0.5 text-[10px]">CURP:</div>
        <div className="pedimento-cell pedimento-value col-span-11 py-0.5 text-[10px]">
          {datosImportador.curp || ''}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <div className="pedimento-cell pedimento-label col-span-2 py-0.5 text-[10px]">
          DOMICILIO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-10 py-0.5 text-[10px]">
          {datosImportador.domicilio || ''}
        </div>
      </div>
    </div>
  );
};

export default PedimentoImportador;
