'use client';

import { GenericCard } from '@/shared/components';
import { LeftChevron, RightChevron } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import type { CustomGlossTab } from '@prisma/client';
import * as pdfjs from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useRef, useState } from 'react';
import type { ITabInfoSelected } from './PedimentAnalysisNFinish';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface IPediment {
  document: string;
  tabs: CustomGlossTab[];
  onClick: (tab: Keyword) => void;
  tabInfoSelected: ITabInfoSelected;
}

const keywords = [
  // PEDIMENTO
  'NUM. PEDIMENTO:',

  'T. OPER',
  'T.OPER',
  'TIPO OPER',
  'TIPO OPER:',
  'TIPO OPER.:',

  'DESTINO:',
  'DESTINO/ORIGEN:',

  'TIPO CAMBIO:',
  'VALOR DOLARES:',
  'VAL. SEGUROS',
  'VAL.SEGUROS',
  'FECHAS', // ⚠️ WARNING ⚠️

  'PESO BRUTO:',

  'DATOS DEL IMPORTADOR/EXPORTADOR',
  'DATOS DEL IMPORTADOR / EXPORTADOR',
  'DATOS DEL PROVEEDOR O COMPRADOR',

  'DATOS DEL TRANSPORTE Y TRANSPORTISTA',

  'PARTIDAS',
  'OBSERVACIONES A NIVEL PARTIDA',

  // COVE
  'No. de Factura',
  'Fecha Expedición',

  'Datos generales del proveedor',
  'Domicilio del proveedor',
  'Datos generales del destinatario',
  'Domicilio del destinatario',

  'Datos de la mercancía',
] as const; // Make this a const assertion to create a tuple of literal types

// Define a type for the keywords
type Keyword = (typeof keywords)[number];

// Create a Set from the keywords array for runtime type checking
const keywordsSet = new Set(keywords);

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
  x: -22,
  y: -12,
  w: 355,
  h: 12,
};

const keywordPositions: Record<Keyword, IKeywordPosition> = {
  // PEDIMENTO
  'NUM. PEDIMENTO:': {
    x: 0,
    y: (currentPage) => (currentPage !== 1 ? -15 : 0),
    w: 90,
    h: (currentPage) => (currentPage !== 1 ? 15 : 0),
  },

  'T. OPER': sharedConfigForTipoOper,
  'T.OPER': sharedConfigForTipoOper,
  'TIPO OPER': sharedConfigForTipoOper,
  'TIPO OPER:': sharedConfigForTipoOper,
  'TIPO OPER.:': sharedConfigForTipoOper,

  'DESTINO:': sharedConfigForDestino,
  'DESTINO/ORIGEN:': sharedConfigForDestino,

  'TIPO CAMBIO:': sharedConfigForTipoCambioNPesoBruto,
  'VALOR DOLARES:': { x: -2, y: -26, w: 165, h: 26 },
  'VAL. SEGUROS': sharedConfigValSeguros,
  'VAL.SEGUROS': sharedConfigValSeguros,
  FECHAS: { x: -50, y: -30, w: 100, h: 30 },

  'PESO BRUTO:': sharedConfigForTipoCambioNPesoBruto,

  'DATOS DEL IMPORTADOR/EXPORTADOR': sharedConfigForDatosImportador,
  'DATOS DEL IMPORTADOR / EXPORTADOR': sharedConfigForDatosImportador,
  'DATOS DEL PROVEEDOR O COMPRADOR': { x: -210, y: -30, w: 400, h: 30 },

  'DATOS DEL TRANSPORTE Y TRANSPORTISTA': { x: 0, y: -110, w: 370, h: 110 },

  PARTIDAS: { x: -255, y: -80, w: 510, h: 80 },
  'OBSERVACIONES A NIVEL PARTIDA': { x: -135, y: 50, w: 410, h: -70 },

  // COVE
  'No. de Factura': { x: 0, y: -18, w: 153, h: 18 },
  'Fecha Expedición': { x: 0, y: -18, w: 182, h: 18 },

  'Datos generales del proveedor': { x: 0, y: -65, w: 390, h: 65 },
  'Domicilio del proveedor': { x: 0, y: -145, w: 425, h: 145 },
  'Datos generales del destinatario': { x: 0, y: -70, w: 380, h: 70 },
  'Domicilio del destinatario': { x: 0, y: -150, w: 415, h: 150 },

  'Datos de la mercancía': { x: 0, y: -70, w: 430, h: 60 },
};

