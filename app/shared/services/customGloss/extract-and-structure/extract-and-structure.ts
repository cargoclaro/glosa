import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { packingListSchema, datosGeneralesSchema, mercanciaSchema, datosGeneralesDePedimentoSchema, partidaSchema } from './schemas';
import { PDFDocument } from 'pdf-lib';

/**
 * Fetches a PDF file and returns an array of base64-encoded pages
 */
export async function fetchPdfPages(fileUrl: string): Promise<string[]> {
  // Fetch the file content
  const response = await fetch(fileUrl);
  const fileContent = await response.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileContent);
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

export async function extractAndStructurePackingList(
  fileUrl: string,
  parentTraceId?: string,
) {
  const telemetryConfig = parentTraceId
    ? {
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Packing List',
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
    }
    : {};
  const { object } = await generateObject({
    model: openai('gpt-4o-2024-11-20'),
    seed: 42,
    ...telemetryConfig,
    schema: packingListSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Estructura el documento en base al esquema proporcionado.',
          },
          {
            type: 'file',
            data: `${fileUrl}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  return object;
}

export async function extractAndStructureCove(
  fileUrl: string,
  parentTraceId?: string,
) {
  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    seed: 42,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract cove',
      metadata: {
        langfuseTraceId: parentTraceId ?? '',
        langfuseUpdateParent: false,
        fileUrl,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe the pdf to markdown',
          },
          {
            type: 'file',
            data: `${fileUrl}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });
  const [
    { object: datosGenerales },
    { object: mercancias }
  ] = await Promise.all([
    generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Structure datos generales cove',
        metadata: {
          langfuseTraceId: parentTraceId ?? '',
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
      schema: datosGeneralesSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Structure the document based on the provided schema. Keep the text "exactly as is", no exceptions.',
            },
            {
              type: 'text',
              text,
            },
          ],
        },
      ],
    }),
    generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Structure mercancias cove',
        metadata: {
          langfuseTraceId: parentTraceId ?? '',
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
      output: 'array',
      schema: mercanciaSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Structure the document based on the provided schema. Keep the text "exactly as is", no exceptions.',
            },
            {
              type: 'text',
              text,
            },
          ],
        },
      ],
    })
  ]);

  return {
    ...datosGenerales,
    mercancias,
  };
}

export async function extractAndStructurePedimento(
  fileUrl: string,
  parentTraceId?: string,
) {
  const pages = await fetchPdfPages(fileUrl);

  let firstPartidasPageIndex: number | null = null;

  for (let i = 0; i < pages.length; i++) {
    const { object: classification } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      output: 'enum',
      enum: ['Datos generales', 'Partidas'],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Classify this page as "Datos generales" or "Partidas" based on whether it contains a partidas section or table.',
            },
            {
              type: 'file',
              data: `data:application/pdf;base64,${pages[i]}`,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    if (classification === 'Partidas') {
      firstPartidasPageIndex = i;
      break;
    }
  }

  if (firstPartidasPageIndex === null) {
    throw new Error('No partidas section found in the document');
  }

  // Create PDF with all datos generales pages (including the first partidas page)
  const datosGeneralesPages = pages.slice(0, firstPartidasPageIndex + 1);
  const datosGeneralesPdfBase64 = await combinePagesToPdf(datosGeneralesPages);

  // Get all partidas pages starting from firstPartidasPageIndex
  const partidasPages = pages.slice(firstPartidasPageIndex);

  const { object: datosGeneralesDePedimento } = await generateObject({
    model: google('gemini-2.0-flash-001'),
    seed: 42,
    schema: datosGeneralesDePedimentoSchema,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'Extract and structure datos generales de pedimento',
      metadata: {
        langfuseTraceId: parentTraceId ?? '',
        langfuseUpdateParent: false,
        fileUrl,
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
            data: `data:application/pdf;base64,${datosGeneralesPdfBase64}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  });

  const partidasResults = await Promise.all(partidasPages.map((pageBase64, index) => generateObject({
    model: google('gemini-2.5-pro-exp-03-25'),
    seed: 42,
    schema: partidaSchema,
    output: 'array',
    experimental_telemetry: {
      isEnabled: true,
      functionId: `Extract partidas from page ${firstPartidasPageIndex + index}`,
      metadata: {
        langfuseTraceId: parentTraceId ?? '',
        langfuseUpdateParent: false,
        fileUrl,
        pageIndex: firstPartidasPageIndex + index,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'JSONify the partidas section on this page only.',
          },
          {
            type: 'file',
            data: `data:application/pdf;base64,${pageBase64}`,
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  })));

  // Combine all partidas from all pages
  const partidas = partidasResults.flatMap(result => result.object);

  return {
    ...datosGeneralesDePedimento,
    partidas
  };
}

/**
 * Combines multiple base64-encoded PDF pages into a single PDF
 */
export async function combinePagesToPdf(pageBase64Strings: string[]): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Process each page and add it to the new document
  for (const pageBase64 of pageBase64Strings) {
    // Remove data URL prefix if present
    const base64Data = pageBase64.startsWith('data:')
      ? pageBase64.split(',')[1]
      : pageBase64;

    // Convert base64 to Uint8Array
    if (!base64Data) { continue; }
    const pageBytes = Buffer.from(base64Data, 'base64');

    // Load the page PDF
    const pagePdf = await PDFDocument.load(pageBytes);

    // Copy all pages (should just be one) from this page PDF
    const copiedPages = await pdfDoc.copyPages(pagePdf, pagePdf.getPageIndices());

    // Add each copied page to the new document
    for (const page of copiedPages) {
      pdfDoc.addPage(page);
    }
  }

  // Save and convert the new PDF to base64
  const combinedPdfBytes = await pdfDoc.save();
  return Buffer.from(combinedPdfBytes).toString('base64');
}
