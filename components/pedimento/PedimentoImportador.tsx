import type React from 'react';

interface PedimentoImportadorProps {
  datosImportador: {
    rfc: string;
    curp: string;
    razon_social: string;
    domicilio: string;
  };
}

const PedimentoImportador: React.FC<PedimentoImportadorProps> = ({
  datosImportador,
}) => {
  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 4 } as React.CSSProperties}
    >
      <div className="grid grid-cols-1 gap-0">
        <div className="pedimento-section-title">
          DATOS DEL IMPORTADOR/EXPORTADOR
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-1">RFC:</div>
        <div className="pedimento-cell pedimento-value col-span-3">
          {datosImportador.rfc || ''}
        </div>
        <div className="pedimento-cell pedimento-label col-span-2">
          NOMBRE, DENOMINACION O RAZON SOCIAL:
        </div>
        <div className="pedimento-cell pedimento-value col-span-6">
          {datosImportador.razon_social}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
        <div className="pedimento-cell pedimento-label col-span-1">CURP:</div>
        <div className="pedimento-cell pedimento-value col-span-11">
          {datosImportador.curp || ''}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <div className="pedimento-cell pedimento-label col-span-2">
          DOMICILIO:
        </div>
        <div className="pedimento-cell pedimento-value col-span-10">
          {datosImportador.domicilio || ''}
        </div>
      </div>
    </div>
  );
};

export default PedimentoImportador;
