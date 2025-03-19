import { format } from 'date-fns';
import { config } from 'dotenv';
import { env } from 'lib/env/server';
import { z } from 'zod';

config();

const TAXFINDER_BASE_URL = 'https://taxfinder-api.griver.com.mx/';
const isDevelopment = process.env.NODE_ENV === 'development';

const taxfinderResponseSchema = z.object({
  data: z.object({
    arancel: z.object({
      unidad_medida: z.object({
        clave: z.string(),
        descripcion: z.string(),
        simbolo: z.string(),
      }),
    }),
    nicos: z.array(
      z.object({
        nico: z.string(),
        descripcion: z.string(),
        fecha_dof: z.string(),
        fecha_entrada_vigor: z.string(),
        abrogado: z.boolean(),
        oid: z.string(),
      })
    ),
    iva: z
      .object({
        excepcion_iva: z.string().nullable().optional(),
        valor_iva: z.number(),
        valor_excepcion_iva: z.number(),
        valor_iva_region_franja: z.number(),
        valor_excepcion_iva_region_franja: z.number(),
        fecha_dof: z.string(),
        fecha_entrada_vigor: z.string(),
        abrogado: z.boolean(),
        oid: z.string(),
      })
      .optional(),
    regulaciones_no_arancelarias: z.object({
      normas: z
        .array(
          z.object({
            clave_acuerdo: z.string(),
            claves_articulos: z.array(z.string()),
            descripcion: z.string(),
            em_sanitaria_nom: z.string(),
          })
        )
        .optional(),
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

/**
 * Input type for tax finder queries
 */
interface TaxFinderInput {
  /** consulta*: Texto de consulta, o fracción */
  fraccion: string;
  /** fecha: Fecha como objeto Date */
  fechaDeEntrada: Date;
  /** tipo_operacion*: Tipo Operacion: Tipo operación IMP para importación, EXP para exportación */
  tipoDeOperacion: 'IMP' | 'EXP';
}

/**
 * Mock response for development environment
 */
const getMockResponse = (fraccion: string) => ({
  data: {
    arancel: {
      unidad_medida: {
        clave: 'KG',
        descripcion: 'KILOGRAMO',
        simbolo: 'kg',
      },
    },
    nicos: [
      {
        nico: '01',
        descripcion: `Descripción para fracción ${fraccion}`,
        fecha_dof: '2023-01-01',
        fecha_entrada_vigor: '2023-01-15',
        abrogado: false,
        oid: 'abc123',
      },
    ],
    iva: {
      excepcion_iva: null,
      valor_iva: 16,
      valor_excepcion_iva: 0,
      valor_iva_region_franja: 16,
      valor_excepcion_iva_region_franja: 0,
      fecha_dof: '2023-01-01',
      fecha_entrada_vigor: '2023-01-15',
      abrogado: false,
      oid: 'def456',
    },
    regulaciones_no_arancelarias: {
      normas: [
        {
          clave_acuerdo: 'NOM-001',
          claves_articulos: ['A1', 'A2'],
          descripcion: 'Norma Oficial Mexicana',
          em_sanitaria_nom: 'COFEPRIS',
        },
      ],
    },
    extra: {
      ligie_arancel: 5,
      claves_identificadores: [],
      identificadores_descripciones: [],
      ieps: [],
      ieps_tasas: [],
      ieps_tasas_preferencias: [],
    },
  },
});

export async function getFraccionInfo({
  fraccion,
  fechaDeEntrada,
  tipoDeOperacion,
}: TaxFinderInput) {
  // Return mock response in development
  if (isDevelopment) {
    console.log(`[DEV] Using mock response for fraccion: ${fraccion}`);
    return getMockResponse(fraccion);
  }

  // Production code - call the actual API
  // Convertir el tipo de operación del pedimento al formato esperado por Tax Finder
  const tipoOperacionTaxFinder = tipoDeOperacion === 'IMP' ? 'I' : 'E';
  const idioma = 'es';
  const TAXFINDER_API_KEY = env.TAXFINDER_API_KEY;
  if (!TAXFINDER_API_KEY) {
    throw new Error('TAXFINDER_API_KEY is not set');
  }

  // Formatear la fecha como YYYY-MM-DD para la API
  const formattedDate = format(fechaDeEntrada, 'yyyy-MM-dd');

  const response = await fetch(`${TAXFINDER_BASE_URL}api/tel/consulta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'reco-api-key': TAXFINDER_API_KEY,
    },
    body: JSON.stringify({
      consulta: fraccion,
      fecha: formattedDate,
      extra: true,
      idioma,
      tipo_operacion: tipoOperacionTaxFinder,
    }),
  });

  return taxfinderResponseSchema.parse(await response.json());
}
