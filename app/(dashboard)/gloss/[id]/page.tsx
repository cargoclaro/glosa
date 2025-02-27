import Link from "next/link";
import { notFound } from "next/navigation";
import { LeftArrow } from "@/app/shared/icons";
import type { Metadata } from "next";
import { isAuthenticated } from "@/app/shared/services/auth";
import prisma from "@/app/shared/services/prisma";

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
  const session = await isAuthenticated();
  const userId = session["userId"];
  if (typeof userId !== "string") {
    throw new Error("User ID is not a string");
  }
  const customGloss = await prisma.customGloss.findUnique({
    where: { id, userId },
    include: {
      files: true,
      alerts: true,
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
            },
          },
        },
      },
    },
  });
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
