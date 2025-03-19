
import React from "react";
import { Partida } from "../../types/pedimento";

interface PedimentoPartidasProps {
  partidas: Partida[];
}

const PedimentoPartidas: React.FC<PedimentoPartidasProps> = ({ partidas }) => {
  if (!partidas || partidas.length === 0) {
    return null;
  }

  const formatNumber = (num: number | null) => {
    if (num === null) return "-";
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(num);
  };

  return (
    <div className="pedimento-section" style={{ "--animation-order": 4 } as React.CSSProperties}>
      <div className="border border-gray-400">
        <div className="bg-gray-300 text-center text-[9px] uppercase py-0.5 border-b border-gray-400 font-bold">
          PARTIDAS
        </div>
        
        {partidas.map((partida, index) => (
          <div key={index} className="mb-0">
            {/* First row - column headers */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">FRACCION</div>
              <div className="col-span-2 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">SUBD / NUM. IDENTIFICACION COMERCIAL.</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">VINC</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">MET VAL</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">UMC</div>
              <div className="col-span-1.5 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">CANTIDAD UMC</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">UMT</div>
              <div className="col-span-1.5 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">CANTIDAD UMT</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">P.V/C</div>
              <div className="col-span-1 text-center py-0.5 px-1 font-semibold">P.O/D</div>
            </div>
            
            {/* SEC and Description row */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">SEC</div>
              <div className="col-span-11 text-center py-0.5 px-1 font-semibold">DESCRIPCION</div>
            </div>
            
            {/* Valuation fields row */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-3 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">VAL ADU/ USD</div>
              <div className="col-span-3 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">IMP. PRECIO PAG.</div>
              <div className="col-span-3 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">PRECIO UNIT.</div>
              <div className="col-span-3 text-center py-0.5 px-1 font-semibold">VAL. AGREG.</div>
            </div>
            
            {/* Brand and model row */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-4 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">MARCA</div>
              <div className="col-span-4 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">MODELO</div>
              <div className="col-span-4 text-center py-0.5 px-1 font-semibold">CÓDIGO PRODUCTO</div>
            </div>
            
            {/* Data Content row 1 */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-1 py-0.5 px-1 border-r border-gray-400">{partida.fraccion || ""}</div>
              <div className="col-span-2 py-0.5 px-1 border-r border-gray-400">{partida.subd_num_identificacion_comercial || ""}</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.vinc || ""}</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.met_val || ""}</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.umc || ""}</div>
              <div className="col-span-1.5 text-right py-0.5 px-1 border-r border-gray-400">{formatNumber(partida.cantidad_umc)}</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.umt || ""}</div>
              <div className="col-span-1.5 text-right py-0.5 px-1 border-r border-gray-400">{formatNumber(partida.cantidad_umt)}</div>
              <div className="col-span-1 py-0.5 px-1 border-r border-gray-400">{partida.p_vic || ""}</div>
              <div className="col-span-1 py-0.5 px-1">{partida.p_oid || ""}</div>
            </div>
            
            {/* Data Content row 2 */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.sec || index + 1}</div>
              <div className="col-span-11 py-0.5 px-1">{partida.descripcion || ""}</div>
            </div>
            
            {/* Data Content row 3 */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-3 text-right py-0.5 px-1 border-r border-gray-400">{partida.val_adu_usd !== null ? formatNumber(partida.val_adu_usd) : ""}</div>
              <div className="col-span-3 text-right py-0.5 px-1 border-r border-gray-400">{partida.imp_precio_pag !== null ? formatNumber(partida.imp_precio_pag) : ""}</div>
              <div className="col-span-3 text-right py-0.5 px-1 border-r border-gray-400">{partida.precio_unit !== null ? formatNumber(partida.precio_unit) : ""}</div>
              <div className="col-span-3 text-right py-0.5 px-1">{partida.val_agreg !== null ? formatNumber(partida.val_agreg) : ""}</div>
            </div>
            
            {/* Data Content row 4 */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-4 py-0.5 px-1 border-r border-gray-400">{partida.marca || ""}</div>
              <div className="col-span-4 py-0.5 px-1 border-r border-gray-400">{partida.modelo || ""}</div>
              <div className="col-span-4 py-0.5 px-1">{partida.codigo_producto || ""}</div>
            </div>
            
            {/* Taxation row headers */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-2 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">CON.</div>
              <div className="col-span-2 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">TASA</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">T.T.</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">F.P.</div>
              <div className="col-span-6 text-center py-0.5 px-1 font-semibold">IMPORTE</div>
            </div>
            
            {/* Taxation data rows */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-2 py-0.5 px-1 border-r border-gray-400">{partida.con || "IGI/IGE"}</div>
              <div className="col-span-2 text-right py-0.5 px-1 border-r border-gray-400">{partida.tasa_arancel?.toFixed(6) || ""}</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.t_t || ""}</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">{partida.f_p}</div>
              <div className="col-span-6 text-right py-0.5 px-1">{formatNumber(0)}</div>
            </div>
            
            {/* IVA row */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-2 py-0.5 px-1 border-r border-gray-400">{partida.iva || "IVA"}</div>
              <div className="col-span-2 text-right py-0.5 px-1 border-r border-gray-400">16.00000</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">1</div>
              <div className="col-span-1 text-center py-0.5 px-1 border-r border-gray-400">0</div>
              <div className="col-span-6 text-right py-0.5 px-1">{formatNumber(partida.importe)}</div>
            </div>
            
            {/* Identifiers row - header */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px] bg-gray-300">
              <div className="col-span-12 text-center py-0.5 px-1 font-semibold">IDENTIFICADORES</div>
            </div>
            
            {/* Identifiers column headers */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-2 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">IDENTIF</div>
              <div className="col-span-3 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">COMPLEMENTO 1</div>
              <div className="col-span-3.5 text-center py-0.5 px-1 border-r border-gray-400 font-semibold">COMPLEMENTO 2</div>
              <div className="col-span-3.5 text-center py-0.5 px-1 font-semibold">COMPLEMENTO 3</div>
            </div>
            
            {/* Identifiers data row - Updated with centered complementos */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-2 py-0.5 px-1 border-r border-gray-400">
                <div className="flex flex-col">
                  <span className="font-semibold">EN</span>
                  <span>{partida.identificadores_en || "XI"}</span>
                </div>
              </div>
              <div className="col-span-3 text-center py-0.5 px-1 border-r border-gray-400">{partida.complemento_1 || ""}</div>
              <div className="col-span-3.5 text-center py-0.5 px-1 border-r border-gray-400">{partida.complemento_2 || "1.1"}</div>
              <div className="col-span-3.5 text-center py-0.5 px-1">{partida.complemento_3 || ""}</div>
            </div>
            
            {/* Observations header */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px] bg-gray-300">
              <div className="col-span-12 text-center py-0.5 px-1 font-semibold">OBSERVACIONES A NIVEL PARTIDA</div>
            </div>
            
            {/* Observations data */}
            <div className="grid grid-cols-12 border-b border-gray-400 text-[9px]">
              <div className="col-span-12 py-2 px-1">
                {partida.observaciones_nivel_partida || partida.observaciones || (
                  <>
                    {partida.marca && <div>MARCA: {partida.marca}</div>}
                    {partida.modelo && <div>MODELO: {partida.modelo}</div>}
                    {partida.observaciones && <div>{partida.observaciones}</div>}
                  </>
                )}
              </div>
            </div>

            {/* Spacer for next partida */}
            {index < partidas.length - 1 && (
              <div className="h-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedimentoPartidas;
