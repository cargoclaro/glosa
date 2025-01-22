import { Document } from "@/app/shared/icons";
import { GenericCard } from "@/app/shared/components";
import { ICustomGloss } from "@/app/shared/interfaces";
import Link from "next/link";

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
            title={`Ver documento ${doc.name}`}
            className="rounded-md p-1 border border-black truncate text-sm text-center hover:bg-gray-200 transition-colors duration-200"
          >
            <Link href={doc.url} target="_blank" rel="noreferrer">
              <p>{doc.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </GenericCard>
  );
};

export default Documents;
