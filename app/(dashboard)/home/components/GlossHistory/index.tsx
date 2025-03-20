'use client';

import { GenericCard } from '@/shared/components';
import { RightArrow } from '@/shared/icons';
import Link from 'next/link';
import type { CustomGlossTable } from '~/db/schema';

const GlossHistory = ({ history }: { history: CustomGlossTable[] }) => {
  return (
    <GenericCard>
      <h1 className=" font-semibold text-xl">Historial Reciente de Glosas</h1>
      <div className="my-2 border-gray-300 border-t" />
      {history && history.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {history.map((gloss) => (
            <li key={gloss.id}>
              <Link
                href={`/gloss/${gloss.id}`}
                className="group flex items-center justify-between rounded-xl p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="text-lg">{'Operación #' + gloss.id}</p>
                  <small className="text-base text-gray-500">
                    {gloss.importerName}
                  </small>
                </div>
                <div className="rounded-xl bg-cargoClaroOrange p-2 text-white group-hover:bg-cargoClaroOrange-hover">
                  <RightArrow size="size-4" strokeWidth={4} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center">
          <p className="font-bold text-lg">No tienes glosas recientes</p>
          <p>{`Comienza a glosar por medio del botón "Nueva Glosa"`}</p>
        </div>
      )}
    </GenericCard>
  );
};

export default GlossHistory;
