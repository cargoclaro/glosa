import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Check,
  ChevronDown,
  FileText,
  ListChecks
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { TabValidation } from '../types';
import type { InferSelectModel } from 'drizzle-orm';
import type { 
  CustomGlossTabValidationStepResources
} from '~/db/schema';

const Detailed = ({ data }: { data: TabValidation }) => {
  const [isLlmExpanded, setIsLlmExpanded] = useState(false);
  const [expandedDocuments, setExpandedDocuments] = useState<Record<string, boolean>>({});
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  
  // Group resources by document type or source
  const resourcesByType = data.resources?.reduce((acc, resource) => {
    const type = resource.name || 'Otro';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(resource);
    return acc;
  }, {} as Record<string, InferSelectModel<typeof CustomGlossTabValidationStepResources>[]>) || {};

  const toggleDocument = (docId: string) => {
    setExpandedDocuments(prev => ({
      ...prev,
      [docId]: !prev[docId]
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
  
  // Analysis text truncated to 85 characters
  const truncatedAnalysis = truncateText(
    data.llmAnalysis || "No hay análisis disponible",
    85
  );
  
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header without close button */}
      <div className="relative py-5 px-6 border-b border-slate-100 bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-800 text-center">
          {data.name || "Num. Pedimento (15 dígitos)"}
        </h1>
      </div>
      
      <div className={cn("grid grid-cols-1 md:grid-cols-7 gap-0", isLlmExpanded && "grid-cols-1")}>
        {/* Left column - Documents */}
        <div className={cn("md:col-span-2 border-r border-slate-100", isLlmExpanded && "hidden")}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-medium text-slate-800">Documentos</h2>
            </div>
            
            {/* Render documents from resources */}
            {Object.entries(resourcesByType).map(([docType, resources]) => (
              <div key={docType} className="border-b border-slate-100">
                <button 
                  className="w-full flex items-center justify-between py-3 px-2 text-left"
                  onClick={() => toggleDocument(docType)}
                >
                  <span className="text-slate-700 font-medium">{docType}</span>
                  <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", 
                    expandedDocuments[docType] && "rotate-180")} />
                </button>
                
                {expandedDocuments[docType] && (
                  <div className="px-2 pb-4">
                    {resources.map((resource) => (
                      <div key={resource.id} className="mb-2">
                        <p className="text-sm text-slate-600">
                          {resource.name}
                        </p>
                        {resource.link && (
                          <a 
                            href={resource.link} 
                            className="block mt-1 text-xs text-blue-500 hover:underline"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Ver documento
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Show a message if no documents are available */}
            {Object.keys(resourcesByType).length === 0 && (
              <div className="text-center py-4 text-sm text-slate-500">
                No hay referencias de documentos disponibles
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Analysis */}
        <div className={cn("md:col-span-5 p-6 space-y-5", isLlmExpanded && "md:col-span-7")}>
          {/* IA Analysis - Main content */}
          <div className="bg-orange-50 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="text-orange-600">
                {/* Chat bubble icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-orange-800">Análisis de IA</h3>
            </div>
            
            <div className="p-4">
              {!isLlmExpanded ? (
                <p className="text-slate-700">
                  {truncatedAnalysis}
                </p>
              ) : (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Análisis Detallado</h4>
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <ReactMarkdown>{data.llmAnalysis || "No hay análisis disponible"}</ReactMarkdown>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button 
                      className="text-orange-600 text-sm flex items-center hover:text-orange-700"
                      onClick={() => setIsLlmExpanded(false)}
                    >
                      Contraer vista <span className="ml-1">↑</span>
                    </button>
                  </div>
                </div>
              )}
              
              {!isLlmExpanded && !isActionsExpanded && (
                <button 
                  className="text-orange-600 text-sm flex items-center mt-3 hover:text-orange-700"
                  onClick={toggleLlmAnalysis}
                >
                  Mostrar más detalles <span className="ml-1">↓</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Actions to Take Section */}
          <div className={cn("bg-blue-50 rounded-lg overflow-hidden", isLlmExpanded && "hidden")}>
            <div 
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={toggleActions}
            >
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-800">Acciones a Tomar</h3>
              </div>
              <ChevronDown 
                className={cn("h-4 w-4 text-blue-600 transition-transform", 
                  isActionsExpanded && "rotate-180")}
              />
            </div>
            
            {isActionsExpanded && (
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
                  <p className="text-sm text-blue-700">No se requieren acciones.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Analysis Results - Smaller secondary section */}
          <div className={cn("bg-emerald-50 rounded-lg overflow-hidden", isLlmExpanded && "hidden", !data.isCorrect && "bg-red-50")}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Check className={cn("h-4 w-4 text-emerald-600", !data.isCorrect && "text-red-600")} />
                <h3 className={cn("text-sm font-medium text-emerald-800", !data.isCorrect && "text-red-800")}>Resultados del Análisis</h3>
              </div>
              <span className={cn("text-xs text-emerald-600", !data.isCorrect && "text-red-600")}>
                {data.isCorrect ? "Validación correcta" : "Validación incorrecta"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailed;
