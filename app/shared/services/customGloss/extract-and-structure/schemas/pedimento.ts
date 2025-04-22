import { isValid, parse } from 'date-fns';
import { z, type RefinementCtx } from 'zod';

export const partidaSchema = z.object({
  secuencia: z.number().describe('Aparece como "SEC" en el documento'),
  fraccion: z.string(),
  subdivisionONumeroDeIdentificacionComercial: z.string(),
  vinculacion: z.enum(['0', '1', '2']).nullable().describe('Aparece como "VINC" en el documento'),
  metodoDeValoracion: z.enum(['0', '1', '2', '3', '4', '5', '6']).nullable(),
  unidadDeMedidaComercial: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']),
  cantidadUnidadDeMedidaComercial: z.number(),
  unidadDeMedidaDeTarifa: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']),
  cantidadUnidadDeMedidaDeTarifa: z.number().nullable().describe('Aparece como "CANTIDAD UMT" en el documento'),
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
  regulacionesYRestriccionesNoArancelarias: z.array(z.object({
    permiso: z
      .string()
      .describe('Aparece como "CLAVE" en el documento'),
    numeroDePermiso: z.string(),
    firmaDescargo: z
      .string()
      .nullable(),
    valorComercialEnDolares: z.number(),
    cantidadUnidadDeMedidaDeTarifaOComercial: z.number().describe('Aparece como "CANTIDAD UMT/C" en el documento'),
  }).nullable()),
  identificadores: z.array(z.object({
    identificador: z.string(),
    complemento1: z.string().nullable(),
    complemento2: z.string().nullable(),
    complemento3: z.string().nullable(),
  })),
  observaciones: z.string().nullable(),
})

