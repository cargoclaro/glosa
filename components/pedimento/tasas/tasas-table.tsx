import React from 'react';

interface TasaProps {
  contrib: string;
  cve_t_tasa: string;
  tasa: string;
}

interface TasasTableProps {
  tasas: TasaProps[];
  fechaEntrada?: string;
  fechaPago?: string;
}

const TasasTable: React.FC<TasasTableProps> = ({ tasas }) => {
  return (
    <div className="grid grid-cols-3 gap-0">
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        CONTRIB.
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        CVE.T.TASA
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        TASA
      </div>

      {tasas.map((tasa, index) => (
        <React.Fragment key={index}>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
            {tasa.contrib}
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
            {tasa.cve_t_tasa}
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-normal text-[10px] text-xs text-xs last:border-r-0">
            {tasa.tasa}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TasasTable;
