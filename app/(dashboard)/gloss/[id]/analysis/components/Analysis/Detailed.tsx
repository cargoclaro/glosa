import type { ICustomGlossTabValidation } from "@/app/shared/interfaces";
import ReactMarkdown from "react-markdown";

interface IResource {
  id: number;
  link: string;
}

interface IActionsToTake {
  id: number;
  description: string;
}

const CustomText = ({ text }: { text: string }) => (
  <ReactMarkdown
    components={{
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      a: ({ ...props }) => (
        <a
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      ),
    }}
  >
    {text}
  </ReactMarkdown>
);

const Detailed = ({ data }: { data: ICustomGlossTabValidation }) => {
  return (
    <>
      <h1
        title={`ANÁLISIS DETALLADO: ${data.name}`}
        className="text-center sticky top-2 pb-4 truncate"
      >
        ANÁLISIS DETALLADO: <span className="font-semibold">{data.name}</span>
      </h1>
      <div className="border rounded-md border-cargoClaroOrange p-2 flex flex-col gap-4">
        <h2>
          Análisis: <span className="font-medium">{data.llmAnalysis}</span>
        </h2>
        <div>
          <h4>Acciones a realizar:</h4>
          <ol className="flex flex-col list-disc ml-4">
            {JSON.parse(JSON.stringify(data.actionsToTake)).map(
              (action: IActionsToTake) => (
                <li key={action.id}>
                  <CustomText text={action.description} />
                </li>
              )
            )}
          </ol>
        </div>
        <div>
          <h3>Referencias:</h3>
          <ol className="flex flex-col gap-2 list-decimal ml-4">
            {JSON.parse(JSON.stringify(data.resources)).map(
              (resource: IResource) => (
                <li key={resource.id}>
                  <CustomText text={resource.link} />
                </li>
              )
            )}
          </ol>
        </div>
        <CustomText text={data.summary} />
      </div>
    </>
  );
};

export default Detailed;
