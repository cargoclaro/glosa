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
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        CLAVE
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        COMPLEMENTO 1
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        COMPLEMENTO 2
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        COMPLEMENTO 3
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        COMPLEMENTO 4
      </div>
      <div className="border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[10px] text-black text-xs uppercase tracking-wider">
        COMPLEMENTO 5
      </div>

      {identificadores.map((identificador, index) => (
        <React.Fragment key={index}>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {identificador.clave}
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {identificador.complemento_1}
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {identificador.complemento_2 || ''}
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0">
            {identificador.complemento_3 || ''}
          </div>
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0" />
          <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-normal text-[10px] text-xs text-xs last:border-r-0" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default IdentificadoresTable;
