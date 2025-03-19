
import React from "react";

interface CodigoDeAceptacionProps {
  clave_seccion_aduanera: string;
}

const CodigoDeAceptacion: React.FC<CodigoDeAceptacionProps> = ({ clave_seccion_aduanera }) => {
  return (
    <div className="grid grid-cols-12 gap-0 border border-gray-400">
      <div className="col-span-3 pedimento-cell pedimento-header font-bold">
        CÓDIGO DE ACEPTACIÓN:
      </div>
      <div className="col-span-5 pedimento-cell pedimento-header text-center font-bold">
        CODIGO DE BARRAS
      </div>
      <div className="col-span-4 pedimento-cell pedimento-header font-bold">
        CLAVE DE LA SECCION ADUANERA DE DESPACHO:
      </div>
      <div className="col-span-8 pedimento-cell pedimento-value"></div>
      <div className="col-span-4 pedimento-cell pedimento-value text-right pr-6">
        {clave_seccion_aduanera || ""}
      </div>
    </div>
  );
};

export default CodigoDeAceptacion;
