import type { Cove } from '@/shared/services/customGloss/extract-and-structure/schemas';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

type CoveMerchandiseProps = {
  cove: Cove;
  pageItems: number[];
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
  selectedCoveSection?: string;
};

export function CoveMerchandise({
  cove,
  pageItems,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
  selectedCoveSection = '',
}: CoveMerchandiseProps) {
  // Extraer el número de COVE del ID para usar en el mapeo
  const coveNumber = cove.datosDelAcuseDeValor.idCove ? 
    parseInt(cove.datosDelAcuseDeValor.idCove.split('-').pop() || '1') : 1;

  // Get all merchandise items except the first one (which is displayed on the recipient page)
  const allItems = cove.mercancias?.slice(1) || [];

  // Only render merchandise items on the current page
  // Filter out undefined items to prevent runtime errors
  const itemsToDisplay = pageItems
    .map((index) => allItems[index])
    .filter((item) => item !== undefined);

  return (
    <div className="overflow-x-auto p-3">
      {/* COVE Title Section - Similar to Pedimento */}
      <div className="mb-4 w-full overflow-hidden rounded-md border border-gray-400">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 border-gray-400 border-b bg-gray-200 py-1 text-center font-semibold text-[11px] text-xs uppercase">
            COVE
          </div>
        </div>
      </div>

      {/* COVE Identifier Section */}
      <div className="border-b p-2">
        <h3 className="mb-1 font-semibold text-sm">
          Datos del Acuse de Valor{' '}
          <span className="font-bold text-zinc-700">
            {cove.datosDelAcuseDeValor.idCove}
          </span>
        </h3>
      </div>

      {/* Merchandise Data */}
      <div className="border-b p-2">
        {itemsToDisplay.map((item, index) => (
          <div
            key={pageItems[index]}
            className={index < itemsToDisplay.length - 1 ? 'mb-6' : 'mb-2'}
          >
            <h3 className="mb-1 font-semibold text-sm">
              Datos de la mercancía
            </h3>

            {/* Datos de la mercancía - Highlighted section */}
            <div
              className={cn(
                'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                getHighlightBorder('Datos de la mercancía', tabs, coveNumber),
                getHighlightFill('Datos de la mercancía', tabInfoSelected, selectedCoveSection, tabs, coveNumber)
              )}
              onClick={() => onClick('Datos de la mercancía')}
            >
              <table className="w-full border-collapse">
                <tbody>
                  {/* First row - header for description spans two columns */}
                  <tr>
                    <td
                      colSpan={2}
                      className="w-2/3 border bg-gray-200 p-1 text-xs font-medium"
                    >
                      Descripción genérica de la mercancía
                    </td>
                    <td className="w-1/3 border bg-gray-200 p-1 text-xs font-medium">
                      Cantidad de mercancía
                    </td>
                  </tr>

                  {/* Second row - values for description spans two columns */}
                  <tr>
                    <td colSpan={2} className="border p-1 text-xs">
                      {item.datosDeLaMercancia
                        .descripcionGenericaDeLaMercancia || '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {item.datosDeLaMercancia.cantidadUMC
                        ? Number(
                            item.datosDeLaMercancia.cantidadUMC
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })
                        : '—'}
                    </td>
                  </tr>

                  {/* Third row - header for unit */}
                  <tr>
                    <td className="border bg-gray-200 p-1 text-xs font-medium">
                      Unidad de Medida
                    </td>
                    <td className="border bg-gray-200 p-1 text-xs font-medium">
                      Tipo moneda
                    </td>
                    <td className="border bg-gray-200 p-1 text-xs font-medium">
                      Valor unitario
                    </td>
                  </tr>

                  {/* Fourth row - values for unit */}
                  <tr>
                    <td className="border p-1 text-xs">
                      {item.datosDeLaMercancia.claveUMC || '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {item.datosDeLaMercancia.tipoMoneda || '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {item.datosDeLaMercancia.valorUnitario
                        ? `$ ${item.datosDeLaMercancia.valorUnitario.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 6,
                              maximumFractionDigits: 6,
                            }
                          )}`
                        : '—'}
                    </td>
                  </tr>

                  {/* Fifth row - header for total values */}
                  <tr>
                    <td
                      colSpan={2}
                      className="border bg-gray-200 p-1 text-xs font-medium"
                    >
                      Valor total
                    </td>
                    <td className="border bg-gray-200 p-1 text-xs font-medium">
                      Valor total en dólares
                    </td>
                  </tr>

                  {/* Sixth row - values for totals */}
                  <tr>
                    <td colSpan={2} className="border p-1 text-xs">
                      {item.datosDeLaMercancia.valorTotal
                        ? `$ ${item.datosDeLaMercancia.valorTotal.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 6,
                              maximumFractionDigits: 6,
                            }
                          )}`
                        : '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {item.datosDeLaMercancia.valorTotalEnDolares
                        ? `$ ${item.datosDeLaMercancia.valorTotalEnDolares.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 4,
                              maximumFractionDigits: 4,
                            }
                          )}`
                        : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {item.descripcionDeLaMercancia?.numeroDeSerie &&
                item.descripcionDeLaMercancia?.numeroDeSerie.length > 0 && (
                  <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b">
                    <div className="bg-gray-100 p-1 font-medium">
                      <h4 className="text-xs">Números de serie</h4>
                    </div>

                    <div className="p-1">
                      <p className="text-xs">
                        {item.descripcionDeLaMercancia?.numeroDeSerie || '—'}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
