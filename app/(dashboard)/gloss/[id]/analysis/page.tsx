import prisma from '@/shared/services/prisma';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

const GlossIdAnalysis = async (
  props: {
    params: Promise<{ id: string }>;
  }
) => {
  const params = await props.params;

  const {
    id
  } = params;

  const { userId } = await auth.protect();
  const customGloss = await prisma.customGloss.findUnique({
    where: { id, userId },
    include: {
      files: {
        include: {
          customGloss: true,
        },
      },
      alerts: {
        include: {
          customGloss: true,
        },
      },
      tabs: {
        include: {
          context: {
            include: {
              data: true,
            },
          },
          validations: {
            include: {
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
  if (!customGloss) notFound();

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
