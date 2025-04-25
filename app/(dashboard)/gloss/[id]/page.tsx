import { LeftArrow } from '@/shared/icons';
import { Square2x2 } from '@/shared/icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PDFCarouselViewer } from '~/components/pdf-carousel';
import { db } from '~/db';

type IDynamicMetadata = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: IDynamicMetadata): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Documentos de Operación ${id}`,
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

  // Find importer name if it exists in the context data
  let importerName = '';
  if (customGloss.tabs?.length > 0) {
    for (const tab of customGloss.tabs) {
      if (tab.context?.length > 0) {
        for (const context of tab.context) {
          if (context.data?.length > 0) {
            for (const data of context.data) {
              if (
                data.name.toLowerCase().includes('importador') ||
                data.name.toLowerCase().includes('razon_social')
              ) {
                importerName = data.value || '';
                break;
              }
            }
          }
          if (importerName) break;
        }
      }
      if (importerName) break;
    }
  }

  // Use the importerName from the CustomGloss if it exists
  if (!importerName && customGloss.importerName) {
    importerName = customGloss.importerName;
  }

  // Fallback importer name
  if (!importerName) {
    importerName = `Operación ${id}`;
  }

  // Use the files from the database
  const files = customGloss.files || [];

  return (
    <article className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">
          <Link className="inline-flex items-center gap-2" href="/gloss">
            <span className="inline-flex items-center">
              <LeftArrow
                size="size-6"
                strokeWidth={2}
                customClass="text-orange-500 mr-2"
              />
              <Square2x2
                size="size-6"
                strokeWidth={2}
                customClass="text-orange-500"
                isFilled={true}
              />
            </span>
            Mis Operaciones
          </Link>
        </h1>
        <Link
          href={`/gloss/${id}/analysis`}
          className="rounded-md border border-white bg-primary px-6 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-primary/80"
        >
          Ver análisis detallado
        </Link>
      </div>

      {/* PDF Carousel Viewer */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <PDFCarouselViewer files={files} importerName={importerName} />
      </div>
    </article>
  );
};

export default GlossIdPage;
