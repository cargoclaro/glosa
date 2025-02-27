import { isAuthenticated } from "@/app/shared/services/auth";
import { GlossDataTable, GlossDataTableColumns } from "./components";
import type { Metadata } from "next";
import prisma from "@/app/shared/services/prisma";

export const metadata: Metadata = {
  title: "Operaciones",
};

const GlossPage = async () => {
  const session = await isAuthenticated();
  const userId = session["userId"];
  if (typeof userId !== "string") {
    throw new Error("User ID is not a string");
  }
  const myGlosses = await prisma.customGloss.findMany({
    where: { userId },
  });
  if (!myGlosses) {
    return <div>No se encontraron operaciones</div>;
  }
  const data = myGlosses.map((gloss) => ({
    id: gloss.id,
    importerName: gloss.importerName,
    operationStatus: gloss.operationStatus,
  }));
  return (
    <article>
      <GlossDataTable data={data} columns={GlossDataTableColumns} />
    </article>
  );
};

export default GlossPage;