export const medioDeTransporteClaves = ['1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '12', '98', '99'] as const;

function transformFechaEntradaPresentacion(dateStr: string | null, ctx: RefinementCtx) {
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
}

export const datosGeneralesDePedimentoSchema = z.object({
  encabezadoPrincipalDelPedimento: z.object({
    numeroDePedimento: z.string().describe('Etiqueta en el documento: "NUM. PEDIMENTO"'),
    tipoDeOperacion: z.enum(['IMP', 'EXP', 'TRA']).nullable().describe('Etiqueta en el documento: "T. OPER"'),
    // TODO: Apendice 2
    claveDePedimento: z.string().describe('Etiqueta en el documento: "CVE. PEDIMENTO"'),
    regimen: z
      .enum(['IMD', 'EXD', 'ITR', 'ITE', 'ETR', 'ETE', 'DFI', 'RFE', 'TRA', 'RFS'])
      .nullable()
      .describe('Etiqueta en el documento: "REGIMEN:"'),
    destino: z
      .enum(['1', '2', '3', '5', '6', '7', '8', '9', '10', '11'])
      .nullable()
      .describe('Etiqueta en el documento: "DESTINO"'),
    tipoDeCambio: z.number().describe('Etiqueta en el documento: "TIPO CAMBIO"'),
    pesoBruto: z.number().nullable().describe('Etiqueta en el documento: "PESO BRUTO"'),
    // TODO: Apendice 1
    aduanaEntradaOSalida: z.string().nullable().describe('Etiqueta en el documento: "ADUANA E/S"'),
    mediosTransporte: z.object({
      entradaSalida: z.enum(medioDeTransporteClaves).nullable().describe('Etiqueta en el documento: "ENTRADA/SALIDA"'),
      arribo: z.enum(medioDeTransporteClaves).nullable().describe('Etiqueta en el documento: "ARRIBO"'),
      salida: z.enum(medioDeTransporteClaves).nullable().describe('Etiqueta en el documento: "SALIDA"'),
    }),
    valores: z.object({
      valorDolares: z.number().nullable().describe('Aparece como "VAL. DOLARES" en el documento'),
      valorAduana: z.number().nullable().describe('Aparece como "VALOR ADUANA" en el documento'),
      precioPagadoOValorComercial: z.number().nullable().describe('Aparece como "PRECIO PAGADO/VALOR COMERCIAL" en el documento'),
    }),
    datosImportador: z.object({
      rfc: z.string().describe('Etiqueta en el documento: "RFC"'),
      curp: z.string().nullable().describe('Etiqueta en el documento: "CURP"'),
      razonSocial: z.string().describe('Etiqueta en el documento: "NOMBRE, DENOMINACION O RAZON SOCIAL"'),
      domicilio: z.string().nullable().describe('Etiqueta en el documento: "DOMICILIO"'),
    }),
    incrementables: z.object({
      valorSeguros: z.number().nullable().describe('Etiqueta en el documento: "VAL. SEGUROS"'),
      seguros: z.number().nullable().describe('Etiqueta en el documento: "SEGUROS"'),
      fletes: z.number().nullable().describe('Etiqueta en el documento: "FLETES"'),
      embalajes: z.number().nullable().describe('Etiqueta en el documento: "EMBALAJES"'),
      otrosIncrementables: z.number().nullable().describe('Etiqueta en el documento: "OTROS INCREMENTABLES"'),
    }),
    decrementables: z.object({
      transporteDecrementables: z.number().nullable().describe('Etiqueta en el documento: "TRANSPORTE DECREMENTABLES"'),
      seguroDecrementables: z.number().nullable().describe('Etiqueta en el documento: "SEGURO DECREMENTABLES"'),
      cargaDecrementables: z.number().nullable().describe('Etiqueta en el documento: "CARGA DECREMENTABLES"'),
      descargaDecrementables: z.number().nullable().describe('Etiqueta en el documento: "DESCARGA DECREMENTABLES"'),
      otrosDecrementables: z.number().nullable().describe('Etiqueta en el documento: "OTROS DECREMENTABLES"'),
    }),
    marcasNumerosBultos: z
      .object({
        marcas: z.string().describe('El valor puede ser "S/M" que significa sin marca.'),
        numeroDeBulto: z.string().describe('El valor puede ser "S/N" que significa sin numero.'),
        totalDeBultos: z.string(),
      })
      .nullable()
      .describe('Etiqueta en el documento: "MARCAS, NUMEROS Y TOTAL DE BULTOS:"'),
    fechas: z.object({
      entrada: z
        .string()
        .describe("Etiqueta en el documento: 'ENTRADA'")
        .transform(transformFechaEntradaPresentacion),
      pago: z
        .string()
        .describe("Etiqueta en el documento: 'PAGO'")
        .transform(transformFechaEntradaPresentacion),
      extraccion: z
        .string()
        .nullable()
        .describe("Etiqueta en el documento: 'EXTRACCIÓN.'"),
      presentacion: z
        .string()
        .nullable()
        .describe("Etiqueta en el documento: 'PRESENTACIÓN.'"),
      importacionAEstadosUnidosOCanada: z
        .string()
        .nullable()
        .describe("Etiqueta en el documento: 'IMP. EUA/CAN.'"),
      original: z
        .string()
        .nullable()
        .describe("Etiqueta en el documento: 'ORIGINAL.'"),
    }),
    cuadroDeLiquidacion: z.object({
      liquidaciones: z.array(z.object({
        // TODO: Apendice 12
        concepto: z.string().describe('Etiqueta en el documento: "CONCEPTO"'),
        fp: z
          .enum([
            '0', '2', '4', '5', '6', '7', '8', '9', '12', '13', '14', '15', '16', '18', '19', '21', '22'
          ])
          .describe('Etiqueta en el documento: "F.P."'),
        importe: z.number().describe('Etiqueta en el documento: "IMPORTE"'),
      })),
      totales: z.object({
        efectivo: z.number().describe('Etiqueta en el documento: "EFECTIVO"'),
        otros: z.number().describe('Etiqueta en el documento: "OTROS"'),
        total: z.number().describe('Etiqueta en el documento: "TOTAL"'),
      }),
    }),
  }),
  idFiscal: z.string().describe('Número de factura extranjera. Aparece como "ID FISCAL" en el documento').nullable(),
  cove: z.string().describe('Código alfanumérico de 11 caracteres. Aparece como "COVE" en el documento').nullable(),
  nombreRazonSocial: z.string().nullable().describe('Aparece como "NOMBRE, DENOMINACION O RAZON SOCIAL:" en el documento'),
  domicilio: z.string().nullable().describe('Aparece como "DOMICILIO:" en el documento'),
  vinculacion: z.enum(['SI', 'NO']).nullable().describe('Aparece como "VINCULACION:" en el documento'),
  datosFactura: z
    .object({
      numFactura: z.string().nullable().describe('Aparece como "NUM. FACTURA" en el documento'),
      fechaFactura: z.string().describe("Fecha en formato DD/MM/YYYY. Aparece como 'FECHA' en el documento").nullable(),
      incoterm: z.string().describe("Código de tres letras (ejemplo: 'FCA'). Aparece como 'INCOTERM' en el documento").nullable(),
      monedaFactura: z.string().describe("Código de moneda de tres letras (ejemplo: 'USD'). Aparece como 'MONEDA/FACT' en el documento").nullable(),
      valorMonedaFactura: z.number().nullable().describe('Aparece como "VAL. MON. FACT" en el documento'),
      factorMonedaFactura: z.number().nullable().describe('Aparece como "FACTOR MON. FACT" en el documento'),
      valorDolaresFactura: z.number().nullable().describe('Aparece como "VAL. DOLARES" en el documento'),
    }),
  noGuiaEmbarqueId: z.string().describe("Identificador de embarque según modo de transporte"),
  tipoContenedorVehiculo: z.string().describe("Valor de 2 números entre 1 y 69").nullable(),
  identificadoresPedimento: z
    .array(
      z.object({
        clave: z.string().nullable().describe('Aparece como "CLAVE/COMPL. IDENTIFICADOR:" en el documento'),
        complemento1: z.string().nullable().describe('Aparece como "COMPLEMENTO 1:" en el documento'),
        complemento2: z.string().nullable().describe('Aparece como "COMPLEMENTO 2:" en el documento'),
        complemento3: z.string().nullable().describe('Aparece como "COMPLEMENTO 3:" en el documento'),
      })
    ),
  observacionesANivelPedimento: z.string().nullable().describe('Aparece como "OBSERVACIONES:" en el documento'),
});

const pedimentoSchema = datosGeneralesDePedimentoSchema.extend({
  partidas: z.array(partidaSchema),
});

export type Pedimento = z.infer<typeof pedimentoSchema>;
