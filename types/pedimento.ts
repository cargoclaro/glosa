import { z } from 'zod';

const partidasSchema = z.object({
  fraccion: z.string(),
  subd_num_identificacion_comercial: z.string(),
  vinc: z.string(),
  met_val: z.string(),
  umc: z.string(),
  cantidad_umc: z.number(),
  umt: z.string(),
  cantidad_umt: z.number(),
  p_vic: z.string(),
  p_oid: z.string(),
  descripcion: z.string(),
  val_adu_usd: z.number().nullable(),
  imp_precio_pag: z.number().nullable(),
  precio_unit: z.number().nullable(),
  val_agreg: z.number().nullable(),
  marca: z.string(),
  modelo: z.string(),
  codigo_producto: z.string().optional(),
  pais_origen: z.string().nullable(),
  pais_vendedor: z.string().nullable(),
  tasa_arancel: z.number(),
  t_t: z.string(),
  f_p: z.number(),
  importe: z.number(),
  observaciones: z.string(),
  identificadores_en: z.string().optional(),
  complemento_1: z.string().optional(),
  complemento_2: z.string().optional(),
  complemento_3: z.string().optional(),
  sec: z.number().optional(),
  con: z.string().optional(),
  igi_ige: z.string().optional(),
  iva: z.string().optional(),
  observaciones_nivel_partida: z.string().optional(),
});

const pedimentoSchema = z.object({
  encabezado_del_pedimento: z.object({
    num_pedimento: z.string(),
    tipo_oper: z.enum(['IMP', 'EXP', 'TRA']),
    cve_pedim: z.string(),
    regimen: z.string(),
    destino_origen: z.string(),
    tipo_cambio: z.number(),
    peso_bruto: z.number(),
    aduana_entrada_salida: z.string(),
  }),
  medios_transporte: z.object({
    entrada_salida: z.string(),
    arribo: z.string(),
    salida: z.string(),
  }),
  valores: z.object({
    valor_dolares: z.number(),
    valor_aduana: z.number(),
    precio_pagado_valor_comercial: z.number(),
  }),
  datos_importador: z.object({
    rfc: z.string(),
    curp: z.string(),
    razon_social: z.string(),
    domicilio: z.string(),
  }),
  incrementables: z.object({
    val_seguros: z.number(),
    seguros: z.number(),
    fletes: z.number(),
    embalajes: z.number(),
    otros_incrementables: z.number(),
  }),
  decrementables: z.object({
    transporte_decrementables: z.number(),
    seguro_decrementables: z.number(),
    carga_decrementables: z.number(),
    descarga_decrementables: z.number(),
    otros_decrementables: z.number(),
  }),
  fecha_entrada_presentacion: z.string(),
  identificadores_nivel_pedimento: z.object({
    clave_seccion_aduanera: z.string(),
    marcas_numeros_bultos: z.string(),
  }),
  id_fiscal: z.string(),
  cove: z.string().nullable(),
  nombre_razon_social: z.string(),
  domicilio: z.string(),
  vinculacion: z.string(),
  datos_factura: z.array(
    z.object({
      num_factura: z.string(),
      fecha_factura: z.string(),
      incoterm: z.string(),
      moneda_factura: z.string(),
      valor_moneda_factura: z.number(),
      factor_moneda_factura: z.number(),
      valor_dolares_factura: z.number(),
    })
  ),
  no_guia_embarque_id: z.string(),
  tipo_contenedor_vehiculo: z.string().nullable(),
  identificadores_pedimento: z.array(
    z.object({
      clave: z.string(),
      complemento_1: z.string(),
      complemento_2: z.string(),
      complemento_3: z.string(),
    })
  ),
  observaciones_a_nivel_pedimento: z.string(),
  document_summary: z.string().nullable(),
  partidas: z.array(partidasSchema),
});

export type Pedimento = z.infer<typeof pedimentoSchema>;
export type Partida = z.infer<typeof partidasSchema>;
