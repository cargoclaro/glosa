import { isValid, parse } from 'date-fns';
import { z, type RefinementCtx } from 'zod';

export const partidaSchema = z.object({
  secuencia: z.number().describe('Etiqueta en el documento: "SEC"'),
  fraccion: z.string().describe('Etiqueta en el documento: "FRACC"'),
  subdivisionONumeroDeIdentificacionComercial: z.string().describe('Etiqueta en el documento: "SUBDIV/NUM. IDENT. COMERCIAL"'),
  vinculacion: z.enum(['0', '1', '2']).nullable().describe('Etiqueta en el documento: "VINC"'),
  metodoDeValoracion: z.enum(['0', '1', '2', '3', '4', '5', '6']).nullable().describe('Etiqueta en el documento: "MET VAL"'),
  unidadDeMedidaComercial: z
    .enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'])
    .describe('Etiqueta en el documento: "UMC"'),
  cantidadUnidadDeMedidaComercial: z.number().describe('Etiqueta en el documento: "CANTIDAD UMC"'),
  unidadDeMedidaDeTarifa: z
    .enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'])
    .describe('Etiqueta en el documento: "UMT"'),
  cantidadUnidadDeMedidaDeTarifa: z.number().nullable().describe('Etiqueta en el documento: "CANTIDAD UMT"'),
  paisDeVentaOCompra: z.string().nullable().describe('Una clave de pais ISO 3166-1 alfa-3. Etiqueta en el documento: "P. V/C."'),
  paisDeOrigenODestino: z.string().nullable().describe('Una clave de pais ISO 3166-1 alfa-3. Etiqueta en el documento: "P. O/D."'),
  descripcion: z.string().describe('Etiqueta en el documento: "DESCRIPCION"'),
  valorEnAduanaOValorEnUSD: z.number().describe('Etiqueta en el documento: "VAL ADU/USD"'),
  importeDePrecioPagadoOValorComercial: z.number().describe('Etiqueta en el documento: "IMP. PRECIO PAG."'),
  precioUnitario: z.number().describe('Etiqueta en el documento: "PRECIO UNIT."'),
  valorAgregado: z.number().nullable().describe('Etiqueta en el documento: "VAL. AGREG."'),
  marca: z.string().nullable().describe('Etiqueta en el documento: "MARCA"'),
  modelo: z.string().nullable().describe('Etiqueta en el documento: "MODELO"'),
  codigoProducto: z.string().nullable().describe('Etiqueta en el documento: "CODIGO PRODUCTO"'),
  contribuciones: z.array(z.object({
    contribucion: z.string().describe('Etiqueta en el documento: "CON."'),
    tasa: z.number().describe('Etiqueta en el documento: "TASA"'),
    tipoDeTasa: z.string().describe('Etiqueta en el documento: "T.T."'),
    formaDePago: z.string().describe('Etiqueta en el documento: "F.P."'),
    importe: z.number().describe('Etiqueta en el documento: "IMPORTE"'),
  })),
  regulacionesYRestriccionesNoArancelarias: z.array(z
    .object({
      permiso: z
        .string()
        .describe('Etiqueta en el documento: "CLAVE"'),
      numeroDePermiso: z.string().describe('Etiqueta en el documento: "NUM. PERMISO"'),
      firmaDescargo: z
        .string()
        .nullable()
        .describe('Etiqueta en el documento: "FIRMA DESCARGO"'),
      valorComercialEnDolares: z.number().describe('Etiqueta en el documento: "VAL. COM. DLS."'),
      cantidadUnidadDeMedidaDeTarifaOComercial: z.number().describe('Etiqueta en el documento: "CANTIDAD UMT/C"'),
    })
    .nullable()
  ),
  // TODO: Apendice 8
  identificadores: z.array(z.object({
    identificador: z.string(),
    complemento1: z.string().nullable(),
    complemento2: z.string().nullable(),
    complemento3: z.string().nullable(),
  })),
  observacionesANivelPartida: z.string().nullable().describe('Etiqueta en el documento: "OBSERVACIONES A NIVEL PARTIDA"'),
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
        totalDeBultos: z.number(),
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
  datosDelProveedorOComprador: z.array(z.object({
    idFiscal: z.string().nullable().describe('Número de factura extranjera. Etiqueta en el documento: "ID FISCAL"'),
    nombreRazonSocial: z.string().describe('Etiqueta en el documento: "NOMBRE, DENOMINACION O RAZON SOCIAL"'),
    domicilio: z.string().nullable().describe('Etiqueta en el documento: "DOMICILIO"'),
    vinculacion: z.enum(['SI', 'NO']).nullable().describe('Etiqueta en el documento: "VINCULACION"'),
    facturas: z.array(z.object({
      numeroDeCFDIODocumentoEquivalente: z.string().describe('Etiqueta en el documento: "NUM. FACTURA"'),
      fecha: z
        .string()
        .describe("Etiqueta en el documento: 'FECHA'")
        .transform(transformFechaEntradaPresentacion),
      // TODO: Apendice 14
      incoterm: z.string().describe("Etiqueta en el documento: 'INCOTERM'").nullable(),
      // TODO: Apendice 5
      moneda: z.string().describe("Etiqueta en el documento: 'MONEDA/FACT'"),
      valorMoneda: z.number().describe('Etiqueta en el documento: "VAL. MON. FACT"'),
      factorMoneda: z.number().describe('Etiqueta en el documento: "FACTOR MON. FACT"'),
      valorDolares: z.number().describe('Etiqueta en el documento: "VAL. DOLARES"'),
    })),
  })),
  guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte: z
    .object({
      numeroMaster: z.string(),
      numeroHouse: z.string(),
    })
    .nullable()
    .describe('Etiqueta en el documento: "NUMERO (GUIA/ORDEN EMBARQUE)/ID"'),
  contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo: z
    .object({
      numero: z.string().describe('Etiqueta en el documento: "NÚMERO"'),
      // TODO: Apendice 10
      tipo: z.string().describe('Etiqueta en el documento: "TIPO"'),
    })
    .nullable()
    .describe('Etiqueta en el documento: "CONTENEDORES/ CARRO DE FERROCARRIL/ NÚMERO ECONÓMICO DEL VEHÍCULO"'),
  identificadoresPedimento: z.array(z
    .object({
      // TODO: Apendice 8
      clave: z.string().describe('Etiqueta en el documento: "CLAVE/COMPL. IDENTIFICADOR"'),
      complemento1: z.string().nullable().describe('Etiqueta en el documento: "COMPLEMENTO 1"'),
      complemento2: z.string().nullable().describe('Etiqueta en el documento: "COMPLEMENTO 2"'),
      complemento3: z.string().nullable().describe('Etiqueta en el documento: "COMPLEMENTO 3"'),
    }))
    .describe('Etiqueta en el documento: "IDENTIFICADORES". No confundir con los identificadores de la partida.'),
  observacionesANivelPedimento: z.string().nullable().describe('Etiqueta en el documento: "OBSERVACIONES"'),
});

const pedimentoSchema = datosGeneralesDePedimentoSchema.extend({
  partidas: z.array(partidaSchema),
});

export type Pedimento = z.infer<typeof pedimentoSchema>;
