import { GlossDataTable, GlossDataTableColumns } from "./components";
import { getMyAnalysis } from "@/app/services/customGloss/controller";
import type { Metadata } from "next";
import type { ICustomGloss } from "@/app/interfaces";

export const metadata: Metadata = {
  title: "Operaciones",
};

const GlossPage = async () => {
  const myGlosses = (await getMyAnalysis()) as ICustomGloss[];
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
