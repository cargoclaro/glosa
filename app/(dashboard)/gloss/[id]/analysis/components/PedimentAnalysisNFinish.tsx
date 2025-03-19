'use client';

import type { CustomGlossFileTable } from '~/db/schema';
import type { Prisma } from '@prisma/client';
import { useState } from 'react';
import { Analysis, Pediment, SavedNFinish } from '.';

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
  files: CustomGlossFileTable[];
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
  const [documentSelected, setDocumentSelected] = useState('PEDIMENTO');
  const [tabSelectedFromDocument, setTabSelectedFromDocument] = useState('');
  const customGlossTabs = customGloss.tabs;
  if (customGlossTabs.length === 0) {
    throw new Error('No tabs found');
  }
  const customGlossTab = customGlossTabs[0];
  if (!customGlossTab) {
    throw new Error('No tab found');
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
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="font-bold text-2xl text-gray-800">
            {documentSelected === 'PEDIMENTO' ? 'Pedimento' : 'COVE'}
          </h2>
          <button
            onClick={() =>
              setDocumentSelected(
                documentSelected === 'PEDIMENTO' ? 'COVE' : 'PEDIMENTO'
              )
            }
            className="rounded-md border border-white bg-cargoClaroOrange px-4 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-cargoClaroOrange-hover"
          >
            Cambiar a {documentSelected === 'PEDIMENTO' ? 'COVE' : 'Pedimento'}
          </button>
        </div>
        <Pediment
          tabs={customGloss.tabs}
          onClick={handleFunction}
          tabInfoSelected={tabInfoSelected}
          document={
            customGloss.files.find(
              (doc) =>
                doc.documentType?.toLowerCase() ===
                documentSelected.toLowerCase()
            )?.url || ''
          }
        />
      </section>
      <section className="col-span-1 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
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
