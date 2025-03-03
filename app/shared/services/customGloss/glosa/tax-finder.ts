import { z } from "zod"
import { config } from "dotenv";

config();

const TAXFINDER_BASE_URL = "https://taxfinder-api.griver.com.mx/";

/**
 * Input type for tax finder queries
 */
interface TaxFinderInput {
  /** consulta*: Texto de consulta, o fracción */
  fraccion: string;
  /** fecha: Fecha de búsqueda. Por defecto: 2025-03-03 */
  fechaDeEntrada: Date;
  /** tipo_operacion*: Tipo Operacion: Tipo operación I para importación, E para exportación */
  tipoDeOperacion: "I" | "E";
}

export async function getFraccionInfo({ fraccion, fechaDeEntrada, tipoDeOperacion }: TaxFinderInput) {
  const idioma = "es";
  const TAXFINDER_API_KEY = process.env["TAXFINDER_API_KEY"];
  if (!TAXFINDER_API_KEY) {
    throw new Error("TAXFINDER_API_KEY is not set");
  }
  
  // Format the date as YYYY-MM-DD string
  const formattedDate = fechaDeEntrada.toISOString().split('T')[0];
  
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
  console.log(response);
}

// Fix the date format (using YYYY-MM-DD format for the Date constructor)
getFraccionInfo({ fraccion: "34049001", fechaDeEntrada: new Date("2024-08-27"), tipoDeOperacion: "I" });