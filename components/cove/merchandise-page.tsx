import type { Cove } from "@/shared/services/customGloss/data-extraction/schemas";

type CoveMerchandiseProps = {
  cove: Cove;
  pageItems: number[];
};

export function CoveMerchandise({ cove, pageItems }: CoveMerchandiseProps) {
  // Create a 10x multiplied version of the merchandise items for testing pagination
  const multipliedMerchandiseItems = () => {
    if (!cove.datos_mercancia?.length) return [];
    const repeatedItems = [];
    for (let i = 0; i < 10; i++) {
      repeatedItems.push(...cove.datos_mercancia);
    }
    // Skip the first item since it's displayed on the recipient page
    return repeatedItems.slice(1);
  };
  
  // Only render merchandise items on the current page
  const itemsToDisplay = pageItems.map(index => {
    const allItems = multipliedMerchandiseItems();
    return allItems[index];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-2 py-4">
        <div className="flex flex-col w-full max-w-3xl mx-auto my-4 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <header className="bg-zinc-800 text-white p-2">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-light tracking-wide">gob mx</h1>
            </div>
          </header>

          {/* Title section */}
          <div className="bg-gray-200 p-3 text-center space-y-0.5">
            <h2 className="text-zinc-700 font-medium text-sm">Información de Valor y de Comercialización</h2>
            <p className="text-zinc-700 text-xs">Ventanilla digital mexicana de comercio exterior</p>
            <p className="text-zinc-700 text-xs">Promoción o solicitud en materia de comercio exterior</p>
          </div>

          {/* COVE Identifier Section */}
          <div className="p-2 border-b">
            <h3 className="text-sm font-semibold mb-1">Datos del Acuse de Valor <span className="font-bold text-zinc-700">{cove.acuse_valor}</span></h3>
          </div>

          {/* Merchandise Data */}
          <div className="p-2 border-b">
            {itemsToDisplay.map((item, index) => (
              <div key={pageItems[index]} className={index < itemsToDisplay.length - 1 ? "mb-6" : "mb-2"}>
                <h3 className="text-sm font-semibold mb-1">Datos de la mercancía</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {/* First row - header for description spans two columns */}
                    <tr>
                      <td colSpan={2} className="border p-1 bg-gray-200 font-medium text-xs w-2/3">
                        Descripción genérica de la mercancía
                      </td>
                      <td className="border p-1 bg-gray-200 font-medium text-xs w-1/3">Cantidad de mercancía</td>
                    </tr>
                    
                    {/* Second row - values for description spans two columns */}
                    <tr>
                      <td colSpan={2} className="border p-1 text-xs">
                        {item.descripcion_mercancia || "—"}
                      </td>
                      <td className="border p-1 text-xs">
                        {item.cantidad_umc ? Number(item.cantidad_umc).toLocaleString('en-US', {
                          minimumFractionDigits: 3,
                          maximumFractionDigits: 3
                        }) : "—"}
                      </td>
                    </tr>
                    
                    {/* Third row - header for unit */}
                    <tr>
                      <td className="border p-1 bg-gray-200 font-medium text-xs">Unidad de Medida</td>
                      <td className="border p-1 bg-gray-200 font-medium text-xs">Tipo moneda</td>
                      <td className="border p-1 bg-gray-200 font-medium text-xs">Valor unitario</td>
                    </tr>
                    
                    {/* Fourth row - values for unit */}
                    <tr>
                      <td className="border p-1 text-xs">{item.clave_umc || "—"}</td>
                      <td className="border p-1 text-xs">{item.tipo_moneda || "—"}</td>
                      <td className="border p-1 text-xs">
                        {item.valor_unitario ? `$ ${item.valor_unitario.toLocaleString('en-US', {
                          minimumFractionDigits: 6,
                          maximumFractionDigits: 6
                        })}` : "—"}
                      </td>
                    </tr>
                    
                    {/* Fifth row - header for total values */}
                    <tr>
                      <td colSpan={2} className="border p-1 bg-gray-200 font-medium text-xs">Valor total</td>
                      <td className="border p-1 bg-gray-200 font-medium text-xs">Valor total en dólares</td>
                    </tr>
                    
                    {/* Sixth row - values for totals */}
                    <tr>
                      <td colSpan={2} className="border p-1 text-xs">
                        {item.valor_total ? `$ ${item.valor_total.toLocaleString('en-US', {
                          minimumFractionDigits: 6,
                          maximumFractionDigits: 6
                        })}` : "—"}
                      </td>
                      <td className="border p-1 text-xs">
                        {item.valor_total_dolares ? `$ ${item.valor_total_dolares.toLocaleString('en-US', {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 4
                        })}` : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {item.numeros_serie && item.numeros_serie.length > 0 && (
                  <div className="grid grid-cols-1 gap-1 border-x border-b mt-1">
                    <div className="p-1 bg-gray-100">
                      <h4 className="font-medium text-xs">Números de serie</h4>
                    </div>
                    
                    <div className="p-1">
                      <p className="text-xs">{item.numeros_serie.join(", ") || "—"}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="bg-gray-200 p-2 flex items-center justify-center">
            <h3 className="text-zinc-700 font-medium text-xs">Información de Valor y de Comercialización</h3>
          </footer>
        </div>
      </div>
    </div>
  );
};