const keywordsConfig: Record<Keyword, string> = {
  // PEDIMENTO
  'NUM. PEDIMENTO:': 'Número de pedimento',

  'T. OPER': 'Tipo de operación',
  'T.OPER': 'Tipo de operación',
  'TIPO OPER': 'Tipo de operación',
  'TIPO OPER:': 'Tipo de operación',
  'TIPO OPER.:': 'Tipo de Ooperación',

  'DESTINO:': 'Clave de destino/origen',
  'DESTINO/ORIGEN:': 'Clave de destino/origen',

  'TIPO CAMBIO:': 'Operación monetaria',
  'VALOR DOLARES:': 'Operación monetaria',
  'VAL. SEGUROS': 'Operación monetaria',
  'VAL.SEGUROS': 'Operación monetaria',
  FECHAS: 'Operación monetaria',

  'PESO BRUTO:': 'Pesos y bultos',

  'DATOS DEL IMPORTADOR/EXPORTADOR': 'Datos de factura',
  'DATOS DEL IMPORTADOR / EXPORTADOR': 'Datos de factura',
  'DATOS DEL PROVEEDOR O COMPRADOR': 'Datos de factura',

  'DATOS DEL TRANSPORTE Y TRANSPORTISTA': 'Datos del transporte',

  PARTIDAS: 'Partidas',
  'OBSERVACIONES A NIVEL PARTIDA': 'Partidas',

  // COVE
  'No. de Factura': 'Datos de la Mercancía',
  'Fecha Expedición': 'Datos de la Mercancía',

  'Datos generales del proveedor': 'Datos Generales',
  'Domicilio del proveedor': 'Datos Proveedor Destinatario',
  'Datos generales del destinatario': 'Datos Proveedor Destinatario',
  'Domicilio del destinatario': 'Datos Proveedor Destinatario',

  'Datos de la mercancía': 'Validación de mercancías',
} as const;

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
        console.error('Error loading PDF: ', reason);
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
      const context = canvas.getContext('2d');
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

      textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .forEach((item) => {
          const text = item.str;
          if (isKeyword(text)) {
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
            mouseY <= y + height &&
            isKeyword(text)
          ) {
            onClick(text);
          }
        });
      };

      canvas.addEventListener('click', handleClick);

      return () => {
        canvas.removeEventListener('click', handleClick);
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
        <div className="flex h-80 w-full items-center justify-center">
          <p className="text-center text-gray-500">Cargando documento...</p>
        </div>
      ) : errorDetected ? (
        <div className="flex h-80 w-full items-center justify-center">
          <p className="text-center text-red-500">
            No se pudo cargar el documento
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <button
              className={cn(
                'rounded-full p-2',
                currentPage <= 1
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-gray-500 text-white'
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
                'rounded-full p-2',
                currentPage >= numPages
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-gray-500 text-white'
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

function getKeywordConfig(text: Keyword, currentPage: number) {
  const config = keywordPositions[text];

  return {
    x: config.x,
    y: typeof config.y === 'function' ? config.y(currentPage) : config.y,
    w: typeof config.w === 'function' ? config.w(currentPage) : config.w,
    h: typeof config.h === 'function' ? config.h(currentPage) : config.h,
  };
}

const getStrokeStyle = (text: Keyword, tabs: CustomGlossTab[]) => {
  const tabName = keywordsConfig[text];

  const tab = tabs.find((tab) => tab.name === tabName);
  return tab?.isCorrect || tab?.isVerified
    ? 'rgb(81,174,57)'
    : 'rgb(235,202,98)';
};

const getFillStyle = (text: Keyword, tabInfoSelected: ITabInfoSelected) => {
  const tabName = keywordsConfig[text];
  if (!tabName || tabInfoSelected.name !== tabName) return 'transparent';

  return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
    ? 'rgba(81,174,57,0.5)'
    : 'rgba(235,202,98,0.5)';
};

function isKeyword(text: string): text is Keyword {
  return keywordsSet.has(text);
}
