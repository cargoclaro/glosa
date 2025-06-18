import { config } from 'dotenv';
import { env } from 'lib/env/server';
import { z } from 'zod';

config();

/**
 * Fetches tariff information from GSmartCode HTS service for a given
 * HS-Code + NICO (10-digit Mexican tariff code).
 *
 * The function performs a GET request to the `hts.gsmartcode.com` endpoint
 * using the `Custom` command so that we only receive the columns we need
 * (fracción, nico, unidad de medida, descripción y aranceles).
 *
 * NOTE: The public documentation for the service is scarce. This query has
 * been tested manually with jQuery and matches the jQuery example provided
 * by GSmartCode. If they ever change the query syntax you can tweak the
 * `cmdCustom` string accordingly.
 */
export async function getSmartcodeInfo({
  fraccion,
  nico,
}: {
  fraccion: string;
  nico: string;
}) {
  const url = new URL('https://hts.gsmartcode.com/api/service');
  url.searchParams.set('cmd', 'getTable');
  url.searchParams.set('tableName', 'bFracciones');
  // Use proper SQL syntax for filtering
  const filter = `FRACCION LIKE '${fraccion}%' AND NICO LIKE '${nico}%'`;
  url.searchParams.set('filterBy', filter);
  url.searchParams.set('orderBy', 'SYSID');
  url.searchParams.set('startIndex', '1');
  url.searchParams.set('endIndex', '10');
  url.searchParams.set('formatResult', 'JSON');
  const apiKey = (env as any).GS_SMARTCODE_KEY ?? 'E5AC590E8D48496FAB4A9DF25AD05308';
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url.toString());
  const rawText = await response.text();
  
  // Check if it's a JSON response or plain text error
  let raw: unknown;
  
  // Handle empty response (no results found)
  if (!rawText.trim()) {
    return null;
  }
  
  try {
    raw = JSON.parse(rawText);
  } catch {
    throw new Error(`GSmartCode error: ${rawText}`);
  }

  // The API returns `[{ ...columns }]` directly.
  // If the shape ever changes you will get a runtime Zod error that can be
  // handled upstream.
  const apiSchema = z.array(
    z.object({
      FRACCION: z.string(),
      NICO: z.string(),
      UMCLAVE: z.string().nullable().optional(),
      UMABREVIACION: z.string().nullable().optional(),
      DESCRIPCION: z.string(),
      ADVIMPONUM: z.string().nullable().optional(),
      ADVEXPONUM: z.union([z.number(), z.string()]).nullable().optional(),
      TASAIVAFRANJA: z.union([z.number(), z.string()]).nullable().optional(),
      TASAIVAINTERIOR: z.union([z.number(), z.string()]).nullable().optional(),
      TASAMIXTA: z.string().nullable().optional(),
    })
  );

  const parsed = apiSchema.safeParse(raw);
  
  if (!parsed.success || parsed.data.length === 0) {
    return null; // Caller can decide how to react when the HS code is unknown.
  }

  const row = parsed.data[0]!; // non-null because length > 0

  return {
    fraccion: row.FRACCION,
    nico: row.NICO,
    unidadMedida: {
      clave: row.UMCLAVE ?? '',
      abreviacion: row.UMABREVIACION ?? '',
    },
    descripcion: row.DESCRIPCION,
    tarifas: {
      adValoremImportacion: row.ADVIMPONUM ? parseFloat(row.ADVIMPONUM) : null,
      adValoremExportacion: row.ADVEXPONUM ? (typeof row.ADVEXPONUM === 'string' ? parseFloat(row.ADVEXPONUM) : row.ADVEXPONUM) : null,
      ivaFranja: row.TASAIVAFRANJA ? (typeof row.TASAIVAFRANJA === 'string' ? parseFloat(row.TASAIVAFRANJA) : row.TASAIVAFRANJA) : null,
      ivaInterior: row.TASAIVAINTERIOR ? (typeof row.TASAIVAINTERIOR === 'string' ? parseFloat(row.TASAIVAINTERIOR) : row.TASAIVAINTERIOR) : null,
      tasaMixta: row.TASAMIXTA ?? null,
    },
  } as const;
}

/**
 * Fetches currency equivalence factors from GSmartCode service.
 *
 * This function queries the bEquivalenciasMoneda table to get the 
 * equivalence factor for a specific currency in a given month and year.
 * The equivalence factor is used to convert foreign currency amounts 
 * to Mexican pesos for customs purposes.
 */
export async function getCurrencyEquivalenceFactor({
  currencyCode,
  month,
  year,
}: {
  currencyCode: string;
  month: string;
  year: string;
}) {
  const url = new URL('https://hts.gsmartcode.com/api/service');
  url.searchParams.set('cmd', 'getTable');
  url.searchParams.set('tableName', 'bEquivalenciasMoneda');
  
  // Filter by currency code, month and year
  const filter = `Clave = '${currencyCode}' AND Mes = '${month}' AND Anio = '${year}'`;
  url.searchParams.set('filterBy', filter);
  url.searchParams.set('orderBy', 'SYSID');
  url.searchParams.set('startIndex', '1');
  url.searchParams.set('endIndex', '10');
  url.searchParams.set('formatResult', 'JSON');
  
  const apiKey = (env as any).GS_SMARTCODE_KEY ?? 'E5AC590E8D48496FAB4A9DF25AD05308';
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url.toString());
  const rawText = await response.text();
  
  // Check if it's a JSON response or plain text error
  let raw: unknown;
  
  // Handle empty response (no results found)
  if (!rawText.trim()) {
    return null;
  }
  
  try {
    raw = JSON.parse(rawText);
  } catch {
    throw new Error(`GSmartCode currency equivalence error: ${rawText}`);
  }

  // Define the schema for currency equivalence data
  const currencySchema = z.array(
    z.object({
      Sysid: z.string(),
      Pais: z.string(),
      Moneda: z.string(),
      EquivalenciaMonedaExtranjera: z.string(),
      Mes: z.string(),
      Anio: z.string(),
      DOF: z.string(),
      Clave: z.string(),
    })
  );

  const parsed = currencySchema.safeParse(raw);
  
  if (!parsed.success || parsed.data.length === 0) {
    return null; // No equivalence factor found for the specified parameters
  }

  const row = parsed.data[0]!; // non-null because length > 0

  return {
    currencyCode: row.Clave,
    country: row.Pais,
    currency: row.Moneda,
    equivalenceFactor: parseFloat(row.EquivalenciaMonedaExtranjera),
    month: row.Mes,
    year: row.Anio,
    dofDate: row.DOF,
  } as const;
} 