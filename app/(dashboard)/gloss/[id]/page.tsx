import Link from "next/link";
import { LeftArrow } from "@/public/icons";
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
      GlossIdPage {id}
      <Link href={`/gloss/${id}/analysis`}>Analysis</Link>
    </article>
  );
};

export default GlossIdPage;
