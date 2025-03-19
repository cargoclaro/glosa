import { LeftArrow } from '@/shared/icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '~/db';

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

const GlossIdPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { id } = params;

  const customGloss = await db.query.CustomGloss.findFirst({
    where: (gloss, { eq }) => eq(gloss.id, id),
    with: {
      files: true,
      alerts: true,
      tabs: {
        with: {
          context: {
            with: {
              data: true,
            },
          },
          validations: {
            with: {
              resources: true,
              actionsToTake: true,
            },
          },
        },
      },
    },
  });
  if (!customGloss) {
    notFound();
  }

  return (
    <article>
      <h1 className="font-bold text-2xl">
        <Link className="inline-flex items-center gap-2" href="/gloss">
          <span>
            <LeftArrow strokeWidth={3} />
          </span>
          Mis Operaciones
        </Link>
      </h1>
      <div className="mt-4 flex flex-col gap-4">
        <p>{customGloss.summary}</p>
        <p>
          <Link
            href={`/gloss/${id}/analysis`}
            className="rounded-md border border-white bg-cargoClaroOrange px-12 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-cargoClaroOrange-hover"
          >
            Ver análisis
          </Link>
        </p>
      </div>
    </article>
  );
};

export default GlossIdPage;
