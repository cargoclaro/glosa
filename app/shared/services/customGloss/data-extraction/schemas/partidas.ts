import { z } from 'zod';

export type Partida = z.infer<typeof partidasSchema>;

export const partidasSchema = z.object({
  sec: z.number().describe('Número de sección'),
  fraccion: z.string().describe('Fracción arancelaria'),
  nico: z.string().describe('Número de identificación comercial'),
  vinc: z.enum(['0', '1']).describe('Vínculo'),
  met_val: z.enum(['1']).describe('Método de valoración'),
  umc: z.string().describe('Unidad de medida comercial'),
  cantidad_umc: z.number().describe('Cantidad en unidad de medida comercial'),
  umt: z.string().describe('Unidad de medida de tarifa'),
  cantidad_umt: z.number().describe('Cantidad en unidad de medida de tarifa'),
  p_v_c: z.string().describe('País de venta o compra'),
  p_o_d: z.string().describe('País de origen o destino'),
  contribuciones: z
    .array(
      z.object({
        con: z.string().describe('Contribución'),
        tasa: z.number().describe('Tasa de contribución'),
        t_t: z.string().describe('Tipo de tasa'),
        f_p: z.string().describe('Forma de pago'),
        importe: z.number().describe('Importe de la contribución'),
      })
    )
    .nullable(),
  descripcion: z.string().describe('Descripción del producto'),
  val_adu: z.number().describe('Valor aduanero'),
  val_agreg: z.number().describe('Valor agregado').nullable(),
  marca: z.string().nullable().describe('Marca'),
  modelo: z.string().nullable().describe('Modelo'),
  codigo_producto: z.string().describe('Código de producto').nullable(),
  imp_precio_pag: z.number().describe('Importe de precio pagado'),
  precio_unit: z.number().describe('Precio unitario'),
  val_com_dls: z
    .number()
    .describe(
      'Valor comercial en dólares - Aparece como "VAL. COM. DLS." en el documento'
    )
    .nullable(),
  cantidad_umtc: z
    .number()
    .describe(
      'Cantidad en unidad de medida de comercialización - Aparece como "CANTIDAD UMTC" en el documento'
    )
    .nullable(),
  firma_descargo: z
    .string()
    .describe(
      'Firma de descargo - Aparece como "FIRMA DESCARGO" en el documento'
    )
    .nullable(),
  num_permiso: z
    .string()
    .describe(
      'Número de permiso o NOM - Aparece como "NUM. PERMISO O NOM" en el documento'
    )
    .nullable(),
  clave: z
    .string()
    .describe('Clave - Aparece como "CLAVE" en el documento')
    .nullable(),
  identificadores: z.array(
    z.object({
      clave: z.string().describe('Clave de identificador'),
      complemento1: z.string().describe('Primer complemento').nullable(),
      complemento2: z.string().describe('Segundo complemento').nullable(),
      complemento3: z.string().describe('Tercer complemento').nullable(),
    })
  ),
  observaciones: z
    .array(z.string().describe('Observaciones adicionales'))
    .nullable(),
  document_summary: z
    .string()
    .describe(
      'Un resumen detallado de la sección de partidas, incluyendo detalles clave sobre los bienes y contexto que puede ser útil para un humano. Este campo es obligatorio y debe ser generado por el LLM, no está proporcionado en el documento.'
    ),
});
