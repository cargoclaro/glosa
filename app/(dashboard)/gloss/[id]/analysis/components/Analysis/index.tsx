"use client";

import { useState } from "react";
import { cn } from "@/app/utils/cn";
import { useModal } from "@/app/hooks";
import { GenericCard, Modal } from "@/app/components";
import { Check, RightArrow, Search, XMark } from "@/public/icons";
import ExclamationTriangle from "@/public/icons/ExclamationTriangle";
import Detailed from "./Detailed";

export interface IRestrictionSelected {
  id: number;
  title: string;
  description: string;
  status: string;
  result: string;
  comparisons: string;
  actionsToTake: string;
  summary: string;
}

const Analysis = () => {
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

  console.log(restrictionSelected);

  const dummyData = {
    analysisType: "Regulación",
    isVerified: false,
    customGlossTaxes: [
      {
        id: 1,
        tax: 16,
        type: "IVA",
        isCheck: true,
      },
      {
        id: 2,
        tax: 5,
        type: "IGI",
        isCheck: true,
      },
      {
        id: 3,
        tax: 0,
        type: "IEPS",
        isCheck: true,
      },
    ],
    customGlossNonTariffRestrictionNRegulations: [
      {
        id: 1,
        title: "(NOM-024-SCFI-2013)",
        description:
          "Se requiere etiquetado, a menos que el producto sea para uso exclusivo automotriz, lo cual no aplica en este caso. [Capítulo 5 de la Ley de Infraestructura de la Calidad]",
        status: "CHECKED",
        result: "Cumplimiento Obligatorio",
        comparisons:
          '[{"id": 1,"title": "1. Descripción del Producto (Ficha Técnica)","description":"❕ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**. [(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://google.com)"},{"id": 2,"title": "2. Exención de la NOM (Ficha Técnica vs Artículos)","description":"❌ No aplica exención - Solo están exentas las mercancías con una dimensión menor a 3mm. Este producto tiene 3mm, por lo que debe cumplir con la NOM. [(Ver Artículo 5.3 - Exención para productos menores a 3mm)](https://google.com) [(Ver Ficha Técnica - Confirmación de dimensiones)](https://google.com)"},{"id": 3,"title": "3. Instrucciones de Uso (Ficha Técnica)","description":"❌ No cumple - Las instrucciones proporcionadas están solo en inglés, lo cual infringe el requisito de estar en español. [(Ver Artículo 7.2 - Instrucciones en idioma español obligatorias)](https://google.com) [(Ver Ficha Técnica - Sección de Instrucciones)](https://google.com)"},{"id": 4,"title": "4. Advertencias de Seguridad (Ficha Técnica)","description":"❕ Cumple parcialmente - Se incluyen advertencias, pero faltan detalles sobre riesgos específicos. [(Ver Artículo 7.5 - Advertencias de seguridad obligatorias y detalladas)](https://google.com) [(Ver Ficha Técnica - Sección de Seguridad)](https://google.com)"}]',
        actionsToTake:
          '[{"id": 1,"description":"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**."},{"id": 2,"description":"**Actualizar la Factura**: Incluir instrucciones en español."},{"id": 3,"description":"**Completar la Sección de Seguridad**: Añadir detalles más específicos sobre los riesgos."}]',
        summary:
          "Este resumen indica que, tras glosar la Ficha Técnica contra los artículos correspondientes de la **NOM-024-SCFI-2013**, **se determinó que el producto no es exento debido a su dimensión de 3mm**, y debe cumplir con la norma. Se han citado los artículos aplicables para facilitar la verificación.",
      },
      {
        id: 2,
        title: "(NOM-024-SCFI-2019)",
        description:
          "Se requiere etiquetado, a menos que el producto sea para uso exclusivo automotriz, lo cual no aplica en este caso. [Capítulo 5 de la Ley de Infraestructura de la Calidad]",
        status: "WARNING",
        result: "Cumplimiento Obligatorio",
        comparisons: "[]",
        actionsToTake: "[]",
        summary: "",
      },
      {
        id: 3,
        title: "STPSRRNA",
        description:
          "Aplica a mercancías producidas mediante trabajo forzoso o infantil. [Artículo 2 de la Ley Federal del Trabajo]",
        status: "CHECKED",
        result: "Cumplimiento Obligatorio",
        comparisons: "[]",
        actionsToTake: "[]",
        summary: "",
      },
    ],
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
          title={dummyData.analysisType}
          className={cn(
            "mt-4 px-12 py-2 rounded-full text-center border truncate",
            dummyData.analysisType === "Regulación"
              ? "bg-yellow-100 border-yellow-400"
              : "bg-blue-100 border-blue-400"
          )}
        >
          {dummyData.analysisType}
        </h2>
        <h3 className="mt-4 pt-4 border-dashed border-t border-t-black text-center font-medium">
          Impuestos Aplicables
        </h3>
        <table className="w-full text-center">
          <tbody>
            {dummyData.customGlossTaxes.map((tax) => (
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
          {dummyData.customGlossNonTariffRestrictionNRegulations.map(
            (restriction) => (
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
            )
          )}
        </ul>
        <div className="text-center">
          <button
            disabled={dummyData.isVerified}
            className={cn(
              "px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm",
              dummyData.isVerified
                ? "bg-gray-300 cursor-not-allowed text-gray-900"
                : "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
            )}
          >
            {dummyData.isVerified
              ? "Análisis Verificado"
              : "Marcar como verificado"}
          </button>
        </div>
      </GenericCard>
    </>
  );
};

export default Analysis;
