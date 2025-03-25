import type { Partida } from '@/shared/services/customGloss/data-extraction/schemas';
import { cn } from '@/shared/utils/cn';
import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoPartidasProps {
  partidas: Partida[];
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoPartidas: React.FC<PedimentoPartidasProps> = ({
  partidas,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  if (!partidas || partidas.length === 0) {
    return null;
  }

  // Helper functions to determine highlight styles
  const getHighlightBorder = (section: string) => {
    const tab = tabs.find((tab) => tab.name === section);
    return tab?.isCorrect || tab?.isVerified
      ? 'border-green-500'
      : 'border-yellow-400';
  };

  const getHighlightFill = (section: string) => {
    if (tabInfoSelected.name !== section) {
      return '';
    }

    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
      ? 'bg-green-100/50'
      : 'bg-yellow-100/50';
  };

  const formatNumber = (num: number | null) => {
    if (num === null) {
      return '-';
    }
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(num);
  };

  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 4 } as React.CSSProperties}
    >
      <div className="border border-gray-400">
        <div className="border-gray-400 border-b bg-gray-300 py-0.5 text-center font-bold text-[9px] uppercase">
          PARTIDAS
        </div>

        {partidas.map((partida, index) => {
          const partidaNumber = index + 1;
          const partidaSection = `Partida ${partidaNumber}`;

          return (
            <div
              key={index}
              className={cn(
                'mb-4 cursor-pointer',
                'overflow-hidden rounded-md border-2',
                getHighlightBorder(partidaSection),
                getHighlightFill(partidaSection)
              )}
              onClick={() => onClick(partidaSection)}
            >
              {/* First row - column headers */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  FRACCION
                </div>
                <div className="col-span-2 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  SUBD / NUM. IDENTIFICACION COMERCIAL.
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  VINC
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  MET VAL
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  UMC
                </div>
                <div className="col-span-1.5 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  CANTIDAD UMC
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  UMT
                </div>
                <div className="col-span-1.5 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  CANTIDAD UMT
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  P.V/C
                </div>
                <div className="col-span-1 px-1 py-0.5 text-center font-semibold">
                  P.O/D
                </div>
              </div>

              {/* SEC and Description row */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  SEC
                </div>
                <div className="col-span-11 px-1 py-0.5 text-center font-semibold">
                  DESCRIPCION
                </div>
              </div>

              {/* Valuation fields row */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  VAL ADU/ USD
                </div>
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  IMP. PRECIO PAG.
                </div>
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  PRECIO UNIT.
                </div>
                <div className="col-span-3 px-1 py-0.5 text-center font-semibold">
                  VAL. AGREG.
                </div>
              </div>

              {/* Brand and model row */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-4 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  MARCA
                </div>
                <div className="col-span-4 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  MODELO
                </div>
                <div className="col-span-4 px-1 py-0.5 text-center font-semibold">
                  CÓDIGO PRODUCTO
                </div>
              </div>

              {/* Data Content row 1 */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5">
                  {partida.fraccion || ''}
                </div>
                <div className="col-span-2 border-gray-400 border-r px-1 py-0.5">
                  {partida.nico || ''}
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                  {partida.vinc || ''}
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                  {partida.met_val || ''}
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                  {partida.umc || ''}
                </div>
                <div className="col-span-1.5 border-gray-400 border-r px-1 py-0.5 text-right">
                  {formatNumber(partida.cantidad_umc)}
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                  {partida.umt || ''}
                </div>
                <div className="col-span-1.5 border-gray-400 border-r px-1 py-0.5 text-right">
                  {formatNumber(partida.cantidad_umt)}
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5">
                  {partida.p_v_c || ''}
                </div>
                <div className="col-span-1 px-1 py-0.5">
                  {partida.p_o_d || ''}
                </div>
              </div>

              {/* Data Content row 2 */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                  {partida.sec || partidaNumber}
                </div>
                <div className="col-span-11 px-1 py-0.5">
                  {partida.descripcion || ''}
                </div>
              </div>

              {/* Data Content row 3 */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-right">
                  {partida.val_adu !== null
                    ? formatNumber(partida.val_adu)
                    : ''}
                </div>
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-right">
                  {partida.imp_precio_pag !== null
                    ? formatNumber(partida.imp_precio_pag)
                    : ''}
                </div>
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-right">
                  {partida.precio_unit !== null
                    ? formatNumber(partida.precio_unit)
                    : ''}
                </div>
                <div className="col-span-3 px-1 py-0.5 text-right">
                  {partida.val_agreg !== null
                    ? formatNumber(partida.val_agreg)
                    : ''}
                </div>
              </div>

              {/* Data Content row 4 */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-4 border-gray-400 border-r px-1 py-0.5">
                  {partida.marca || ''}
                </div>
                <div className="col-span-4 border-gray-400 border-r px-1 py-0.5">
                  {partida.modelo || ''}
                </div>
                <div className="col-span-4 px-1 py-0.5">
                  {partida.codigo_producto || ''}
                </div>
              </div>

              {/* Taxation row headers */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-2 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  CON.
                </div>
                <div className="col-span-2 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  TASA
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  T.T.
                </div>
                <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  F.P.
                </div>
                <div className="col-span-6 px-1 py-0.5 text-center font-semibold">
                  IMPORTE
                </div>
              </div>

              {/* Taxation data rows */}
              {partida.contribuciones?.map((contribucion, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 border-gray-400 border-b text-[9px]"
                >
                  <div className="col-span-2 border-gray-400 border-r px-1 py-0.5">
                    {contribucion.con}
                  </div>
                  <div className="col-span-2 border-gray-400 border-r px-1 py-0.5 text-right">
                    {contribucion.tasa?.toFixed(6) || ''}
                  </div>
                  <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                    {contribucion.t_t}
                  </div>
                  <div className="col-span-1 border-gray-400 border-r px-1 py-0.5 text-center">
                    {contribucion.f_p}
                  </div>
                  <div className="col-span-6 px-1 py-0.5 text-right">
                    {formatNumber(contribucion.importe)}
                  </div>
                </div>
              ))}

              {/* Identifiers row - header */}
              <div className="grid grid-cols-12 border-gray-400 border-b bg-gray-300 text-[9px]">
                <div className="col-span-12 px-1 py-0.5 text-center font-semibold">
                  IDENTIFICADORES
                </div>
              </div>

              {/* Identifiers column headers */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-2 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  IDENTIF
                </div>
                <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  COMPLEMENTO 1
                </div>
                <div className="col-span-3.5 border-gray-400 border-r px-1 py-0.5 text-center font-semibold">
                  COMPLEMENTO 2
                </div>
                <div className="col-span-3.5 px-1 py-0.5 text-center font-semibold">
                  COMPLEMENTO 3
                </div>
              </div>

              {/* Identifiers data rows */}
              {partida.identificadores?.map((identificador, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 border-gray-400 border-b text-[9px]"
                >
                  <div className="col-span-2 border-gray-400 border-r px-1 py-0.5">
                    {identificador.clave}
                  </div>
                  <div className="col-span-3 border-gray-400 border-r px-1 py-0.5 text-center">
                    {identificador.complemento1 || ''}
                  </div>
                  <div className="col-span-3.5 border-gray-400 border-r px-1 py-0.5 text-center">
                    {identificador.complemento2 || ''}
                  </div>
                  <div className="col-span-3.5 px-1 py-0.5 text-center">
                    {identificador.complemento3 || ''}
                  </div>
                </div>
              ))}

              {/* Observations header */}
              <div className="grid grid-cols-12 border-gray-400 border-b bg-gray-300 text-[9px]">
                <div className="col-span-12 px-1 py-0.5 text-center font-semibold">
                  OBSERVACIONES A NIVEL PARTIDA
                </div>
              </div>

              {/* Observations data */}
              <div className="grid grid-cols-12 border-gray-400 border-b text-[9px]">
                <div className="col-span-12 px-1 py-2">
                  {partida.observaciones || (
                    <>
                      {partida.marca && <div>MARCA: {partida.marca}</div>}
                      {partida.modelo && <div>MODELO: {partida.modelo}</div>}
                      {partida.observaciones && (
                        <div>{partida.observaciones}</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PedimentoPartidas;
