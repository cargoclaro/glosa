import { GlossDataTable, GlossDataTableColumns } from "./components";
import { getMyAnalysis } from "@/app/shared/services/customGloss/controller";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operaciones",
};

const GlossPage = async () => {
  const myGlosses = (await getMyAnalysis());
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
