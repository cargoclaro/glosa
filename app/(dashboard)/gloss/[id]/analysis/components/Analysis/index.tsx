'use client';

import { GenericCard, Modal } from '@/shared/components';
import { useModal } from '@/shared/hooks';
import {
  ArrowTrendingUp,
  Check,
  DocMagniGlass,
  Document,
  ExclamationTriangle,
  LeftChevron,
  RightArrow,
  RightChevron,
} from '@/shared/icons';
import { markTabAsVerifiedByTabIdNCustomGlossID } from '@/shared/services/customGloss/controller';
import { useMutation } from '@tanstack/react-query';
import type { InferSelectModel } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import { type JSX, useCallback, useEffect, useRef, useState } from 'react';
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
      const tabWidth = container.firstElementChild?.clientWidth || 100;
      container.scrollTo({ left: index * (tabWidth + 16), behavior: 'smooth' });
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
      <GenericCard>
        <div className="relative w-full">
          <button
            type="button"
            className="absolute top-0 left-0 rounded-full bg-white/70 p-1 shadow-md transition-colors duration-200 hover:bg-white/90"
            onClick={handlePrevious}
          >
            <LeftChevron />
          </button>
          <ul
            ref={scrollContainerRef}
            style={{ scrollbarWidth: 'none' }}
            className="flex gap-4 overflow-x-scroll font-semibold"
          >
            {tabs.map((tab) => (
              <GenericTabLi
                key={tab.id}
                title={tab.name}
                active={tabSelected === tab.name}
                onClick={() => handleTabClick(tab.name)}
              />
            ))}
          </ul>
          <button
            type="button"
            className="absolute top-0 right-0 rounded-full bg-white/70 p-1 shadow-md transition-colors duration-200 hover:bg-white/90"
            onClick={handleNext}
          >
            <RightChevron />
          </button>
        </div>
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

interface IGenericTabLi {
  title: string;
  active: boolean;
  onClick: () => void;
}

const GenericTabLi = ({ title, active, onClick }: IGenericTabLi) => (
  <li>
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'min-w-64 border-b-2 pb-2 text-center hover:border-primary/80 hover:text-primary/80',
        active ? 'border-primary text-primary' : 'border-black'
      )}
    >
      <p className="line-clamp-1">{title}</p>
    </button>
  </li>
);

interface IGenericTabComponent {
  data: tabs;
  handleClick: (data: tabs['validations'][number]) => void;
}

const GenericTabComponent = ({ data, handleClick }: IGenericTabComponent) => {
  const uniqueOrigins = Array.from(
    new Set(data.context.map((item) => item.origin))
  );
  const [showAllOrigins, setShowAllOrigins] = useState(false);

  // Display only first 3 documents initially
  const displayOrigins = showAllOrigins
    ? uniqueOrigins
    : uniqueOrigins.slice(0, 3);

  // Check if we need to show the "Show more" button
  const hasMoreOrigins = uniqueOrigins.length > 3;

  return (
    <>
      <StatusHeader status={data.isCorrect} />
      <SectionDivider title="Pasos de Validación" icon={<ArrowTrendingUp />} />
      <p className="mb-2 text-center text-gray-600 text-sm italic">
        Haga <strong>clic</strong> en las validaciones para ver una explicación
        detallada
      </p>
      <DataListForSummaryCard
        data={data.validations}
        handleDetail={handleClick}
      />
      <SectionDivider title="Fuentes" icon={<DocMagniGlass />} />
      <div className="relative">
        <ul className="mt-4 mb-4 flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
          {displayOrigins.map((origin, index) => (
            <li key={index} className="w-full">
              <div
                title={origin}
                className="flex items-center gap-2.5 rounded-lg bg-[#f6eeff] px-4 py-3 transition-colors duration-200 hover:bg-[#f0e6ff]"
              >
                <Document />
                <span className="font-medium text-sm">
                  {origin.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {hasMoreOrigins && (
          <div className="mt-4 mb-4 flex justify-center">
            <button
              onClick={() => setShowAllOrigins(!showAllOrigins)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200"
              title={
                showAllOrigins
                  ? 'Mostrar menos'
                  : `Mostrar ${uniqueOrigins.length - 3} más`
              }
            >
              {showAllOrigins ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
                  width="16"
                  height="16"
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
      <div className="mb-4 border-t border-t-black" />
      <VerifiedButton
        tabId={data.id}
        isVerified={data.isVerified}
        customGlossId={data.customGlossId}
      />
    </>
  );
};

interface ISectionDivider {
  title: string;
  icon: JSX.Element;
}

const SectionDivider = ({ title, icon }: ISectionDivider) => (
  <>
    <DashedLine customClass="mt-4" />
    <p className="flex items-center justify-center gap-1 py-2 font-bold">
      <span>{icon}</span>
      {title}
    </p>
    <DashedLine customClass="mb-4" />
  </>
);

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
    buttonContent = 'Análisis Verificado';
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
          'rounded-md border border-white px-12 py-2 text-sm shadow-black/50 shadow-md',
          mutation.isPending && 'cursor-not-allowed opacity-50',
          isVerified
            ? 'cursor-not-allowed bg-gray-300 text-gray-900'
            : 'bg-primary text-white hover:bg-primary/80'
        )}
      >
        {buttonContent}
      </button>
    </div>
  );
};

const StatusHeader = ({ status }: { status: boolean }) => (
  <h2
    title={status ? 'El análisis fue correcto' : 'El análisis no fue correcto'}
    className={cn(
      'mt-4 flex w-full items-center justify-center gap-2 truncate rounded-md px-4 py-3 text-center',
      status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    )}
  >
    {status ? (
      <>
        <Check customClass="h-5 w-5 text-green-600" />
        <span>Todo parece bien</span>
      </>
    ) : (
      <>
        <ExclamationTriangle customClass="h-5 w-5 text-yellow-600" />
        <span>Verificar datos</span>
      </>
    )}
  </h2>
);

const DashedLine = ({ customClass = '' }: { customClass?: string }) => (
  <div className={cn('border-b border-b-black border-dashed', customClass)} />
);

interface IDataListForSummaryCard {
  data: tabs['validations'];
  handleDetail: (data: tabs['validations'][number]) => void;
}

const DataListForSummaryCard = ({
  data,
  handleDetail,
}: IDataListForSummaryCard) => {
  return (
    <ul className="my-4 flex max-h-[300px] flex-col gap-4 overflow-y-auto overflow-x-hidden">
      {data.map((item) => (
        <li
          key={item.id}
          onClick={() => handleDetail(item)}
          className={cn(
            'group flex cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border p-2 text-sm sm:flex-row lg:flex-col xl:flex-row',
            item.isCorrect
              ? 'border-green-500 bg-green-100/50 text-green-500 hover:bg-green-100/80'
              : 'border-yellow-500 bg-yellow-100/50 text-yellow-500 hover:bg-yellow-100/80'
          )}
        >
          {item.isCorrect ? (
            <span>
              <Check />
            </span>
          ) : (
            <span>
              <ExclamationTriangle />
            </span>
          )}
          <p className="font-semibold text-black">
            {`${item.name}: `}
            <span className="font-normal">{item.description}</span>
          </p>
          <span className="animate-infinite rounded-full border-2 border-black p-1 text-black group-hover:animate-pulse">
            <RightArrow size="size-4" strokeWidth={4} />
          </span>
        </li>
      ))}
    </ul>
  );
};
