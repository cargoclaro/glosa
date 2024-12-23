"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { LeftChevron, RightChevron } from "@/app/shared/icons";
import { cn } from "@/app/shared/utils/cn";
import { GenericCard } from "@/app/shared/components";

interface ClickableArea {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const NewPdf = ({ document }: { document: string }) => {
  const [numPages, setNumPages] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorDetected, setErrorDetected] = useState(false);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const [clickableAreas, setClickableAreas] = useState<ClickableArea[]>([]);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(document);
    loadingTask.promise.then(
      (pdf) => {
        setNumPages(pdf.numPages);
        renderPage(pdf, currentPage);
      },
      (reason) => {
        console.error("Error loading PDF: ", reason);
        setErrorDetected(true);
      }
    );
  }, [document, currentPage]);

  const renderPage = async (
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNumber: number
  ) => {
    const page = await pdf.getPage(pageNumber);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    renderTaskRef.current = page.render(renderContext);

    renderTaskRef.current.promise.catch((error) => {
      if (error.name !== "RenderingCancelledException") {
        console.error("Render error:", error);
      }
    });

    // // Extraer el texto y detectar palabras clave
    const textContent = await page.getTextContent();
    const areas: ClickableArea[] = [];
    const keywords = [
      "NUM. PEDIMENTO:",
      "T. OPER",
      "TIPO OPER",
      "DESTINO:",
      "PESO BRUTO:",
      "PARTIDAS",
    ]; // Palabras clave a buscar

    console.log(textContent);
    textContent.items.forEach((item) => {
      const { str, transform, width, height } = item;
      const regex = new RegExp(`^${keywords.join("|")}$`, "i");
      if (regex.test(str.trim())) {
        const x = transform[4];
        const y = viewport.height - transform[5] - height;
        areas.push({ x, y, width, height, text: str });
      }
    });

    console.log(areas);

    setClickableAreas(areas);

    // // Dibujar áreas detectadas
    drawClickableAreas(context, areas);

    // renderTaskRef.current.promise.catch((error) => {
    //   if (error.name !== "RenderingCancelledException") {
    //     console.error("Render error:", error);
    //   }
    // });
  };

  const drawClickableAreas = (
    context: CanvasRenderingContext2D,
    areas: ClickableArea[]
  ) => {
    context.save();
    context.strokeStyle = "red";
    context.lineWidth = 2;

    areas.forEach((area) => {
      context.strokeRect(
        area.x +
          (area.text === "NUM. PEDIMENTO:" || area.text === "DESTINO:"
            ? 10
            : 80),
        area.y - (area.text === "PARTIDAS" ? 300 : 370),
        area.width + (area.text === "NUM. PEDIMENTO:" ? 150 : 20),
        area.height + 5
      );
    });

    context.restore();
  };

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

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Obtener coordenadas relativas al canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Clic detectado en: X: ${x}, Y: ${y}`);

    console.log(clickableAreas);

    clickableAreas.forEach((area) => {
      if (
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
      ) {
        console.log(`Área clickeada: ${area.text}`);
        alert(`Clic detectado en área: ${area.text}`);
      }
    });
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
          <canvas
            ref={canvasRef}
            className="w-full max-w-full"
            onClick={handleCanvasClick}
          />
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

export default NewPdf;
