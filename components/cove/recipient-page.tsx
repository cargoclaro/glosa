import type { Cove } from '@/shared/services/customGloss/data-extraction/schemas';
import { cn } from '@/shared/utils/cn';
import type { CustomGlossTabTable } from '~/db/schema';

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

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-2 py-4">
        <div className="mx-auto my-4 flex w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xs">
          {/* Header */}
          <header className="bg-zinc-800 p-2 text-white">
            <div className="flex items-center justify-between">
              <h1 className="font-light text-sm tracking-wide">gob mx</h1>
            </div>
          </header>

          {/* Title section */}
          <div className="space-y-0.5 bg-gray-200 p-3 text-center">
            <h2 className="font-medium text-sm text-zinc-700">
              Información de Valor y de Comercialización
            </h2>
            <p className="text-xs text-zinc-700">
              Ventanilla digital mexicana de comercio exterior
            </p>
            <p className="text-xs text-zinc-700">
              Promoción o solicitud en materia de comercio exterior
            </p>
          </div>

          {/* COVE Identifier Section */}
          <div className="border-b p-2">
            <h3 className="mb-1 font-semibold text-sm">
              Datos del Acuse de Valor{' '}
              <span className="font-bold text-zinc-700">
                {cove.acuse_valor}
              </span>
            </h3>
          </div>

          {/* Recipient Data */}
          {cove.datos_generales_destinatario && (
            <div className="border-b p-2">
              <h3 className="mb-1 font-semibold text-sm">
                Datos generales del destinatario
              </h3>

              {/* Datos generales del destinatario - Highlighted section */}
              <div
                className={cn(
                  'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                  getHighlightBorder('Datos Proveedor Destinatario'),
                  getHighlightFill('Datos Proveedor Destinatario')
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
                    <h4 className="font-medium text-xs">
                      Tax ID/Sin Tax ID/RFC/CURP
                    </h4>
                  </div>

                  <div className="border-r p-1">
                    <p className="text-xs">RFC</p>
                  </div>
                  <div className="p-1">
                    <p className="text-xs">
                      {cove.datos_generales_destinatario.rfc_destinatario ||
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
                      {cove.datos_generales_destinatario.nombre_razon_social ||
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
              {cove.datos_generales_destinatario.domicilio && (
                <div
                  className={cn(
                    'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                    getHighlightBorder('Datos Proveedor Destinatario'),
                    getHighlightFill('Datos Proveedor Destinatario')
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
                        {cove.datos_generales_destinatario.domicilio.calle ||
                          '—'}
                      </p>
                    </div>
                    <div className="border-r p-1">
                      <p className="text-xs">
                        {cove.datos_generales_destinatario.domicilio
                          .numero_exterior || '—'}
                      </p>
                    </div>
                    <div className="border-r p-1">
                      <p className="text-xs">—</p>
                    </div>
                    <div className="p-1">
                      <p className="text-xs">
                        {cove.datos_generales_destinatario.domicilio
                          .codigo_postal || '—'}
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
                        {cove.datos_generales_destinatario.domicilio.colonia ||
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
                        {cove.datos_generales_destinatario.domicilio.pais ||
                          '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* First Merchandise Item */}
          {cove.datos_mercancia && cove.datos_mercancia.length > 0 && (
            <div className="border-b p-2">
              <h3 className="mb-1 font-semibold text-sm">
                Datos de la mercancía
              </h3>

              {/* Datos de la mercancía - Highlighted section */}
              <div
                className={cn(
                  'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                  getHighlightBorder('Validación de mercancías'),
                  getHighlightFill('Validación de mercancías')
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
                          {cove.datos_mercancia[0]?.descripcion_mercancia ||
                            '—'}
                        </td>
                        <td className="border p-1 text-xs">
                          {cove.datos_mercancia[0]?.cantidad_umc
                            ? Number(
                                cove.datos_mercancia[0].cantidad_umc
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
                          {cove.datos_mercancia[0]?.clave_umc || '—'}
                        </td>
                        <td className="border p-1 text-xs">
                          {cove.datos_mercancia[0]?.tipo_moneda || '—'}
                        </td>
                        <td className="border p-1 text-xs">
                          {cove.datos_mercancia[0]?.valor_unitario
                            ? `$ ${cove.datos_mercancia[0].valor_unitario.toLocaleString(
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
                          {cove.datos_mercancia[0]?.valor_total
                            ? `$ ${cove.datos_mercancia[0].valor_total.toLocaleString(
                                'en-US',
                                {
                                  minimumFractionDigits: 6,
                                  maximumFractionDigits: 6,
                                }
                              )}`
                            : '—'}
                        </td>
                        <td className="border p-1 text-xs">
                          {cove.datos_mercancia[0]?.valor_total_dolares
                            ? `$ ${cove.datos_mercancia[0].valor_total_dolares.toLocaleString(
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

                  {cove.datos_mercancia[0]?.numeros_serie &&
                    cove.datos_mercancia[0].numeros_serie.length > 0 && (
                      <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b">
                        <div className="bg-gray-100 p-1">
                          <h4 className="font-medium text-xs">
                            Números de serie
                          </h4>
                        </div>

                        <div className="p-1">
                          <p className="text-xs">
                            {cove.datos_mercancia[0].numeros_serie.join(', ') ||
                              '—'}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="flex items-center justify-center bg-gray-200 p-2">
            <h3 className="font-medium text-xs text-zinc-700">
              Información de Valor y de Comercialización
            </h3>
          </footer>
        </div>
      </div>
    </div>
  );
}
