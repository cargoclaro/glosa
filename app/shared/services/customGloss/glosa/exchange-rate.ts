const BANXICO_BASE_URL = 'https://www.banxico.org.mx/SieAPIRest/service/v1';

import { config } from 'dotenv';
import { env } from 'lib/env/server';
import { z } from 'zod';
import { ok, err } from 'neverthrow';

config();

const oportunoSchema = z.object({
  bmx: z.object({
    series: z
      .array(
        z.object({
          idSerie: z.string(),
          titulo: z.string(),
          datos: z
            .array(z.object({ fecha: z.string(), dato: z.string() }))
            .optional(),
        })
      )
      .length(1),
  }),
});

async function isDiaHabil(date: Date, seriesId: string): Promise<boolean> {
  const dateString = date.toISOString().split('T')[0];
  const response = await fetch(
    `${BANXICO_BASE_URL}/series/${seriesId}/datos/${dateString}/${dateString}`,
    {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Bmx-Token': env.BANXICO_TOKEN,
      },
    }
  );

  const result = oportunoSchema.safeParse(await response.json());
  if (!result.success) {
    return false;
  }
  const { bmx } = result.data;
  // If datos exists and has elements, it's a business day
  return !!bmx.series[0]?.datos && bmx.series[0]?.datos.length > 0;
}

async function getPreviousDiaHabil(
  fechaPedimento: Date,
  seriesId: string
): Promise<Date> {
  // Create a copy of the input date to avoid modifying the original
  const resultDate = new Date(fechaPedimento);
  let businessDaysFound = 0;

  // Keep going back one day at a time until we find the second business day
  while (businessDaysFound < 2) {
    // Move one day backward
    resultDate.setDate(resultDate.getDate() - 1);

    // Check if this day is a valid business day using the API
    const isBusinessDay = await isDiaHabil(resultDate, seriesId);

    // If we found a business day, count it
    if (isBusinessDay) {
      businessDaysFound++;
    }
  }

  return resultDate;
}

export async function getExchangeRate(
  fechaPedimento: Date,
  currencyCode: 'USD' | 'EUR' | 'GBP' = 'USD'
) {
  // Map of common currency codes to their series IDs (pesos series)
  const currencySeries: Record<'USD' | 'EUR' | 'GBP', string> = {
    USD: 'SF43718',
    EUR: 'SF57923',
    GBP: 'SF57815',
  };

  const seriesId = currencySeries[currencyCode];

  const previousBusinessDay = await getPreviousDiaHabil(
    fechaPedimento,
    seriesId
  );

  const previousBusinessDayString = previousBusinessDay
    .toISOString()
    .split('T')[0];

  const response = await fetch(
    `${BANXICO_BASE_URL}/series/${seriesId}/datos/${previousBusinessDayString}/${previousBusinessDayString}`,
    {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Bmx-Token': env.BANXICO_TOKEN,
      },
    }
  );

  const result = oportunoSchema.safeParse(await response.json());
  if (!result.success) {
    return err('Invalid response from Banxico');
  }
  const { bmx } = result.data;

  // Verify that the expected data exists
  if (!bmx.series[0]?.datos?.[0]) {
    return err('Exchange rate data not found in the expected format');
  }

  return ok(bmx.series[0].datos[0].dato);
}
