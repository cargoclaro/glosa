"use client";

import { useState } from "react";
import { Pediment, Analysis, SavedNFinish } from ".";
import { CustomGlossFile } from "@prisma/client";
import { Prisma } from "@prisma/client";

type tabs = Prisma.CustomGlossTabGetPayload<{
  include: {
    context: {
      include: { data: true };
    };
    validations: {
      include: {
        resources: true;
        actionsToTake: true;
        steps: true;
      };
    };
    customGloss: true;
  };
}>;

interface IPedimentAnalysisNFinish {
  id: string;
  moneySaved: number;
  tabs: tabs[];
  files: CustomGlossFile[];
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
  const customGlossTabs = customGloss.tabs;
  if (customGlossTabs.length === 0) {
    throw new Error("No tabs found");
  }
  const customGlossTab = customGlossTabs[0];
  if (!customGlossTab) {
    throw new Error("No tab found");
  }
  const { name, isCorrect, isVerified } = customGlossTab;
  const [tabInfoSelected, setTabInfoSelected] = useState<ITabInfoSelected>({
    name,
    isCorrect,
    isVerified,
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
          document={
            customGloss.files.find((doc) => doc.name.toLowerCase().includes(documentSelected.toLowerCase()))
              ?.url || ""
          }
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
