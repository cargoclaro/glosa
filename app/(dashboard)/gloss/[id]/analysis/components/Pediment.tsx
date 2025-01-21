"use client";

import * as pdfjs from "pdfjs-dist";
import { cn } from "@/app/shared/utils/cn";
import { GenericCard } from "@/app/shared/components";
import React, { useEffect, useRef, useState } from "react";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { ITabInfoSelected } from "./PedimentAnalysisNFinish";
import { ICustomGlossTab } from "@/app/shared/interfaces";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface IPediment {
  document: string;
  tabs: ICustomGlossTab[];
  onClick: (tab: string) => void;
  tabInfoSelected: ITabInfoSelected;
}

const keywords = [
  "NUM. PEDIMENTO:",

  "T. OPER",
  "T.OPER",
  "TIPO OPER",
  "TIPO OPER:",
  "TIPO OPER.:",

  "DESTINO:",
  "DESTINO/ORIGEN:",

  "TIPO CAMBIO:",
  "VALOR DOLARES:",
  "VAL. SEGUROS",
  "VAL.SEGUROS",
  "FECHAS", // ⚠️ WARNING ⚠️

  "PESO BRUTO:",

  "DATOS DEL IMPORTADOR/EXPORTADOR",
  "DATOS DEL IMPORTADOR / EXPORTADOR",
  "DATOS DEL PROVEEDOR O COMPRADOR",

  "PARTIDAS",
  "OBSERVACIONES A NIVEL PARTIDA",
]; // Palabras clave a buscar

interface IKeywordPosition {
  x: number;
  y: number | ((currentPage: number) => number);
  w: number | ((currentPage: number) => number);
  h: number | ((currentPage: number) => number);
}

const sharedConfigForTipoOper = {
  x: 0,
  y: (currentPage: number) => (currentPage !== 1 ? -15 : 0),
  w: (currentPage: number) => (currentPage === 1 ? 175 : 125),
  h: (currentPage: number) => (currentPage !== 1 ? 15 : 0),
};

const sharedConfigForDestino = {
  x: 0,
  y: 0,
  w: 35,
  h: 0,
};

const sharedConfigForDatosImportador = {
  x: -110,
  y: -50,
  w: 240,
  h: 50,
};

const sharedConfigForTipoCambioNPesoBruto = {
  x: 0,
  y: 0,
  w: 55,
  h: 0,
};

const sharedConfigValSeguros = {
  x: 0,
  y: -10,
  w: 335,
  h: 10,
};

const keywordPositions: Record<string, IKeywordPosition> = {
  "NUM. PEDIMENTO:": {
    x: 0,
    y: (currentPage) => (currentPage !== 1 ? -15 : 0),
    w: 90,
    h: (currentPage) => (currentPage !== 1 ? 15 : 0),
  },

  "T. OPER": sharedConfigForTipoOper,
  "T.OPER": sharedConfigForTipoOper,
  "TIPO OPER": sharedConfigForTipoOper,
  "TIPO OPER:": sharedConfigForTipoOper,
  "TIPO OPER.:": sharedConfigForTipoOper,

  "DESTINO:": sharedConfigForDestino,
  "DESTINO/ORIGEN:": sharedConfigForDestino,

  "TIPO CAMBIO:": sharedConfigForTipoCambioNPesoBruto,
  "VALOR DOLARES:": { x: 0, y: -18, w: 165, h: 18 },
  "VAL. SEGUROS": sharedConfigValSeguros,
  "VAL.SEGUROS": sharedConfigValSeguros,
  FECHAS: { x: -50, y: -30, w: 100, h: 30 },

  "PESO BRUTO:": sharedConfigForTipoCambioNPesoBruto,

  "DATOS DEL IMPORTADOR/EXPORTADOR": sharedConfigForDatosImportador,
  "DATOS DEL IMPORTADOR / EXPORTADOR": sharedConfigForDatosImportador,
  "DATOS DEL PROVEEDOR O COMPRADOR": { x: -210, y: -30, w: 400, h: 30 },

  PARTIDAS: { x: -255, y: -80, w: 510, h: 80 },
  "OBSERVACIONES A NIVEL PARTIDA": { x: -135, y: 50, w: 410, h: -70 },
};

const defaultConfig = { x: 0, y: 0, w: 0, h: 0 };

const keywordsConfig = {
  "NUM. PEDIMENTO:": "N° de pedimento",

  "T. OPER": "Tipo de Operación",
  "T.OPER": "Tipo de Operación",
  "TIPO OPER": "Tipo de Operación",
  "TIPO OPER:": "Tipo de Operación",
  "TIPO OPER.:": "Tipo de Operación",

  "DESTINO:": "Destino/Origen de Mercancías",
  "DESTINO/ORIGEN:": "Destino/Origen de Mercancías",

  "TIPO CAMBIO:": "Operación (Fecha de entrada y Tipo de cambio)",
  "VALOR DOLARES:": "Operación (Fecha de entrada y Tipo de cambio)",
  "VAL. SEGUROS": "Operación (Fecha de entrada y Tipo de cambio)",
  "VAL.SEGUROS": "Operación (Fecha de entrada y Tipo de cambio)",
  FECHAS: "Operación (Fecha de entrada y Tipo de cambio)",

  "PESO BRUTO:": "Pesos y Bultos",

  "DATOS DEL IMPORTADOR/EXPORTADOR": "Datos de Factura",
  "DATOS DEL IMPORTADOR / EXPORTADOR": "Datos de Factura",
  "DATOS DEL PROVEEDOR O COMPRADOR": "Datos de Factura",

  PARTIDAS: "Partidas",
  "OBSERVACIONES A NIVEL PARTIDA": "Partidas",
};

