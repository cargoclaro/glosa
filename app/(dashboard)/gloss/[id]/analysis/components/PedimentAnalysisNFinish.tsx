"use client";

import { useState } from "react";
import { Pediment, Analysis, SavedNFinish } from ".";
import type { ICustomGloss, ICustomGlossTab } from "@/app/shared/interfaces";

interface IPedimentAnalysisNFinish {
  id: string;
  moneySaved: number;
  tabs: ICustomGlossTab[];
  files: ICustomGloss["files"];
}

export interface ITabInfoSelected {
  name: string;
  isCorrect: boolean;
  isVerified: boolean;
}

const PedimentAnalysisNFinish = ({
  customGloss,
}: {
  customGloss: IPedimentAnalysisNFinish;
}) => {
  const [documentSelected, setDocumentSelected] = useState("PEDIMENTO");
  const [tabSelectedFromDocument, setTabSelectedFromDocument] = useState("");
  const [tabInfoSelected, setTabInfoSelected] = useState<ITabInfoSelected>({
    name: customGloss.tabs[0].name,
    isCorrect: customGloss.tabs[0].isCorrect,
    isVerified: customGloss.tabs[0].isVerified,
  });

  const handleFunction = (tab: string) => {
    setTabSelectedFromDocument(tab);
  };

  return (
    <>
      <section className="sm:col-span-2">
        <div className="flex gap-2 justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {documentSelected === "PEDIMENTO" ? "Pedimento" : "COVE"}
          </h2>
          <button
            onClick={() =>
              setDocumentSelected(
                documentSelected === "PEDIMENTO" ? "COVE" : "PEDIMENTO"
              )
            }
            className="px-4 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
          >
            Cambiar a {documentSelected === "PEDIMENTO" ? "COVE" : "Pedimento"}
          </button>
        </div>
        <Pediment
          tabs={customGloss.tabs}
          onClick={handleFunction}
          tabInfoSelected={tabInfoSelected}
          // document="/PEDIMENT500.pdf"
          // document="/PEDIMENTO.pdf"
          document={`https://cargo-claro-fastapi-6z19.onrender.com/proxy-file?url=${
            customGloss.files.find((doc) =>
              doc.name === documentSelected ? doc : null
            )?.url || ""
          }`}
        />
      </section>
      <section className="flex flex-col gap-4 col-span-1 sm:col-span-3 lg:col-span-1">
        <Analysis
          tabs={customGloss.tabs}
          setTabInfoSelected={setTabInfoSelected}
          tabSelectedFromDocument={tabSelectedFromDocument}
        />
        <SavedNFinish
          glossId={customGloss.id}
          moneySaved={customGloss.moneySaved}
        />
      </section>
    </>
  );
};

export default PedimentAnalysisNFinish;
