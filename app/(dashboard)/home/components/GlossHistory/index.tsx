'use client';

import { GenericCard } from '@/shared/components';
import { Clock, RightArrow } from '@/shared/icons';
import Link from 'next/link';
import type { CustomGlossTable } from '~/db/schema';

const GlossHistory = ({ history }: { history: CustomGlossTable[] }) => {
  return (
    <GenericCard customClass="h-full min-h-[500px] flex flex-col">
      <h1 className="font-semibold text-xl flex items-center gap-2">
        <Clock size="size-6" customClass="text-black" />
        Historial Reciente de Glosas
      </h1>
      <div className="my-2 border-gray-300 border-t" />
      {history && history.length > 0 ? (
        <ul className="flex flex-col gap-3 flex-grow">
          {history.map((gloss) => (
            <li key={gloss.id}>
              <Link
                href={`/gloss/${gloss.id}`}
                className="group flex items-center justify-between rounded-xl p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="text-lg">{gloss.importerName}</p>
                  <small className="text-base text-gray-500">
                    {`Operación #${gloss.id}`}
                  </small>
                </div>
                <div className="rounded-xl bg-primary p-2 text-white group-hover:bg-primary/80">
                  <RightArrow size="size-4" strokeWidth={4} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center flex-grow flex flex-col justify-center">
          <p className="font-bold text-lg">No tienes glosas recientes</p>
          <p>{`Comienza a glosar por medio del botón "Nueva Glosa"`}</p>
        </div>
      )}
    </GenericCard>
  );
};

export default GlossHistory;
