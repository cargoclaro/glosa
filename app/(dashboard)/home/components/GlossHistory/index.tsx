"use client";

import { GenericCard } from "@/app/components";
import { useAuth } from "@/app/hooks";

const GlossHistory = () => {
  const { user } = useAuth();
  console.log(user);

  // THIS WILL BE REPLACED BY THE REAL DATA FROM THE USER
  const dumpGloses = [
    {
      id: 1,
      importerName: "Nissan",
    },
    {
      id: 2,
      importerName: "Cablemex",
    },
    {
      id: 3,
      importerName: "Daniel González",
    },
  ];

  return (
    <GenericCard>
      <h1 className=" font-semibold text-xl">Historial Reciente de Glosas</h1>
      <div className="border-t border-gray-300 my-2" />
      <ul>
        {dumpGloses.map((gloss) => (
          <li key={gloss.id} className="flex justify-between">
            <span>{gloss.importerName}</span>
            <button className="px-4">Ver</button>
          </li>
        ))}
      </ul>
    </GenericCard>
  );
};

export default GlossHistory;
