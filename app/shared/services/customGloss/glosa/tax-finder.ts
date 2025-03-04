import { config } from "dotenv";

config();

const TAXFINDER_BASE_URL = "https://taxfinder-api.griver.com.mx/";

/**
 * Input type for tax finder queries
 */
interface TaxFinderInput {
  /** consulta*: Texto de consulta, o fracción */
  fraccion: string;
  /** fecha: Fecha de búsqueda en formato DD/MM/YYYY */
  fechaDeEntrada: string;
  /** tipo_operacion*: Tipo Operacion: Tipo operación I para importación, E para exportación */
  tipoDeOperacion: "I" | "E";
}

export async function getFraccionInfo({ fraccion, fechaDeEntrada, tipoDeOperacion }: TaxFinderInput) {
  const idioma = "es";
  const TAXFINDER_API_KEY = process.env["TAXFINDER_API_KEY"];
  if (!TAXFINDER_API_KEY) {
    throw new Error("TAXFINDER_API_KEY is not set");
  }
  
  // Parse DD/MM/YYYY to Date object and then to YYYY-MM-DD
  const [day, month, year] = fechaDeEntrada.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  const formattedDate = date.toISOString().split('T')[0];
  
  const response = await fetch(`${TAXFINDER_BASE_URL}api/tel/consulta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "reco-api-key": TAXFINDER_API_KEY,
    },
    body: JSON.stringify({
      consulta: fraccion,
      fecha: formattedDate,
      idioma,
      tipo_operacion: tipoDeOperacion,
    })
  });
  
  const result = await response.json();
  console.log('Response from TaxFinder API:', JSON.stringify(result, null, 2));
}

// Example using DD/MM/YYYY format
getFraccionInfo({ fraccion: "34049001", fechaDeEntrada: "27/08/2024", tipoDeOperacion: "I" });