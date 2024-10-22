import { DUMP_GLOSSES } from "@/app/constants";
import { GlossDataTable, GlossDataTableColumns } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operaciones",
};

const GlossPage = () => {
  return (
    <article>
      <GlossDataTable data={DUMP_GLOSSES} columns={GlossDataTableColumns} />
    </article>
  );
};

export default GlossPage;
