'use client';

import { GenericCard, Modal } from '@/shared/components';
import { useModal } from '@/shared/hooks';
import {
  Check,
  DocMagniGlass,
  Document,
  ExclamationTriangle,
  LeftChevron,
  RightArrow,
  RightChevron,
  Info,
  ClipboardDocumentList,
} from '@/shared/icons';
import { markTabAsVerifiedByTabIdNCustomGlossID } from '@/shared/services/customGloss/controller';
import { useMutation } from '@tanstack/react-query';
import type { InferSelectModel } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CustomGloss,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStep,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStepResources,
} from '~/db/schema';
import { cn } from '~/lib/utils';
import type { ITabInfoSelected } from '../pediment-analysis-n-finish';
import Detailed from './detailed';

type TabValidation = InferSelectModel<typeof CustomGlossTabValidationStep> & {
  resources: InferSelectModel<typeof CustomGlossTabValidationStepResources>[];
  actionsToTake: InferSelectModel<
    typeof CustomGlossTabValidationStepActionToTake
  >[];
  steps: InferSelectModel<typeof CustomGlossTabValidationStep>[];
};

type TabContext = InferSelectModel<typeof CustomGlossTabContext> & {
  data: InferSelectModel<typeof CustomGlossTabContextData>[];
};

type tabs = InferSelectModel<typeof CustomGlossTab> & {
  context: TabContext[];
  validations: TabValidation[];
  customGloss: InferSelectModel<typeof CustomGloss>;
};

interface IAnalysis {
  tabs: tabs[];
  tabSelectedFromDocument: string;
  setTabInfoSelected: (tab: ITabInfoSelected) => void;
}

