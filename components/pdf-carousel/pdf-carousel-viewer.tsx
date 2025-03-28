'use client';

import { ChevronFirst, ChevronLast } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  File,
  FileArchive,
  FileBox,
  FileImage,
  FileSpreadsheet,
  FileText,
  Maximize,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CustomGlossFileTable } from '~/db/schema';
import { cn } from '~/lib/utils';
import { Button } from '~/ui/button';

interface PDFCarouselViewerProps {
  files: CustomGlossFileTable[];
  className?: string;
  importerName?: string;
}

const PDFCarouselViewer = ({
  files,
  className,
  importerName = '',
}: PDFCarouselViewerProps) => {
  // Log the incoming files for debugging
  useEffect(() => {
    console.log('Files received in component:', files.length);
    files.forEach((file, index) => {
      console.log(`Component File ${index + 1}:`, {
        id: file.id,
        name: file.name,
        url: file.url,
        documentType: file.documentType || 'unknown',
      });
    });
  }, [files]);

  // Accept all files - we'll handle display appropriately
  const documentFiles = useMemo(() => {
    return files;
  }, [files]);

  // State for active document index
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Get currently active document
  const currentDocument = useMemo(() => {
    if (documentFiles.length === 0) return null;
    return documentFiles[activeDocIndex];
  }, [documentFiles, activeDocIndex]);

  // Find pedimento document to show first
  useEffect(() => {
    const pedimentoIndex = documentFiles.findIndex(
      (file) =>
        file.name.toLowerCase().includes('pedimento') ||
        (file.documentType &&
          file.documentType.toLowerCase().includes('pedimento'))
    );

    if (pedimentoIndex !== -1) {
      setActiveDocIndex(pedimentoIndex);
    }
  }, [documentFiles]);

  // Get document icon based on file type
  const getDocumentIcon = (file: CustomGlossFileTable) => {
    const fileName = file.name.toLowerCase();
    const documentType = file.documentType?.toLowerCase() || '';

    // Check for PDFs
    if (
      (fileName.includes('pedimento') || documentType === 'pedimento') &&
      (file.url.toLowerCase().endsWith('.pdf') ||
        file.url.toUpperCase().endsWith('.PDF'))
    ) {
      return <FileText className="mr-2 h-5 w-5 text-red-500" />;
    }

    // Check for Carta 3.1.8
    if (
      fileName.includes('carta 3.1.8') ||
      fileName.includes('carta318') ||
      documentType === 'carta318'
    ) {
      return <FileText className="mr-2 h-5 w-5 text-purple-600" />;
    }

    // Check for invoices/facturas
    if (
      fileName.includes('factura') ||
      documentType === 'factura' ||
      fileName.includes('invoice')
    ) {
      return <FileSpreadsheet className="mr-2 h-5 w-5 text-green-500" />;
    }

    // Check for COVEs
    if (fileName.includes('cove') || documentType === 'cove') {
      return <FileText className="mr-2 h-5 w-5 text-blue-500" />;
    }

    // Check for Packing List
    if (
      fileName.includes('packing') ||
      fileName.includes('lista') ||
      documentType === 'listaDeEmpaque'
    ) {
      return <FileBox className="mr-2 h-5 w-5 text-yellow-600" />;
    }

    // Check for images
    if (file.url.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return <FileImage className="mr-2 h-5 w-5 text-purple-500" />;
    }

    // Check for transport documents
    if (
      fileName.includes('transporte') ||
      documentType === 'documentodetransporte' ||
      fileName.includes('guia') ||
      fileName.includes('guide') ||
      fileName.includes('aerea')
    ) {
      return <FileArchive className="mr-2 h-5 w-5 text-amber-500" />;
    }

    // Default icon
    return <File className="mr-2 h-5 w-5 text-gray-500" />;
  };

  // Navigation functions
  const goToNextDoc = () => {
    if (activeDocIndex < documentFiles.length - 1) {
      setActiveDocIndex(activeDocIndex + 1);
    }
  };

  const goToPrevDoc = () => {
    if (activeDocIndex > 0) {
      setActiveDocIndex(activeDocIndex - 1);
    }
  };

  const goToFirstDoc = () => {
    setActiveDocIndex(0);
  };

  const goToLastDoc = () => {
    setActiveDocIndex(documentFiles.length - 1);
  };

  // Determine if next/prev buttons should be enabled
  const canGoNext = activeDocIndex < documentFiles.length - 1;
  const canGoPrev = activeDocIndex > 0;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else if (viewerRef.current?.requestFullscreen) {
      viewerRef.current.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Document thumbnails (for sidebar list)
  const renderDocumentList = () => {
    return (
      <div className="h-[70vh] w-64 overflow-y-auto rounded-l-xl border-gray-200 border-r bg-gray-50">
        <div className="border-gray-200 border-b p-3">
          <h3 className="font-medium text-gray-700 text-sm">Documentos</h3>
        </div>
        <div className="space-y-1 p-2">
          {documentFiles.map((file, index) => (
            <div
              key={file.id}
              className={cn(
                'flex cursor-pointer items-center rounded-md p-2 text-sm transition-all',
                index === activeDocIndex
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              )}
              onClick={() => setActiveDocIndex(index)}
            >
              {getDocumentIcon(file)}
              <div className="line-clamp-2">{file.name || 'Document'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render document content based on file type
  const renderDocumentContent = () => {
    if (!currentDocument) return null;

    // Check if it's a PDF by extension or document type
    const isPdf =
      currentDocument.url.toLowerCase().endsWith('.pdf') ||
      currentDocument.url.toUpperCase().endsWith('.PDF') ||
      (currentDocument.documentType &&
        (currentDocument.documentType.toLowerCase().includes('pdf') ||
          currentDocument.documentType.toLowerCase() === 'pedimento' ||
          currentDocument.documentType.toLowerCase() === 'cove' ||
          currentDocument.documentType.toLowerCase() === 'factura'));

    if (isPdf) {
      // For PDFs, use direct embedding with Google PDF Viewer as a fallback
      return (
        <div className="h-full w-full">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(currentDocument.url)}&embedded=true`}
            className="h-full w-full"
            title={currentDocument.name || 'PDF Document'}
            onError={(e) => {
              // If Google Viewer fails, try direct embedding
              e.currentTarget.src = currentDocument.url;
            }}
          />
        </div>
      );
    }

    // For HTML files
    if (currentDocument.url.toLowerCase().endsWith('.html')) {
      return (
        <iframe
          src={currentDocument.url}
          className="h-full w-full"
          title={currentDocument.name || 'HTML Document'}
        />
      );
    }

    // For images
    if (currentDocument.url.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={currentDocument.url}
            alt={currentDocument.name || 'Document'}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }

    // For other document types, provide a download link
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="mb-4 text-gray-600">
          Este tipo de documento no se puede previsualizar directamente.
        </p>
        <a
          href={currentDocument.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
        >
          Abrir documento
        </a>
      </div>
    );
  };

  if (documentFiles.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-gray-300 border-dashed">
        <p className="text-center text-gray-500">
          No se encontraron documentos
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Importer Name if available */}
      {importerName && (
        <h2 className="font-bold text-gray-800 text-xl">{importerName}</h2>
      )}

      {/* Main container for sidebar and viewer */}
      <div
        ref={viewerRef}
        className={cn(
          'relative flex w-full overflow-hidden rounded-xl shadow-xl',
          isFullscreen ? 'fixed inset-0 z-50 bg-white' : '',
          className
        )}
      >
        {/* Left Sidebar - Document List */}
        {!isFullscreen && renderDocumentList()}

        {/* Right Side - Document Viewer */}
        <div className="flex flex-1 flex-col">
          {/* Document Viewer Header */}
          <div className="flex items-center justify-between border-gray-200 border-b bg-white px-4 py-2">
            <div className="flex items-center">
              {currentDocument && getDocumentIcon(currentDocument)}
              <h3 className="font-medium text-sm">
                {currentDocument?.name || 'Document'}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={currentDocument?.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-xs hover:text-blue-800 hover:underline"
              >
                Abrir en nueva pestaña
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Document Content */}
          <div className="h-[70vh] flex-1">{renderDocumentContent()}</div>

          {/* Document Navigation Controls */}
          <div className="flex items-center justify-center space-x-2 border-gray-100 border-t bg-white px-2 py-2">
            <Button
              variant="outline"
              className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
              onClick={goToFirstDoc}
              disabled={!canGoPrev}
            >
              <ChevronFirst className="h-3 w-3" />
            </Button>

            {canGoPrev && (
              <Button
                variant="outline"
                className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
                onClick={goToPrevDoc}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Anterior
              </Button>
            )}

            <span className="text-gray-600 text-xs">
              {activeDocIndex + 1} de {documentFiles.length}
            </span>

            {canGoNext && (
              <Button
                variant="default"
                className="flex h-8 items-center bg-zinc-800 py-1 text-xs transition-all duration-300 hover:bg-zinc-700"
                onClick={goToNextDoc}
              >
                Siguiente
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}

            <Button
              variant="outline"
              className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
              onClick={goToLastDoc}
              disabled={activeDocIndex === documentFiles.length - 1}
            >
              <ChevronLast className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFCarouselViewer;
