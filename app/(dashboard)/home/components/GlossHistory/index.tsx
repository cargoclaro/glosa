'use client';

import { GenericCard } from '@/shared/components';
import { Clock, RightArrow } from '@/shared/icons';
import Link from 'next/link';
import type { CustomGlossTable } from '~/db/schema';

const GlossHistory = ({ history }: { history: CustomGlossTable[] }) => {
  // Ensure we always have exactly 6 items to display
  const displayItems = history && history.length > 0 ? history.slice(0, 6) : [];
  const placeholdersNeeded = Math.max(0, 6 - displayItems.length);
  
  return (
    <GenericCard customClass="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Clock size="size-6" customClass="text-black" />
        <h1 className="font-semibold text-xl">Historial Reciente de Glosas</h1>
      </div>
      <div className="border-gray-200 border-b mb-3" />
      
      {history && history.length > 0 ? (
        <ul className="flex flex-col flex-grow justify-between">
          {displayItems.map((gloss) => (
            <li key={gloss.id} className="py-2">
              <Link
                href={`/gloss/${gloss.id}`}
                className="group flex items-center justify-between hover:bg-orange-50 rounded-lg transition-colors duration-200 p-3"
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
          
          {/* Add placeholder items if we have fewer than 6 items */}
          {placeholdersNeeded > 0 && Array.from({ length: placeholdersNeeded }).map((_, index) => (
            <li key={`placeholder-${index}`} className="py-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-grow">
                  <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse mt-1"></div>
                </div>
                <div className="rounded-full bg-gray-200 p-2 animate-pulse">
                  <div className="h-4 w-4"></div>
                </div>
              </div>
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
