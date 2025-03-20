'use client';

import { useEffect, useState } from 'react';
import PedimentoViewer from '~/components/pedimento/PedimentoViewer';
import { mockPedimento } from '~/data/mockPedimento';
import type { Pedimento } from '~/types/pedimento';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className="mb-12 animate-fadeIn text-center opacity-0"
          style={{ animationDelay: '200ms' }}
        >
          <h1 className="font-bold text-4xl text-gray-900 tracking-tight sm:text-5xl">
            Pedimento
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg">
            Documento aduanal
          </p>
        </div>

        {loaded ? (
          <PedimentoViewer
            pedimento={pedimento!}
            className="mx-auto max-w-5xl"
          />
        ) : (
          <div className="mx-auto flex h-[600px] max-w-4xl items-center justify-center rounded-lg bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="relative h-16 w-16">
                <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                  <div className="h-16 w-16 animate-spin rounded-full border-gray-900 border-t-2 border-b-2"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-500 text-sm">
                Cargando documento...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
