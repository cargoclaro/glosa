import { config } from "dotenv";
import { z } from "zod";
import { format } from "date-fns";

config();

const TAXFINDER_BASE_URL = "https://taxfinder-api.griver.com.mx/";

const taxfinderResponseSchema = z.object({
  data: z.object({
    arancel: z.object({
      unidad_medida: z.object({
        clave: z.string(),
        descripcion: z.string(),
        simbolo: z.string(),
      }),
    }),
    nicos: z.array(z.object({
      nico: z.string(),
      descripcion: z.string(),
      fecha_dof: z.string(),
      fecha_entrada_vigor: z.string(),
      abrogado: z.boolean(),
      oid: z.string(),
    })),
    iva: z.object({
      excepcion_iva: z.string().nullable().optional(),
      valor_iva: z.number(),
      valor_excepcion_iva: z.number(),
      valor_iva_region_franja: z.number(),
      valor_excepcion_iva_region_franja: z.number(),
      fecha_dof: z.string(),
      fecha_entrada_vigor: z.string(),
      abrogado: z.boolean(),
      oid: z.string(),
    }).optional(),
    regulaciones_no_arancelarias: z.object({
      normas: z.array(z.object({
        clave_acuerdo: z.string(),
        claves_articulos: z.array(z.string()),
        descripcion: z.string(),
        em_sanitaria_nom: z.string(),
      })).optional(),
    }),
    extra: z.object({
      ligie_arancel: z.number(),
      claves_identificadores: z.array(z.unknown()).optional(),
      identificadores_descripciones: z.array(z.unknown()).optional(),
      ieps: z.array(z.unknown()).optional(),
      ieps_tasas: z.array(z.unknown()).optional(),
      ieps_tasas_preferencias: z.array(z.unknown()).optional(),
    }),
  }),
});

const clavesRegulacion = [
  "TLC", "ACE", "FF", "RF", "IEPS", "ISAN", "ALADI", "PROSEC", "CC", "PE", "AC",
  "AMX", "AE", "MT", "VU", "AP", "TIPAT", "PAD", "NOM", "ANX", "CM", "IMMEX",
  "EMB", "OBS", "PROMOCAL", "LAL", "CICOPLAFEST", "INAH", "INBA", "INAINU",
  "SAGARPA", "SE", "SEP", "SENER", "SG", "SHCP", "SEMARNAT", "SSA", "SEDENA",
  "COMEXCA", "REIT", "EF", "CUL", "ETI", "LIGIE"
] as const;

type ClaveRegulacion = typeof clavesRegulacion[number];

const articuloFundamentoLegalResponseSchema = z.object({
  data: z.array(z.object({
    articulo: z.object({
      fragmento_dof: z.object({
        descripcion: z.string(),
      }),
    }),
  })).min(1),
});


async function getArticuloFundamentoLegal({ clave_acuerdo, clave_regulacion, clave_articulo }: {
  clave_acuerdo: string,
  clave_regulacion: ClaveRegulacion,
  clave_articulo: string[]
}) {
  const TAXFINDER_API_KEY = process.env["TAXFINDER_API_KEY"];
  if (!TAXFINDER_API_KEY) {
    throw new Error("TAXFINDER_API_KEY is not set");
  }

  const response = await fetch(`${TAXFINDER_BASE_URL}api/articulos/consultar?clave_acuerdo=${clave_acuerdo}&clave_regulacion=${clave_regulacion}&clave_articulo=${clave_articulo.join(",")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "reco-api-key": TAXFINDER_API_KEY,
    },
  });

  const result = await response.json();

  const parsedResult = articuloFundamentoLegalResponseSchema.parse(result);

  const fundamentoLegal = parsedResult.data[0]?.articulo.fragmento_dof.descripcion;

  if (!fundamentoLegal) {
    throw new Error("Fundamento legal not found");
  }

  return fundamentoLegal;
}

/**
 * Input type for tax finder queries
 */
interface TaxFinderInput {
  /** consulta*: Texto de consulta, o fracción */
  fraccion: string;
  /** fecha: Fecha como objeto Date */
  fechaDeEntrada: Date;
  /** tipo_operacion*: Tipo Operacion: Tipo operación IMP para importación, EXP para exportación */
  tipoDeOperacion: "IMP" | "EXP";
}

export async function getFraccionInfo({ fraccion, fechaDeEntrada, tipoDeOperacion }: TaxFinderInput) {
  // Convertir el tipo de operación del pedimento al formato esperado por Tax Finder
  const tipoOperacionTaxFinder = tipoDeOperacion === "IMP" ? "I" : "E";
  const idioma = "es";
  const TAXFINDER_API_KEY = process.env["TAXFINDER_API_KEY"];
  if (!TAXFINDER_API_KEY) {
    throw new Error("TAXFINDER_API_KEY is not set");
  }

  // Formatear la fecha como YYYY-MM-DD para la API
  const formattedDate = format(fechaDeEntrada, "yyyy-MM-dd");

  const response = await fetch(`${TAXFINDER_BASE_URL}api/tel/consulta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "reco-api-key": TAXFINDER_API_KEY,
    },
    body: JSON.stringify({
      consulta: fraccion,
      fecha: formattedDate,
      extra: true,
      idioma,
      tipo_operacion: tipoOperacionTaxFinder,
    })
  });

  return taxfinderResponseSchema.parse(await response.json());
}
