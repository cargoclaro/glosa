const BANXICO_BASE_URL = 'https://www.banxico.org.mx/SieAPIRest/service/v1';

import { z } from "zod"

export const oportunoSchema = z.object({
  bmx: z.object({
    series: z.array(
      z.object({
        idSerie: z.string(),
        titulo: z.string(),
        datos: z.array(z.object({ fecha: z.string(), dato: z.string() })).length(1)
      })
    ).length(1)
  })
})


export async function getExchangeRate(currencyCode: "USD" | "EUR" | "GBP" = 'USD') {
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

  const response = await fetch(`${BANXICO_BASE_URL}/series/${seriesId}/datos/oportuno`, {
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