"use client";

import { useState } from "react";
import { Pediment, Analysis, SavedNFinish } from ".";
import type { ICustomGloss, ICustomGlossTab } from "@/app/shared/interfaces";

interface IPedimentAnalysisNFinish {
  id: string;
  moneySaved: number;
  tabs: ICustomGlossTab[];
  files: ICustomGloss["files"]; // THIS OPTIONAL WILL CHANGE TO REQUIRED
}

const PedimentAnalysisNFinish = ({
  customGloss,
}: {
  customGloss: IPedimentAnalysisNFinish;
}) => {
  const [tabSelectedFromDocument, setTabSelectedFromDocument] = useState("");

  const handleFunction = (tab: string) => {
    setTabSelectedFromDocument(tab);
  };

  return (
    <>
      <section className="sm:col-span-2">
        <Pediment
          onClick={handleFunction}
          // document="https://drive.google.com/uc?export=download&id=1_MPjjVK1TgmZISo29rx5_3XkWjo1Ub1j"
          // document="/ANOTHER_PEDIMENT4.pdf"
          document={
            customGloss.files.find((doc) =>
              doc.name === "PEDIMENTO" ? doc : null
            )?.url || ""
          }
        />
      </section>
      <section className="flex flex-col gap-4 col-span-1 sm:col-span-3 lg:col-span-1">
        <Analysis
          tabs={customGloss.tabs}
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
