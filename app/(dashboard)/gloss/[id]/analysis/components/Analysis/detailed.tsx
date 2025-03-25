import ReactMarkdown from 'react-markdown';

interface IResource {
  id: number;
  link: string | null;
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

import type { InferSelectModel } from 'drizzle-orm';
import type { CustomGlossTabValidationStep } from '~/db/schema';

type validation = InferSelectModel<typeof CustomGlossTabValidationStep> & {
  resources: Array<{ id: number; link: string | null }>;
  actionsToTake: Array<{ id: number; description: string }>;
};

const Detailed = ({ data }: { data: validation }) => {
  return (
    <>
      <h1
        title={`ANÁLISIS DETALLADO: ${data.name}`}
        className="sticky top-2 truncate pb-4 text-center"
      >
        ANÁLISIS DETALLADO: <span className="font-semibold">{data.name}</span>
      </h1>
      <div className="flex flex-col gap-4 rounded-md border border-cargoClaroOrange p-2">
        <h2>
          Análisis:{' '}
          <span className="font-medium">
            {data.llmAnalysis ? (
              <ReactMarkdown>{data.llmAnalysis}</ReactMarkdown>
            ) : (
              ''
            )}
          </span>
        </h2>
        <div>
          <h4>Acciones a realizar:</h4>
          <ol className="ml-4 flex list-disc flex-col">
            {data.actionsToTake.map((action: IActionsToTake) => (
              <li key={action.id}>
                <CustomText text={action.description} />
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Referencias:</h3>
          <ol className="ml-4 flex list-decimal flex-col gap-2">
            {data.resources.map((resource: IResource) => (
              <li key={resource.id}>
                <CustomText text={resource.link ?? 'Sin enlace'} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Detailed;
