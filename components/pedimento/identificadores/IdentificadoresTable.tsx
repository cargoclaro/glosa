import React from 'react';

interface IdentificadorProps {
  clave: string;
  complemento_1: string;
  complemento_2: string;
  complemento_3: string;
}

interface IdentificadoresTableProps {
  identificadores: IdentificadorProps[];
}

const IdentificadoresTable: React.FC<IdentificadoresTableProps> = ({
  identificadores,
}) => {
  return (
    <div className="grid grid-cols-6 gap-0">
      <div className="pedimento-header">CLAVE</div>
      <div className="pedimento-header">COMPLEMENTO 1</div>
      <div className="pedimento-header">COMPLEMENTO 2</div>
      <div className="pedimento-header">COMPLEMENTO 3</div>
      <div className="pedimento-header">COMPLEMENTO 4</div>
      <div className="pedimento-header">COMPLEMENTO 5</div>

      {identificadores.map((identificador, index) => (
        <React.Fragment key={index}>
          <div className="pedimento-cell pedimento-value">
            {identificador.clave}
          </div>
          <div className="pedimento-cell pedimento-value">
            {identificador.complemento_1}
          </div>
          <div className="pedimento-cell pedimento-value">
            {identificador.complemento_2 || ''}
          </div>
          <div className="pedimento-cell pedimento-value">
            {identificador.complemento_3 || ''}
          </div>
          <div className="pedimento-cell pedimento-value"></div>
          <div className="pedimento-cell pedimento-value"></div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default IdentificadoresTable;
