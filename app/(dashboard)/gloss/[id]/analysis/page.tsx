import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '~/db';
import { Documents, PedimentAnalysisNFinish } from './components';

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

const GlossIdAnalysis = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const params = await props.params;

  const { id } = params;

  const { userId } = await auth.protect();
  const customGloss = await db.query.CustomGloss.findFirst({
    where: (gloss, { eq, and }) =>
      and(eq(gloss.id, id), eq(gloss.userId, userId)),
    with: {
      files: {
        with: {
          customGloss: true,
        },
      },
      alerts: {
        with: {
          customGloss: true,
        },
      },
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
              steps: true,
            },
          },
          customGloss: true,
        },
      },
    },
  });
  if (!customGloss) {
    notFound();
  }

  return (
    <article className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <section className="flex flex-col gap-4">
        <div className="mx-auto w-full">
          <Link
            href="/"
            className="rounded-md border border-black px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-100"
          >
            Home
          </Link>
        </div>
        <Documents data={customGloss.files} />
      </section>
      <PedimentAnalysisNFinish
        customGloss={{
          id: customGloss.id,
          tabs: customGloss.tabs,
          files: customGloss.files,
          moneySaved: customGloss.moneySaved,
        }}
      />
    </article>
  );
};

export default GlossIdAnalysis;
