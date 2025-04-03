import { isValid, parse } from 'date-fns';
import { z } from 'zod';

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

export const datosGeneralesDePedimentoSchema = z.object({
  encabezadoPrincipalDelPedimento: z.object({
    numeroDePedimento: z.string(),
    tipoDeOperacion: z.enum(['IMP', 'EXP', 'TRA']),
    claveDePedimento: z.string(),
    regimen: z.enum(['IMD', 'EXD', 'ITR', 'ITE', 'ETR', 'ETE', 'DFI', 'RFE', 'TRA', 'RFS']),
    destinoOrigen: z.enum(['1', '2', '3', '5', '6', '7', '8', '9', '10', '11']),
    tipoCambio: z.number(),
    pesoBruto: z.number(),
    aduanaEntradaOSalida: z.string(),
  }),
  mediosTransporte: z
    .object({
      entradaSalida: z.string().nullable(),
      arribo: z.string().nullable(),
      salida: z.string().nullable(),
    }),
  valores: z
    .object({
      valorDolares: z.number().nullable(),
      valorAduana: z.number().nullable(),
      precioPagadoValorComercial: z.number().nullable(),
    }),
  datosImportador: z
    .object({
      rfc: z.string().nullable(),
      curp: z.string().nullable(),
      razonSocial: z.string(),
      domicilio: z.string().nullable(),
    }),
  incrementables: z
    .object({
      valorSeguros: z.number().nullable(),
      seguros: z.number().nullable(),
      fletes: z.number().nullable(),
      embalajes: z.number().nullable(),
      otrosIncrementables: z.number().nullable(),
    }),
  decrementables: z
    .object({
      transporteDecrementables: z.number().nullable(),
      seguroDecrementables: z.number().nullable(),
      cargaDecrementables: z.number().nullable(),
      descargaDecrementables: z.number().nullable(),
      otrosDecrementables: z.number().nullable(),
    }),
  fechaEntradaPresentacion: z
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
  cuadroDeLiquidacion: z
    .object({
      liquidaciones: z
        .array(
          z.object({
            concepto: z.string().nullable(),
            fp: z.number().nullable(),
            importe: z.number().nullable(),
          })
        )
        .nullable(),
      totales: z
        .object({
          efectivo: z.number().nullable(),
          otros: z.number().nullable(),
          total: z.number().nullable(),
        })
        .nullable(),
    }),
  identificadoresNivelPedimento: z
    .object({
      claveSeccionAduanera: z.string().describe("Código numérico de tres dígitos (mostrado como '470' en el documento)").nullable(),
      marcasNumerosBultos: z.string().describe("Campo que muestra cantidad y tipo de paquetes (por ejemplo, 'S/M S/N 4 BULTOS')").nullable(),
    }),
  idFiscal: z.string().describe('Número de factura extranjera').nullable(),
  cove: z.string().describe('Código alfanumérico de 11 caracteres').nullable(),
  nombreRazonSocial: z.string().nullable(),
  domicilio: z.string().nullable(),
  vinculacion: z.enum(['SI', 'NO']).nullable().describe("'SI' o 'NO'"),
  datosFactura: z
    .object({
      numFactura: z.string().nullable(),
      fechaFactura: z.string().describe("Fecha en formato DD/MM/YYYY").nullable(),
      incoterm: z.string().describe("Código de tres letras (ejemplo: 'FCA')").nullable(),
      monedaFactura: z.string().describe("Código de moneda de tres letras (ejemplo: 'USD')").nullable(),
      valorMonedaFactura: z.number().nullable(),
      factorMonedaFactura: z.number().nullable(),
      valorDolaresFactura: z.number().nullable(),
    }),
  noGuiaEmbarqueId: z.string().describe("Identificador de embarque según modo de transporte"),
  tipoContenedorVehiculo: z.string().describe('Valor de 2 números entre 1 y 69').nullable(),
  identificadoresPedimento: z
    .array(
      z.object({
        clave: z.string().nullable(),
        complemento1: z.string().nullable(),
        complemento2: z.string().nullable(),
        complemento3: z.string().nullable(),
      })
    ),
  observacionesANivelPedimento: z.string().nullable(),
});

const pedimentoSchema = datosGeneralesDePedimentoSchema.extend({
  partidas: z.array(partidaSchema),
});

export type Pedimento = z.infer<typeof pedimentoSchema>;
