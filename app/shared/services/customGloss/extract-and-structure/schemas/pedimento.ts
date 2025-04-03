import { isValid, parse } from 'date-fns';
import { z } from 'zod';

export const partidaSchema = z.object({
  secuencia: z.number().describe('Aparece como "SEC" en el documento'),
  fraccion: z.string(),
  subdivisionONumeroDeIdentificacionComercial: z.string(),
  vinculacion: z.enum(['0', '1', '2']).nullable().describe('Aparece como "VINC" en el documento'),
  metodoDeValoracion: z.string().nullable().describe('Un numero del 0 al 6'),
  unidadDeMedidaComercial: z
    .string()
    .describe('Un numero del 1 al 22, aparece como "UMC" en el documento'),
  cantidadUnidadDeMedidaComercial: z.number(),
  unidadDeMedidaDeTarifa: z
    .string()
    .nullable()
    .describe('Un numero del 1 al 22, aparece como "UMT" en el documento'),
  cantidadUnidadDeMedidaDeTarifa: z.number().nullable(),
  paisDeVentaOCompra: z.string().nullable().describe('Una clave de pais ISO 3166-1 alfa-3, aparece como "P. V/C." en el documento'),
  paisDeOrigenODestino: z.string().nullable().describe('Una clave de pais ISO 3166-1 alfa-3, aparece como "P. O/D." en el documento'),
  descripcion: z.string(),
  valorEnAduanaOValorEnUSD: z.number(),
  importeDePrecioPagadoOValorComercial: z.number(),
  precioUnitario: z.number(),
  valorAgregado: z.number().nullable(),
  marca: z.string().nullable(),
  modelo: z.string().nullable(),
  codigoProducto: z.string().nullable(),
  contribuciones: z.array(z.object({
    contribucion: z.string(),
    tasa: z.number(),
    tipoDeTasa: z.string(),
    formaDePago: z.string(),
    importe: z.number(),
  })),
  regulacionesYRestriccionesNoArancelarias: z.object({
    permiso: z
      .string()
      .describe('Aparece como "CLAVE" en el documento'),
    numeroDePermiso: z.string(),
    firmaDescargo: z
      .string()
      .nullable(),
    valorComercialEnDolares: z.number(),
    cantidadUnidadDeMedidaDeTarifaOComercial: z.number().describe('Aparece como "CANTIDAD UMT/C" en el documento'),
  }).nullable(),
  identificadores: z.array(z.object({
    identificador: z.string(),
    complemento1: z.string().nullable(),
    complemento2: z.string().nullable(),
    complemento3: z.string().nullable(),
  })),
  observaciones: z.string().nullable(),
})

