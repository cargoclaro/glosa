'use client';

import type { Cove } from '@/shared/services/customGloss/extract-and-structure/schemas';
import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
import type { InferSelectModel } from 'drizzle-orm';
import { useState } from 'react';
import { CoveViewer } from '~/components/cove/index';
import PedimentoViewer from '~/components/pedimento/pedimento-viewer';
import type { CustomGlossFileTable } from '~/db/schema';
import type {
  CustomGloss,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStep,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStepResources,
} from '~/db/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs';
import { Analysis, SavedNFinish } from '.';

type TabValidation = InferSelectModel<typeof CustomGlossTabValidationStep> & {
  resources: InferSelectModel<typeof CustomGlossTabValidationStepResources>[];
  actionsToTake: InferSelectModel<
    typeof CustomGlossTabValidationStepActionToTake
  >[];
  steps: InferSelectModel<typeof CustomGlossTabValidationStep>[];
};

type TabContext = InferSelectModel<typeof CustomGlossTabContext> & {
  data: InferSelectModel<typeof CustomGlossTabContextData>[];
};

type tabs = InferSelectModel<typeof CustomGlossTab> & {
  context: TabContext[];
  validations: TabValidation[];
  customGloss: InferSelectModel<typeof CustomGloss>;
};

interface IPedimentAnalysisNFinish {
  id: string;
  moneySaved: number;
  tabs: tabs[];
  files: CustomGlossFileTable[];
  cove: Cove | null;
  pedimento: Pedimento | null;
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
      <section className="flex flex-col sm:col-span-2">
        <div className="mb-2">
          <Tabs
            defaultValue="PEDIMENTO"
            value={documentSelected}
            onValueChange={setDocumentSelected}
            className="w-full"
          >
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="PEDIMENTO">Pedimento</TabsTrigger>
                <TabsTrigger value="COVE" disabled={!customGloss.cove}>
                  COVE
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="PEDIMENTO">
              {customGloss.pedimento && (
                <PedimentoViewer
                  pedimento={customGloss.pedimento}
                  tabs={customGloss.tabs}
                  onClick={handleFunction}
                  tabInfoSelected={tabInfoSelected}
                />
              )}
            </TabsContent>
            <TabsContent value="COVE">
              {customGloss.cove && (
                <CoveViewer
                  cove={customGloss.cove}
                  tabs={customGloss.tabs}
                  onClick={handleFunction}
                  tabInfoSelected={tabInfoSelected}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <section className="col-span-1 flex flex-col gap-4 pt-10 sm:col-span-3 lg:col-span-1">
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
