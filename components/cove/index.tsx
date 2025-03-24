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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {currentPage === 'second' && (
          <Button 
            variant="outline" 
            className="border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center" 
            onClick={() => setCurrentPage('first')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            P�gina anterior
          </Button>
        )}
        {currentPage === 'first' && (
          <div className="ml-auto">
            <Button 
              variant="default" 
              className="bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 flex items-center" 
              onClick={() => setCurrentPage('second')}
            >
              P�gina siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {currentPage === 'first' ? <CoveFirstPage cove={cove} /> : <CoveDetails cove={cove} />}
    </div>
  );
}