const Analysis = ({
  tabs,
  setTabInfoSelected,
  tabSelectedFromDocument,
}: IAnalysis) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);
  const [tabSelected, setTabSelected] = useState('Número de pedimento');

  const [dataForDetail, setDataForDetail] = useState<
    tabs['validations'][number]
  >({
    id: 0,
    name: '',
    description: '',
    llmAnalysis: '',
    isCorrect: true,
    resources: [],
    actionsToTake: [],
    createdAt: new Date(),
    customGlossTabId: '',
    steps: [],
    fraccion: '',
    parentStepId: 0,
  });

  const handleDetail = (data: tabs['validations'][number]) => {
    setDataForDetail(data);
    openMenu();
  };

  const scrollToTab = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tabElement = container.children[index] as HTMLElement;
      if (tabElement) {
        // Calculate center position: tab's left position + half its width - half container width
        const tabRect = tabElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const tabCenter = tabElement.offsetLeft + (tabRect.width / 2);
        const scrollPosition = tabCenter - (containerRect.width / 2);
        
        // Scroll to center the tab
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.name === tabSelected);
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (!nextTab) {
      return;
    }
    setTabSelected(nextTab.name);
    setTabInfoSelected({
      name: nextTab.name,
      isCorrect: nextTab.isCorrect,
      isVerified: nextTab.isVerified,
    });
    scrollToTab(nextIndex);
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.name === tabSelected);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    const prevTab = tabs[prevIndex];
    if (!prevTab) {
      return;
    }
    setTabSelected(prevTab.name);
    setTabInfoSelected({
      name: prevTab.name,
      isCorrect: prevTab.isCorrect,
      isVerified: prevTab.isVerified,
    });
    scrollToTab(prevIndex);
  };

  const handleTabClick = useCallback(
    (id: string) => {
      const tabIndex = tabs.findIndex((tab) => tab.name === id);
      const tab = tabs[tabIndex];
      if (!tab) {
        return;
      }
      setTabSelected(id);
      setTabInfoSelected({
        name: tab.name,
        isCorrect: tab.isCorrect,
        isVerified: tab.isVerified,
      });
      scrollToTab(tabIndex);
    },
    [tabs, setTabInfoSelected]
  );

  useEffect(() => {
    if (tabSelectedFromDocument !== '') {
      if (tabSelectedFromDocument === 'NUM. PEDIMENTO:') {
        handleTabClick('Número de pedimento');
      } else if (
        tabSelectedFromDocument === 'T. OPER' ||
        tabSelectedFromDocument === 'T.OPER' ||
        tabSelectedFromDocument === 'TIPO OPER' ||
        tabSelectedFromDocument === 'TIPO OPER:' ||
        tabSelectedFromDocument === 'TIPO OPER.:'
      ) {
        handleTabClick('Tipo de operación');
      } else if (
        tabSelectedFromDocument === 'DESTINO:' ||
        tabSelectedFromDocument === 'DESTINO/ORIGEN:'
      ) {
        handleTabClick('Clave de destino/origen');
      } else if (
        tabSelectedFromDocument === 'TIPO CAMBIO:' ||
        tabSelectedFromDocument === 'VALOR DOLARES:' ||
        tabSelectedFromDocument === 'VAL. SEGUROS' ||
        tabSelectedFromDocument === 'VAL.SEGUROS' ||
        tabSelectedFromDocument === 'FECHAS'
      ) {
        handleTabClick('Operación monetaria');
      } else if (tabSelectedFromDocument === 'PESO BRUTO:') {
        handleTabClick('Pesos y bultos');
      } else if (
        tabSelectedFromDocument === 'DATOS DEL IMPORTADOR/EXPORTADOR' ||
        tabSelectedFromDocument === 'DATOS DEL IMPORTADOR / EXPORTADOR' ||
        tabSelectedFromDocument === 'DATOS DEL PROVEEDOR O COMPRADOR'
      ) {
        handleTabClick('Datos de factura');
      } else if (
        tabSelectedFromDocument === 'DATOS DEL TRANSPORTE Y TRANSPORTISTA'
      ) {
        handleTabClick('Datos del transporte');
      } else if (
        tabSelectedFromDocument === 'PARTIDAS' ||
        tabSelectedFromDocument === 'OBSERVACIONES A NIVEL PARTIDA'
      ) {
        handleTabClick('Partidas');
      } else if (tabSelectedFromDocument === 'Datos generales del proveedor') {
        handleTabClick('Datos Generales');
      } else if (
        tabSelectedFromDocument === 'Domicilio del proveedor' ||
        tabSelectedFromDocument === 'Datos generales del destinatario' ||
        tabSelectedFromDocument === 'Domicilio del destinatario'
      ) {
        handleTabClick('Datos Proveedor Destinatario');
      } else if (tabSelectedFromDocument === 'Datos de la mercancía') {
        handleTabClick('Validación de mercancías');
      } else {
        handleTabClick(tabSelectedFromDocument);
      }
    }
  }, [tabSelectedFromDocument, handleTabClick]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeMenu} menuRef={menuRef}>
        <Detailed data={dataForDetail} />
      </Modal>
      <GenericCard customClass="bg-white">
        <div className="relative w-full mb-4">
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 left-0 rounded-full bg-[#f8f8f8] p-1.5 shadow-sm transition-colors duration-200 hover:bg-[#f0f0f0] z-10"
            onClick={handlePrevious}
          >
            <LeftChevron size="size-4" />
          </button>
          <div className="mx-8 rounded-lg">
            <div className="flex justify-center items-center">
              <div className="py-2 px-4">
                <button
                  type="button"
                  title={tabSelected}
                  className="relative px-6 py-2.5 rounded-lg text-center transition-all duration-200 min-w-[180px] border bg-blue-50/80 text-blue-600 font-medium shadow-sm border-blue-200/70"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="line-clamp-1 text-sm whitespace-nowrap mx-auto">{tabSelected}</p>
                  </div>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full bg-[#f8f8f8] p-1.5 shadow-sm transition-colors duration-200 hover:bg-[#f0f0f0] z-10"
            onClick={handleNext}
          >
            <RightChevron size="size-4" />
          </button>
        </div>
        
        {/* Divider after navbar */}
        <div className="w-full h-px bg-[#e8e8e8] mb-6"></div>
        
        {tabs.map(
          (tab) =>
            tabSelected === tab.name && (
              <GenericTabComponent
                key={tab.id}
                data={tab}
                handleClick={(data) => handleDetail(data)}
              />
            )
        )}
      </GenericCard>
    </>
  );
};

export default Analysis;

interface IGenericTabComponent {
  data: tabs;
  handleClick: (data: tabs['validations'][number]) => void;
}

