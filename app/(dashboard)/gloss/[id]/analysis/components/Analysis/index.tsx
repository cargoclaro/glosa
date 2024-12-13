"use client";

import Detailed from "./Detailed";
import { useRef, useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useModal } from "@/app/shared/hooks";
import { GenericCard, Modal } from "@/app/shared/components";
import {
  Check,
  XMark,
  RightArrow,
  ExclamationTriangle,
  LeftChevron,
  RightChevron,
} from "@/app/shared/icons";
import { GLOSS_ANALYSIS_TABS } from "@/app/shared/constants";

export interface ICommonDataForDetail {
  id: number;
  title: string;
  status: string;
  description: string;
  result: string;
  summary: string;
  comparisons: string;
  actions_to_take: string;
}

interface IPedimentNum {
  number: bigint;
  status: string;
  anio: number;
  isVerified: boolean;
}

interface IOperationType {
  status: string;
  data: string;
  appendices: string;
  isVerified: boolean;
}

interface IDestinationOrigin {
  status: string;
  destinationOriginKey: string;
  appendixValidator: string;
  appendices: string;
  isVerified: boolean;
}

interface IOperation {
  status: string;
  isVerified: boolean;
  calculations: string;
}

interface IGrossWeight {
  status: string;
  isVerified: boolean;
  calculations: string;
}

interface IInvoiceData {
  status: string;
  isVerified: boolean;
  importerExporter: string;
  supplierBuyer: string;
}

interface ITransportData {
  status: string;
  type: string;
  data: string;
  isVerified: boolean;
}

interface IPartidas {
  taxes: string;
  status: string;
  isVerified: boolean;
  restrictionsRegulations: string;
}

interface IAnalysis {
  pedimentNum: IPedimentNum;
  operationType: IOperationType;
  destinationOrigin: IDestinationOrigin;
  operation: IOperation;
  grossWeight: IGrossWeight;
  invoiceData: IInvoiceData;
  transportData: ITransportData;
  partidas: IPartidas;
}

