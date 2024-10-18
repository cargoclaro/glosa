import { Document } from "@/public/icons";
import { GenericCard } from "@/app/components";

const Documents = () => {
  const dummyData = [
    {
      id: 1,
      url: "https://dummycloud.com/glosas/files/gloss28/proforma.pdf",
    },
    {
      id: 2,
      url: "https://dummycloud.com/glosas/files/gloss28/ficha_tecnica.pdf",
    },
    {
      id: 3,
      url: "https://dummycloud.com/glosas/files/gloss28/carta_318.pdf",
    },
    {
      id: 4,
      url: "https://dummycloud.com/glosas/files/gloss28/certificado_origen.pdf",
    },
    {
      id: 5,
      url: "https://dummycloud.com/glosas/files/gloss28/sedena.pdf",
    },
  ];
  return (
    <GenericCard customClass="">
      <h1 className="flex justify-center items-center gap-2 font-semibold pb-2 border-b border-black">
        <Document />
        Documentos
      </h1>
      <ul className="mt-4 flex flex-col gap-4">
        {dummyData.map((doc) => (
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
