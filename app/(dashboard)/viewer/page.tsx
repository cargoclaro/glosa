"use client";

import { useState, useEffect } from "react";
import PedimentoViewer from "~/components/pedimento/PedimentoViewer";
import { mockPedimento } from "~/data/mockPedimento";
import { Pedimento } from "~/types/pedimento";

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [pedimento, setPedimento] = useState<Pedimento | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPedimento(mockPedimento);
      setLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 opacity-0 animate-fadeIn" style={{ animationDelay: "200ms" }}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pedimento
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg">
            Documento aduanal
          </p>
        </div>

        {!loaded ? (
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto h-[600px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-gray-900 animate-spin"></div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Cargando documento...</p>
            </div>
          </div>
        ) : (
          <PedimentoViewer pedimento={pedimento!} className="max-w-5xl mx-auto" />
        )}
      </div>
    </div>
  );
};
