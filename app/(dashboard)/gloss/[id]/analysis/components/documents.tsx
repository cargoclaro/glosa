import { GenericCard } from '@/shared/components';
import Link from 'next/link';
import type { CustomGlossFileTable } from '~/db/schema';
import { cn } from '~/lib/utils';

// File type icons based on extension
const DocumentIcon = ({ fileType, className }: { fileType: string; className?: string }) => {
  // Get file extension
  const extension = fileType.split('.').pop()?.toLowerCase() || '';
  
  // All icons now use the same neutral color
  const getIconColor = () => {
    return 'text-blue-500';
  };

  // All backgrounds now use the same neutral color
  const getBgColor = () => {
    return 'bg-blue-50/30';
  };

  // Different icon per file type
  const renderIcon = () => {
    const iconClass = getIconColor();
    
    switch(extension) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15L12 12"></path>
            <path d="M12 12L15 15"></path>
            <path d="M12 12V18"></path>
          </svg>
        );
      case 'xml':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
        );
      case 'xlsx':
      case 'xls':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="8" y1="13" x2="16" y2="13"></line>
            <line x1="8" y1="17" x2="16" y2="17"></line>
            <path d="M16 12v-1h-3"></path>
            <rect x="8" y="9" width="4" height="4"></rect>
          </svg>
        );
      case 'docx':
      case 'doc':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        );
    }
  };
  
  return (
    <div className={cn("flex h-6 w-6 items-center justify-center rounded", getBgColor(), className)}>
      {renderIcon()}
    </div>
  );
};

const Documents = ({ data }: { data: CustomGlossFileTable[] }) => {
  return (
    <GenericCard customClass="bg-white shadow-sm">
      <div className="flex items-center justify-center gap-2 border-b border-[#e8e8e8] pb-3 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
        <h2 className="text-base font-semibold text-[#333333] tracking-tight">
          Documentos
        </h2>
      </div>
      <ul className="flex flex-col gap-2.5">
        {data.map((doc) => {
          // All items now use the same neutral border color
          const getDocBorderColor = () => {
            return 'border-[#e8e8e8]';
          };
          
          return (
            <li
              key={doc.id}
              title={`Ver documento ${doc.name}`}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg border shadow-sm bg-white py-2 px-3 transition-all duration-200 hover:shadow-md",
                getDocBorderColor()
              )}
            >
              <DocumentIcon fileType={doc.name} />
              <Link 
                href={doc.url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full"
              >
                <p className="truncate text-sm text-[#444444] font-medium">{doc.name}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </GenericCard>
  );
};

export default Documents;
