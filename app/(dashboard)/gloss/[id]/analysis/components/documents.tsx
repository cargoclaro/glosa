import { GenericCard } from '@/shared/components';
import { Document } from '@/shared/icons';
import Link from 'next/link';
import type { CustomGlossFileTable } from '~/db/schema';

const Documents = ({ data }: { data: CustomGlossFileTable[] }) => {
  return (
    <GenericCard customClass="">
      <h1 className="flex items-center justify-center gap-2 border-black border-b pb-2 font-semibold">
        <Document />
        Documentos
      </h1>
      <ul className="mt-4 flex flex-col gap-4">
        {data.map((doc) => (
          <li
            key={doc.id}
            title={`Ver documento ${doc.name}`}
            className="truncate rounded-md border border-black p-1 text-center text-sm transition-colors duration-200 hover:bg-gray-200"
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
