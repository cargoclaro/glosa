import type React from 'react';
import IdentificadoresTable from './identificadores/IdentificadoresTable';
import LiquidacionTable from './liquidacion/LiquidacionTable';
import TasasTable from './tasas/TasasTable';

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
  liquidacion?: {
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
}

const PedimentoIdentificadores: React.FC<PedimentoIdentificadoresProps> = ({
  identificadoresNivelPedimento,
  identificadoresPedimento,
  fechaEntrada = '18/03/2025',
  fechaPago = '18/03/2025',
  tasas = [
    { contrib: 'DTA', cve_t_tasa: '7', tasa: '8.00000' },
    { contrib: 'PRV', cve_t_tasa: '2', tasa: '290.00000' },
    { contrib: 'IVA PRV', cve_t_tasa: '1', tasa: '16.00000' },
  ],
  liquidacion = {
    conceptos: [
      { concepto: 'DTA', fp: '0', importe: 1967 },
      { concepto: 'IVA', fp: '0', importe: 39644 },
      { concepto: 'PRV', fp: '0', importe: 290 },
      { concepto: 'IVA PRV', fp: '0', importe: 46 },
    ],
    totales: {
      efectivo: 41947,
      otros: 0,
      total: 41947,
    },
  },
}) => {
  return (
    <div
      className="pedimento-section"
      style={{ '--animation-order': 7 } as React.CSSProperties}
    >
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-4">
          <div className="pedimento-section-title">CÓDIGO DE ACEPTACIÓN:</div>
          <div className="pedimento-cell pedimento-value">&nbsp;</div>
        </div>
        <div className="col-span-4">
          <div className="pedimento-section-title">CODIGO DE BARRAS</div>
          <div className="pedimento-cell pedimento-value">&nbsp;</div>
        </div>
        <div className="col-span-4">
          <div className="pedimento-section-title">
            CLAVE DE LA SECCION ADUANERA DE DESPACHO:
          </div>
          <div className="pedimento-cell pedimento-value text-center">
            {identificadoresNivelPedimento.clave_seccion_aduanera}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-0">
        <div className="col-span-8">
          <div className="pedimento-section-title">
            MARCAS, NUMEROS Y TOTAL DE BULTOS:
          </div>
          <div className="pedimento-cell pedimento-value">
            {identificadoresNivelPedimento.marcas_numeros_bultos}
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex h-full flex-col">
            <div className="pedimento-header">1/2</div>
            <div className="pedimento-cell pedimento-value flex flex-1 items-center justify-center text-center">
              2
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-0">
        <div className="col-span-1">
          <div className="pedimento-section-title">FECHAS</div>
          <div className="grid grid-cols-1 gap-0">
            <div className="grid grid-cols-3 gap-0">
              <div className="pedimento-cell pedimento-label col-span-1">
                ENTRADA
              </div>
              <div className="pedimento-cell pedimento-value col-span-2">
                {fechaEntrada}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0">
              <div className="pedimento-cell pedimento-label col-span-1">
                PAGO
              </div>
              <div className="pedimento-cell pedimento-value col-span-2">
                {fechaPago}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="pedimento-section-title">TASAS A NIVEL PEDIMENTO</div>
          <TasasTable tasas={tasas} />
        </div>
      </div>

      <div className="mt-4">
        <div className="pedimento-section-title">IDENTIFICADORES</div>
        <IdentificadoresTable identificadores={identificadoresPedimento} />
      </div>

      <div className="mt-4">
        <div className="pedimento-section-title">LIQUIDACIÓN</div>
        <LiquidacionTable liquidacion={liquidacion} />
      </div>
    </div>
  );
};

export default PedimentoIdentificadores;
