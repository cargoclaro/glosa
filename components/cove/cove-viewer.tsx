import type { Cove } from '@/shared/services/customGloss/data-extraction/schemas';
import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { Button } from '~/ui/button';
import { CoveHeader } from './first-page';
import { CoveMerchandise } from './merchandise-page';
import { CoveRecipient } from './recipient-page';

type PageType = 'header' | 'recipient' | 'merchandise';

// Define how many merchandise items to show per page
const ITEMS_PER_PAGE = 3;

interface ICoveViewerProps {
  cove: Cove;
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  tabInfoSelected?: { name: string; isCorrect: boolean; isVerified: boolean };
}

export function CoveViewer({
  cove,
  tabs = [],
  onClick,
  tabInfoSelected = { name: '', isCorrect: false, isVerified: false },
}: ICoveViewerProps) {
  const [currentPageType, setCurrentPageType] = useState<PageType>('header');
  const [merchandisePage, setMerchandisePage] = useState<number>(0); // For merchandise subpages

  // Get merchandise items, skipping the first one which is displayed on the recipient page
  const merchandiseItems = useMemo(() => {
    if (!cove.datos_mercancia?.length) {
      return [];
    }
    // Skip the first item since it's displayed on the recipient page
    return cove.datos_mercancia.slice(1);
  }, [cove.datos_mercancia]);

  // Calculate total number of merchandise pages needed
  const totalMerchandisePages = useMemo(() => {
    if (!merchandiseItems.length) {
      return 0;
    }
    return Math.ceil(merchandiseItems.length / ITEMS_PER_PAGE);
  }, [merchandiseItems]);

  // Calculate which items should be displayed on current merchandise page
  const currentMerchandiseItems = useMemo(() => {
    if (!merchandiseItems.length) {
      return [];
    }

    const startIndex = merchandisePage * ITEMS_PER_PAGE;

    // Make sure we don't try to display items past the end of the array
    if (startIndex >= merchandiseItems.length) {
      return []; // Return empty array if we're past the end
    }

    const endIndex = Math.min(
      startIndex + ITEMS_PER_PAGE,
      merchandiseItems.length
    );

    // Return indices from our array
    return Array.from(
      { length: endIndex - startIndex },
      (_, i) => startIndex + i
    );
  }, [merchandiseItems, merchandisePage]);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPageType === 'header') {
      setCurrentPageType('recipient');
    } else if (currentPageType === 'recipient') {
      // Only go to merchandise pages if there are items to show
      if (merchandiseItems.length > 0) {
        setCurrentPageType('merchandise');
        setMerchandisePage(0); // Reset to first merchandise page
      }
    } else if (
      currentPageType === 'merchandise' &&
      merchandisePage < totalMerchandisePages - 1
    ) {
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
  const canGoNext =
    currentPageType === 'header' ||
    (currentPageType === 'recipient' && merchandiseItems.length > 0) ||
    (currentPageType === 'merchandise' &&
      merchandisePage < totalMerchandisePages - 1);

  const canGoPrev =
    currentPageType === 'recipient' || currentPageType === 'merchandise';

  // Get current page number and total pages for display
  const getCurrentPageInfo = () => {
    let currentPage = 1; // Start with header = page 1

    // Calculate total pages - base pages (header & recipient) + merchandise pages
    // If there are no merchandise items, don't include them in total
    const totalPages =
      merchandiseItems.length > 0 ? 2 + totalMerchandisePages : 2;

    if (currentPageType === 'recipient') {
      currentPage = 2;
    }
    // Merchandise pages start at 3 (after header and recipient)
    else if (currentPageType === 'merchandise') {
      currentPage = 3 + merchandisePage;
    }

    // Make sure we don't show a current page number higher than total pages
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    return { currentPage, totalPages };
  };

  const { currentPage, totalPages } = getCurrentPageInfo();

  // Render the appropriate page component with highlighting props
  const renderPage = () => {
    // Shared props for all components
    const sharedProps = {
      cove,
      tabs,
      onClick,
      tabInfoSelected,
    };

    switch (currentPageType) {
      case 'header':
        return <CoveHeader {...sharedProps} />;
      case 'recipient':
        return <CoveRecipient {...sharedProps} />;
      case 'merchandise':
        return (
          <CoveMerchandise
            {...sharedProps}
            pageItems={currentMerchandiseItems}
          />
        );
      default:
        return <CoveHeader {...sharedProps} />;
    }
  };

  return (
    <div className="relative">
      {renderPage()}

      <div className="container mx-auto mt-1 flex items-center justify-center space-x-2 px-2 py-2">
        {/* First page button */}
        <Button
          variant="outline"
          className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
          onClick={goToFirstPage}
          disabled={!canGoPrev}
        >
          <ChevronFirst className="h-3 w-3" />
        </Button>

        {/* Previous page button */}
        {canGoPrev && (
          <Button
            variant="outline"
            className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
            onClick={goToPrevPage}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Anterior
          </Button>
        )}

        {/* Page indicator */}
        <span className="text-gray-600 text-xs">
          Página {currentPage} de {totalPages}
        </span>

        {/* Next page button */}
        {canGoNext && (
          <Button
            variant="default"
            className="flex h-8 items-center bg-zinc-800 py-1 text-xs transition-all duration-300 hover:bg-zinc-700"
            onClick={goToNextPage}
          >
            Siguiente
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}

        {/* Last page button */}
        <Button
          variant="outline"
          className="flex h-8 items-center border border-gray-300 py-1 text-xs transition-all duration-300 hover:bg-gray-100"
          onClick={goToLastPage}
          disabled={
            // Disable if we're already on the last page
            (currentPageType === 'merchandise' &&
              merchandisePage === totalMerchandisePages - 1) ||
            // Disable if we're on the recipient page and there are no merchandise items
            (currentPageType === 'recipient' &&
              merchandiseItems.length === 0) ||
            // Disable if we're on the last possible page type
            currentPage === totalPages
          }
        >
          <ChevronLast className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
