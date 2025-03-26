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
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">CONTRIB.</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">CVE.T.TASA</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">TASA</div>

      {tasas.map((tasa, index) => (
        <React.Fragment key={index}>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-center text-[10px]">
            {tasa.contrib}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-center text-[10px]">
            {tasa.cve_t_tasa}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-center text-[10px]">
            {tasa.tasa}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TasasTable;
