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

const TasasTable: React.FC<TasasTableProps> = ({
  tasas,
  fechaEntrada,
  fechaPago,
}) => {
  return (
    <div className="grid grid-cols-3 gap-0">
      <div className="pedimento-header">CONTRIB.</div>
      <div className="pedimento-header">CVE.T.TASA</div>
      <div className="pedimento-header">TASA</div>

      {tasas.map((tasa, index) => (
        <React.Fragment key={index}>
          <div className="pedimento-cell pedimento-value text-center">
            {tasa.contrib}
          </div>
          <div className="pedimento-cell pedimento-value text-center">
            {tasa.cve_t_tasa}
          </div>
          <div className="pedimento-cell pedimento-value text-center">
            {tasa.tasa}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TasasTable;
