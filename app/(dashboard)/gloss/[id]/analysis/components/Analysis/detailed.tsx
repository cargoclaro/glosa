import {
  Check,
  ChevronDown,
  Database,
  ExternalLink,
  ListChecks,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '~/lib/utils';
import type { TabContext, TabValidation } from '../types';

// Add CSS for custom scrollbar
import './styles.css';

// Define interfaces for our context data
interface ContextItem {
  name: string;
  value?: string;
  description?: string;
}

interface ContextData {
  data: ContextItem[];
}

interface ContextsStructure {
  PROVIDED: Record<string, ContextData>;
  EXTERNAL: Record<string, ContextData>;
}

interface DetailedProps {
  data: TabValidation;
  contexts?: TabContext[];
  onClose: () => void;
}

/**
 * Function to transform database context data into the format needed for our component
 */
const transformContextData = (contexts: TabContext[]): ContextsStructure => {
  // Create the structure with empty PROVIDED and EXTERNAL objects
  const result: ContextsStructure = {
    PROVIDED: {},
    EXTERNAL: {},
  };

  // Process each context
  for (const context of contexts) {
    // We only care about PROVIDED and EXTERNAL types
    if (context.type === 'PROVIDED' || context.type === 'EXTERNAL') {
      const category = context.type;
      const origin = context.origin;

      // Make sure the origin exists in this category
      if (!result[category][origin]) {
        result[category][origin] = { data: [] };
      }

      // Add each context data item
      for (const item of context.data) {
        result[category][origin].data.push({
          name: item.name,
          value: item.value,
          // Description is not directly available in the schema, we could add logic
          // here if we needed to derive a description
        });
      }
    }
  }

  return result;
};

/**
 * Helper function to clean up Markdown text by:
 * - Removing quotes at the beginning
 * - Handling escaped characters
 * - Processing other issues that could affect rendering
 */
const cleanMarkdownText = (text: string | undefined | null): string => {
  if (!text) return '';

  // Remove quotes at the beginning and end if they exist
  let cleanedText = text.trim();
  if (
    (cleanedText.startsWith('"') && cleanedText.endsWith('"')) ||
    (cleanedText.startsWith("'") && cleanedText.endsWith("'"))
  ) {
    cleanedText = cleanedText.substring(1, cleanedText.length - 1);
  }

  // Handle literal "\\n" in JSON strings (double backslashes)
  cleanedText = cleanedText.replace(/\\\\n/g, '\n');

  // Convert escaped newlines to actual newlines
  cleanedText = cleanedText.replace(/\\n/g, '\n');

  // Replace other common escaped characters
  cleanedText = cleanedText.replace(/\\"/g, '"');
  cleanedText = cleanedText.replace(/\\'/g, "'");
  cleanedText = cleanedText.replace(/\\t/g, '\t');

  // Remove "markdown" prefix if it exists
  if (cleanedText.startsWith('markdown')) {
    cleanedText = cleanedText.substring('markdown'.length).trim();
  }

  return cleanedText;
};

/**
 * Helper function to detect if text is likely markdown
 */
const isLikelyMarkdown = (text: string | undefined | null): boolean => {
  if (!text) return false;

  // Check for common markdown indicators
  return (
    text.includes('\n') ||
    text.includes('\\n') ||
    text.includes('**') ||
    text.includes('*') ||
    text.includes('_') ||
    text.includes('#') ||
    text.includes('- ') ||
    text.includes('1. ') ||
    (text.includes('[') && text.includes('](')) ||
    text.includes('```') ||
    text.includes('`') ||
    (text.includes('|') && text.includes('-|-'))
  );
};

const Detailed = ({ data, contexts = [], onClose }: DetailedProps) => {
  const [isLlmExpanded, setIsLlmExpanded] = useState(false);
  const [isActionsExpanded, setIsActionsExpanded] = useState(true);
  const [expandedProvidedContext, setExpandedProvidedContext] = useState<
    Record<string, boolean>
  >({});
  const [expandedExternalContext, setExpandedExternalContext] = useState<
    Record<string, boolean>
  >({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Use real context data if available, otherwise create empty structure
  const contextData =
    contexts.length > 0
      ? transformContextData(contexts)
      : {
          PROVIDED: {},
          EXTERNAL: {},
        };

  const toggleProvidedContext = (contextId: string) => {
    setExpandedProvidedContext((prev) => ({
      ...prev,
      [contextId]: !prev[contextId],
    }));
  };

  const toggleExternalContext = (contextId: string) => {
    setExpandedExternalContext((prev) => ({
      ...prev,
      [contextId]: !prev[contextId],
    }));
  };

  // Function to toggle Actions section
  const toggleActions = () => {
    // If expanding actions, collapse IA analysis
    if (!isActionsExpanded && isLlmExpanded) {
      setIsLlmExpanded(false);
    }
    setIsActionsExpanded(!isActionsExpanded);
  };

  // Function to toggle IA analysis
  const toggleLlmAnalysis = () => {
    // If expanding IA, collapse actions
    if (!isLlmExpanded && isActionsExpanded) {
      setIsActionsExpanded(false);
    }
    setIsLlmExpanded(!isLlmExpanded);
  };

  // Function to truncate text
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };

  // Analysis text truncated to 250 characters (increased from 85)
  const truncatedAnalysis = truncateText(
    data.llmAnalysis || 'No hay análisis disponible',
    250
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="relative flex h-[85vh] w-[90vw] max-w-6xl flex-col rounded-xl bg-white shadow-lg"
      >
        {/* Header */}
        <div
          className={cn(
            'relative rounded-t-xl border-slate-100 border-b px-6 py-5',
            data.isCorrect ? 'bg-green-50' : 'bg-yellow-50'
          )}
        >
          <h1 className="text-center font-semibold text-slate-800 text-xl">
            {data.name || 'Num. Pedimento (15 dígitos)'}
          </h1>

          {/* Close button (X) in the upper right */}
          <button
            onClick={onClose}
            className="-translate-y-1/2 absolute top-1/2 right-4 text-slate-500 transition-colors hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content container with fixed height */}
        <div className="flex min-h-0 flex-1">
          {/* Left sidebar - independently scrollable */}
          <div className="custom-scrollbar w-full overflow-y-auto border-slate-100 border-r md:w-1/3 lg:w-1/4">
            <div className="space-y-8 p-5">
              {/* Provided Context Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-500" />
                  <h2 className="font-medium text-base text-slate-800">
                    Contexto Proporcionado
                  </h2>
                </div>

                {Object.keys(contextData.PROVIDED).length > 0 ? (
                  Object.entries(contextData.PROVIDED).map(
                    ([contextType, contextData]) => (
                      <div
                        key={contextType}
                        className="border-slate-100 border-b"
                      >
                        <button
                          className="flex w-full items-center justify-between px-2 py-3 text-left"
                          onClick={() => toggleProvidedContext(contextType)}
                        >
                          <span className="font-medium text-[14.4px] text-slate-700">
                            {contextType}
                          </span>
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 text-slate-400 transition-transform duration-300',
                              expandedProvidedContext[contextType] &&
                                'rotate-180'
                            )}
                          />
                        </button>

                        <div
                          className={cn(
                            'origin-top transform overflow-hidden transition-all duration-300 ease-out',
                            expandedProvidedContext[contextType]
                              ? 'max-h-[250px] scale-y-100 opacity-100'
                              : 'max-h-0 scale-y-95 opacity-0'
                          )}
                        >
                          <div className="custom-scrollbar max-h-[230px] overflow-y-auto px-2 pb-4">
                            {contextData.data.map((item, index) => (
                              <div
                                key={index}
                                className="mb-3 border-indigo-200 border-l-2 pl-3"
                              >
                                {item.description ? (
                                  <div>
                                    <p className="font-medium text-[12.6px] text-slate-700">
                                      {item.name}
                                    </p>
                                    <p className="mt-1 text-[10.8px] text-slate-600">
                                      {item.description}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col">
                                    <p className="font-medium text-[12.6px] text-slate-700">
                                      {item.name}
                                    </p>
                                    {item.value &&
                                    isLikelyMarkdown(item.value) ? (
                                      <div className="markdown-content mt-1 text-[10.8px] text-indigo-600">
                                        <ReactMarkdown className="text-inherit">
                                          {cleanMarkdownText(item.value)}
                                        </ReactMarkdown>
                                      </div>
                                    ) : (
                                      <p className="mt-1 text-[10.8px] text-indigo-600">
                                        {item.value}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-slate-500 text-sm italic">
                    No se usa contexto proporcionado
                  </p>
                )}
              </div>

              {/* External Context Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-500" />
                  <h2 className="font-medium text-base text-slate-800">
                    Contexto Externo
                  </h2>
                </div>

                {Object.keys(contextData.EXTERNAL).length > 0 ? (
                  Object.entries(contextData.EXTERNAL).map(
                    ([contextType, contextData]) => (
                      <div
                        key={contextType}
                        className="border-slate-100 border-b"
                      >
                        <button
                          className="flex w-full items-center justify-between px-2 py-3 text-left"
                          onClick={() => toggleExternalContext(contextType)}
                        >
                          <span className="font-medium text-[14.4px] text-slate-700">
                            {contextType}
                          </span>
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 text-slate-400 transition-transform duration-300',
                              expandedExternalContext[contextType] &&
                                'rotate-180'
                            )}
                          />
                        </button>

                        <div
                          className={cn(
                            'origin-top transform overflow-hidden transition-all duration-300 ease-out',
                            expandedExternalContext[contextType]
                              ? 'max-h-[250px] scale-y-100 opacity-100'
                              : 'max-h-0 scale-y-95 opacity-0'
                          )}
                        >
                          <div className="custom-scrollbar max-h-[230px] overflow-y-auto px-2 pb-4">
                            {contextData.data.map((item, index) => (
                              <div
                                key={index}
                                className="mb-3 border-purple-200 border-l-2 pl-3"
                              >
                                <div className="flex flex-col">
                                  <p className="font-medium text-[12.6px] text-slate-700">
                                    {item.name}
                                  </p>
                                  {item.value &&
                                  isLikelyMarkdown(item.value) ? (
                                    <div className="markdown-content mt-1 text-[10.8px] text-purple-600">
                                      <ReactMarkdown className="text-inherit">
                                        {cleanMarkdownText(item.value)}
                                      </ReactMarkdown>
                                    </div>
                                  ) : (
                                    <p className="mt-1 text-[10.8px] text-purple-600">
                                      {item.value}
                                    </p>
                                  )}
                                  {item.description && (
                                    <p className="mt-1 text-[10.8px] text-slate-600">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-slate-500 text-sm italic">
                    No se usa contexto externo
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content area - independently scrollable */}
          <div className="custom-scrollbar w-full overflow-y-auto md:w-2/3 lg:w-3/4">
            <div className="space-y-5 p-6">
              {/* IA Analysis - Main content */}
              <div
                className={cn(
                  'overflow-hidden rounded-lg',
                  data.isCorrect ? 'bg-green-50' : 'bg-yellow-50'
                )}
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <div
                    className={cn(
                      '',
                      data.isCorrect ? 'text-green-600' : 'text-yellow-600'
                    )}
                  >
                    {/* Chat bubble icon */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3
                    className={cn(
                      'font-medium text-lg',
                      data.isCorrect ? 'text-green-800' : 'text-yellow-800'
                    )}
                  >
                    Análisis de IA
                  </h3>
                </div>

                <div className="p-4">
                  <div
                    className={cn(
                      'transform overflow-hidden transition-all duration-300 ease-out',
                      isLlmExpanded
                        ? 'max-h-[1000px] translate-y-0 opacity-100'
                        : '-translate-y-0 max-h-[150px] opacity-90'
                    )}
                  >
                    {isLlmExpanded ? (
                      <div>
                        <h4 className="mb-3 font-medium text-slate-700">
                          Análisis Detallado
                        </h4>
                        <div className="custom-scrollbar max-h-[300px] overflow-y-auto pr-2 text-slate-700">
                          <ReactMarkdown className="text-inherit">
                            {cleanMarkdownText(data.llmAnalysis) ||
                              'No hay análisis disponible'}
                          </ReactMarkdown>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            className={cn(
                              'flex items-center text-sm',
                              data.isCorrect
                                ? 'text-green-600 hover:text-green-700'
                                : 'text-yellow-600 hover:text-yellow-700'
                            )}
                            onClick={() => setIsLlmExpanded(false)}
                          >
                            Contraer vista{' '}
                            <span className="ml-1 transition-transform duration-300">
                              ↑
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-700">{truncatedAnalysis}</p>
                        <button
                          className={cn(
                            'mt-3 flex items-center text-sm',
                            data.isCorrect
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-yellow-600 hover:text-yellow-700'
                          )}
                          onClick={toggleLlmAnalysis}
                        >
                          Mostrar más detalles{' '}
                          <span className="ml-1 transition-transform duration-300">
                            ↓
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions to Take Section */}
              <div className="overflow-hidden rounded-lg bg-blue-50">
                <div
                  className="flex cursor-pointer items-center justify-between px-4 py-3"
                  onClick={toggleActions}
                >
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-blue-800 text-sm">
                      Acciones a Realizar
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-blue-600 transition-transform duration-300',
                      isActionsExpanded ? 'rotate-180' : ''
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'transform overflow-hidden transition-all duration-300 ease-out',
                    isActionsExpanded
                      ? 'max-h-[250px] translate-y-0 opacity-100'
                      : '-translate-y-1 max-h-0 opacity-0'
                  )}
                >
                  <div className="px-4 pt-1 pb-4">
                    {data.actionsToTake && data.actionsToTake.length > 0 ? (
                      <ul className="custom-scrollbar max-h-[200px] space-y-3 overflow-y-auto pr-2">
                        {data.actionsToTake.map((action) => (
                          <li
                            key={action.id}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border border-blue-300" />
                            <span className="text-blue-700 text-sm">
                              {action.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="flex items-center text-blue-700 text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Todo parece estar en orden. No se requieren acciones
                        adicionales.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailed;
