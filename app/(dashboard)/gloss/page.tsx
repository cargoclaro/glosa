import { DUMP_GLOSSES } from "@/app/constants";
import { GlossDataTable, GlossDataTableColumns } from "./components";

const GlossPage = () => {
  return (
    <article>
      <GlossDataTable data={DUMP_GLOSSES} columns={GlossDataTableColumns} />
    </article>
  );
};

export default GlossPage;
