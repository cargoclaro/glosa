import { getMyAnalysisById } from "@/app/services/customGloss/controller";
import {
  Alerts,
  Analysis,
  Pediment,
  Documents,
  SavedNFinish,
} from "./components";
import type { Metadata } from "next";
import { ICustomGloss } from "@/app/interfaces";

type IDynamicMetadata = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: IDynamicMetadata): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Análisis de Glosa ${id}`,
  };
}

const GlossIdAnalysis = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const customGloss = (await getMyAnalysisById(id)) as ICustomGloss;
  return (
    <article className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <section className="flex flex-col gap-4">
        <Alerts data={customGloss.alerts} />
        <Documents data={customGloss.files} />
      </section>
      <section className="sm:col-span-2">
        <Pediment
          document={
            customGloss.files.find((doc) =>
              doc.url.toLowerCase().includes("pedimento")
            )?.url || ""
          }
        />
      </section>
      <section className="flex flex-col sm:flex-row lg:flex-col gap-4 col-span-1 sm:col-span-3 lg:col-span-1">
        <Analysis
          type={customGloss.analysisType}
          isVerified={customGloss.isVerified}
          taxes={customGloss.customGlossTaxes}
          restrictionsNRegulations={
            customGloss.customGlossNonTariffRestrictionNRegulations
          }
        />
        <SavedNFinish
          glossId={customGloss.id}
          moneySaved={customGloss.moneySaved}
        />
      </section>
    </article>
  );
};

export default GlossIdAnalysis;
