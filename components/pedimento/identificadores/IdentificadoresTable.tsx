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
      <div className="pedimento-header text-[10px] py-0.5">CLAVE</div>
      <div className="pedimento-header text-[10px] py-0.5">COMPLEMENTO 1</div>
      <div className="pedimento-header text-[10px] py-0.5">COMPLEMENTO 2</div>
      <div className="pedimento-header text-[10px] py-0.5">COMPLEMENTO 3</div>
      <div className="pedimento-header text-[10px] py-0.5">COMPLEMENTO 4</div>
      <div className="pedimento-header text-[10px] py-0.5">COMPLEMENTO 5</div>

      {identificadores.map((identificador, index) => (
        <React.Fragment key={index}>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">
            {identificador.clave}
          </div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">
            {identificador.complemento_1}
          </div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">
            {identificador.complemento_2 || ''}
          </div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">
            {identificador.complemento_3 || ''}
          </div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5"></div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5"></div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default IdentificadoresTable;
