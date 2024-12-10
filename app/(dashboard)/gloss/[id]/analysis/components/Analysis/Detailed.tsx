import { IRestrictionSelected } from ".";
import ReactMarkdown from "react-markdown";

interface IComparison {
  id: number;
  title: string;
  links: string;
  description: string;
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

const Detailed = ({ restriction }: { restriction: IRestrictionSelected }) => {
  return (
    <>
      <h1
        title={`ANÁLISIS DETALLADO: ${restriction.title}`}
        className="text-center sticky top-2 pb-4 truncate"
      >
        ANÁLISIS DETALLADO:{" "}
        <span className="font-semibold">{restriction.title}</span>
      </h1>
      <div className="border rounded-md border-cargoClaroOrange p-2 flex flex-col gap-4">
        <h2>
          Resultado: <span className="font-medium">{restriction.result}</span>
        </h2>
        <div>
          <h3>Resultados de la comparación:</h3>
          <ol className="flex flex-col gap-2 list-decimal ml-4">
            {JSON.parse(restriction.comparisons).map(
              (comparison: IComparison) => (
                <li key={comparison.id}>
                  <p>{comparison.title}</p>
                  <CustomText text={comparison.description} />
                  <CustomText text={comparison.links[0]} />
                </li>
              )
            )}
          </ol>
        </div>
        <div>
          <h4>Acciones a realizar:</h4>
          <ol className="flex flex-col list-disc ml-4">
            {JSON.parse(restriction.actionsToTake).map(
              (action: IActionsToTake) => (
                <li key={action.id}>
                  <CustomText text={action.description} />
                </li>
              )
            )}
          </ol>
        </div>
        <CustomText text={restriction.summary} />
      </div>
    </>
  );
};

export default Detailed;
