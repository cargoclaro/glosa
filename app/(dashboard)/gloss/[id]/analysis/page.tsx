import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '~/db';
import { Documents, PedimentAnalysisNFinish } from './components';
import type { Tabs } from './components/types';

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
            className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 p-1.5 text-xs shadow-sm transition-colors duration-200 hover:bg-orange-100"
            aria-label="Back to home"
            title="Back to home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
        <Documents data={customGloss.files} />
      </section>
      <PedimentAnalysisNFinish
        customGloss={{
          id: customGloss.id,
          tabs: customGloss.tabs as unknown as Tabs[],
          files: customGloss.files,
          moneySaved: customGloss.moneySaved,
          coves: customGloss.cove || [], // Pasar todos los COVEs
          pedimento: customGloss.pedimento,
        }}
      />
    </article>
  );
};

export default GlossIdAnalysis;
