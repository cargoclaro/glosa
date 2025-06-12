'use client';

import React from 'react';
import type {
  Cove,
  Pedimento,
} from '@/shared/services/customGloss/extract-and-structure/schemas';
import { useState } from 'react';
import { CoveViewer } from '~/components/cove/index';
import PedimentoViewer from '~/components/pedimento/pedimento-viewer';
import type { CustomGlossFileTable, RiskAnalysisTable } from '~/db/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs';
import { Analysis, SavedNFinish } from '.';
import type { Tabs as GlossTabs, ITabInfoSelected } from './types';
import RiskAnalysisAlert from './risk-analysis-alert';

interface IPedimentAnalysisNFinish {
  id: string;
  moneySaved: number;
  tabs: GlossTabs[];
  files: CustomGlossFileTable[];
  cove: Cove | null;
  pedimento: Pedimento | null;
  risks: RiskAnalysisTable[];
}

const PedimentAnalysisNFinish = ({
  customGloss,
}: {
  customGloss: IPedimentAnalysisNFinish;
}) => {
  const [showRisk, setShowRisk] = useState(true);
  const [documentSelected, setDocumentSelected] = useState('PEDIMENTO');
  const [tabSelectedFromDocument, setTabSelectedFromDocument] = useState('');
  const customGlossTab = customGloss.tabs[0];
  if (!customGlossTab) {
    return (
      <section className="col-span-full flex flex-col items-center justify-center gap-4 py-10">
        <p className="text-center text-sm text-slate-600">
          La glosa aún se está procesando. Por favor, vuelve a intentarlo en unos
          minutos.
        </p>
      </section>
    );
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
      <RiskAnalysisAlert
        open={showRisk}
        onOpenChange={setShowRisk}
        risks={customGloss.risks}
      />
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
