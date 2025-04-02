import type { Cove } from '@/shared/services/customGloss/extract-and-structure/schemas';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface ICoveRecipientProps {
  cove: Cove;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

export function CoveRecipient({
  cove,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}: ICoveRecipientProps) {
  return (
    <div className="overflow-x-auto p-3">
      {/* COVE Title Section - Similar to Pedimento */}
      <div className="mb-4 w-full border border-gray-400 rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 border-gray-400 border-b bg-gray-200 py-0.5 py-1 text-center font-semibold text-[11px] text-xs uppercase">
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

      {/* Recipient Data */}
      {cove.datosGeneralesDelDestinatario && (
        <div className="border-b p-2">
          <h3 className="mb-1 font-semibold text-sm">
            Datos generales del destinatario
          </h3>

          {/* Datos generales del destinatario - Highlighted section */}
          <div
            className={cn(
              'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
              getHighlightBorder('Datos Proveedor Destinatario', tabs),
              getHighlightFill('Datos Proveedor Destinatario', tabInfoSelected)
            )}
            onClick={() => onClick('Datos generales del destinatario')}
          >
            <div className="grid grid-cols-1 gap-1 border-x border-t border-b md:grid-cols-2">
              <div className="border-r bg-gray-100 p-1">
                <h4 className="font-medium text-xs">
                  Tipo de identificador
                </h4>
              </div>
              <div className="bg-gray-100 p-1">
                <h4 className="font-medium text-xs">Tax ID/Sin Tax ID/RFC/CURP</h4>
              </div>

              <div className="border-r p-1">
                <p className="text-xs">RFC</p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelDestinatario.taxIdSinTaxIdRfcCurp ||
                    '—'}
                </p>
              </div>
            </div>

            <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b md:grid-cols-3">
              <div className="border-r bg-gray-100 p-1 md:col-span-1">
                <h4 className="font-medium text-xs">
                  Nombre(s) o Razón Social
                </h4>
              </div>
              <div className="border-r bg-gray-100 p-1">
                <h4 className="font-medium text-xs">Apellido paterno</h4>
              </div>
              <div className="bg-gray-100 p-1">
                <h4 className="font-medium text-xs">Apellido materno</h4>
              </div>

              <div className="border-r p-1 md:col-span-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelDestinatario.nombresORazonSocial ||
                    '—'}
                </p>
              </div>
              <div className="border-r p-1">
                <p className="text-xs">—</p>
              </div>
              <div className="p-1">
                <p className="text-xs">—</p>
              </div>
            </div>
          </div>

          {/* Address */}
          {cove.domicilioDelDestinatario && (
            <div
              className={cn(
                'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                getHighlightBorder('Datos Proveedor Destinatario', tabs),
                getHighlightFill('Datos Proveedor Destinatario', tabInfoSelected)
              )}
              onClick={() => onClick('Domicilio del destinatario')}
            >
              <h4 className="mt-1 mb-1 ml-1 font-semibold text-xs">
                Domicilio del destinatario
              </h4>
              <div className="grid grid-cols-1 gap-1 border md:grid-cols-4">
                <div className="border-r bg-gray-100 p-1 md:col-span-1">
                  <h4 className="font-medium text-xs">Calle</h4>
                </div>
                <div className="border-r bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">No. exterior</h4>
                </div>
                <div className="border-r bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">No. interior</h4>
                </div>
                <div className="bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">Código postal</h4>
                </div>

                <div className="border-r p-1 md:col-span-1">
                  <p className="text-xs">
                    {cove.domicilioDelDestinatario.calle ||
                      '—'}
                  </p>
                </div>
                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.domicilioDelDestinatario.numeroExterior || '—'}
                  </p>
                </div>
                <div className="border-r p-1">
                  <p className="text-xs">—</p>
                </div>
                <div className="p-1">
                  <p className="text-xs">
                    {cove.domicilioDelDestinatario.codigoPostal || '—'}
                  </p>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b md:grid-cols-2">
                <div className="border-r bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">Colonia</h4>
                </div>
                <div className="bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">Localidad</h4>
                </div>

                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.domicilioDelDestinatario.colonia ||
                      '—'}
                  </p>
                </div>
                <div className="p-1">
                  <p className="text-xs">—</p>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b md:grid-cols-2">
                <div className="border-r bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">
                    Entidad federativa
                  </h4>
                </div>
                <div className="bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">Municipio</h4>
                </div>

                <div className="border-r p-1">
                  <p className="text-xs">—</p>
                </div>
                <div className="p-1">
                  <p className="text-xs">—</p>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b">
                <div className="bg-gray-100 p-1">
                  <h4 className="font-medium text-xs">País</h4>
                </div>

                <div className="p-1">
                  <p className="text-xs">
                    {cove.domicilioDelDestinatario.pais ||
                      '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* First Merchandise Item */}
      {cove.mercancias && cove.mercancias.length > 0 && (
        <div className="border-b p-2">
          <h3 className="mb-1 font-semibold text-sm">
            Datos de la mercancía
          </h3>

          {/* Datos de la mercancía - Highlighted section */}
          <div
            className={cn(
              'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
              getHighlightBorder('Validación de mercancías', tabs),
              getHighlightFill('Validación de mercancías', tabInfoSelected)
            )}
            onClick={() => onClick('Datos de la mercancía')}
          >
            <div className="mb-2">
              <table className="w-full border-collapse">
                <tbody>
                  {/* First row - header for description spans two columns */}
                  <tr>
                    <td
                      colSpan={2}
                      className="w-2/3 border bg-gray-200 p-1 font-medium text-xs"
                    >
                      Descripción genérica de la mercancía
                    </td>
                    <td className="w-1/3 border bg-gray-200 p-1 font-medium text-xs">
                      Cantidad de mercancía
                    </td>
                  </tr>

                  {/* Second row - values for description spans two columns */}
                  <tr>
                    <td colSpan={2} className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.descripcionGenericaDeLaMercancia ||
                        '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.cantidadUMC
                        ? Number(
                            cove.mercancias[0]?.datosDeLaMercancia.cantidadUMC
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })
                        : '—'}
                    </td>
                  </tr>

                  {/* Third row - header for unit */}
                  <tr>
                    <td className="border bg-gray-200 p-1 font-medium text-xs">
                      Unidad de Medida
                    </td>
                    <td className="border bg-gray-200 p-1 font-medium text-xs">
                      Tipo moneda
                    </td>
                    <td className="border bg-gray-200 p-1 font-medium text-xs">
                      Valor unitario
                    </td>
                  </tr>

                  {/* Fourth row - values for unit */}
                  <tr>
                    <td className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.claveUMC || '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.tipoMoneda || '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.valorUnitario
                        ? `$ ${cove.mercancias[0]?.datosDeLaMercancia.valorUnitario.toLocaleString(
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
                      className="border bg-gray-200 p-1 font-medium text-xs"
                    >
                      Valor total
                    </td>
                    <td className="border bg-gray-200 p-1 font-medium text-xs">
                      Valor total en dólares
                    </td>
                  </tr>

                  {/* Sixth row - values for totals */}
                  <tr>
                    <td colSpan={2} className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.valorTotal
                        ? `$ ${cove.mercancias[0]?.datosDeLaMercancia.valorTotal.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 6,
                              maximumFractionDigits: 6,
                            }
                          )}`
                        : '—'}
                    </td>
                    <td className="border p-1 text-xs">
                      {cove.mercancias[0]?.datosDeLaMercancia.valorTotalEnDolares
                        ? `$ ${cove.mercancias[0]?.datosDeLaMercancia.valorTotalEnDolares.toLocaleString(
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

              {cove.mercancias[0]?.descripcionDeLaMercancia?.numeroDeSerie &&
                cove.mercancias[0]?.descripcionDeLaMercancia?.numeroDeSerie.length > 0 && (
                  <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b">
                    <div className="bg-gray-100 p-1">
                      <h4 className="font-medium text-xs">
                        Números de serie
                      </h4>
                    </div>

                    <div className="p-1">
                      <p className="text-xs">
                        {cove.mercancias[0]?.descripcionDeLaMercancia?.numeroDeSerie ||
                          '—'}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
