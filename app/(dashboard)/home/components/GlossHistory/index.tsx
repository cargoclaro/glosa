'use client';

import { GenericCard } from '@/shared/components';
import { Clock, RightArrow } from '@/shared/icons';
import Link from 'next/link';
import type { CustomGlossTable } from '~/db/schema';

const GlossHistory = ({ history }: { history: CustomGlossTable[] }) => {
  return (
    <GenericCard customClass="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock size="size-6" customClass="text-black" />
        <h1 className="font-semibold text-xl">Historial Reciente de Glosas</h1>
      </div>
      <div className="border-gray-200 border-b mb-4" />
      
      {history && history.length > 0 ? (
        <ul className="flex flex-col flex-grow space-y-3">
          {history.map((gloss) => (
            <li key={gloss.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              <Link
                href={`/gloss/${gloss.id}`}
                className="group flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors duration-200 p-3"
              >
                <div className="flex-grow">
                  <p className="text-base font-medium text-gray-900">{gloss.importerName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {`Operación #${gloss.id}`}
                  </p>
                </div>
                <div className="rounded-full bg-primary p-2 text-white group-hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center">
                  <RightArrow size="size-4" strokeWidth={3} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center flex-grow flex flex-col justify-center p-6 bg-gray-50 rounded-xl">
          <p className="font-bold text-lg text-gray-800">No tienes glosas recientes</p>
          <p className="text-gray-600 mt-2">{`Comienza a glosar por medio del botón "Nueva Glosa"`}</p>
        </div>
      )}
    </GenericCard>
  );
};

export default GlossHistory;