export const datosGeneralesDePedimentoSchema = z.object({
  encabezado_del_pedimento: z
    .object({
      num_pedimento: z
        .string()
        .nullable(),
      tipo_oper: z
        .enum(['IMP', 'EXP', 'TRA'])
        .describe(
          'Tipo de operación: IMP (Importación), EXP (Exportación/retorno), TRA (Tránsitos)'
        )
        .nullable(),
      cve_pedim: z
        .string()
        .describe("Código de 2 caracteres (por ejemplo, 'A1') que indica el tipo de pedimento")
        .nullable(),
      regimen: z
        .string()
        .describe("Código de 3 letras que indica el régimen aduanero (por ejemplo, 'IMD')")
        .nullable(),
      destino_origen: z
        .string()
        .describe('Número de un solo dígito que indica el destino')
        .nullable(),
      tipo_cambio: z
        .number()
        .describe('Tipo de cambio con 5 decimales (por ejemplo, 16.86600)')
        .nullable(),
      peso_bruto: z
        .number()
        .describe('Peso bruto en kilogramos con 3 decimales')
        .nullable(),
      aduana_entrada_salida: z
        .string()
        .describe('Código de 3 dígitos que indica la oficina de aduanas')
        .nullable(),
    })
    .describe('Información del encabezado del pedimento (documento aduanero)'),
  medios_transporte: z
    .object({
      entrada_salida: z
        .string()
        .describe('Código de un dígito para el transporte de entrada/salida')
        .nullable(),
      arribo: z
        .string()
        .describe('Código de un dígito para el transporte de llegada')
        .nullable(),
      salida: z
        .string()
        .describe('Código de un dígito para el transporte de salida')
        .nullable(),
    })
    .describe('Medios de transporte'),
  valores: z
    .object({
      valor_dolares: z
        .number()
        .describe(
          'Valor en USD con 2 decimales, siempre junto, nunca separado por comas, espacios u otro carácter'
        )
        .nullable(),
      valor_aduana: z
        .number()
        .describe(
          'Valor aduanero en MXN, siempre junto, nunca separado por comas, espacios u otro carácter'
        )
        .nullable(),
      precio_pagado_valor_comercial: z
        .number()
        .describe(
          'Valor comercial/precio pagado en MXN, siempre junto, nunca separado por comas, espacios u otro carácter'
        )
        .nullable(),
    })
    .describe('Valores relacionados con la transacción'),
  datos_importador: z
    .object({
      rfc: z
        .string()
        .describe('Código RFC de 12 caracteres para empresas o 13 para personas físicas')
        .nullable(),
      curp: z
        .string()
        .describe('Identificador CURP de 18 caracteres alfanuméricos (opcional)')
        .nullable(),
      razon_social: z
        .string()
        .describe("Nombre legal completo de la empresa o individuo, cerca del CURP"),
      domicilio: z
        .string()
        .describe(
          'Dirección completa incluyendo calle, número, código postal, ciudad y estado'
        )
        .nullable(),
    })
    .describe('Información del importador'),
  incrementables: z
    .object({
      valor_seguros: z
        .number()
        .describe('Aparece en el pedimento como "VAL. SEGUROS".')
        .nullable(),
      seguros: z
        .number()
        .describe('Aparece en el pedimento como "SEGUROS".')
        .nullable(),
      fletes: z
        .number()
        .describe('Aparece en el pedimento como "FLETES".')
        .nullable(),
      embalajes: z
        .number()
        .describe('Aparece en el pedimento como "EMBALAJES".')
        .nullable(),
      otros_incrementables: z
        .number()
        .describe('Aparece en el pedimento como "OTROS INCREMENTABLES".')
        .nullable(),
    })
    .describe('Costos adicionales a ser agregados'),
  decrementables: z
    .object({
      transporte_decrementables: z
        .number()
        .describe('Costos de transporte deducibles en MXN')
        .nullable(),
      seguro_decrementables: z
        .number()
        .describe('Costos de seguro deducibles en MXN')
        .nullable(),
      carga_decrementables: z
        .number()
        .describe('Costos de carga deducibles en MXN')
        .nullable(),
      descarga_decrementables: z
        .number()
        .describe('Costos de descarga deducibles en MXN')
        .nullable(),
      otros_decrementables: z
        .number()
        .describe('Otros costos deducibles en MXN')
        .nullable(),
    })
    .describe('Costos a ser deducidos'),
  fecha_entrada_presentacion: z
    .string()
    .describe("Fecha en formato DD/MM/YYYY (por ejemplo, '13/05/2024')")
    .nullable()
    .transform((dateStr, ctx) => {
      if (!dateStr) {
        return null;
      }

      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());

      if (!isValid(parsedDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY.`,
        });
        return null;
      }

      return parsedDate;
    }),
  cuadro_de_liquidacion: z
    .object({
      liquidaciones: z
        .array(
          z.object({
            concepto: z
              .string()
              .describe(
                'Código o nombre del concepto (por ejemplo, "DTA", "PRV", "IVA", "IVA/PRV")'
              )
              .nullable(),
            fp: z
              .number()
              .describe('Código de forma de pago, generalmente un valor numérico')
              .nullable(),
            importe: z
              .number()
              .describe('Monto a pagar por este concepto en MXN')
              .nullable(),
          })
        )
        .describe(
          'Array de entradas de liquidación que muestran impuestos y tarifas a pagar'
        )
        .nullable(),
      totales: z
        .object({
          efectivo: z
            .number()
            .describe('Monto total a pagar en efectivo')
            .nullable(),
          otros: z
            .number()
            .describe('Monto total a pagar por otros medios')
            .nullable(),
          total: z.number().describe('Gran total de todos los pagos').nullable(),
        })
        .describe('Resumen de los totales de pago')
        .nullable(),
    })
    .describe('Tabla completa de liquidación con entradas y totales'),
  identificadores_nivel_pedimento: z
    .object({
      clave_seccion_aduanera: z
        .string()
        .describe("Código numérico de tres dígitos (mostrado como '470' en el documento)")
        .nullable(),
      marcas_numeros_bultos: z
        .string()
        .describe(
          "Campo de texto que muestra cantidad y tipo de paquetes (por ejemplo, 'S/M S/N 4 BULTOS')"
        )
        .nullable(),
    })
    .describe('Identificadores a nivel pedimento'),
  id_fiscal: z
    .string()
    .describe('Código alfanumérico que representa el número de factura extranjera.')
    .nullable(),
  cove: z
    .string()
    .describe(
      "Código alfanumérico (mostrado como 'COVE'); importante y tiene 11 caracteres"
    )
    .nullable(),
  nombre_razon_social: z
    .string()
    .describe(
      "Nombre de la empresa en letras mayúsculas (por ejemplo, 'SAIC MOTOR INTERNATIONAL CO., LTD')"
    )
    .nullable(),
  domicilio: z
    .string()
    .describe(
      "Dirección completa con formato específico (por ejemplo, 'YESHENG ROAD No. 188 No. Int. ROOM 429H, C.P. 200135, PILOT FREE TRADE ZONE SHANGHAI, CHINA (REPUBLICA POPULAR)')"
    )
    .nullable(),
  vinculacion: z
    .string()
    .describe("Campo de texto de dos letras ('SI' o 'NO')")
    .nullable(),
  datos_factura: z
    .object({
      num_factura: z
        .string()
        .describe(
          'El número de factura mexicana; alfanumérico; si no hay, dejar en blanco'
        )
        .nullable(),
      fecha_factura: z
        .string()
        .describe("Fecha en formato DD/MM/YYYY (por ejemplo, '07/05/2024')")
        .nullable(),
      incoterm: z
        .string()
        .describe("Código de tres letras en mayúsculas (por ejemplo, 'FCA')")
        .nullable(),
      moneda_factura: z
        .string()
        .describe("Código de moneda de tres letras (por ejemplo, 'USD')")
        .nullable(),
      valor_moneda_factura: z
        .number()
        .describe("Número decimal con 2 decimales (por ejemplo, '1068.75')")
        .nullable(),
      factor_moneda_factura: z
        .number()
        .describe("Número decimal con 8 decimales (por ejemplo, '1.00000000')")
        .nullable(),
      valor_dolares_factura: z
        .number()
        .describe('Valor en USD con 2 decimales')
        .nullable(),
    })
    .describe('Datos de factura asociados con el pedimento'),
  no_guia_embarque_id: z
    .string()
    .describe(
      "El número de orden de embarque es un identificador alfanumérico que varía según el modo de transporte. Para transporte terrestre, se asigna un solo número como 123H456. El transporte marítimo recibe uno o dos números por embarque, con formato MLB ABCD12345678 y para HLB no sigue un formato estricto. El transporte aéreo puede tener uno o dos números - una Guía Aérea Maestra (por ejemplo, 23456789) puede o no contener 'M' y/o una Guía Aérea de Casa (por ejemplo, 87654321) puede o no contener 'H'."
    ),
  tipo_contenedor_vehiculo: z
    .string()
    .describe(
      'Tipo de contenedor o vehículo; valor de 2 números. Varían de 1 a 69'
    )
    .nullable(),

  identificadores_pedimento: z
    .array(
      z.object({
        clave: z
          .string()
          .describe("Código de dos letras en mayúsculas (por ejemplo, 'CR', 'SO', 'ED')")
          .nullable(),
        complemento_1: z
          .string()
          .describe("Valor alfanumérico (por ejemplo, '4', 'AA', '0438240ZDKJQ3')")
          .nullable(),
        complemento_2: z
          .string()
          .describe('Campo vacío si no se proporciona')
          .nullable(),
        complemento_3: z
          .string()
          .describe('Campo vacío si no se proporciona')
          .nullable(),
      })
    )
    .describe('Array de identificadores a nivel pedimento'),
  observaciones_a_nivel_pedimento: z
    .string()
    .describe(
      'Las observaciones exactas a nivel pedimento. Transcribe el documento tal como está, sin agregar información adicional.'
    )
    .nullable(),
  document_summary: z
    .string()
    .describe(
      'Un resumen detallado del documento, incluyendo detalles sobre los derechos que se transfieren y contexto que puede ser útil para un humano.'
    )
    .nullable(),
});

const pedimentoSchema = datosGeneralesDePedimentoSchema.extend({
  partidas: z.array(partidaSchema),
});

export type Pedimento = z.infer<typeof pedimentoSchema>;
