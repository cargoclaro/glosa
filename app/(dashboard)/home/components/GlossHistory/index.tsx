"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks";
import { RightArrow } from "@/public/icons";
import { DUMP_GLOSSES } from "@/app/constants";
import { GenericCard, GlossHistorySkeleton } from "@/app/components";

const GlossHistory = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
          <GenericCard>
            <h1 className=" font-semibold text-xl">
              Historial Reciente de Glosas
            </h1>
            <div className="border-t border-gray-300 my-2" />
            <ul className="flex flex-col gap-2">
              {DUMP_GLOSSES.slice(0, 3).map((gloss) => (
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
          </GenericCard>
        </>
      ) : (
        <GlossHistorySkeleton />
      )}
    </>
  );
};

export default GlossHistory;
