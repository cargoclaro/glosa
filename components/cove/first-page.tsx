import type { Cove } from '@/shared/services/customGloss/extract-and-structure/schemas';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { getHighlightBorder, getHighlightFill } from './utils/highlight-styles';

interface ICoveHeaderProps {
  cove: Cove;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
  selectedCoveSection?: string;
}

export function CoveHeader({
  cove,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
  selectedCoveSection = '',
}: ICoveHeaderProps) {
  // Extraer el número de COVE del ID para usar en el mapeo
  const coveNumber = cove.datosDelAcuseDeValor.idCove ? 
    parseInt(cove.datosDelAcuseDeValor.idCove.split('-').pop() || '1') : 1;

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
      {cove.datosDelAcuseDeValor.idCove && (
        <div className="border-b p-2">
          <h3 className="mb-1 font-semibold text-sm">
            Datos del Acuse de Valor{' '}
            <span className="font-bold text-zinc-700">
              {cove.datosDelAcuseDeValor.idCove}
            </span>
          </h3>

          {/* Información general section */}
          <div
            className={cn(
              'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
              getHighlightBorder('Datos Generales', tabs, coveNumber),
              getHighlightFill('Datos Generales', tabInfoSelected, selectedCoveSection, tabs, coveNumber)
            )}
            onClick={() => onClick('Datos Generales')}
          >
            <div className="grid grid-cols-1 gap-1 border md:grid-cols-3">
              <div className="border-r border-b bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Tipo de operación</h4>
              </div>
              <div className="border-r border-b bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Relación de facturas</h4>
              </div>
              <div className="border-b bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">No. de factura</h4>
              </div>

              <div className="border-r p-1">
                <p className="text-xs">
                  {cove.datosDelAcuseDeValor.tipoDeOperacion || '—'}
                </p>
              </div>
              <div className="border-r p-1">
                <p className="text-xs">
                  {cove.datosDelAcuseDeValor.relacionDeFacturas || '—'}
                </p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {cove.datosDelAcuseDeValor.numeroDeFactura || '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 border-x border-b md:grid-cols-2">
              <div className="border-r bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Tipo de figura</h4>
              </div>
              <div className="bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Fecha Exp.</h4>
              </div>

              <div className="border-r p-1">
                <p className="text-xs">
                  {cove.datosDelAcuseDeValor.tipoDeFigura || '—'}
                </p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {JSON.stringify(cove.datosDelAcuseDeValor.fechaExpedicion) ||
                    '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="mt-1 border">
            <div className="bg-gray-100 p-1 font-medium">
              <h4 className="text-xs">Observaciones</h4>
            </div>
            <div className="min-h-[40px] p-1">
              <p className="text-xs">
                {cove.datosDelAcuseDeValor.observaciones || '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Data - Datos generales del proveedor */}
      {cove.datosGeneralesDelProveedor && (
        <div className="border-b p-2">
          <h3 className="mb-1 font-semibold text-sm">
            Datos generales del proveedor
          </h3>

          <div
            className={cn(
              'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
              getHighlightBorder('Datos Proveedor Destinatario', tabs, coveNumber),
              getHighlightFill('Datos Proveedor Destinatario', tabInfoSelected, selectedCoveSection, tabs, coveNumber)
            )}
            onClick={() => onClick('Datos Proveedor Destinatario')}
          >
            <div className="grid grid-cols-1 gap-1 border-x border-t border-b md:grid-cols-2">
              <div className="border-r bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Tipo de identificador</h4>
              </div>
              <div className="bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">
                  Tax ID/Sin Tax ID/RFC/CURP
                </h4>
              </div>

              <div className="border-r p-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelProveedor.tipoDeIdentificador || '—'}
                </p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelProveedor.taxIdSinTaxIdRfcCurp || '—'}
                </p>
              </div>
            </div>

            <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b md:grid-cols-3">
              <div className="border-r bg-gray-100 p-1 md:col-span-1 font-medium">
                <h4 className="text-xs">
                  Nombre(s) o Razón Social
                </h4>
              </div>
              <div className="border-r bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Apellido paterno</h4>
              </div>
              <div className="bg-gray-100 p-1 font-medium">
                <h4 className="text-xs">Apellido materno</h4>
              </div>

              <div className="border-r p-1 md:col-span-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelProveedor.nombresORazonSocial || '—'}
                </p>
              </div>
              <div className="border-r p-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelProveedor.apellidoPaterno || '—'}
                </p>
              </div>
              <div className="p-1">
                <p className="text-xs">
                  {cove.datosGeneralesDelProveedor.apellidoMaterno || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Address - Domicilio del proveedor */}
          {cove.domicilioDelProveedor && (
            <div
              className={cn(
                'mb-1 cursor-pointer overflow-hidden rounded-md border-2',
                getHighlightBorder('Domicilio del proveedor', tabs, coveNumber),
                getHighlightFill('Domicilio del proveedor', tabInfoSelected, selectedCoveSection, tabs, coveNumber)
              )}
              onClick={() => onClick('Domicilio del proveedor')}
            >
              <h4 className="mt-1 mb-1 ml-1 text-xs font-semibold">
                Domicilio del proveedor
              </h4>
              <div className="grid grid-cols-1 gap-1 border md:grid-cols-4">
                <div className="border-r bg-gray-100 p-1 md:col-span-1 font-medium">
                  <h4 className="text-xs">Calle</h4>
                </div>
                <div className="border-r bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">No. exterior</h4>
                </div>
                <div className="border-r bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">No. interior</h4>
                </div>
                <div className="bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">Código postal</h4>
                </div>

                <div className="border-r p-1 md:col-span-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.calle || '—'}
                  </p>
                </div>
                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.numeroExterior || '—'}
                  </p>
                </div>
                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.numeroInterior || '—'}
                  </p>
                </div>
                <div className="p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.codigoPostal || '—'}
                  </p>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b md:grid-cols-2">
                <div className="border-r bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">Colonia</h4>
                </div>
                <div className="bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">Localidad</h4>
                </div>

                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.colonia || '—'}
                  </p>
                </div>
                <div className="p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.localidad || '—'}
                  </p>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b md:grid-cols-2">
                <div className="border-r bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">Entidad federativa</h4>
                </div>
                <div className="bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">Municipio</h4>
                </div>

                <div className="border-r p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.entidadFederativa || '—'}
                  </p>
                </div>
                <div className="p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.municipio || '—'}
                  </p>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-1 border-x border-b">
                <div className="bg-gray-100 p-1 font-medium">
                  <h4 className="text-xs">País</h4>
                </div>

                <div className="p-1">
                  <p className="text-xs">
                    {cove.domicilioDelProveedor.pais || '—'}
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