const Analysis = ({
  pedimentNum,
  operationType,
  destinationOrigin,
  operation,
  grossWeight,
  invoiceData,
  transportData,
  partidas,
}: IAnalysis) => {
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);
  const [tabSelected, setTabSelected] = useState("pedimentNum");
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const [dataForDetail, setDataForDetail] = useState<ICommonDataForDetail>({
    id: 0,
    title: "",
    description: "",
    status: "",
    result: "",
    comparisons: "",
    actions_to_take: "",
    summary: "",
  });

  const handleDetail = (data: ICommonDataForDetail) => {
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
    const currentIndex = GLOSS_ANALYSIS_TABS.findIndex(
      (tab) => tab.id === tabSelected
    );
    const nextIndex = (currentIndex + 1) % GLOSS_ANALYSIS_TABS.length;
    setTabSelected(GLOSS_ANALYSIS_TABS[nextIndex].id);
    scrollToTab(nextIndex);
  };

  const handlePrevious = () => {
    const currentIndex = GLOSS_ANALYSIS_TABS.findIndex(
      (tab) => tab.id === tabSelected
    );
    const prevIndex =
      (currentIndex - 1 + GLOSS_ANALYSIS_TABS.length) %
      GLOSS_ANALYSIS_TABS.length;
    setTabSelected(GLOSS_ANALYSIS_TABS[prevIndex].id);
    scrollToTab(prevIndex);
  };

  const handleTabClick = (id: string) => {
    const tabIndex = GLOSS_ANALYSIS_TABS.findIndex((tab) => tab.id === id);
    setTabSelected(id);
    scrollToTab(tabIndex);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeMenu} menuRef={menuRef}>
        <Detailed data={dataForDetail} />
      </Modal>
      <GenericCard>
        <div className="relative">
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
            {GLOSS_ANALYSIS_TABS.map((tab) => (
              <GenericTabLi
                key={tab.id}
                title={tab.title}
                active={tabSelected === tab.id}
                onClick={() => handleTabClick(tab.id)}
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
        {tabSelected === "pedimentNum" ? (
          <PedimentNum
            anio={pedimentNum.anio}
            number={pedimentNum.number}
            status={pedimentNum.status}
            isVerified={pedimentNum.isVerified}
          />
        ) : tabSelected === "operationType" ? (
          <OperationType
            data={operationType.data}
            status={operationType.status}
            appendices={operationType.appendices}
            isVerified={operationType.isVerified}
            handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
          />
        ) : tabSelected === "destinationOrigin" ? (
          <DestinationOrigin
            status={destinationOrigin.status}
            destinationOriginKey={destinationOrigin.destinationOriginKey}
            appendixValidator={destinationOrigin.appendixValidator}
            appendices={destinationOrigin.appendices}
            isVerified={operationType.isVerified}
            handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
          />
        ) : tabSelected === "operation" ? (
          <OperationNGrossWeight
            status={operation.status}
            isVerified={operation.isVerified}
            calculations={operation.calculations}
            handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
          />
        ) : tabSelected === "grossWeight" ? (
          <OperationNGrossWeight
            status={grossWeight.status}
            isVerified={grossWeight.isVerified}
            calculations={grossWeight.calculations}
            handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
          />
        ) : tabSelected === "invoiceData" ? (
          <InvoiceData
            status={invoiceData.status}
            isVerified={invoiceData.isVerified}
            importerExporter={invoiceData.importerExporter}
            supplierBuyer={invoiceData.supplierBuyer}
            handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
          />
        ) : tabSelected === "transportData" ? (
          <TransportData
            status={transportData.status}
            type={transportData.type}
            data={transportData.data}
            isVerified={transportData.isVerified}
            handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
          />
        ) : (
          tabSelected === "certification" && (
            <Partidas
              taxes={partidas.taxes}
              status={partidas.status}
              isVerified={partidas.isVerified}
              restrictionsRegulations={partidas.restrictionsRegulations}
              handleClick={(data: ICommonDataForDetail) => handleDetail(data)}
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
      onClick={onClick}
      className={cn(
        "border-b-2 min-w-48 text-center pb-2 hover:border-cargoClaroOrange-hover hover:text-cargoClaroOrange-hover",
        active
          ? "border-cargoClaroOrange text-cargoClaroOrange"
          : "border-black"
      )}
    >
      {title}
    </button>
  </li>
);

const PedimentNum = ({ anio, number, status, isVerified }: IPedimentNum) => (
  <>
    <h1 className="text-center font-bold py-10">{number.toString()}</h1>
    <DashedLine />
    <StatusHeader status={status} />
    <ul className="my-10 flex flex-col gap-4 md:mx-10 lg:mx-0 xl:mx-10">
      <li className="flex gap-2 justify-between items-center">
        <p className="size-10 py-2 px-4 rounded-full border border-black">1</p>
        <p>Año extraído = {anio}</p>
        <Check customClass="text-green-500" size="size-6" />
      </li>
      <li className="flex gap-2 justify-between items-center">
        <p className="size-10 py-2 px-3.5 rounded-full border border-black">
          2
        </p>
        <p>Año actual = {new Date().getFullYear()}</p>
        <Check customClass="text-green-500" size="size-6" />
      </li>
      <li className="flex gap-2 justify-between items-center">
        <p className="size-10 py-2 px-3.5 rounded-full border border-black">
          3
        </p>
        <p>Año actual = Año extraído</p>
        {anio === new Date().getFullYear() ? (
          <Check customClass="text-green-500" size="size-6" />
        ) : (
          <XMark customClass="text-red-500" size="size-6" />
        )}
      </li>
    </ul>
    <VerifiedButton isVerified={isVerified} />
  </>
);

interface IOperationTypeWithHandle extends IOperationType {
  handleClick: (data: ICommonDataForDetail) => void;
}

const OperationType = ({
  status,
  data,
  appendices,
  isVerified,
  handleClick,
}: IOperationTypeWithHandle) => {
  interface IOperationTypeData {
    id: number;
    name: string;
    value: string;
    is_check: boolean;
  }
  const dataParsed = JSON.parse(data) as IOperationTypeData[];

  return (
    <>
      <table className="w-full text-center my-5">
        <tbody>
          {dataParsed.map((item) => (
            <tr key={item.id}>
              <td className="w-2/3 border-r border-r-black pr-2">
                {item.name}
              </td>
              <td className="w-1/3 font-bold">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <DashedLine />
      <StatusHeader status={status} />
      <table className="w-full text-center my-5">
        <tbody>
          {dataParsed.map((item) => (
            <tr key={item.id}>
              <td className="border-r border-r-black font-bold pr-2">
                {item.value}
              </td>
              <td className="">
                {item.is_check ? (
                  <Check customClass="text-green-500 mx-auto" size="size-6" />
                ) : (
                  <XMark customClass="text-red-500" size="size-6" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DashedLine />
      <p className="mt-4 text-center font-bold">APÉNDICES</p>
      <DataListForSummaryCard data={appendices} handleDetail={handleClick} />
      <VerifiedButton isVerified={isVerified} />
    </>
  );
};

interface IDestinationOriginWithHandle extends IDestinationOrigin {
  handleClick: (data: ICommonDataForDetail) => void;
}

const DestinationOrigin = ({
  status,
  destinationOriginKey,
  appendixValidator,
  appendices,
  isVerified,
  handleClick,
}: IDestinationOriginWithHandle) => (
  <>
    <StatusHeader status={status} />
    <DashedLine customClass="mt-4" />
    <table className="w-full text-center my-5">
      <tbody>
        <tr>
          <td className="border-r border-r-black font-bold w-1/2 pr-2">
            Destino/Origen
          </td>
          <td>{destinationOriginKey}</td>
        </tr>
      </tbody>
    </table>
    <DashedLine />
    <p className="mt-10 mb-4 font-bold text-center">Pasos</p>
    <ul className="mb-10 flex flex-col gap-4 md:mx-10 lg:mx-0 2xl:mx-10">
      <li className="flex gap-2 justify-between items-center">
        <p className="size-10 py-2 px-4 rounded-full border border-black">1</p>
        <p>Clave DESTINO/ORIGEN</p>
        <Check customClass="text-green-500" size="size-6" />
      </li>
      <li className="flex gap-2 justify-between items-center">
        <p className="size-10 py-2 px-3.5 rounded-full border border-black">
          2
        </p>
        <p>Validar con {appendixValidator}</p>
        <Check customClass="text-green-500" size="size-6" />
      </li>
      <li className="flex gap-2 justify-between items-center">
        <p className="size-10 py-2 px-3.5 rounded-full border border-black">
          3
        </p>
        <p>Confirmar con destino final</p>
        <Check customClass="text-green-500" size="size-6" />
      </li>
    </ul>
    <DashedLine />
    <p className="mt-4 text-center font-bold">APÉNDICES</p>
    <DataListForSummaryCard data={appendices} handleDetail={handleClick} />
    <VerifiedButton isVerified={isVerified} />
  </>
);

interface IOperationNGrossWeightWithHandle extends IOperation {
  handleClick: (data: ICommonDataForDetail) => void;
}

const OperationNGrossWeight = ({
  status,
  isVerified,
  calculations,
  handleClick,
}: IOperationNGrossWeightWithHandle) => {
  const dataParsed = JSON.parse(calculations) as ICommonDataForDetail[];

  return (
    <>
      <StatusHeader status={status} />
      <DashedLine customClass="mt-4" />
      <table className="w-full text-center my-5">
        <tbody>
          {dataParsed.map((item) => (
            <tr key={item.id}>
              <td className="w-1/2 border-r border-r-black font-bold pr-2">
                {item.title}
              </td>
              <td className="">
                {item.status === "CHECKED" ? (
                  <Check customClass="text-green-500 mx-auto" size="size-6" />
                ) : (
                  <XMark customClass="text-red-500 mx-auto" size="size-6" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DashedLine />
      <p className="mt-4 font-bold text-center">Cálculos</p>
      <DataListForSummaryCard data={calculations} handleDetail={handleClick} />
      <VerifiedButton isVerified={isVerified} />
    </>
  );
};

interface IInvoiceDataWithHandle extends IInvoiceData {
  handleClick: (data: ICommonDataForDetail) => void;
}

const InvoiceData = ({
  status,
  isVerified,
  importerExporter,
  supplierBuyer,
  handleClick,
}: IInvoiceDataWithHandle) => {
  interface IImporterExporterDetails {
    rfc_is_check: boolean;
    tax_address_is_check: boolean;
    company_name_is_check: boolean;
    details: string;
  }
  const importerExporterParsed = JSON.parse(
    importerExporter
  ) as IImporterExporterDetails;
  const { details: importerExporterParsedDetails } = importerExporterParsed;

  interface ISupplierBuyerDetails {
    company_name_is_check: boolean;
    address_is_check: boolean;
    tax_id: boolean; // tax_id_is_check
    details: string;
  }
  const supplierBuyerParsed = JSON.parse(
    supplierBuyer
  ) as ISupplierBuyerDetails;
  const { details: supplierBuyerParsedDetails } = supplierBuyerParsed;

  return (
    <>
      <StatusHeader status={status} />
      <DashedLine customClass="mt-4" />
      <p className="mt-4 text-center font-bold">Importador/Exportador</p>
      <table className="w-full text-center my-5">
        <tbody>
          <tr>
            <td className="w-1/2 border-r border-r-black pr-2">
              RFC Importador
            </td>
            <td>
              {importerExporterParsed.rfc_is_check ? (
                <Check customClass="text-green-500 mx-auto" size="size-6" />
              ) : (
                <XMark customClass="text-red-500" size="size-6" />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-1/2 border-r border-r-black pr-2">
              Domicilio Fiscal
            </td>
            <td>
              {importerExporterParsed.tax_address_is_check ? (
                <Check customClass="text-green-500 mx-auto" size="size-6" />
              ) : (
                <XMark customClass="text-red-500" size="size-6" />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-1/2 border-r border-r-black pr-2">
              Nombre/Razón Social
            </td>
            <td>
              {importerExporterParsed.company_name_is_check ? (
                <Check customClass="text-green-500 mx-auto" size="size-6" />
              ) : (
                <XMark customClass="text-red-500" size="size-6" />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <DataListForSummaryCard
        data={JSON.stringify([importerExporterParsedDetails])}
        handleDetail={handleClick}
      />
      <DashedLine />
      <p className="mt-4 text-center font-bold">Proveedor/Comprador</p>
      <table className="w-full text-center my-5">
        <tbody>
          <tr>
            <td className="w-1/2 border-r border-r-black pr-2">
              Nombre/Razón Social
            </td>
            <td>
              {supplierBuyerParsed.company_name_is_check ? (
                <Check customClass="text-green-500 mx-auto" size="size-6" />
              ) : (
                <XMark customClass="text-red-500" size="size-6" />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-1/2 border-r border-r-black pr-2">Domicilio</td>
            <td>
              {supplierBuyerParsed.address_is_check ? (
                <Check customClass="text-green-500 mx-auto" size="size-6" />
              ) : (
                <XMark customClass="text-red-500" size="size-6" />
              )}
            </td>
          </tr>
          <tr>
            <td className="w-1/2 border-r border-r-black pr-2">ID Fiscal</td>
            <td>
              {supplierBuyerParsed.tax_id ? (
                <Check customClass="text-green-500 mx-auto" size="size-6" />
              ) : (
                <XMark customClass="text-red-500" size="size-6" />
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <DataListForSummaryCard
        data={JSON.stringify([supplierBuyerParsedDetails])}
        handleDetail={handleClick}
      />
      <VerifiedButton isVerified={isVerified} />
    </>
  );
};

interface ITransportDataWithHandle extends ITransportData {
  handleClick: (data: ICommonDataForDetail) => void;
}

const TransportData = ({
  status,
  type,
  data,
  isVerified,
  handleClick,
}: ITransportDataWithHandle) => {
  const dataParsed = JSON.parse(data) as ICommonDataForDetail[];

  return (
    <>
      <StatusHeader status={status} />
      <DashedLine customClass="mt-4" />
      <ul className="flex gap-2 items-center justify-between md:text-3xl lg:text-xl xl:text-3xl mt-4 md:mx-10 lg:mx-0 2xl:mx-10">
        <li
          className={cn(
            "px-5 py-4 rounded-full border",
            type === "LAND" ? "border-cargoClaroOrange" : "border-white"
          )}
        >
          🚚
        </li>
        <li
          className={cn(
            "px-5 py-4 rounded-full border",
            type === "AIR" ? "border-cargoClaroOrange" : "border-white"
          )}
        >
          ✈️
        </li>
        <li
          className={cn(
            "px-5 py-4 rounded-full border",
            type === "SEA" ? "border-cargoClaroOrange" : "border-white"
          )}
        >
          🚢
        </li>
      </ul>
      <DashedLine customClass="mt-4" />
      <p className="mt-4 text-center font-bold">Datos del Vehículo</p>
      <table className="w-full text-center my-5">
        <tbody>
          {dataParsed.map((item) => (
            <tr key={item.id}>
              <td className="w-1/2 border-r border-r-black font-bold pr-2">
                {item.title}
              </td>
              <td className="">
                {item.status === "CHECKED" ? (
                  <Check customClass="text-green-500 mx-auto" size="size-6" />
                ) : (
                  <XMark customClass="text-red-500" size="size-6" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DashedLine />
      <DataListForSummaryCard data={data} handleDetail={handleClick} />
      <VerifiedButton isVerified={isVerified} />
    </>
  );
};

interface IPartidasWithHandle extends IPartidas {
  handleClick: (data: ICommonDataForDetail) => void;
}

const Partidas = ({
  status,
  isVerified,
  taxes,
  restrictionsRegulations,
  handleClick,
}: IPartidasWithHandle) => {
  interface ITax {
    id: number;
    tax: number;
    type: string;
    isCheck: boolean;
  }
  const taxesParsed = JSON.parse(taxes) as ITax[];
  const restrictionsRegulationsParsed = JSON.parse(
    restrictionsRegulations
  ) as ICommonDataForDetail[];

  console.log(taxesParsed);

  return (
    <>
      <StatusHeader status={status} />
      <DashedLine customClass="mt-4" />
      <p className="mt-4 text-center font-bold">Impuestos Aplicables</p>
      <table className="w-full text-center mt-4">
        <tbody>
          {taxesParsed.map((tax) => (
            <tr key={tax.id}>
              <td className="border-r border-r-black">{tax.type}</td>
              <td>{tax.tax > 0 ? `${tax.tax}%` : "Exento"}</td>
              <td>
                {tax.isCheck ? (
                  <Check customClass="text-green-500" size="size-4" />
                ) : (
                  <XMark customClass="text-red-500" size="size-4" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DashedLine customClass="mt-4" />
      <p className="mt-4 text-center font-bold">
        Restricciones y Regulaciones No Arancelarias
      </p>
      <DataListForSummaryCard
        data={JSON.stringify(restrictionsRegulationsParsed)}
        handleDetail={handleClick}
      />
      <VerifiedButton isVerified={isVerified} />
    </>
  );
};

interface IVerifiedButton {
  isVerified: boolean;
  onClick?: () => void;
}

const VerifiedButton = ({ isVerified }: IVerifiedButton) => (
  <div className="text-center">
    <button
      disabled={isVerified}
      className={cn(
        "px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm",
        isVerified
          ? "bg-gray-300 cursor-not-allowed text-gray-900"
          : "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
      )}
    >
      {isVerified ? "Análisis Verificado" : "Marcar como verificado"}
    </button>
  </div>
);

const StatusHeader = ({ status }: { status: string }) => (
  <h2
    title={status}
    className={cn(
      "mt-4 px-12 py-2 rounded-full text-center border truncate",
      status === "Validation"
        ? "bg-green-100 border-green-400"
        : "bg-red-100 border-red-400"
    )}
  >
    {status === "Validation" ? "Validación" : "Error"}
  </h2>
);

const DashedLine = ({ customClass = "" }: { customClass?: string }) => (
  <div className={cn("border-dashed border-b border-b-black", customClass)} />
);

interface IDataListForSummaryCard {
  data: string;
  handleDetail: (data: ICommonDataForDetail) => void;
}

const DataListForSummaryCard = ({
  data,
  handleDetail,
}: IDataListForSummaryCard) => {
  const parsedData = JSON.parse(data) as ICommonDataForDetail[];

  return (
    <ul className="my-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto overflow-x-hidden">
      {parsedData.map((item) => (
        <li
          key={item.id}
          onClick={() => handleDetail(item)}
          className={cn(
            "flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-2 rounded-lg p-2 border text-sm group cursor-pointer",
            item.status === "CHECKED"
              ? "bg-green-100/50 hover:bg-green-100/80 border-green-500 text-green-500"
              : item.status === "WARNING"
              ? "bg-yellow-100/50 hover:bg-yellow-100/80 border-yellow-500 text-yellow-500"
              : "bg-red-100/50 hover:bg-red-100/80 border-red-500 text-red-500"
          )}
        >
          {item.status === "CHECKED" ? (
            <span>
              <Check />
            </span>
          ) : item.status === "WARNING" ? (
            <span>
              <ExclamationTriangle />
            </span>
          ) : (
            <span>
              <XMark />
            </span>
          )}
          <p className="text-black font-semibold">
            {item.title + ": "}
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
