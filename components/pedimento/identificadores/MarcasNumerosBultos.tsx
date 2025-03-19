
import React from "react";

interface MarcasNumerosBultosProps {
  marcas_numeros_bultos: string;
}

const MarcasNumerosBultos: React.FC<MarcasNumerosBultosProps> = ({ marcas_numeros_bultos }) => {
  return (
    <div className="grid grid-cols-12 gap-0 border border-gray-400 mt-4">
      <div className="col-span-8 pedimento-cell pedimento-header font-bold">
        MARCAS, NUMEROS Y TOTAL DE BULTOS:
      </div>
      <div className="col-span-4 pedimento-cell pedimento-value text-right">
        <span className="mr-6">1/2</span>
      </div>
      <div className="col-span-8 pedimento-cell pedimento-value">
        {marcas_numeros_bultos || ""}
      </div>
      <div className="col-span-4 pedimento-cell pedimento-value text-right pr-6">
        2
      </div>
    </div>
  );
};

export default MarcasNumerosBultos;
