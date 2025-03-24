import type { Cove } from "@/shared/services/customGloss/data-extraction/schemas";

export function CoveFirstPage({ cove }: { cove: Cove }) {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div>
          <div className="flex flex-col w-full max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <header className="bg-zinc-800 text-white p-4">
              <div className="flex items-center">
                <h1 className="text-xl font-light tracking-wide">gob mx</h1>
              </div>
            </header>

            {/* Title section */}
            <div className="bg-gray-200 p-5 text-center space-y-1">
              <h2 className="text-zinc-700 font-medium">Información de Valor y de Comercialización</h2>
              <p className="text-zinc-700">Ventanilla digital mexicana de comercio exterior</p>
              <p className="text-zinc-700">Promoción o solicitud en materia de comercio exterior</p>
            </div>

            {/* COVE Identifier Section */}
            {cove.acuse_valor && (
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold mb-2">Datos del Acuse de Valor <span className="font-bold text-zinc-700">{cove.acuse_valor}</span></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border">
                  <div className="p-2 bg-gray-100 border-r border-b">
                    <h4 className="font-medium">Tipo de operación</h4>
                  </div>
                  <div className="p-2 bg-gray-100 border-r border-b">
                    <h4 className="font-medium">Relación de facturas</h4>
                  </div>
                  <div className="p-2 bg-gray-100 border-b">
                    <h4 className="font-medium">No. de factura</h4>
                  </div>
                  
                  <div className="p-2 border-r">
                    <p>{cove.tipo_operacion || "—"}</p>
                  </div>
                  <div className="p-2 border-r">
                    <p>{cove.relacion_facturas || "—"}</p>
                  </div>
                  <div className="p-2">
                    <p>{cove.numero_factura || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-x border-b mt-2">
                  <div className="p-2 bg-gray-100 border-r">
                    <h4 className="font-medium">Tipo de figura</h4>
                  </div>
                  <div className="p-2 bg-gray-100">
                    <h4 className="font-medium">Fecha Exp.</h4>
                  </div>
                  
                  <div className="p-2 border-r">
                    <p>{cove.tipo_figura || "—"}</p>
                  </div>
                  <div className="p-2">
                    <p>{JSON.stringify(cove.fecha_expedicion) || "—"}</p>
                  </div>
                </div>

                {/* Observations */}
                <div className="mt-2 border">
                  <div className="p-2 bg-gray-100">
                    <h4 className="font-medium">Observaciones</h4>
                  </div>
                  <div className="p-2 min-h-[60px]">
                    <p>{cove.observaciones || "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier Data */}
            {cove.datos_generales_proveedor && (
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold mb-2">Datos generales del proveedor</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-x border-t border-b">
                  <div className="p-2 bg-gray-100 border-r">
                    <h4 className="font-medium">Tipo de identificador</h4>
                  </div>
                  <div className="p-2 bg-gray-100">
                    <h4 className="font-medium">Tax ID/Sin Tax ID/RFC/CURP</h4>
                  </div>
                  
                  <div className="p-2 border-r">
                    <p>{cove.datos_generales_proveedor.tipo_identificador || "—"}</p>
                  </div>
                  <div className="p-2">
                    <p>{cove.datos_generales_proveedor.identificador || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-x border-b mt-2">
                  <div className="p-2 bg-gray-100 border-r md:col-span-1">
                    <h4 className="font-medium">Nombre(s) o Razón Social</h4>
                  </div>
                  <div className="p-2 bg-gray-100 border-r">
                    <h4 className="font-medium">Apellido paterno</h4>
                  </div>
                  <div className="p-2 bg-gray-100">
                    <h4 className="font-medium">Apellido materno</h4>
                  </div>
                  
                  <div className="p-2 border-r md:col-span-1">
                    <p>{cove.datos_generales_proveedor.nombre_razon_social || "—"}</p>
                  </div>
                  <div className="p-2 border-r">
                    <p>—</p>
                  </div>
                  <div className="p-2">
                    <p>—</p>
                  </div>
                </div>

                {/* Address */}
                {cove.datos_generales_proveedor.domicilio && (
                  <>
                    <h4 className="font-semibold mt-4 mb-2">Domicilio del proveedor</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border">
                      <div className="p-2 bg-gray-100 border-r md:col-span-1">
                        <h4 className="font-medium">Calle</h4>
                      </div>
                      <div className="p-2 bg-gray-100 border-r">
                        <h4 className="font-medium">No. exterior</h4>
                      </div>
                      <div className="p-2 bg-gray-100 border-r">
                        <h4 className="font-medium">No. interior</h4>
                      </div>
                      <div className="p-2 bg-gray-100">
                        <h4 className="font-medium">Código postal</h4>
                      </div>
                      
                      <div className="p-2 border-r md:col-span-1">
                        <p>{cove.datos_generales_proveedor.domicilio.calle || "—"}</p>
                      </div>
                      <div className="p-2 border-r">
                        <p>{cove.datos_generales_proveedor.domicilio.numero_exterior || "—"}</p>
                      </div>
                      <div className="p-2 border-r">
                        <p>—</p>
                      </div>
                      <div className="p-2">
                        <p>{cove.datos_generales_proveedor.domicilio.codigo_postal || "—"}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-x border-b mt-2">
                      <div className="p-2 bg-gray-100 border-r">
                        <h4 className="font-medium">Colonia</h4>
                      </div>
                      <div className="p-2 bg-gray-100">
                        <h4 className="font-medium">Localidad</h4>
                      </div>
                      
                      <div className="p-2 border-r">
                        <p>{cove.datos_generales_proveedor.domicilio.colonia || "—"}</p>
                      </div>
                      <div className="p-2">
                        <p>—</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-x border-b mt-2">
                      <div className="p-2 bg-gray-100 border-r">
                        <h4 className="font-medium">Entidad federativa</h4>
                      </div>
                      <div className="p-2 bg-gray-100">
                        <h4 className="font-medium">Municipio</h4>
                      </div>
                      
                      <div className="p-2 border-r">
                        <p>—</p>
                      </div>
                      <div className="p-2">
                        <p>—</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 border-x border-b mt-2">
                      <div className="p-2 bg-gray-100">
                        <h4 className="font-medium">País</h4>
                      </div>
                      
                      <div className="p-2">
                        <p>{cove.datos_generales_proveedor.domicilio.pais || "—"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-200 p-5 flex items-center justify-center">
              <h3 className="text-zinc-700 font-medium">Información de Valor y de Comercialización</h3>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
