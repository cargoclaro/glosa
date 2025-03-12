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

export function getPreviousDiaHabil(fechaPedimento: Date): Date {
  const mexicoHolidays = new Holidays('MX');
  // Create a copy of the input date to avoid modifying the original
  const resultDate = new Date(fechaPedimento);
  
  // Keep going back one day at a time until we find a business day
  do {
    // Move one day backward
    resultDate.setDate(resultDate.getDate() - 1);
    
    // Check if this day is a valid business day
    const isWeekend = resultDate.getDay() === 0 || resultDate.getDay() === 6;
    const isHoliday = mexicoHolidays.isHoliday(resultDate);
    
    // If we found a business day (not weekend and not holiday), return it
    if (!isWeekend && !isHoliday) {
      return resultDate;
    }
  } while (true);  // Continue until we find a valid business day
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

async function main() {
  try {
    // Test with today's date
    const today = new Date();
    console.log('Testing exchange rates for:', today.toISOString().split('T')[0]);

    // Test USD rate
    console.log('\nTesting USD Exchange Rate:');
    const usdRate = await getExchangeRate(today, 'USD');
    console.log('USD Rate:', usdRate);

    // Test EUR rate
    console.log('\nTesting EUR Exchange Rate:');
    const eurRate = await getExchangeRate(today, 'EUR');
    console.log('EUR Rate:', eurRate);

    // Test previous business day
    const prevBusinessDay = getPreviousDiaHabil(today);
    console.log('\nPrevious Business Day:', prevBusinessDay.toISOString().split('T')[0]);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

// This is similar to Python's if __name__ == "__main__":
if (require.main === module) {
  main().catch(console.error);
}
