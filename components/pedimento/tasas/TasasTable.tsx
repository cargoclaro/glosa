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
      <div className="pedimento-header py-0.5 text-[10px]">CONTRIB.</div>
      <div className="pedimento-header py-0.5 text-[10px]">CVE.T.TASA</div>
      <div className="pedimento-header py-0.5 text-[10px]">TASA</div>

      {tasas.map((tasa, index) => (
        <React.Fragment key={index}>
          <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
            {tasa.contrib}
          </div>
          <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
            {tasa.cve_t_tasa}
          </div>
          <div className="pedimento-cell pedimento-value py-0.5 text-center text-[10px]">
            {tasa.tasa}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TasasTable;
