"use client";

import Link from "next/link";
import { RightArrow } from "@/app/shared/icons";
import { GenericCard } from "@/app/shared/components";
import { CustomGloss } from "@prisma/client";

const GlossHistory = ({ history }: { history: CustomGloss[] }) => {
  return (
    <GenericCard>
      <h1 className=" font-semibold text-xl">
        Historial Reciente de Glosas
      </h1>
      <div className="border-t border-gray-300 my-2" />
      {history && history.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {history.map((gloss) => (
            <li key={gloss.id}>
              <Link
                href={`/gloss/${gloss.id}`}
                className="flex justify-between items-center group hover:bg-gray-50 p-2 rounded-xl"
              >
                <div>
                  <p className="text-lg">{"Operación #" + gloss.id}</p>
                  <small className="text-base text-gray-500">
                    {gloss.importerName}
                  </small>
                </div>
                <div className="p-2 text-white bg-cargoClaroOrange group-hover:bg-cargoClaroOrange-hover rounded-xl">
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
