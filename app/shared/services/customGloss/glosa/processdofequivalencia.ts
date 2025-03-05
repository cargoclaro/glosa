// processdofequivalencia.ts

import { load } from 'cheerio';
import type { Element } from 'domhandler';

// Interface for the date-based notes response
interface DofNotesResponse {
  messageCode: number;
  response: string;
  NotasMatutinas: Array<{
    codNota: number;
    titulo: string;
  }>;
}

// Interface for the note content response
interface DofNotaResponse {
  messageCode: number;
  response: string;
  Nota: {
    codNota: number;
    titulo: string;
    cadenaContenido: string;
  };
}

// Fetch the note ID for currency equivalences by date
async function getNoteIdByDate(date: string): Promise<string> {
  const url = `https://sidofqa.segob.gob.mx/dof/sidof/notas/${date}`;
  const response = await fetch(url);
  const data = (await response.json()) as DofNotesResponse;

  // Find the note with "Equivalencia" and "monedas" in the title
  const regex = /equivalencia.*monedas/i;
  const targetNote = data.NotasMatutinas.find(note => regex.test(note.titulo));

  if (!targetNote) {
    throw new Error(`No currency equivalence note found for date ${date}`);
  }

  return targetNote.codNota.toString();
}

// Fetch the HTML content of a specific note
async function getNotaHtml(noteId: string): Promise<string> {
  const url = `https://sidofqa.segob.gob.mx/dof/sidof/notas/nota/${noteId}`;
  const response = await fetch(url);
  const data = (await response.json()) as DofNotaResponse;
  return data.Nota.cadenaContenido;
}

// Parse the HTML to extract currency equivalences
function parseEquivalencias(html: string): Array<{ pais: string; moneda: string; valor: string }> {
  const $ = load(html);
  const results: Array<{ pais: string; moneda: string; valor: string }> = [];

  // Select the first table (adjust if multiple tables exist)
  const table = $('table').first();

  // Process each row, skipping the header (first row)
  table.find('tr').slice(1).each((_index: number, element: Element) => {
    const columns = $(element).find('td');
    if (columns.length >= 3) {
      const pais = $(columns[0]).text().trim();
      const moneda = $(columns[1]).text().trim();
      const valor = $(columns[2]).text().trim();

      // Ensure the row is a valid data row (not a header or footer)
      if (pais && moneda && valor && !pais.match(/país/i) && !moneda.match(/moneda/i)) {
        results.push({ pais, moneda, valor });
      }
    }
  });

  return results;
}

// Main function to fetch and parse equivalences
async function main(date: string = '07-01-2025') {
  try {
    console.log(`Fetching notes for date ${date}...`);
    const noteId = await getNoteIdByDate(date);
    console.log(`Fetching HTML for note ${noteId}...`);
    
    const html = await getNotaHtml(noteId);
    const equivalencias = parseEquivalencias(html);
    
    console.log('Currency Equivalences:', JSON.stringify(equivalencias, null, 2));
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
  }
}

// Run the script
main().catch(err => console.error(err));