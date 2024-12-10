import { Document } from "@/public/icons";
import { GenericCard } from "@/app/components";
import { ICustomGloss } from "@/app/interfaces";

const Documents = ({ data }: { data: ICustomGloss["files"] }) => {
  return (
    <GenericCard customClass="">
      <h1 className="flex justify-center items-center gap-2 font-semibold pb-2 border-b border-black">
        <Document />
        Documentos
      </h1>
      <ul className="mt-4 flex flex-col gap-4">
        {data.map((doc) => (
          <li
            key={doc.id}
            title={doc.url.substring(doc.url.lastIndexOf("/") + 1)}
            className="rounded-md p-1 border border-black truncate text-sm text-center"
          >
            {doc.url.substring(doc.url.lastIndexOf("/") + 1)}
          </li>
        ))}
      </ul>
    </GenericCard>
  );
};

export default Documents;
