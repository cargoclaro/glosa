'use client';

import { GenericCard, Modal } from '@/shared/components';
import { INITIAL_STATE_RESPONSE } from '@/shared/constants';
import { useModal, useServerAction } from '@/shared/hooks';
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
import type { ISharedState } from '@/shared/interfaces';
import { markTabAsVerifiedByTabIdNCustomGlossID } from '@/shared/services/customGloss/controller';
import { cn } from '@/shared/utils/cn';
import { type JSX, useCallback, useEffect, useRef, useState } from 'react';
import type { ITabInfoSelected } from '../PedimentAnalysisNFinish';
import Detailed from './Detailed';
import type { InferSelectModel } from 'drizzle-orm';
import type {
  CustomGloss,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStep,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStepResources
} from '~/db/schema';

type TabValidation = InferSelectModel<typeof CustomGlossTabValidationStep> & {
  resources: InferSelectModel<typeof CustomGlossTabValidationStepResources>[];
  actionsToTake: InferSelectModel<typeof CustomGlossTabValidationStepActionToTake>[];
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
    updatedAt: new Date(),
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
      title={title}
      onClick={onClick}
      className={cn(
        'min-w-64 border-b-2 pb-2 text-center hover:border-cargoClaroOrange-hover hover:text-cargoClaroOrange-hover',
        active
          ? 'border-cargoClaroOrange text-cargoClaroOrange'
          : 'border-black'
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
  return (
    <>
      <StatusHeader status={data.isCorrect} />
      <SectionDivider title="Pasos de Validación" icon={<ArrowTrendingUp />} />
      <DataListForSummaryCard
        data={data.validations}
        handleDetail={handleClick}
      />
      <SectionDivider title="Fuentes" icon={<DocMagniGlass />} />
      <ul className="mt-4 flex max-h-[160px] flex-col gap-1 overflow-y-auto">
        {uniqueOrigins.map((origin, index) => (
          <li key={index} className="">
            <p
              title={origin}
              className="inline-flex w-full items-center justify-center gap-1 truncate rounded-full border border-purple-400 bg-purple-100 px-12 py-2 text-center"
            >
              <span>
                <Document />
              </span>
              {origin.toUpperCase()}
            </p>
          </li>
        ))}
      </ul>
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
  const { response, isLoading, setIsLoading } =
    useServerAction<ISharedState>(INITIAL_STATE_RESPONSE);

  const handleVerify = async () => {
    setIsLoading(true);
    await markTabAsVerifiedByTabIdNCustomGlossID({
      tabId,
      customGlossId,
    });
    setIsLoading(false);
  };

  return (
    <div className="text-center">
      {response.message && <p className="text-red-500">{response.message}</p>}
      <button
        disabled={isVerified}
        onClick={() => handleVerify()}
        className={cn(
          'rounded-md border border-white px-12 py-2 text-sm shadow-black/50 shadow-md',
          isLoading && 'cursor-not-allowed opacity-50',
          isVerified
            ? 'cursor-not-allowed bg-gray-300 text-gray-900'
            : 'bg-cargoClaroOrange text-white hover:bg-cargoClaroOrange-hover'
        )}
      >
        {isVerified ? 'Análisis Verificado' : 'Marcar como verificado'}
      </button>
    </div>
  );
};

const StatusHeader = ({ status }: { status: boolean }) => (
  <h2
    title={status ? 'El análisis fue correcto' : 'El análisis no fue correcto'}
    className={cn(
      'mt-4 truncate rounded-full border px-12 py-2 text-center',
      status
        ? 'border-green-400 bg-green-100'
        : 'border-yellow-400 bg-yellow-100'
    )}
  >
    {status ? 'Todo parece bien' : 'Verificar datos'}
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
            {item.name + ': '}
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
