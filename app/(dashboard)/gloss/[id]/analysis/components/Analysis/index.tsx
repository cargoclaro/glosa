"use client";

import { useState } from "react";
import Detailed from "./Detailed";
import { cn } from "@/app/utils/cn";
import { useModal } from "@/app/hooks";
import { GenericCard, Modal } from "@/app/components";
import {
  Check,
  XMark,
  Search,
  RightArrow,
  ExclamationTriangle,
} from "@/public/icons";
import { ICustomGloss } from "@/app/interfaces";

export interface IRestrictionSelected {
  id: number;
  title: string;
  status: string;
  result: string;
  summary: string;
  description: string;
  comparisons: string;
  actionsToTake: string;
}

interface IAnalysis {
  type: string;
  isVerified: boolean;
  taxes: ICustomGloss["customGlossTaxes"];
  restrictionsNRegulations: ICustomGloss["customGlossNonTariffRestrictionNRegulations"];
}

const Analysis = ({
  type,
  isVerified,
  taxes,
  restrictionsNRegulations,
}: IAnalysis) => {
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);
  const [restrictionSelected, setRestrictionSelected] =
    useState<IRestrictionSelected>({
      id: 0,
      title: "",
      description: "",
      status: "",
      result: "",
      comparisons: "",
      actionsToTake: "",
      summary: "",
    });

  const handleDetail = (restriction: IRestrictionSelected) => {
    setRestrictionSelected(restriction);
    openMenu();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeMenu} menuRef={menuRef}>
        <Detailed restriction={restrictionSelected} />
      </Modal>
      <GenericCard customClass="">
        <h1 className="flex justify-center items-center gap-2 font-semibold pb-2 border-b border-black">
          <Search size="size-5" />
          Análisis
        </h1>
        <h2
          title={type}
          className={cn(
            "mt-4 px-12 py-2 rounded-full text-center border truncate",
            type === "REGULATION"
              ? "bg-yellow-100 border-yellow-400"
              : "bg-blue-100 border-blue-400"
          )}
        >
          {type === "REGULATION" ? "Regulación" : "Restricción"}
        </h2>
        <h3 className="mt-4 pt-4 border-dashed border-t border-t-black text-center font-medium">
          Impuestos Aplicables
        </h3>
        <table className="w-full text-center">
          <tbody>
            {taxes.map((tax) => (
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
        <div className="border-dashed border-b border-b-black my-4" />
        <h4 className="text-center font-medium">
          Restricciones y Regulaciones No Arancelarias
        </h4>
        <ul className="my-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto overflow-x-hidden">
          {restrictionsNRegulations.map((restriction) => (
            <li
              key={restriction.id}
              onClick={() => handleDetail(restriction)}
              className={cn(
                "flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-2 rounded-lg p-2 border text-sm group cursor-pointer",
                restriction.status === "CHECKED"
                  ? "bg-green-100/50 hover:bg-green-100/80 border-green-500 text-green-500"
                  : restriction.status === "WARNING"
                  ? "bg-yellow-100/50 hover:bg-yellow-100/80 border-yellow-500 text-yellow-500"
                  : "bg-red-100/50 hover:bg-red-100/80 border-red-500 text-red-500"
              )}
            >
              {restriction.status === "CHECKED" ? (
                <span>
                  <Check />
                </span>
              ) : restriction.status === "WARNING" ? (
                <span>
                  <ExclamationTriangle />
                </span>
              ) : (
                <span>
                  <XMark />
                </span>
              )}
              <p className="text-black font-semibold">
                {restriction.title + ": "}
                <span className="font-normal">{restriction.description}</span>
              </p>
              <span className="text-black p-1 rounded-full border-2 border-black group-hover:animate-pulse animate-infinite">
                <RightArrow size="size-4" strokeWidth={4} />
              </span>
            </li>
          ))}
        </ul>
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
      </GenericCard>
    </>
  );
};

export default Analysis;