const GenericTabComponent = ({ data, handleClick }: IGenericTabComponent) => {
  const uniqueOrigins = Array.from(
    new Set(data.context.map((item) => item.origin))
  );
  const [showAllOrigins, setShowAllOrigins] = useState(false);
  const [showSources, setShowSources] = useState(false);

  // Display only first 3 documents initially
  const displayOrigins = showAllOrigins
    ? uniqueOrigins
    : uniqueOrigins.slice(0, 3);

  // Check if we need to show the "Show more" button
  const hasMoreOrigins = uniqueOrigins.length > 3;

  return (
    <>
      <StatusHeader status={data.isCorrect} />
      
      {/* Divider after status header */}
      <div className="w-full h-px bg-[#e8e8e8] my-6"></div>
      
      {/* Validation Steps directly as main content */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardDocumentList size="size-4.5" strokeWidth={2} customClass="text-[#333333]" />
          <h3 className="text-base font-semibold text-[#333333] tracking-tight">
            Pasos de Validación
          </h3>
        </div>
        <DataListForSummaryCard
          data={data.validations}
          handleDetail={handleClick}
        />
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-[#e8e8e8] my-8"></div>
      
      {/* Sources Section without Container - Collapsible */}
      <div className="mb-8">
        <div 
          className="flex items-center justify-between mb-3 cursor-pointer" 
          onClick={() => setShowSources(!showSources)}
        >
          <div className="flex items-center gap-2">
            <DocMagniGlass size="size-4.5" customClass="text-[#333333]" />
            <h3 className="text-base font-semibold text-[#333333] tracking-tight">
              Fuentes
            </h3>
          </div>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f5] transition-colors duration-200 hover:bg-[#eaeaea]"
            aria-label={showSources ? "Colapsar" : "Expandir"}
            title={showSources ? "Colapsar" : "Expandir"}
          >
            {showSources ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#555555]"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#555555]"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </button>
        </div>
        
        {showSources && (
          <div className="relative">
            <ul className="flex max-h-32 flex-col gap-2 overflow-y-auto pr-1">
              {displayOrigins.map((origin, index) => (
                <li key={index} className="w-full">
                  <div
                    title={origin}
                    className="flex items-center gap-2.5 rounded-lg bg-[#f8f2ff] px-3.5 py-2.5 transition-colors duration-200 hover:bg-[#f0e6ff] border border-[#efe4ff] shadow-sm"
                  >
                    <Document size="size-4" customClass="text-purple-500" />
                    <span className="font-medium text-xs text-gray-700">
                      {origin.toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {hasMoreOrigins && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setShowAllOrigins(!showAllOrigins)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200"
                  title={
                    showAllOrigins
                      ? 'Mostrar menos'
                      : `Mostrar ${uniqueOrigins.length - 3} más`
                  }
                >
                  {showAllOrigins ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-[#e8e8e8] mb-8"></div>
      
      <VerifiedButton
        tabId={data.id}
        isVerified={data.isVerified}
        customGlossId={data.customGlossId}
      />
    </>
  );
};

interface IVerifiedButton {
  tabId: string;
  isVerified: boolean;
  customGlossId: string;
}

const VerifiedButton = ({
  tabId,
  isVerified,
  customGlossId,
}: IVerifiedButton) => {
  const mutation = useMutation({
    mutationFn: () =>
      markTabAsVerifiedByTabIdNCustomGlossID({
        tabId,
        customGlossId,
      }),
    onError: (error) => {
      // Handle redirects (which Next.js sends as 303 responses that React Query considers errors)
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        // This is a redirect, allow it to happen normally
        return;
      }
    },
  });

  let buttonContent: React.ReactNode;
  if (mutation.isPending) {
    buttonContent = (
      <span className="flex items-center justify-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Verificando...
      </span>
    );
  } else if (isVerified) {
    buttonContent = (
      <span className="flex items-center justify-center">
        <Check size="size-4" strokeWidth={2} customClass="mr-2 text-green-500" />
        Análisis Verificado
      </span>
    );
  } else {
    buttonContent = 'Marcar como verificado';
  }

  return (
    <div className="text-center">
      {mutation.error &&
        (mutation.error as Error).message !== 'NEXT_REDIRECT' && (
          <p className="text-red-500">{(mutation.error as Error).message}</p>
        )}
      <button
        type="button"
        disabled={isVerified || mutation.isPending}
        onClick={() => mutation.mutate()}
        className={cn(
          'rounded-md px-6 py-2 text-sm transition-all duration-300',
          mutation.isPending && 'cursor-not-allowed opacity-50',
          isVerified
            ? 'cursor-not-allowed bg-transparent text-gray-700'
            : 'text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent border border-blue-300'
        )}
      >
        {buttonContent}
      </button>
    </div>
  );
};

const StatusHeader = ({ status }: { status: boolean }) => (
  <div className="mt-2 mb-4 rounded-xl border border-[#e8e8e8] bg-white shadow-sm overflow-hidden">
    <div className={cn(
      "px-4 py-3",
      status 
        ? "bg-green-100/90 border-green-200/90" 
        : "bg-yellow-50/70 border-yellow-100/70"
    )}>
      <div className="flex items-center justify-center gap-2">
        {status ? (
          <>
            <Check size="size-4.5" strokeWidth={2} customClass="text-green-600" />
            <h3 className="text-base font-semibold text-green-700 tracking-tight">
              Todo parece bien
            </h3>
          </>
        ) : (
          <>
            <ExclamationTriangle customClass="h-4.5 w-4.5 text-yellow-500" />
            <h3 className="text-base font-semibold text-[#333333] tracking-tight">
              Verificar datos
            </h3>
          </>
        )}
      </div>
    </div>
  </div>
);

interface IDataListForSummaryCard {
  data: tabs['validations'];
  handleDetail: (data: tabs['validations'][number]) => void;
}

const DataListForSummaryCard = ({
  data,
  handleDetail,
}: IDataListForSummaryCard) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleTooltipToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  // Add click away listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if clicking outside tooltip and its button
      const target = e.target as HTMLElement;
      if (activeTooltip !== null && !target.closest('.tooltip-container')) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeTooltip]);

  return (
    <ul className="my-2 flex max-h-[320px] flex-col gap-2 overflow-y-auto overflow-x-hidden px-1">
      {data.map((item) => (
        <li
          key={item.id}
          className="group relative flex flex-col rounded-lg border bg-white shadow hover:shadow-md transition-all duration-200"
          style={{
            borderColor: item.isCorrect ? '#10b98180' : '#fbbf2480',  // green-500 or yellow-400 colors with alpha
            borderWidth: '1px',
          }}
        >
          {/* Left status indicator */}
          <div 
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
              item.isCorrect ? "bg-green-500/80" : "bg-yellow-400/80"
            )}
          />

          {/* Main content area */}
          <div className="w-full px-3 py-2.5">
            <div className="flex justify-between items-start mb-1.5">
              {/* Title */}
              <h3 className="text-base font-medium text-[#333333]">{item.name}</h3>
              
              {/* Info button moved to top right */}
              <div className="tooltip-container relative">
                <button 
                  type="button"
                  className="rounded-full p-0.5 text-[#777777] bg-[#f5f5f5] hover:bg-[#eaeaea] transition-colors duration-200"
                  onClick={(e) => handleTooltipToggle(e, item.id)}
                  aria-label="Mostrar más información"
                  title="Ver descripción"
                >
                  <Info size="size-4" />
                </button>
                {activeTooltip === item.id && (
                  <div 
                    className="tooltip-container absolute z-50 right-0 top-full mt-1.5 w-64 rounded-lg bg-white p-2 text-xs text-[#555555] shadow-lg border border-[#e8e8e8]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="font-medium mb-0.5">Descripción:</div>
                    <div className="text-[#666666] text-xs">{item.description}</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom row with status indicator and detailed analysis link */}
            <div className="flex items-center justify-between mt-3">
              {/* Status indicator moved to bottom left */}
              {item.isCorrect ? (
                <div className="flex items-center">
                  <Check customClass="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="text-sm text-[#444444] font-medium">Correcto</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <ExclamationTriangle customClass="h-4 w-4 text-yellow-500 mr-1.5" />
                  <span className="text-sm text-[#444444] font-medium">Revisar</span>
                </div>
              )}

              {/* "Ver análisis detallado" button with no border in default state, only fill on hover */}
              <button
                type="button"
                onClick={() => handleDetail(item)}
                className="group/btn flex items-center gap-0.5 text-blue-500 hover:text-white px-2 py-1 rounded transition-all duration-300 text-xs font-medium bg-transparent hover:bg-blue-500/90 cursor-pointer"
              >
                <span>Ver análisis detallado</span>
                <RightArrow size="size-3" strokeWidth={2} customClass="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
