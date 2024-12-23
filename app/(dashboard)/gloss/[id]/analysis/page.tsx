import { getMyAnalysisById } from "@/app/shared/services/customGloss/controller";
import {
  // Alerts,
  Analysis,
  // Pediment,
  Documents,
  SavedNFinish,
} from "./components";
import type { Metadata } from "next";
import { ICustomGloss } from "@/app/shared/interfaces";
import { notFound } from "next/navigation";
import NewPdf from "./components/NewPdf";

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
      <section className="sm:col-span-2">
        {/* <Pediment
          document={
            customGloss.files.find((doc) =>
              doc.name === "PEDIMENTO" ? doc : null
            )?.url || ""
          }
        /> */}
        <NewPdf
          // document={
          //   customGloss.files.find((doc) => (doc.name === "PEDIMENTO" ? doc : null))
          //     ?.url || ""
          // }
          document="/PEDIMENTO.pdf"
        />
      </section>
      <section className="flex flex-col gap-4 col-span-1 sm:col-span-3 lg:col-span-1">
        <Analysis tabs={customGloss.tabs} />
        <SavedNFinish
          glossId={customGloss.id}
          moneySaved={customGloss.moneySaved}
        />
      </section>
    </article>
  );
};

export default GlossIdAnalysis;
