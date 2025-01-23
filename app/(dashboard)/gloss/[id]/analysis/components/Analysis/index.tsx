"use client";

import Detailed from "./Detailed";
import { cn } from "@/app/shared/utils/cn";
import { useModal, useServerAction } from "@/app/shared/hooks";
import { GenericCard, Modal } from "@/app/shared/components";
import { ITabInfoSelected } from "../PedimentAnalysisNFinish";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  RightArrow,
  LeftChevron,
  RightChevron,
  DocMagniGlass,
  ArrowTrendingUp,
  ExclamationTriangle,
} from "@/app/shared/icons";
import type {
  ICustomGlossTab,
  ICustomGlossTabValidation,
  ISharedState,
} from "@/app/shared/interfaces";
import { markTabAsVerifiedByTabIdNCustomGlossID } from "@/app/shared/services/customGloss/controller";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";

export interface ICommonDataForDetail {
  id: number;
  title: string;
  status: string;
  description: string;
  result: string;
  comparisons: string;
  actions_to_take: string;
}

interface IAnalysis {
  tabs: ICustomGlossTab[];
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
  const [tabSelected, setTabSelected] = useState("N° de pedimento");

  const [dataForDetail, setDataForDetail] = useState<ICustomGlossTabValidation>(
    {
      id: 0,
      name: "",
      description: "",
      llmAnalysis: "",
      isCorrect: true,
      resources: [],
      actionsToTake: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      customGlossTabId: "",
    }
  );

  const handleDetail = (data: ICustomGlossTabValidation) => {
    setDataForDetail(data);
    openMenu();
  };

