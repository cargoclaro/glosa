import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Check,
  ChevronDown,
  ListChecks,
  Database,
  ExternalLink,
  X
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { TabValidation } from '../types';
import type { InferSelectModel } from 'drizzle-orm';
import type { 
  CustomGlossTabValidationStepResources,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStep
} from '~/db/schema';

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
  onClose: () => void;
}

// Function to transform database context data into the format needed for our component
const transformContextData = (
  contexts: (InferSelectModel<typeof CustomGlossTabContext> & {
    data: InferSelectModel<typeof CustomGlossTabContextData>[];
  })[]
): ContextsStructure => {
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
          // Description is not directly available in the schema, but we could
          // add logic here to set description based on other criteria if needed
        });
      }
    }
  }

  return result;
};

const Detailed = ({ data, onClose }: DetailedProps) => {
  const [isLlmExpanded, setIsLlmExpanded] = useState(false);
  const [isActionsExpanded, setIsActionsExpanded] = useState(true);
  const [expandedProvidedContext, setExpandedProvidedContext] = useState<Record<string, boolean>>({});
  const [expandedExternalContext, setExpandedExternalContext] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  // Use real context data from the database
  const contexts = data.contexts && data.contexts.length > 0 
    ? transformContextData(data.contexts) 
    : {
        PROVIDED: {},
        EXTERNAL: {}
      };

  const toggleProvidedContext = (contextId: string) => {
    setExpandedProvidedContext(prev => ({
      ...prev,
      [contextId]: !prev[contextId]
    }));
  };

  const toggleExternalContext = (contextId: string) => {
    setExpandedExternalContext(prev => ({
      ...prev,
      [contextId]: !prev[contextId]
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
    data.llmAnalysis || "No hay análisis disponible",
    250
  );
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-[90vw] max-w-6xl h-[85vh] flex flex-col relative">
        {/* Header */}
        <div className={cn("py-5 px-6 border-b border-slate-100 rounded-t-xl relative", 
          data.isCorrect ? "bg-green-50" : "bg-yellow-50")}>
          <h1 className="text-xl font-semibold text-slate-800 text-center">
            {data.name || "Num. Pedimento (15 dígitos)"}
          </h1>
          
          {/* Close button (X) in the upper right */}
          <button 
            onClick={onClose} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content container with fixed height */}
        <div className="flex flex-1 min-h-0">
          {/* Left sidebar - independently scrollable */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-100 overflow-y-auto">
            <div className="p-5 space-y-8">
              {/* Provided Context Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-base font-medium text-slate-800">Contexto Proporcionado</h2>
                </div>
                
                {Object.entries(contexts.PROVIDED).length > 0 ? (
                  Object.entries(contexts.PROVIDED).map(([contextType, contextData]) => (
                    <div key={contextType} className="border-b border-slate-100">
                      <button 
                        className="w-full flex items-center justify-between py-3 px-2 text-left"
                        onClick={() => toggleProvidedContext(contextType)}
                      >
                        <span className="text-slate-700 font-medium text-[14.4px]">{contextType}</span>
                        <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-300", 
                          expandedProvidedContext[contextType] && "rotate-180")} />
                      </button>
                      
                      <div className={cn(
                        "overflow-hidden transition-all duration-300 ease-out transform origin-top",
                        expandedProvidedContext[contextType] 
                          ? "max-h-[500px] opacity-100 scale-y-100" 
                          : "max-h-0 opacity-0 scale-y-95"
                      )}>
                        <div className="px-2 pb-4">
                          {contextData.data.map((item, index) => (
                            <div key={index} className="mb-3 border-l-2 border-indigo-200 pl-3">
                              {item.description ? (
                                <div>
                                  <p className="text-[12.6px] font-medium text-slate-700">{item.name}</p>
                                  <p className="text-[10.8px] text-slate-600 mt-1">{item.description}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <p className="text-[12.6px] font-medium text-slate-700">{item.name}</p>
                                  <p className="text-[10.8px] text-indigo-600 mt-1">{item.value}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No hay contexto proporcionado disponible</p>
                )}
              </div>

              {/* External Context Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ExternalLink className="w-5 h-5 text-purple-500" />
                  <h2 className="text-base font-medium text-slate-800">Contexto Externo</h2>
                </div>
                
                {Object.entries(contexts.EXTERNAL).length > 0 ? (
                  Object.entries(contexts.EXTERNAL).map(([contextType, contextData]) => (
                    <div key={contextType} className="border-b border-slate-100">
                      <button 
                        className="w-full flex items-center justify-between py-3 px-2 text-left"
                        onClick={() => toggleExternalContext(contextType)}
                      >
                        <span className="text-slate-700 font-medium text-[14.4px]">{contextType}</span>
                        <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-300", 
                          expandedExternalContext[contextType] && "rotate-180")} />
                      </button>
                      
                      <div className={cn(
                        "overflow-hidden transition-all duration-300 ease-out transform origin-top",
                        expandedExternalContext[contextType] 
                          ? "max-h-[500px] opacity-100 scale-y-100" 
                          : "max-h-0 opacity-0 scale-y-95"
                      )}>
                        <div className="px-2 pb-4">
                          {contextData.data.map((item, index) => (
                            <div key={index} className="mb-3 border-l-2 border-purple-200 pl-3">
                              <div className="flex flex-col">
                                <p className="text-[12.6px] font-medium text-slate-700">{item.name}</p>
                                {item.value && (
                                  <p className="text-[10.8px] text-purple-600 mt-1">{item.value}</p>
                                )}
                                {item.description && (
                                  <p className="text-[10.8px] text-slate-600 mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No hay contexto externo disponible</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Main content area - independently scrollable */}
          <div className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto">
            <div className="p-6 space-y-5">
              {/* IA Analysis - Main content */}
              <div className={cn("rounded-lg overflow-hidden", 
                data.isCorrect ? "bg-green-50" : "bg-yellow-50")}>
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className={cn("", 
                    data.isCorrect ? "text-green-600" : "text-yellow-600")}>
                    {/* Chat bubble icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className={cn("text-lg font-medium", 
                    data.isCorrect ? "text-green-800" : "text-yellow-800")}>Análisis de IA</h3>
                </div>
                
                <div className="p-4">
                  <div className={cn(
                    "transition-all duration-300 ease-out overflow-hidden transform",
                    isLlmExpanded 
                      ? "max-h-[1000px] opacity-100 translate-y-0" 
                      : "max-h-[150px] opacity-90 -translate-y-0"
                  )}>
                    {!isLlmExpanded ? (
                      <div>
                        <p className="text-slate-700">
                          {truncatedAnalysis}
                        </p>
                        <button 
                          className={cn("text-sm flex items-center mt-3", 
                            data.isCorrect ? "text-green-600 hover:text-green-700" : "text-yellow-600 hover:text-yellow-700")}
                          onClick={toggleLlmAnalysis}
                        >
                          Mostrar más detalles <span className="ml-1 transition-transform duration-300">↓</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-3">Análisis Detallado</h4>
                        <div className="text-slate-700">
                          <ReactMarkdown className="text-inherit">{data.llmAnalysis || "No hay análisis disponible"}</ReactMarkdown>
                        </div>
                        <div className="flex justify-end mt-4">
                          <button 
                            className={cn("text-sm flex items-center",
                              data.isCorrect ? "text-green-600 hover:text-green-700" : "text-yellow-600 hover:text-yellow-700")}
                            onClick={() => setIsLlmExpanded(false)}
                          >
                            Contraer vista <span className="ml-1 transition-transform duration-300">↑</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions to Take Section */}
              <div className="bg-blue-50 rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={toggleActions}
                >
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-blue-800">Acciones a Realizar</h3>
                  </div>
                  <ChevronDown 
                    className={cn("h-4 w-4 text-blue-600 transition-transform duration-300", 
                      isActionsExpanded ? "rotate-180" : "")}
                  />
                </div>
                
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-out transform",
                  isActionsExpanded 
                    ? "max-h-[500px] opacity-100 translate-y-0" 
                    : "max-h-0 opacity-0 -translate-y-1"
                )}>
                  <div className="px-4 pb-4 pt-1">
                    {data.actionsToTake && data.actionsToTake.length > 0 ? (
                      <ul className="space-y-3">
                        {data.actionsToTake.map((action) => (
                          <li key={action.id} className="flex items-start gap-3">
                            <div className="w-4 h-4 mt-0.5 border border-blue-300 rounded-full flex-shrink-0" />
                            <span className="text-sm text-blue-700">{action.description}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-700 flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Todo parece estar en orden. No se requieren acciones adicionales.
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
