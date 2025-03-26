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
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">CLAVE</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">COMPLEMENTO 1</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">COMPLEMENTO 2</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">COMPLEMENTO 3</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">COMPLEMENTO 4</div>
      <div className="bg-gray-200 text-black uppercase text-xs font-semibold tracking-wider text-center py-1 border-b border-gray-400 py-0.5 text-[10px]">COMPLEMENTO 5</div>

      {identificadores.map((identificador, index) => (
        <React.Fragment key={index}>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            {identificador.clave}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            {identificador.complemento_1}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            {identificador.complemento_2 || ''}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]">
            {identificador.complemento_3 || ''}
          </div>
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]" />
          <div className="px-2 border-r last:border-r-0 border-gray-400 text-xs min-h-6 flex items-center text-xs font-normal py-0.5 text-[10px]" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default IdentificadoresTable;
