import {
  Alerts,
  Analysis,
  Pediment,
  Documents,
  SavedNFinish,
} from "./components";
import type { Metadata } from "next";

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

const GlossIdAnalysis = () => {
  return (
    <article className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <section className="flex flex-col gap-4">
        <Alerts />
        <Documents />
      </section>
      <section className="sm:col-span-2">
        <Pediment />
      </section>
      <section className="flex flex-col sm:flex-row lg:flex-col gap-4 col-span-1 sm:col-span-3 lg:col-span-1">
        <Analysis />
        <SavedNFinish />
      </section>
    </article>
  );
};

export default GlossIdAnalysis;
