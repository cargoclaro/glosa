import Link from "next/link";
import { notFound } from "next/navigation";
import { LeftArrow } from "@/app/shared/icons";
import { getMyAnalysisById } from "@/app/shared/services/customGloss/controller";
import type { Metadata } from "next";

type IDynamicMetadata = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: IDynamicMetadata): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Resumen de Glosa ${id}`,
  };
}

const GlossIdPage = async ({ params: { id } }: { params: { id: string } }) => {
  const customGloss = (await getMyAnalysisById(id));
  if (!customGloss) notFound();

  return (
    <article>
      <h1 className="text-2xl font-bold">
        <Link className="inline-flex items-center gap-2" href="/gloss">
          <span>
            <LeftArrow strokeWidth={3} />
          </span>
          Mis Operaciones
        </Link>
      </h1>
      <div className="flex flex-col gap-4 mt-4">
        <p>{customGloss.summary}</p>
        <p>
          <Link
            href={`/gloss/${id}/analysis`}
            className="px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
          >
            Ver análisis
          </Link>
        </p>
      </div>
    </article>
  );
};

export default GlossIdPage;
