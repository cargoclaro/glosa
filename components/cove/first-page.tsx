import type { Cove } from '@/shared/services/customGloss/data-extraction/schemas';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface ICoveHeaderProps {
  cove: Cove;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

export function CoveHeader({
  cove,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}: ICoveHeaderProps) {
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
      {cove.acuse_valor && (
        <div className="border-b p-2">
          <h3 className="mb-1 font-semibold text-sm">
            Datos del Acuse de Valor{' '}
            <span className="font-bold text-zinc-700">
              {cove.acuse_valor}
            </span>
          </h3>

          {/* Información general section */}
          <div
            className={cn(
              'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
              getHighlightBorder('Datos Generales', tabs),
              getHighlightFill('Datos Generales', tabInfoSelected)
            )}
            onClick={() => onClick('Datos Generales')}
          >
            <div className="grid grid-cols-1 gap-1 border md:grid-cols-3">
              <div className="border-r border-b bg-gray-100 p-1">
                <h4 className="font-medium text-xs">Tipo de operación</h4>
              </div>
              <div className="border-r border-b bg-gray-100 p-1">
                <h4 className="font-medium text-xs">
                  Relación de facturas
                </h4>
              </div>
              <div className="border-b bg-gray-100 p-1">
                <h4 className="font-medium text-xs">No. de factura</h4>
              </div>

              <div className="border-r p-1">
                <p className="text-xs">{cove.tipo_operacion || '—'}</p>
              </div>
              <div className="border-r p-1">
                <p className="text-xs">{cove.relacion_facturas || '—'}</p>
              </div>
              <div className="p-1">
                <p className="text-xs">{cove.numero_factura || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 border-x border-b md:grid-cols-2">
              <div className="border-r bg-gray-100 p-1">
                <h4 className="font-medium text-xs">Tipo de figura</h4>
              </div>
              <div className="bg-gray-100 p-1">
                <h4 className="font-medium text-xs">Fecha Exp.</h4>
              </div>

              <div className="border-r p-1">
                <p className="text-xs">{cove.tipo_figura || '—'}</p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {JSON.stringify(cove.fecha_expedicion) || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="mt-1 border">
            <div className="bg-gray-100 p-1">
              <h4 className="font-medium text-xs">Observaciones</h4>
            </div>
            <div className="min-h-[40px] p-1">
              <p className="text-xs">{cove.observaciones || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Data - Datos generales del proveedor */}
      {cove.datos_generales_proveedor && (
        <div className="border-b p-2">
          <h3 className="mb-1 font-semibold text-sm">
            Datos generales del proveedor
          </h3>

          <div
            className={cn(
              'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
              getHighlightBorder('Datos Proveedor Destinatario', tabs),
              getHighlightFill('Datos Proveedor Destinatario', tabInfoSelected)
            )}
            onClick={() => onClick('Datos Proveedor Destinatario')}
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
                <p className="text-xs">
                  {cove.datos_generales_proveedor.tipo_identificador ||
                    '—'}
                </p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {cove.datos_generales_proveedor.identificador || '—'}
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
                  {cove.datos_generales_proveedor.nombre_razon_social ||
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

          {/* Address - Domicilio del proveedor */}
          {cove.datos_generales_proveedor.domicilio && (
            <div
              className={cn(
                'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                getHighlightBorder('Datos Proveedor Destinatario', tabs),
                getHighlightFill('Datos Proveedor Destinatario', tabInfoSelected)
              )}
              onClick={() => onClick('Domicilio del proveedor')}
            >
              <h4 className="mt-1 mb-1 ml-1 font-semibold text-xs">
                Domicilio del proveedor
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
                    {cove.datos_generales_proveedor.domicilio.calle ||
                      '—'}
                  </p>
                </div>
                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.datos_generales_proveedor.domicilio
                      .numero_exterior || '—'}
                  </p>
                </div>
                <div className="border-r p-1">
                  <p className="text-xs">—</p>
                </div>
                <div className="p-1">
                  <p className="text-xs">
                    {cove.datos_generales_proveedor.domicilio
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
                    {cove.datos_generales_proveedor.domicilio.colonia ||
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
                    {cove.datos_generales_proveedor.domicilio.pais || '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
