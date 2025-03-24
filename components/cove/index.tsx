import { useState } from 'react';
import { CoveFirstPage } from './first-page';
import { CoveDetails } from './second-page';
import type { Cove } from "@/shared/services/customGloss/data-extraction/schemas";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function CoveViewer({ cove }: { cove: Cove }) {
  const [currentPage, setCurrentPage] = useState<'first' | 'second'>('first');

  return (
    <div className="relative">
      {currentPage === 'first' ? <CoveFirstPage cove={cove} /> : <CoveDetails cove={cove} />}
      
      <div className="container mx-auto px-2 py-2 flex justify-center items-center space-x-4 mt-1">
        {currentPage === 'second' && (
          <Button 
            variant="outline" 
            className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center py-1 h-8 text-xs" 
            onClick={() => setCurrentPage('first')}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Página anterior
          </Button>
        )}
        {currentPage === 'first' && (
          <Button 
            variant="default" 
            className="bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 flex items-center py-1 h-8 text-xs" 
            onClick={() => setCurrentPage('second')}
          >
            Página siguiente
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}