const Pediment = ({ tabs, document, onClick, tabInfoSelected }: IPediment) => {
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Indicador de carga
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorDetected, setErrorDetected] = useState(false);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);

  useEffect(() => {
    setIsLoading(true); // Empieza la carga del nuevo documento
    const loadingTask = pdfjs.getDocument(document);

    loadingTask.promise.then(
      (pdf) => {
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1); // Resetea a la primera página al cambiar documento
        setIsLoading(false); // Finaliza la carga
      },
      (reason) => {
        console.error("Error loading PDF: ", reason);
        setErrorDetected(true);
        setIsLoading(false); // Finaliza la carga incluso si hay un error
      }
    );
  }, [document]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDoc.getPage(currentPage);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;

      // Obtener contenido de texto y resaltar palabras clave
      const textContent = await page.getTextContent();
      const buffer = 0; // Margen adicional alrededor de los recuadros
      const clickableAreas: {
        x: number;
        y: number;
        width: number;
        height: number;
        text: string;
      }[] = [];

      (textContent.items as TextItem[]).forEach((item) => {
        const text = item.str;
        if (keywords.includes(text)) {
          const { transform, width, height } = item;

          const [, , , , offsetX, offsetY] = transform;

          const {
            x: customX,
            y: customY,
            w: customW,
            h: customH,
          } = getKeywordConfig(text, currentPage);

          const x = (offsetX + customX) * scale;
          const y = viewport.height - (offsetY + customY) * scale;
          const w = (width + customW) * scale;
          const h = (height + customH) * scale;

          context.strokeStyle = getStrokeStyle(text, tabs);
          context.lineWidth = 2;
          context.fillStyle = getFillStyle(text, tabInfoSelected);

          context.strokeRect(
            x - buffer,
            y - h - buffer,
            w + 2 * buffer,
            h + 2 * buffer
          );
          context.fillRect(
            x - buffer,
            y - h - buffer,
            w + 2 * buffer,
            h + 2 * buffer
          );

          // Agregar área para click
          clickableAreas.push({
            x: x - buffer,
            y: y - h - buffer,
            width: w + 2 * buffer,
            height: h + 2 * buffer,
            text,
          });
        }
      });

      // Manejar clics
      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();

        // Ajustar las coordenadas del clic según el tamaño escalado
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        clickableAreas.forEach((area) => {
          const { x, y, width, height, text } = area;
          if (
            mouseX >= x &&
            mouseX <= x + width &&
            mouseY >= y &&
            mouseY <= y + height
          ) {
            onClick(text);
          }
        });
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        canvas.removeEventListener("click", handleClick);
      };
    };

    renderPage();
  }, [pdfDoc, currentPage, onClick, tabInfoSelected, tabs]);

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <GenericCard>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-80">
          <p className="text-gray-500 text-center">Cargando documento...</p>
        </div>
      ) : errorDetected ? (
        <div className="flex justify-center items-center w-full h-80">
          <p className="text-red-500 text-center">
            No se pudo cargar el documento
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <button
              className={cn(
                "rounded-full p-2",
                currentPage <= 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-500 text-white"
              )}
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
            >
              <LeftChevron />
            </button>
            <p>
              Página {currentPage} de {numPages}
            </p>
            <button
              className={cn(
                "rounded-full p-2",
                currentPage >= numPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-500 text-white"
              )}
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
            >
              <RightChevron />
            </button>
          </div>
          <canvas ref={canvasRef} className="w-full max-w-full" />
        </>
      )}
    </GenericCard>
  );
};

export default Pediment;

function getKeywordConfig(text: string, currentPage: number) {
  const config = keywordPositions[text] || defaultConfig;

  return {
    x: config.x,
    y: typeof config.y === "function" ? config.y(currentPage) : config.y,
    w: typeof config.w === "function" ? config.w(currentPage) : config.w,
    h: typeof config.h === "function" ? config.h(currentPage) : config.h,
  };
}

const getStrokeStyle = (text: string, tabs: ICustomGlossTab[]) => {
  const tabName = keywordsConfig[text as keyof typeof keywordsConfig];
  if (!tabName) return "black";

  const tab = tabs.find((tab) => tab.name === tabName);
  return tab?.isCorrect || tab?.isVerified
    ? "rgb(81,174,57)"
    : "rgb(235,202,98)";
};

const getFillStyle = (text: string, tabInfoSelected: ITabInfoSelected) => {
  const tabName = keywordsConfig[text as keyof typeof keywordsConfig];
  if (!tabName || tabInfoSelected.name !== tabName) return "transparent";

  return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
    ? "rgba(81,174,57,0.5)"
    : "rgba(235,202,98,0.5)";
};
