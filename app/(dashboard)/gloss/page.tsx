import { DUMP_GLOSSES } from "@/app/constants";
import { GlossDataTable, GlossDataTableColumns } from "./components";

const GlossPage = () => {
  return (
    <article className="mt-2">
      <GlossDataTable data={DUMP_GLOSSES} columns={GlossDataTableColumns} />
    </article>
  );
};

export default GlossPage;
