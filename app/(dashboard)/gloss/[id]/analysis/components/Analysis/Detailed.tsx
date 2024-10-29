import { IRestrictionSelected } from ".";
import ReactMarkdown from "react-markdown";

interface IComparison {
  id: number;
  title: string;
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
      <h1 className="text-center">
        ANÁLISIS DETALLADO:{" "}
        <span className="font-semibold">{restriction.title}</span>
      </h1>
      <div className="border rounded-md border-cargoClaroOrange p-2 mt-4">
        <h2>
          Resultado: <span className="font-medium">{restriction.result}</span>
        </h2>
        <h3 className="mt-4 mb-2">Resultados de la comparación:</h3>
        <ol className="flex flex-col gap-4">
          {JSON.parse(restriction.comparisons).map(
            (comparison: IComparison) => (
              <li key={comparison.id}>
                <p>{comparison.title}</p>
                <CustomText text={comparison.description} />
              </li>
            )
          )}
        </ol>
        <h4 className="mt-4 mb-2">Acciones a realizar:</h4>
        <ol className="flex flex-col list-disc">
          {JSON.parse(restriction.actionsToTake).map(
            (action: IActionsToTake) => (
              <li key={action.id}>
                <CustomText text={action.description} />
              </li>
            )
          )}
        </ol>
      </div>
    </>
  );
};

export default Detailed;
