import React from "react";

interface PedimentoImportadorProps {
  datosImportador: {
    rfc: string;
    curp: string;
    razon_social: string;
    domicilio: string;
  };
}

const PedimentoImportador: React.FC<PedimentoImportadorProps> = ({ datosImportador }) => {
  return (
    <div className="pedimento-section" style={{ "--animation-order": 4 } as React.CSSProperties}>
      <div className="grid grid-cols-1 gap-0">
        <div className="pedimento-section-title">
          DATOS DEL IMPORTADOR/EXPORTADOR
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-0 border-b border-gray-400">
        <div className="col-span-1 pedimento-cell pedimento-label">RFC:</div>
        <div className="col-span-3 pedimento-cell pedimento-value">{datosImportador.rfc || ""}</div>
        <div className="col-span-2 pedimento-cell pedimento-label">NOMBRE, DENOMINACION O RAZON SOCIAL:</div>
        <div className="col-span-6 pedimento-cell pedimento-value">{datosImportador.razon_social}</div>
      </div>
      
      <div className="grid grid-cols-12 gap-0 border-b border-gray-400">
        <div className="col-span-1 pedimento-cell pedimento-label">CURP:</div>
        <div className="col-span-11 pedimento-cell pedimento-value">{datosImportador.curp || ""}</div>
      </div>
      
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-2 pedimento-cell pedimento-label">DOMICILIO:</div>
        <div className="col-span-10 pedimento-cell pedimento-value">{datosImportador.domicilio || ""}</div>
      </div>
    </div>
  );
};

export default PedimentoImportador;
