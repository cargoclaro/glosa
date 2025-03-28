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
      <div className="mb-3 flex items-center gap-2">
        <Clock size="size-6" customClass="text-black" />
        <h1 className="font-semibold text-xl">Historial Reciente de Glosas</h1>
      </div>
      <div className="mb-3 border-gray-200 border-b" />

      {history && history.length > 0 ? (
        <ul className="flex flex-grow flex-col justify-between">
          {displayItems.map((gloss) => (
            <li key={gloss.id} className="py-2">
              <Link
                href={`/gloss/${gloss.id}`}
                className="group flex items-center justify-between rounded-lg p-3 transition-colors duration-200 hover:bg-orange-50"
              >
                <div className="flex-grow">
                  <p className="font-medium text-base text-gray-900">
                    {gloss.importerName}
                  </p>
                  <p className="mt-1 text-gray-500 text-sm">
                    {`Operación #${gloss.id}`}
                  </p>
                </div>
                <div className="flex items-center justify-center rounded-full bg-primary p-2 text-white transition-colors duration-200 group-hover:bg-primary/90">
                  <RightArrow size="size-4" strokeWidth={3} />
                </div>
              </Link>
            </li>
          ))}

          {/* Add placeholder items if we have fewer than 6 items */}
          {placeholdersNeeded > 0 &&
            Array.from({ length: placeholdersNeeded }).map((_, index) => (
              <li key={`placeholder-${index}`} className="py-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex-grow">
                    <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200"></div>
                    <div className="mt-1 h-4 w-32 animate-pulse rounded-md bg-gray-200"></div>
                  </div>
                  <div className="animate-pulse rounded-full bg-gray-200 p-2">
                    <div className="h-4 w-4"></div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="flex flex-grow flex-col justify-center rounded-xl bg-gray-50 p-6 text-center">
          <p className="font-bold text-gray-800 text-lg">
            No tienes glosas recientes
          </p>
          <p className="mt-2 text-gray-600">{`Comienza a glosar por medio del botón "Nueva Glosa"`}</p>
        </div>
      )}
    </GenericCard>
  );
};

export default GlossHistory;