  const scrollToTab = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tabWidth = container.firstElementChild?.clientWidth || 100; // Ancho de cada tab
      container.scrollTo({ left: index * (tabWidth + 16), behavior: "smooth" }); // 16px es el `gap`
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.name === tabSelected);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setTabSelected(tabs[nextIndex].name);
    setTabInfoSelected({
      name: tabs[nextIndex].name,
      isCorrect: tabs[nextIndex].isCorrect,
      isVerified: tabs[nextIndex].isVerified,
    });
    scrollToTab(nextIndex);
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.name === tabSelected);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setTabSelected(tabs[prevIndex].name);
    setTabInfoSelected({
      name: tabs[prevIndex].name,
      isCorrect: tabs[prevIndex].isCorrect,
      isVerified: tabs[prevIndex].isVerified,
    });
    scrollToTab(prevIndex);
  };

  const handleTabClick = useCallback(
    (id: string) => {
      const tabIndex = tabs.findIndex((tab) => tab.name === id);
      setTabSelected(id);
      setTabInfoSelected({
        name: tabs[tabIndex].name,
        isCorrect: tabs[tabIndex].isCorrect,
        isVerified: tabs[tabIndex].isVerified,
      });
      scrollToTab(tabIndex);
    },
    [tabs, setTabInfoSelected]
  );

  useEffect(() => {
    if (tabSelectedFromDocument !== "") {
      if (tabSelectedFromDocument === "NUM. PEDIMENTO:") {
        handleTabClick("N° de pedimento");
      } else if (
        tabSelectedFromDocument === "T. OPER" ||
        tabSelectedFromDocument === "T.OPER" ||
        tabSelectedFromDocument === "TIPO OPER" ||
        tabSelectedFromDocument === "TIPO OPER:" ||
        tabSelectedFromDocument === "TIPO OPER.:"
      ) {
        handleTabClick("Tipo de Operación");
      } else if (
        tabSelectedFromDocument === "DESTINO:" ||
        tabSelectedFromDocument === "DESTINO/ORIGEN:"
      ) {
        handleTabClick("Destino/Origen de Mercancías");
      } else if (
        tabSelectedFromDocument === "TIPO CAMBIO:" ||
        tabSelectedFromDocument === "VALOR DOLARES:" ||
        tabSelectedFromDocument === "VAL. SEGUROS" ||
        tabSelectedFromDocument === "VAL.SEGUROS" ||
        tabSelectedFromDocument === "FECHAS"
      ) {
        handleTabClick("Operación (Fecha de entrada y Tipo de cambio)");
      } else if (tabSelectedFromDocument === "PESO BRUTO:") {
        handleTabClick("Pesos y Bultos");
      } else if (
        tabSelectedFromDocument === "DATOS DEL IMPORTADOR/EXPORTADOR" ||
        tabSelectedFromDocument === "DATOS DEL IMPORTADOR / EXPORTADOR" ||
        tabSelectedFromDocument === "DATOS DEL PROVEEDOR O COMPRADOR"
      ) {
        handleTabClick("Datos de Factura");
      } else if (
        tabSelectedFromDocument === "PARTIDAS" ||
        tabSelectedFromDocument === "OBSERVACIONES A NIVEL PARTIDA"
      ) {
        handleTabClick("Partidas");
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
            className="absolute top-0 left-0 rounded-full p-1 shadow-md bg-white/70 hover:bg-white/90 transition-colors duration-200"
            onClick={handlePrevious}
          >
            <LeftChevron />
          </button>
          <ul
            ref={scrollContainerRef}
            style={{ scrollbarWidth: "none" }}
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
            className="absolute top-0 right-0 rounded-full p-1 shadow-md bg-white/70 hover:bg-white/90 transition-colors duration-200"
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
        "border-b-2 min-w-64 text-center pb-2 hover:border-cargoClaroOrange-hover hover:text-cargoClaroOrange-hover",
        active
          ? "border-cargoClaroOrange text-cargoClaroOrange"
          : "border-black"
      )}
    >
      <p className="line-clamp-1">{title}</p>
    </button>
  </li>
);

interface IGenericTabComponent {
  data: ICustomGlossTab;
  handleClick: (data: ICustomGlossTabValidation) => void;
}

const GenericTabComponent = ({ data, handleClick }: IGenericTabComponent) => {
  return (
    <>
      <StatusHeader status={data.isCorrect} />
      <SectionDivider title="Contexto" icon={<DocMagniGlass />} />
      <table className="w-full text-center my-5">
        <tbody>
          {data.context[0].data.map((item) => (
            <tr key={item.id}>
              <td className="w-1/2 border-r border-r-black pr-2 py-2">
                <p title={item.name} className="line-clamp-1">
                  {item.name}
                </p>
              </td>
              <td className="w-1/2 font-bold">
                <p title={item.value} className="pl-1 line-clamp-1">
                  {item.value}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SectionDivider title="Fuentes" icon={<DocMagniGlass />} />
      <p
        title={`Anexo 22 - ${data.context[0].origin}`}
        className={cn(
          "mt-4 px-12 py-2 rounded-full text-center border truncate bg-purple-100 border-purple-400"
        )}
      >
        Anexo 22 {"->"} {data.context[0].origin}
      </p>
      <SectionDivider title="Pasos de Validación" icon={<ArrowTrendingUp />} />
      <DataListForSummaryCard
        data={data.validations}
        handleDetail={handleClick}
      />
      <div className="border-t border-t-black mb-4" />
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
    <p className="flex gap-1 items-center justify-center font-bold py-2">
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
  const { response, isLoading, setResponse, setIsLoading } =
    useServerAction<ISharedState>(INITIAL_STATE_RESPONSE);

  const handleVerify = async () => {
    setIsLoading(true);
    const res = await markTabAsVerifiedByTabIdNCustomGlossID({
      tabId,
      customGlossId,
    });
    if (res && !res.success) {
      setResponse(res);
    }
    setIsLoading(false);
  };

  return (
    <div className="text-center">
      {response.message && <p className="text-red-500">{response.message}</p>}
      <button
        disabled={isVerified}
        onClick={() => handleVerify()}
        className={cn(
          "px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm",
          isLoading && "cursor-not-allowed opacity-50",
          isVerified
            ? "bg-gray-300 cursor-not-allowed text-gray-900"
            : "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
        )}
      >
        {isVerified ? "Análisis Verificado" : "Marcar como verificado"}
      </button>
    </div>
  );
};

const StatusHeader = ({ status }: { status: boolean }) => (
  <h2
    title={status ? "El análisis fue correcto" : "El análisis no fue correcto"}
    className={cn(
      "mt-4 px-12 py-2 rounded-full text-center border truncate",
      status
        ? "bg-green-100 border-green-400"
        : "bg-yellow-100 border-yellow-400"
    )}
  >
    {status ? "Todo parece bien" : "Verificar datos"}
  </h2>
);

const DashedLine = ({ customClass = "" }: { customClass?: string }) => (
  <div className={cn("border-dashed border-b border-b-black", customClass)} />
);

interface IDataListForSummaryCard {
  data: ICustomGlossTabValidation[];
  handleDetail: (data: ICustomGlossTabValidation) => void;
}

const DataListForSummaryCard = ({
  data,
  handleDetail,
}: IDataListForSummaryCard) => {
  return (
    <ul className="my-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto overflow-x-hidden">
      {data.map((item) => (
        <li
          key={item.id}
          onClick={() => handleDetail(item)}
          className={cn(
            "flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-2 rounded-lg p-2 border text-sm group cursor-pointer",
            item.isCorrect
              ? "bg-green-100/50 hover:bg-green-100/80 border-green-500 text-green-500"
              : "bg-yellow-100/50 hover:bg-yellow-100/80 border-yellow-500 text-yellow-500"
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
          <p className="text-black font-semibold">
            {item.name + ": "}
            <span className="font-normal">{item.description}</span>
          </p>
          <span className="text-black p-1 rounded-full border-2 border-black group-hover:animate-pulse animate-infinite">
            <RightArrow size="size-4" strokeWidth={4} />
          </span>
        </li>
      ))}
    </ul>
  );
};
