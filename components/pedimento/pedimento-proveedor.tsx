import type { Pedimento } from '@/shared/services/customGloss/extract-and-structure/schemas';
import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { 
  getValidationBorder, 
  getSelectionFill, 
  getSelectionHeaderStyle 
} from './utils/highlight-styles';

interface PedimentoProveedorProps {
  datosDelProveedorOComprador: Pedimento['datosDelProveedorOComprador'];
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

const PedimentoProveedor: React.FC<PedimentoProveedorProps> = ({
  datosDelProveedorOComprador,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}) => {
  const formatNumber = (num: number) => {
    if (num === null || num === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="mb-4 w-full overflow-hidden rounded-md border-2 border-gray-400">
        {/* Main header with gray background */}
        <div className="border-gray-400 border-b bg-gray-200 py-0.5 text-center font-semibold text-[10px] uppercase">
          DATOS DEL PROVEEDOR O COMPRADOR
        </div>

        {datosDelProveedorOComprador.map(
          (
            {
              idFiscal,
              nombreRazonSocial,
              domicilio,
              vinculacion,
              facturas,
            },
            proveedorIndex
          ) => (
            <div key={`proveedor-${proveedorIndex}`}>
              {/* Header row */}
              <div className="grid grid-cols-12 gap-0 border-gray-400 border-b bg-white">
                <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
                  ID FISCAL:
                </div>
                <div className="col-span-5 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
                  NOMBRE, DENOMINACION O RAZON SOCIAL:
                </div>
                <div className="col-span-4 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
                  DOMICILIO:
                </div>
                <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 font-semibold text-[10px] text-xs uppercase last:border-r-0">
                  VINCULACION
                </div>
              </div>

              {/* Data row */}
              <div className="grid grid-cols-12 gap-0 border-gray-400 border-b">
                <div className="col-span-2 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
                  {idFiscal || ''}
                </div>
                <div className="col-span-5 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
                  {nombreRazonSocial || ''}
                </div>
                <div className="col-span-4 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
                  {domicilio || ''}
                </div>
                <div className="col-span-1 flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
                  {vinculacion || ''}
                </div>
              </div>

              {/* Facturas section */}
              {facturas.map(
                (
                  {
                    numeroDeCFDIODocumentoEquivalente,
                    fecha,
                    incoterm,
                    moneda,
                    valorMoneda,
                    factorMoneda,
                    valorDolares,
                  },
                  facturaIndex
                ) => {
                  const numeroFactura = numeroDeCFDIODocumentoEquivalente || `${facturaIndex + 1}`;
                  const facturaTabName = `Datos de factura ${numeroFactura}`;
                  const isSelected = tabInfoSelected.name === facturaTabName;
                  
                  return (
                    <div 
                      key={`factura-${proveedorIndex}-${facturaIndex}`}
                      className={cn(
                        'cursor-pointer transition-all duration-200 rounded-sm',
                        // Espaciado solo si no es la última factura
                        facturaIndex < facturas.length - 1 && 'mb-1',
                        // Validation border - always visible
                        getValidationBorder(facturaTabName, tabs),
                        // Selection background - only when selected
                        getSelectionFill(facturaTabName, tabInfoSelected),
                        // Hover effect that doesn't interfere with selection
                        !isSelected && 'hover:bg-blue-50/30'
                      )}
                      onClick={() => onClick(facturaTabName)}
                    >
                      {/* Facturas section - column headers */}
                      <div className="grid grid-cols-7 gap-0 border-gray-400 border-b bg-white">
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          NUM.FACTURA
                        </div>
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          FECHA
                        </div>
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          INCOTERM
                        </div>
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          MONEDA FACT
                        </div>
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          VAL.MON.FACT
                        </div>
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          FACTOR MON.FACT
                        </div>
                        <div className={cn(
                          "flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center font-semibold text-[10px] uppercase last:border-r-0",
                          getSelectionHeaderStyle(facturaTabName, tabInfoSelected)
                        )}>
                          VAL.DOLARES
                        </div>
                      </div>

                      {/* Factura data row */}
                      <div className="grid grid-cols-7 gap-0 border-gray-400 border-b">
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-[10px] text-xs last:border-r-0">
                          {numeroDeCFDIODocumentoEquivalente || ''}
                        </div>
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
                          {fecha?.toString() || ''}
                        </div>
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
                          {incoterm || ''}
                        </div>
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
                          {moneda || ''}
                        </div>
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right text-[10px] text-xs last:border-r-0">
                          {formatNumber(valorMoneda)}
                        </div>
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-center text-[10px] text-xs last:border-r-0">
                          {factorMoneda?.toFixed(8) || ''}
                        </div>
                        <div className="flex min-h-6 items-center border-gray-400 border-r px-2 py-0.5 text-right text-[10px] text-xs last:border-r-0">
                          {formatNumber(valorDolares)}
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PedimentoProveedor;
