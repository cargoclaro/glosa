import { useState, useMemo } from 'react';
import { CoveHeader } from './first-page';
import { CoveRecipient } from './recipient-page';
import { CoveMerchandise } from './merchandise-page';
import type { Cove } from "@/shared/services/customGloss/data-extraction/schemas";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast } from "lucide-react";

type PageType = 'header' | 'recipient' | 'merchandise';

// Define how many merchandise items to show per page
const ITEMS_PER_PAGE = 3;

export function CoveViewer({ cove }: { cove: Cove }) {
  const [currentPageType, setCurrentPageType] = useState<PageType>('header');
  const [merchandisePage, setMerchandisePage] = useState<number>(0); // For merchandise subpages

  // Multiply merchandise items by 10 for testing pagination
  const multipliedMerchandiseItems = useMemo(() => {
    if (!cove.datos_mercancia?.length) return [];
    // Create an array with 10x the original items by repeating the original items
    const repeatedItems = [];
    for (let i = 0; i < 10; i++) {
      repeatedItems.push(...cove.datos_mercancia);
    }
    // Skip the first item since it's displayed on the recipient page
    return repeatedItems.slice(1);
  }, [cove.datos_mercancia]);

  // Calculate total number of merchandise pages needed
  const totalMerchandisePages = useMemo(() => {
    if (!multipliedMerchandiseItems.length) return 0;
    return Math.ceil(multipliedMerchandiseItems.length / ITEMS_PER_PAGE);
  }, [multipliedMerchandiseItems]);

  // Calculate which items should be displayed on current merchandise page
  const currentMerchandiseItems = useMemo(() => {
    if (!multipliedMerchandiseItems.length) return [];
    
    const startIndex = merchandisePage * ITEMS_PER_PAGE;
    
    // Make sure we don't try to display items past the end of the array
    if (startIndex >= multipliedMerchandiseItems.length) {
      return []; // Return empty array if we're past the end
    }
    
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, multipliedMerchandiseItems.length);
    
    // Return indices from our multiplied array
    return Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);
  }, [multipliedMerchandiseItems, merchandisePage]);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPageType === 'header') {
      setCurrentPageType('recipient');
    } else if (currentPageType === 'recipient') {
      setCurrentPageType('merchandise');
      setMerchandisePage(0); // Reset to first merchandise page
    } else if (currentPageType === 'merchandise' && merchandisePage < totalMerchandisePages - 1) {
      setMerchandisePage(merchandisePage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPageType === 'merchandise' && merchandisePage > 0) {
      setMerchandisePage(merchandisePage - 1);
    } else if (currentPageType === 'merchandise' && merchandisePage === 0) {
      setCurrentPageType('recipient');
    } else if (currentPageType === 'recipient') {
      setCurrentPageType('header');
    }
  };

  const goToFirstPage = () => {
    setCurrentPageType('header');
    setMerchandisePage(0);
  };

  const goToLastPage = () => {
    if (totalMerchandisePages > 0) {
      setCurrentPageType('merchandise');
      // Make sure we don't set a page that doesn't exist
      setMerchandisePage(Math.max(0, totalMerchandisePages - 1));
    } else {
      // If there are no merchandise pages, go to recipient page
      setCurrentPageType('recipient');
    }
  };

  // Determine if next/prev buttons should be enabled
  const canGoNext = (
    currentPageType === 'header' || 
    currentPageType === 'recipient' || 
    (currentPageType === 'merchandise' && merchandisePage < totalMerchandisePages - 1)
  );
  
  const canGoPrev = (
    currentPageType === 'recipient' || 
    (currentPageType === 'merchandise')
  );

  // Get current page number and total pages for display
  const getCurrentPageInfo = () => {
    let currentPage = 1; // Start with header = page 1
    // Total pages is 2 (header + recipient) plus the number of merchandise pages
    let totalPages = 2 + totalMerchandisePages;
    
    if (currentPageType === 'recipient') currentPage = 2;
    // Merchandise pages start at 3 (after header and recipient)
    else if (currentPageType === 'merchandise') currentPage = 3 + merchandisePage;
    
    // Make sure we don't show a current page number higher than total pages
    if (currentPage > totalPages) currentPage = totalPages;
    
    return { currentPage, totalPages };
  };

  const { currentPage, totalPages } = getCurrentPageInfo();

  // Render the appropriate page component
  const renderPage = () => {
    switch (currentPageType) {
      case 'header':
        return <CoveHeader cove={cove} />;
      case 'recipient':
        return <CoveRecipient cove={cove} />;
      case 'merchandise':
        return <CoveMerchandise cove={cove} pageItems={currentMerchandiseItems} />;
      default:
        return <CoveHeader cove={cove} />;
    }
  };

  return (
    <div className="relative">
      {renderPage()}
      
      <div className="container mx-auto px-2 py-2 flex justify-center items-center space-x-2 mt-1">
        {/* First page button */}
        <Button 
          variant="outline" 
          className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-1 h-8 text-xs"
          onClick={goToFirstPage}
          disabled={!canGoPrev}
        >
          <ChevronFirst className="h-3 w-3" />
        </Button>

        {/* Previous page button */}
        {canGoPrev && (
          <Button 
            variant="outline" 
            className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-1 h-8 text-xs" 
            onClick={goToPrevPage}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Anterior
          </Button>
        )}

        {/* Page indicator */}
        <span className="text-xs text-gray-600">
          Página {currentPage} de {totalPages}
        </span>

        {/* Next page button */}
        {canGoNext && (
          <Button 
            variant="default" 
            className="bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 flex items-center py-1 h-8 text-xs" 
            onClick={goToNextPage}
          >
            Siguiente
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}

        {/* Last page button */}
        <Button 
          variant="outline" 
          className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-1 h-8 text-xs"
          onClick={goToLastPage}
          disabled={!canGoNext}
        >
          <ChevronLast className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}