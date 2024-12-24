import { notFound } from "next/navigation";
import {
  // Alerts,
  Documents,
  PedimentAnalysisNFinish,
} from "./components";
import { getMyAnalysisById } from "@/app/shared/services/customGloss/controller";
import type { Metadata } from "next";
import type { ICustomGloss } from "@/app/shared/interfaces";

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
  if (!customGloss) notFound();

  return (
    <article className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <section className="flex flex-col gap-4">
        {/* <Alerts data={customGloss.alerts} /> */}
        <Documents data={customGloss.files} />
      </section>
      <PedimentAnalysisNFinish
        customGloss={{
          id: customGloss.id,
          tabs: customGloss.tabs,
          moneySaved: customGloss.moneySaved,
        }}
      />
    </article>
  );
};

export default GlossIdAnalysis;
