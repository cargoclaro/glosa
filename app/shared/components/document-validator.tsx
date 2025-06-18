import React, { useRef, useEffect } from 'react';
import Modal from './modal';

export type DocumentStatus = 'missing' | 'present';

export interface DocumentItem {
  name: string;
  status: DocumentStatus;
  required?: boolean;
}

interface DocumentValidatorProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  documents: DocumentItem[];
  /** Called when user decides to proceed */
  onProceed?: () => void;
  /** Called when user cancels / goes back */
  onBack?: () => void;
  files?: FileList | null;
}

const statusStyles: Record<DocumentStatus, string> = {
  missing:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  present:
    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
};

// Simple badge component
const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const DocumentValidator: React.FC<DocumentValidatorProps> = ({
  open,
  onOpenChange,
  documents,
  onProceed,
  onBack,
  files,
}) => {
  const close = () => {
    onOpenChange?.(false);
    onBack?.();
  };
  const proceed = () => {
    onProceed?.();
    // modal stays open via parent
  };

  const menuRef = useRef<HTMLDivElement | null>(null);

  const missingRequired = documents.some(
    (d) => d.required && d.status === 'missing'
  );

  const canProceed = !missingRequired;

  const requiredDocs = documents.filter((d) => d.required);
  const optionalDocs = documents.filter((d) => !d.required);

  // Allow users to press "Enter" to proceed when the modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && open) {
        // Prevent the default form submission behaviour
        e.preventDefault();
        // Only proceed if the required documents are present
        if (!missingRequired) {
          proceed();
        }
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, proceed, missingRequired]);

  return (
    <Modal isOpen={open} onClose={close} menuRef={menuRef}>
      <div className="mx-auto w-full max-w-3xl rounded-lg border bg-white shadow-xl">
        <div className="p-6 pb-4 border-b">
          <h2 className="text-lg font-semibold">
            Documentos {missingRequired ? 'faltantes' : 'detectados'}
          </h2>
          <h3 className="text-sm text-gray-600 mt-2">
            Para hacer la mejor glosa posible incluye todos estos documentos
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-4">
          <div>
            <h3 className="mb-2 font-medium">Requeridos</h3>
            <ul className="space-y-2">
              {requiredDocs.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-4 rounded-md transition-shadow hover:shadow-sm">
                  <Badge className={`min-w-[80px] justify-center ${statusStyles[doc.status]}`}>
                    {doc.status === 'missing' ? 'MISSING' : 'OK'}
                  </Badge>
                  <span className="text-sm leading-tight">{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Opcionales</h3>
            <ul className="space-y-2">
              {optionalDocs.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-4 rounded-md transition-shadow hover:shadow-sm">
                  <Badge className={`min-w-[80px] justify-center ${statusStyles[doc.status]}`}>
                    {doc.status === 'missing' ? 'MISSING' : 'OK'}
                  </Badge>
                  <span className="text-sm leading-tight">{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {missingRequired && (
          <p className="px-6 text-sm text-gray-600">
            Con base en el Art. 65 de la Ley Aduanera.
          </p>
        )}

        {/* File previews */}
        {files && files.length > 0 && (
          <>
            <h3 className="px-6 font-medium mt-4">Archivos cargados</h3>
            <ul className="flex w-full max-w-full gap-2 overflow-x-auto px-6 py-2">
              {Array.from(files).map((file, idx) => (
                <li key={idx} className="flex-shrink-0 w-40">
                  <iframe
                    title={file.name}
                    src={URL.createObjectURL(file)}
                    className="w-full h-40 border rounded"
                  />
                  <p className="truncate text-xs mt-1 text-center" title={file.name}>{file.name}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex justify-end gap-3 p-6 pt-4 border-t">
          <button
            onClick={close}
            className="inline-flex items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100"
          >
            Volver
          </button>
          <button
            onClick={proceed}
            disabled={!canProceed}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow ${
              canProceed
                ? 'bg-orange-600 text-white hover:bg-orange-600/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentValidator;