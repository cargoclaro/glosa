import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { PDFDocument } from 'pdf-lib';
import { z } from 'zod';
import {
  type Partida,
  datosGeneralesDePedimentoSchema,
  partidaSchema,
} from '../schemas';

/**
 * Splits a PDF into individual pages and returns array of base64-encoded pages
 */
async function splitPdfIntoPages(file: File): Promise<string[]> {
  // Read the file content
  const fileArrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileArrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  // Array to store base64 strings for each page
  const pageBase64Strings: string[] = [];

  // Process each page
  for (let i = 0; i < pageCount; i++) {
    // Create a new document with just this page
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);

    // Save and convert to base64
    const pageBytes = await newPdfDoc.save();
    const base64String = Buffer.from(pageBytes).toString('base64');
    pageBase64Strings.push(base64String);
  }

  return pageBase64Strings;
}

/**
 * Combines multiple base64-encoded PDF pages into a single PDF
 */
async function combinePagesToPdf(pageBase64Strings: string[]): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Process each page and add it to the new document
  for (const pageBase64 of pageBase64Strings) {
    // Remove data URL prefix if present
    const base64Data = pageBase64.startsWith('data:')
      ? pageBase64.split(',')[1]
      : pageBase64;

    // Convert base64 to Uint8Array
    if (!base64Data) {
      continue;
    }
    const pageBytes = Buffer.from(base64Data, 'base64');

    // Load the page PDF
    const pagePdf = await PDFDocument.load(pageBytes);

    // Copy all pages (should just be one) from this page PDF
    const copiedPages = await pdfDoc.copyPages(
      pagePdf,
      pagePdf.getPageIndices()
    );

    // Add each copied page to the new document
    for (const page of copiedPages) {
      pdfDoc.addPage(page);
    }
  }

  // Save and convert the new PDF to base64
  const combinedPdfBytes = await pdfDoc.save();
  return Buffer.from(combinedPdfBytes).toString('base64');
}

export async function extractAndStructurePedimento(
  file: File,
  parentTraceId: string
) {
  const pages = await splitPdfIntoPages(file);

  // Classify the first three pages only
  const pagesToClassify = pages.slice(0, 3);

  // Parallelize classification of all pages to find first 'Partidas' quicker
  const classificationPromises = pagesToClassify.map((pageBase64, index) =>
    generateObject({
      model: google('gemini-2.5-flash-preview-04-17'),
      experimental_telemetry: {
        isEnabled: true,
        // +1 because zero-indexed
        functionId: `Classify page ${index + 1}`,
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileName: file.name,
        },
      },
      seed: 42,
      output: 'enum',
      enum: ['Datos generales', 'Partidas'],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Clasifica esta página como "Datos generales" o "Partidas" según si contiene una sección de partidas. Debe venir información como la fracción, las contribuciones y los identificadores de la partida (no del pedimento general).',
            },
            {
              type: 'file',
              data: `data:application/pdf;base64,${pageBase64}`,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    })
  );
  const classifications = (await Promise.all(classificationPromises)).map(
    (result) => result.object
  );
  const firstPartidasPageIndex = classifications.findIndex(
    (c) => c === 'Partidas'
  );
  if (firstPartidasPageIndex === -1) {
    throw new Error('Should never happen');
  }

  // Create PDF with all datos generales pages (including the first partidas page)
  const datosGeneralesPages = pages.slice(0, firstPartidasPageIndex + 1);

  // Split datosGeneralesPages into first page and remaining pages
  const [firstPageBase64, ...otherPagesBase64] = datosGeneralesPages;
  const firstPagePdfBase64 = await combinePagesToPdf([
    firstPageBase64 as string,
  ]);
  const otherPagesPdfBase64 =
    otherPagesBase64.length > 0
      ? await combinePagesToPdf(otherPagesBase64)
      : '';

  // Get all partidas pages starting from firstPartidasPageIndexInPages
  const partidasPages = pages.slice(firstPartidasPageIndex);

  const { encabezadoPrincipalDelPedimento, ...restOfPedimento } =
    datosGeneralesDePedimentoSchema.shape;

  // Kick off datos-generales and partidas extractions in parallel
  const encabezadoPrincipalDelPedimentoPromise = generateObject({
    model: openai('o4-mini-2025-04-16'),
    temperature: 1,
    providerOptions: { openai: { reasoningEffort: 'high' } },
    seed: 42,
    schema: encabezadoPrincipalDelPedimento,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract and structure datos generales de pedimento',
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false,
        fileName: file.name,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extrae los datos generales del pedimento.',
          },
          {
            type: 'file',
            data: `data:application/pdf;base64,${firstPagePdfBase64}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  const restOfPedimentoPromise = generateObject({
    model: openai('o4-mini-2025-04-16'),
    temperature: 1,
    providerOptions: { openai: { reasoningEffort: 'high' } },
    seed: 42,
    schema: z.object(restOfPedimento),
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract and structure datos generales de pedimento',
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false,
        fileName: file.name,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extrae los datos generales del pedimento.',
          },
          {
            type: 'file',
            data: `data:application/pdf;base64,${otherPagesPdfBase64}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  const partidasResultsPromise = Promise.all(
    partidasPages.map(async (pageBase64, pageIndex) => {
      // Count partidas on this page
      const {
        object: { partidasCount },
      } = await generateObject({
        model: google('gemini-2.5-flash-preview-04-17'),
        seed: 42,
        schema: z.object({ partidasCount: z.number() }),
        experimental_telemetry: {
          isEnabled: true,
          functionId: `Count partidas on page ${firstPartidasPageIndex + pageIndex + 1}`,
          metadata: {
            langfuseTraceId: parentTraceId,
            langfuseUpdateParent: false,
            fileName: file.name,
          },
        },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Basado en la etiqueta "SEC" cuentas las partidas en esta página. No quiero la cuenta global de todo el pedimento, solo de esta página.',
              },
              {
                type: 'file',
                data: `data:application/pdf;base64,${pageBase64}`,
                mimeType: 'application/pdf',
              },
            ],
          },
        ],
      });

      // Extract each partida individually
      const extractionPromises: Promise<{ object: Partida }>[] = [];
      // Spanish ordinals for partidas on the page
      const ordinals = [
        'primera',
        'segunda',
        'tercera',
        'cuarta',
        'quinta',
        'sexta',
        'séptima',
        'octava',
        'novena',
        'décima',
      ];
      for (let i = 1; i <= partidasCount; i++) {
        extractionPromises.push(
          generateObject({
            model: google('gemini-2.5-pro-preview-03-25'),
            seed: 42,
            schema: partidaSchema,
            experimental_telemetry: {
              isEnabled: true,
              functionId: `Extract partida ${i} from page ${firstPartidasPageIndex + pageIndex + 1}`,
              metadata: {
                langfuseTraceId: parentTraceId,
                langfuseUpdateParent: false,
                fileName: file.name,
              },
            },
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Basado en la etiqueta "SEC" extrae la ${ordinals[i - 1]} partida que aparece en esta página. No me refiero a la cuenta global de partidas, sino a las que aparecen en esta página.`,
                  },
                  {
                    type: 'file',
                    data: `data:application/pdf;base64,${pageBase64}`,
                    mimeType: 'application/pdf',
                  },
                ],
              },
            ],
          })
        );
      }
      const extracted = await Promise.all(extractionPromises);
      return extracted.map((r) => r.object);
    })
  );

  const [
    encabezadoPrincipalDelPedimentoResponse,
    restOfPedimentoResponse,
    partidasPagesResults,
  ] = await Promise.all([
    encabezadoPrincipalDelPedimentoPromise,
    restOfPedimentoPromise,
    partidasResultsPromise,
  ]);
  const datosGeneralesDePedimento = {
    encabezadoPrincipalDelPedimento:
      encabezadoPrincipalDelPedimentoResponse.object,
    ...restOfPedimentoResponse.object,
  };

  // Combine all partidas from all pages
  const partidas = partidasPagesResults.flat();

  return {
    ...datosGeneralesDePedimento,
    partidas,
  };
}
