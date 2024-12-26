"use client";

import * as pdfjs from "pdfjs-dist";
import { cn } from "@/app/shared/utils/cn";
import { GenericCard } from "@/app/shared/components";
import React, { useEffect, useRef, useState } from "react";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface IPediment {
  document: string;
  onClick: (tab: string) => void;
}

const Pediment = ({ document, onClick }: IPediment) => {
  const [numPages, setNumPages] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorDetected, setErrorDetected] = useState(false);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);

  useEffect(() => {
    const loadingTask = pdfjs.getDocument(document);
    loadingTask.promise.then(
      (pdf) => {
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      },
      (reason) => {
        console.error("Error loading PDF: ", reason);
        setErrorDetected(true);
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

      const keywords = [
        "NUM. PEDIMENTO:",
        "T. OPER",
        "TIPO OPER",
        "TIPO OPER:",
        "DESTINO:",
        "TIPO CAMBIO:",
        "PESO BRUTO:",
        "VALOR DOLARES:",
        "DATOS DEL IMPORTADOR/EXPORTADOR",
        "VAL. SEGUROS",
        "DATOS DEL PROVEEDOR O COMPRADOR",
        "PARTIDAS",
      ]; // Palabras clave a buscar

      (textContent.items as TextItem[]).forEach((item) => {
        const text = item.str;
        if (keywords.includes(text)) {
          const { transform, width, height } = item;

          const [, , , , offsetX, offsetY] = transform;
          const customX =
            text === "DATOS DEL IMPORTADOR/EXPORTADOR"
              ? -110
              : text === "DATOS DEL PROVEEDOR O COMPRADOR"
              ? -210
              : text === "PARTIDAS"
              ? -255
              : 0;
          const x = (offsetX + customX) * scale;
          const customY =
            text === "NUM. PEDIMENTO:" && currentPage !== 1
              ? -15
              : (text === "T. OPER" ||
                  text === "TIPO OPER" ||
                  text === "TIPO OPER:") &&
                currentPage !== 1
              ? -15
              : text === "DATOS DEL IMPORTADOR/EXPORTADOR"
              ? -60
              : text === "VAL. SEGUROS"
              ? -10
              : text === "VALOR DOLARES:"
              ? -18
              : text === "DATOS DEL PROVEEDOR O COMPRADOR"
              ? -30
              : text === "PARTIDAS"
              ? -80
              : 0;
          const y = viewport.height - (offsetY + customY) * scale;
          const customW =
            text === "NUM. PEDIMENTO:" && currentPage === 1
              ? 85
              : text === "NUM. PEDIMENTO:" && currentPage !== 1
              ? 15
              : (text === "T. OPER" ||
                  text === "TIPO OPER" ||
                  text === "TIPO OPER:") &&
                currentPage === 1
              ? 175
              : (text === "T. OPER" ||
                  text === "TIPO OPER" ||
                  text === "TIPO OPER:") &&
                currentPage !== 1
              ? 125
              : text === "DESTINO:"
              ? 35
              : text === "TIPO CAMBIO:" || text === "PESO BRUTO:"
              ? 55
              : text === "VALOR DOLARES:"
              ? 165
              : text === "DATOS DEL IMPORTADOR/EXPORTADOR"
              ? 240
              : text === "VAL. SEGUROS"
              ? 335
              : text === "DATOS DEL PROVEEDOR O COMPRADOR"
              ? 400
              : text === "PARTIDAS"
              ? 510
              : 0;
          const w = (width + customW) * scale;
          const customH =
            text === "NUM. PEDIMENTO:" && currentPage !== 1
              ? 15
              : (text === "T. OPER" ||
                  text === "TIPO OPER" ||
                  text === "TIPO OPER:") &&
                currentPage !== 1
              ? 15
              : text === "DATOS DEL IMPORTADOR/EXPORTADOR"
              ? 60
              : text === "VAL. SEGUROS"
              ? 10
              : text === "VALOR DOLARES:"
              ? 18
              : text === "DATOS DEL PROVEEDOR O COMPRADOR"
              ? 30
              : text === "PARTIDAS"
              ? 80
              : 0;
          const h = (height + customH) * scale;

          context.fillStyle =
            text === "NUM. PEDIMENTO:"
              ? "rgba(214,200,233,0.6)"
              : text === "T. OPER" ||
                text === "TIPO OPER" ||
                text === "TIPO OPER:"
              ? "rgba(125,181,145,0.5)"
              : text === "DESTINO:"
              ? "rgba(112,182,249,0.6)"
              : text === "TIPO CAMBIO:" ||
                text === "VALOR DOLARES:" ||
                text === "VAL. SEGUROS"
              ? "rgba(236,167,148,0.6)"
              : text === "PESO BRUTO:"
              ? "rgba(251,231,159,0.6)"
              : text === "DATOS DEL IMPORTADOR/EXPORTADOR" ||
                text === "DATOS DEL PROVEEDOR O COMPRADOR"
              ? "rgba(165,133,217,0.6)"
              : text === "PARTIDAS"
              ? "rgba(216,181,126,0.6)"
              : "rgba(0,0,0,0.6)";
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
  }, [pdfDoc, currentPage, onClick]);

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
      {numPages > 1 ? (
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
      ) : !errorDetected ? (
        <div className="flex justify-center items-center w-full h-80">
          <p
            className="text-gray-500 text-center"
            style={{ whiteSpace: "pre-wrap" }}
          >
            Cargando documento...
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-80">
          <p
            className="text-red-500 text-center"
            style={{ whiteSpace: "pre-wrap" }}
          >
            No se pudo cargar el documento
          </p>
        </div>
      )}
    </GenericCard>
  );
};

export default Pediment;
