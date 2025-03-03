const BANXICO_BASE_URL = 'https://www.banxico.org.mx/SieAPIRest/service/v1';

import { z } from "zod"
import { config } from "dotenv"
import Holidays from 'date-holidays';

config()

const oportunoSchema = z.object({
  bmx: z.object({
    series: z.array(
      z.object({
        idSerie: z.string(),
        titulo: z.string(),
        datos: z.array(z.object({ fecha: z.string(), dato: z.string() }))
      })
    ).length(1)
  })
})

/**
 * Gets the previous business day (día hábil) in Mexico
 * @param date Starting date to search from (defaults to current date)
 * @param daysBack Number of business days to go back (defaults to 1)
 * @returns Date object representing the previous business day
 */
export function getPreviousDiaHabil(fechaPedimento: Date): Date {
  const daysBack = 2;
  const mexicoHolidays = new Holidays('MX');
  // Create a copy of the input date to avoid modifying the original
  const resultDate = new Date(fechaPedimento);
  let businessDaysFound = 0;
  
  // Keep searching backward until we find the required number of business days
  while (businessDaysFound < daysBack) {
    // Move one day backward
    resultDate.setDate(resultDate.getDate() - 1);
    
    // Check if this day is a business day
    const isWeekend = resultDate.getDay() === 0 || resultDate.getDay() === 6;
    const isHoliday = mexicoHolidays.isHoliday(resultDate);
    
    if (!isWeekend && !isHoliday) {
      businessDaysFound++;
    }
  }
  
  return resultDate;
}

export async function getExchangeRate(fechaPedimento: Date, currencyCode: "USD" | "EUR" | "GBP" = 'USD') {
  // Map of common currency codes to their series IDs (pesos series)
  const currencySeries: Record<"USD" | "EUR" | "GBP", string> = {
    'USD': 'SF43718',
    'EUR': 'SF57923',
    'GBP': 'SF57815',
  };

  const seriesId = currencySeries[currencyCode];
  const token = process.env["BANXICO_TOKEN"];

  if (!token) {
    throw new Error('BANXICO_TOKEN is not set');
  }

  const previousBusinessDay = getPreviousDiaHabil(fechaPedimento);
  const previousBusinessDayString = previousBusinessDay.toISOString().split('T')[0];

  const response = await fetch(`${BANXICO_BASE_URL}/series/${seriesId}/datos/${previousBusinessDayString}/${previousBusinessDayString}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Bmx-Token': token
    }
  });

  const data = oportunoSchema.parse(await response.json());
  
  // Verify that the expected data exists and return the exchange rate value (dato)
  if (!data.bmx.series[0] || !data.bmx.series[0].datos[0]) {
    throw new Error('Exchange rate data not found in the expected format');
  }
  
  return data.bmx.series[0].datos[0].dato;
}
