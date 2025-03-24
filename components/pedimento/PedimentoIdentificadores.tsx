import type React from 'react';
import IdentificadoresTable from './identificadores/IdentificadoresTable';
import LiquidacionTable from './liquidacion/LiquidacionTable';
import TasasTable from './tasas/TasasTable';

import type { CustomGlossTabTable } from '~/db/schema';

interface PedimentoIdentificadoresProps {
  identificadoresNivelPedimento: {
    clave_seccion_aduanera: string;
    marcas_numeros_bultos: string;
  };
  identificadoresPedimento: Array<{
    clave: string;
    complemento_1: string;
    complemento_2: string;
    complemento_3: string;
  }>;
  fechaEntrada?: string;
  fechaPago?: string;
  tasas?: Array<{
    contrib: string;
    cve_t_tasa: string;
    tasa: string;
  }>;
  liquidacion: {
    conceptos: Array<{
      concepto: string;
      fp: string;
      importe: number;
    }>;
    totales: {
      efectivo: number;
      otros: number;
      total: number;
    };
  };
  tabs?: CustomGlossTabTable[];
  onClick?: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoIdentificadores: React.FC<PedimentoIdentificadoresProps> = ({
  identificadoresNivelPedimento,
  identificadoresPedimento,
  fechaEntrada,
  fechaPago,
  tasas = [],
  liquidacion,
  tabs = [],
  onClick = () => {},
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 7 } as React.CSSProperties}
    >
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-4">
          <div className="pedimento-section-title text-[11px] py-0.5">CÓDIGO DE ACEPTACIÓN:</div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">&nbsp;</div>
        </div>
        <div className="col-span-4">
          <div className="pedimento-section-title text-[11px] py-0.5">CODIGO DE BARRAS</div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">&nbsp;</div>
        </div>
        <div className="col-span-4">
          <div className="pedimento-section-title text-[11px] py-0.5">
            CLAVE DE LA SECCION ADUANERA DE DESPACHO:
          </div>
          <div className="pedimento-cell pedimento-value text-center text-[10px] py-0.5">
            {identificadoresNivelPedimento.clave_seccion_aduanera}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-12 gap-0">
        <div className="col-span-8">
          <div className="pedimento-section-title text-[11px] py-0.5">
            MARCAS, NUMEROS Y TOTAL DE BULTOS:
          </div>
          <div className="pedimento-cell pedimento-value text-[10px] py-0.5">
            {identificadoresNivelPedimento.marcas_numeros_bultos}
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex h-full flex-col">
            <div className="pedimento-header text-[10px] py-0.5">1/2</div>
            <div className="pedimento-cell pedimento-value flex flex-1 items-center justify-center text-center text-[10px] py-0.5">
              2
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-0">
        <div className="col-span-1">
          <div className="pedimento-section-title text-[11px] py-0.5">FECHAS</div>
          <div className="grid grid-cols-1 gap-0">
            <div className="grid grid-cols-3 gap-0">
              <div className="pedimento-cell pedimento-label col-span-1 text-[10px] py-0.5">
                ENTRADA
              </div>
              <div className="pedimento-cell pedimento-value col-span-2 text-[10px] py-0.5">
                {fechaEntrada}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0">
              <div className="pedimento-cell pedimento-label col-span-1 text-[10px] py-0.5">
                PAGO
              </div>
              <div className="pedimento-cell pedimento-value col-span-2 text-[10px] py-0.5">
                {fechaPago}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="pedimento-section-title text-[11px] py-0.5">TASAS A NIVEL PEDIMENTO</div>
          <TasasTable tasas={tasas} />
        </div>
      </div>

      <div className="mt-2">
        <div className="pedimento-section-title text-[11px] py-0.5">IDENTIFICADORES</div>
        <IdentificadoresTable identificadores={identificadoresPedimento} />
      </div>

      <div className="mt-2">
        <div className="pedimento-section-title text-[11px] py-0.5">LIQUIDACIÓN</div>
        <LiquidacionTable liquidacion={liquidacion} />
      </div>
    </div>
  );
};

export default PedimentoIdentificadores;
