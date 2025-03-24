import type { Cove } from "@/shared/services/customGloss/data-extraction/schemas";

export function CoveDetails({ cove }: { cove: Cove }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col w-full max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <header className="bg-zinc-800 text-white p-4">
            <div className="flex items-center justify-between">
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
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold mb-2">Datos del Acuse de Valor <span className="font-bold text-zinc-700">{cove.acuse_valor}</span></h3>
          </div>

          {/* Recipient Data */}
          {cove.datos_generales_destinatario && (
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold mb-2">Datos generales del destinatario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-x border-t border-b">
                <div className="p-2 bg-gray-100 border-r">
                  <h4 className="font-medium">Tipo de identificador</h4>
                </div>
                <div className="p-2 bg-gray-100">
                  <h4 className="font-medium">Tax ID/Sin Tax ID/RFC/CURP</h4>
                </div>
                
                <div className="p-2 border-r">
                  <p>RFC</p>
                </div>
                <div className="p-2">
                  <p>{cove.datos_generales_destinatario.rfc_destinatario || "—"}</p>
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
                  <p>{cove.datos_generales_destinatario.nombre_razon_social || "—"}</p>
                </div>
                <div className="p-2 border-r">
                  <p>—</p>
                </div>
                <div className="p-2">
                  <p>—</p>
                </div>
              </div>

              {/* Address */}
              {cove.datos_generales_destinatario.domicilio && (
                <>
                  <h4 className="font-semibold mt-4 mb-2">Domicilio del destinatario</h4>
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
                      <p>{cove.datos_generales_destinatario.domicilio.calle || "—"}</p>
                    </div>
                    <div className="p-2 border-r">
                      <p>{cove.datos_generales_destinatario.domicilio.numero_exterior || "—"}</p>
                    </div>
                    <div className="p-2 border-r">
                      <p>—</p>
                    </div>
                    <div className="p-2">
                      <p>{cove.datos_generales_destinatario.domicilio.codigo_postal || "—"}</p>
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
                      <p>{cove.datos_generales_destinatario.domicilio.colonia || "—"}</p>
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
                      <p>{cove.datos_generales_destinatario.domicilio.pais || "—"}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Merchandise Data - Updated to match the photo exactly */}
          {cove.datos_mercancia && cove.datos_mercancia.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold mb-2">Datos de la mercancía</h3>

              {cove.datos_mercancia.map((item, index) => (
                <div key={index} className="mb-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      {/* First row - header for description spans two columns */}
                      <tr>
                        <td colSpan={2} className="border p-2 bg-gray-200 font-medium w-2/3">
                          Descripción genérica de la mercancía
                        </td>
                        <td className="border p-2 bg-gray-200 font-medium w-1/3">Cantidad de mercancía</td>
                      </tr>
                      
                      {/* Second row - values for description spans two columns */}
                      <tr>
                        <td colSpan={2} className="border p-2">
                          {item.descripcion_mercancia || "—"}
                        </td>
                        <td className="border p-2">
                          {item.cantidad_umc ? Number(item.cantidad_umc).toLocaleString('en-US', {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3
                          }) : "—"}
                        </td>
                      </tr>
                      
                      {/* Third row - header for unit */}
                      <tr>
                        <td className="border p-2 bg-gray-200 font-medium">Unidad de Medida</td>
                        <td className="border p-2 bg-gray-200 font-medium">Tipo moneda</td>
                        <td className="border p-2 bg-gray-200 font-medium">Valor unitario</td>
                      </tr>
                      
                      {/* Fourth row - values for unit */}
                      <tr>
                        <td className="border p-2">{item.clave_umc || "—"}</td>
                        <td className="border p-2">{item.tipo_moneda || "—"}</td>
                        <td className="border p-2">
                          {item.valor_unitario ? `$ ${item.valor_unitario.toLocaleString('en-US', {
                            minimumFractionDigits: 6,
                            maximumFractionDigits: 6
                          })}` : "—"}
                        </td>
                      </tr>
                      
                      {/* Fifth row - header for total values */}
                      <tr>
                        <td colSpan={2} className="border p-2 bg-gray-200 font-medium">Valor total</td>
                        <td className="border p-2 bg-gray-200 font-medium">Valor total en dólares</td>
                      </tr>
                      
                      {/* Sixth row - values for totals */}
                      <tr>
                        <td colSpan={2} className="border p-2">
                          {item.valor_total ? `$ ${item.valor_total.toLocaleString('en-US', {
                            minimumFractionDigits: 6,
                            maximumFractionDigits: 6
                          })}` : "—"}
                        </td>
                        <td className="border p-2">
                          {item.valor_total_dolares ? `$ ${item.valor_total_dolares.toLocaleString('en-US', {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4
                          })}` : "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {item.numeros_serie && item.numeros_serie.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 border-x border-b mt-2">
                      <div className="p-2 bg-gray-100">
                        <h4 className="font-medium">Números de serie</h4>
                      </div>
                      
                      <div className="p-2">
                        <p>{item.numeros_serie.join(", ") || "—"}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No navigation buttons here - moved to parent component */}

          {/* Footer */}
          <footer className="bg-gray-200 p-5 flex items-center justify-center">
            <h3 className="text-zinc-700 font-medium">Información de Valor y de Comercialización</h3>
          </footer>
        </div>
      </div>
    </div>
  );
};
