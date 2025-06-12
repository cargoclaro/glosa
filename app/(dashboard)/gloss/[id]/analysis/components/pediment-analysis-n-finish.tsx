'use client';

import type {
  Cove,
  Pedimento,
} from '@/shared/services/customGloss/extract-and-structure/schemas';
import { useState } from 'react';
import { CoveViewer } from '~/components/cove/index';
import PedimentoViewer from '~/components/pedimento/pedimento-viewer';
import type { CustomGlossFileTable } from '~/db/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs';
import { Analysis, SavedNFinish } from '.';
import type { Tabs as GlossTabs, ITabInfoSelected } from './types';

interface IPedimentAnalysisNFinish {
  id: string;
  moneySaved: number;
  tabs: GlossTabs[];
  files: CustomGlossFileTable[];
  coves: Cove[]; // Ahora es un array de COVEs
  pedimento: Pedimento | null;
}

const PedimentAnalysisNFinish = ({
  customGloss,
}: {
  customGloss: IPedimentAnalysisNFinish;
}) => {
  const [documentSelected, setDocumentSelected] = useState('PEDIMENTO');
  const [tabSelectedFromDocument, setTabSelectedFromDocument] = useState('');
  // Nueva variable para rastrear qué sección específica del COVE está seleccionada
  const [selectedCoveSection, setSelectedCoveSection] = useState<string>('');
  
  const customGlossTab = customGloss.tabs[0];
  if (!customGlossTab) {
    throw new Error('Should never happen');
  }
  const { name, isCorrect, isVerified } = customGlossTab;
  const [tabInfoSelected, setTabInfoSelected] = useState<ITabInfoSelected>({
    name,
    isCorrect,
    isVerified,
  });

  const handleFunction = (tab: string) => {
    console.log('handleFunction called with:', tab, 'documentSelected:', documentSelected);
    
    // Si estamos viendo un COVE específico, necesitamos navegar al tab del COVE correcto
    // pero también queremos mostrar la sección específica dentro de ese COVE
    if (documentSelected.startsWith('COVE-')) {
      const coveParts = documentSelected.split('-');
      const coveIndexStr = coveParts[1];
      if (coveIndexStr && !isNaN(parseInt(coveIndexStr))) {
        const coveIndex = parseInt(coveIndexStr);
        const coveTabName = `COVE ${coveIndex + 1}`;
        
        console.log('COVE click:', coveTabName, 'Section:', tab);
        
        // Guardar la sección específica seleccionada para highlighting
        setSelectedCoveSection(tab);
        
        // Mapear la sección clickeada al nombre de tab específico
        let targetTabName = '';
        
        // Primero intentar con la nueva estructura específica (con guión)
        if (tab === 'Datos Generales' || tab === 'Datos generales del proveedor') {
          targetTabName = `COVE ${coveIndex + 1} - Datos Generales`;
        } else if (tab === 'Datos Proveedor Destinatario' ||
                   tab === 'Domicilio del proveedor' ||
                   tab === 'Datos generales del destinatario' ||
                   tab === 'Domicilio del destinatario') {
          targetTabName = `COVE ${coveIndex + 1} - Datos Proveedor Destinatario`;
        } else if (tab === 'Datos de la mercancía' || tab === 'Validación de mercancías') {
          targetTabName = `COVE ${coveIndex + 1} - Validación de mercancías`;
        }
        
        // Buscar el tab específico
        const targetTab = customGloss.tabs.find(t => t.name === targetTabName);
        
        // Cambiar al tab encontrado
        if (targetTab) {
          console.log('Navigating to:', targetTab.name, 'for section:', tab);
          setTabInfoSelected({
            name: targetTab.name,
            isCorrect: targetTab.isCorrect,
            isVerified: targetTab.isVerified,
          });
          
          // Limpiar tabSelectedFromDocument ya que navegamos directamente al tab correcto
          setTabSelectedFromDocument('');
        } else {
          console.log('No tab found for COVE:', coveIndex + 1, 'section:', tab);
          setTabSelectedFromDocument(tab);
        }
      } else {
        setTabSelectedFromDocument(tab);
      }
    } else {
      // Si estamos viendo el pedimento, mantener la lógica original
      setSelectedCoveSection(''); // Limpiar selección de COVE
      setTabSelectedFromDocument(tab);
    }
  };

  return (
    <>
      <section className="flex flex-col sm:col-span-2">
        <div className="mb-2">
          <Tabs
            defaultValue="PEDIMENTO"
            value={documentSelected}
            onValueChange={setDocumentSelected}
            className="w-full"
          >
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="PEDIMENTO">Pedimento</TabsTrigger>
                {customGloss.coves.length > 0 ? (
                  customGloss.coves.map((_, index) => (
                    <TabsTrigger 
                      key={`cove-${index}`}
                      value={`COVE-${index}`}
                      className="relative"
                    >
                      COVE {index + 1}
                    </TabsTrigger>
                  ))
                ) : (
                  <TabsTrigger value="NO-COVE" disabled>
                    Sin COVEs
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            <TabsContent value="PEDIMENTO">
              {customGloss.pedimento && (
                <PedimentoViewer
                  pedimento={customGloss.pedimento}
                  tabs={customGloss.tabs}
                  onClick={handleFunction}
                  tabInfoSelected={tabInfoSelected}
                />
              )}
            </TabsContent>
            {customGloss.coves.map((cove, index) => (
              <TabsContent key={`cove-content-${index}`} value={`COVE-${index}`}>
                <CoveViewer
                  cove={cove}
                  tabs={customGloss.tabs.filter(tab => 
                    tab.name.startsWith(`COVE ${index + 1} -`)
                  )}
                  onClick={handleFunction}
                  tabInfoSelected={tabInfoSelected}
                  selectedCoveSection={selectedCoveSection} // Nueva prop para highlighting
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      <section className="col-span-1 flex flex-col gap-4 pt-10 sm:col-span-3 lg:col-span-1">
        <Analysis
          tabs={customGloss.tabs}
          setTabInfoSelected={setTabInfoSelected}
          tabSelectedFromDocument={tabSelectedFromDocument}
          tabInfoSelected={tabInfoSelected}
        />
        <SavedNFinish
          glossId={customGloss.id}
          moneySaved={customGloss.moneySaved}
        />
      </section>
    </>
  );
};

export default PedimentAnalysisNFinish;
