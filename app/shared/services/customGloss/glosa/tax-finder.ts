import { config } from 'dotenv';
import { env } from 'lib/env/server';
import moment from 'moment';
import { z } from 'zod';

config();

export async function getFraccionInfo({
  clavePais,
  fraccion,
  fechaDeEntrada,
  nico,
  tipoDeOperacion,
}: {
  clavePais: string;
  fraccion: string;
  fechaDeEntrada: Date;
  nico: string;
  tipoDeOperacion: 'IMP' | 'EXP';
}) {
  interface TaxFinderRequest {
    /** Clave Pais: Clave M3 del país. Puedes consultar los paises en el endpoint /utilidades/consultar-paises (Obligatorio para SOAP) */
    clave_pais?: string;
    /** Consulta: Texto de consulta, o fracción */
    consulta: string;
    /** Extra: Especifica si debe devolver información del SIARA. Por defecto: false */
    extra?: boolean;
    /** Fecha: Fecha de búsqueda. Por defecto: 2025-03-21 */
    fecha?: string;
    /** Fecha Pago: Fecha de pago (Opcional) (Uso exclusivo SIARA) */
    fecha_pago?: string;
    /** Fraccion2: Fracción 2 (Opcional) (Uso exclusivo SIARA) */
    fraccion2?: string;
    /** IdiomasEnum: Idioma de la respuesta de la petición. Por defecto: es. Valores permitidos: es┃en┃zh */
    idioma?: 'es' | 'en' | 'zh';
    /** Nico: Nico (Opcional) (Uso exclusivo SIARA) */
    nico?: string;
    /** Tipo Operacion: Tipo operación I para importación, E para exportación */
    tipo_operacion: 'I' | 'E';
  }

  const response = await fetch(
    'https://taxfinder-api.griver.com.mx/api/tel/consulta',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'reco-api-key': env.TAXFINDER_API_KEY,
      },
      body: JSON.stringify({
        clave_pais: clavePais,
        consulta: fraccion,
        extra: true,
        fecha: moment(fechaDeEntrada).format('YYYY-MM-DD'),
        fecha_pago: moment(new Date()).format('YYYY-MM-DD'),
        idioma: 'es',
        nico,
        tipo_operacion: tipoDeOperacion === 'IMP' ? 'I' : 'E',
      } as TaxFinderRequest),
    }
  );

  const resJson = await response.json();
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
              em_sanitaria_nom: z.string().optional(),
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

  const parsed = taxfinderResponseSchema.safeParse(resJson);
  if (!parsed.success) {
    console.error('Taxfinder response validation failed', parsed.error);
    return {
      data: {
        arancel: {
          unidad_medida: {
            clave: '',
            descripcion: '',
            simbolo: '',
          },
        },
        nicos: [],
        regulaciones_no_arancelarias: { normas: [] },
        extra: { ligie_arancel: 0 },
      },
    } satisfies z.infer<typeof taxfinderResponseSchema>;
  }
  return parsed.data;
}
