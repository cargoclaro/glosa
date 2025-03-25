import { isValid, parse } from 'date-fns';
import { z } from 'zod';
import { partidasSchema } from './partidas';

export type Pedimento = z.infer<typeof pedimentoSchema>;

export const pedimentoSchema = z.object({
  encabezado_del_pedimento: z
    .object({
      num_pedimento: z
        .string()
        .describe(
          'A 15-digit number formatted as XX XX XXXX XXXXXXX (2 digits, 2 digits, 4 digits, 7 digits)'
        )
        .nullable(),
      tipo_oper: z
        .enum(['IMP', 'EXP', 'TRA'])
        .describe(
          'Tipo de operación: IMP (Importación), EXP (Exportación/retorno), TRA (Tránsitos)'
        )
        .nullable(),
      cve_pedim: z
        .string()
        .describe("2-character code (e.g., 'A1') indicating pedimento type")
        .nullable(),
      regimen: z
        .string()
        .describe("3-letter code indicating customs regime (e.g., 'IMD')")
        .nullable(),
      destino_origen: z
        .string()
        .describe('Single digit number indicating destination')
        .nullable(),
      tipo_cambio: z
        .number()
        .describe('Exchange rate with 5 decimal places (e.g., 16.86600)')
        .nullable(),
      peso_bruto: z
        .number()
        .describe('Gross weight in kilograms with 3 decimal places')
        .nullable(),
      aduana_entrada_salida: z
        .string()
        .describe('3-digit code indicating customs office')
        .nullable(),
    })
    .describe('Header information of the pedimento (customs document)'),
  medios_transporte: z
    .object({
      entrada_salida: z
        .string()
        .describe('Single digit code for entry/exit transport')
        .nullable(),
      arribo: z
        .string()
        .describe('Single digit code for arrival transport')
        .nullable(),
      salida: z
        .string()
        .describe('Single digit code for departure transport')
        .nullable(),
    })
    .describe('Transportation means'),
  valores: z
    .object({
      valor_dolares: z
        .number()
        .describe(
          'Value in USD with 2 decimal places, always together it is never separated by commas, spaces or any other character'
        )
        .nullable(),
      valor_aduana: z
        .number()
        .describe(
          'Customs value in MXN, always together it is never separated by commas, spaces or any other character'
        )
        .nullable(),
      precio_pagado_valor_comercial: z
        .number()
        .describe(
          'Commercial value/paid price in MXN, always together it is never separated by commas, spaces or any other character'
        )
        .nullable(),
    })
    .describe('Values related to the transaction'),
  datos_importador: z
    .object({
      rfc: z
        .string()
        .describe('12-character RFC code for companies or 13 for individuals')
        .nullable(),
      curp: z
        .string()
        .describe('18-alphanumeric number CURP identifier (optional)')
        .nullable(),
      razon_social: z
        .string()
        .describe("Company or individual's full legal name, near the CURP"),
      domicilio: z
        .string()
        .describe(
          'Complete address including street, number, postal code, city, and state'
        )
        .nullable(),
    })
    .describe('Importer information'),
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
    .describe('Additional costs to be added'),
  decrementables: z
    .object({
      transporte_decrementables: z
        .number()
        .describe('Deductible transport costs in MXN')
        .nullable(),
      seguro_decrementables: z
        .number()
        .describe('Deductible insurance costs in MXN')
        .nullable(),
      carga_decrementables: z
        .number()
        .describe('Deductible loading costs in MXN')
        .nullable(),
      descarga_decrementables: z
        .number()
        .describe('Deductible unloading costs in MXN')
        .nullable(),
      otros_decrementables: z
        .number()
        .describe('Other deductible costs in MXN')
        .nullable(),
    })
    .describe('Costs to be deducted'),
  fecha_entrada_presentacion: z
    .string()
    .describe("Date in DD/MM/YYYY format (e.g., '13/05/2024')")
    .nullable()
    .transform((dateStr, ctx) => {
      if (!dateStr) {
        return null;
      }

      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());

      if (!isValid(parsedDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid date format: ${dateStr}. Expected DD/MM/YYYY.`,
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
                'Concept code or name (e.g., "DTA", "PRV", "IVA", "IVA/PRV")'
              )
              .nullable(),
            fp: z
              .number()
              .describe('Payment form code, usually a numeric value')
              .nullable(),
            importe: z
              .number()
              .describe('Amount to be paid for this concept in MXN')
              .nullable(),
          })
        )
        .describe(
          'Array of liquidation entries showing taxes and fees to be paid'
        )
        .nullable(),
      totales: z
        .object({
          efectivo: z
            .number()
            .describe('Total amount to be paid in cash')
            .nullable(),
          otros: z
            .number()
            .describe('Total amount to be paid through other means')
            .nullable(),
          total: z.number().describe('Grand total of all payments').nullable(),
        })
        .describe('Summary of payment totals')
        .nullable(),
    })
    .describe('Complete liquidation table with entries and totals'),
  identificadores_nivel_pedimento: z
    .object({
      clave_seccion_aduanera: z
        .string()
        .describe("Three-digit numeric code (shown as '470' in document)")
        .nullable(),
      marcas_numeros_bultos: z
        .string()
        .describe(
          "Text field showing quantity and type of packages (e.g., 'S/M S/N 4 BULTOS')"
        )
        .nullable(),
    })
    .describe('Identifiers at the pedimento level'),
  id_fiscal: z
    .string()
    .describe('Alphanumeric code representing the foreign invoice number. ')
    .nullable(),
  cove: z
    .string()
    .describe(
      "Alphanumeric code (shown as 'COVE'); important and has 11 characters"
    )
    .nullable(),
  nombre_razon_social: z
    .string()
    .describe(
      "Company name in uppercase letters (e.g., 'SAIC MOTOR INTERNATIONAL CO., LTD')"
    )
    .nullable(),
  domicilio: z
    .string()
    .describe(
      "Full address with specific format (e.g., 'YESHENG ROAD No. 188 No. Int. ROOM 429H, C.P. 200135, PILOT FREE TRADE ZONE SHANGHAI, CHINA (REPUBLICA POPULAR)')"
    )
    .nullable(),
  vinculacion: z
    .string()
    .describe("Two-letter text field ('SI' or 'NO')")
    .nullable(),
  datos_factura: z
    .object({
      num_factura: z
        .string()
        .describe(
          'The Mexican invoice number; alphanumeric; if none, leave blank'
        )
        .nullable(),
      fecha_factura: z
        .string()
        .describe("Date in DD/MM/YYYY format (e.g., '07/05/2024')")
        .nullable(),
      incoterm: z
        .string()
        .describe("Three-letter code in uppercase (e.g., 'FCA')")
        .nullable(),
      moneda_factura: z
        .string()
        .describe("Three-letter currency code (e.g., 'USD')")
        .nullable(),
      valor_moneda_factura: z
        .number()
        .describe("Decimal number with 2 decimal places (e.g., '1068.75')")
        .nullable(),
      factor_moneda_factura: z
        .number()
        .describe("Decimal number with 8 decimal places (e.g., '1.00000000')")
        .nullable(),
      valor_dolares_factura: z
        .number()
        .describe('Value in USD with 2 decimal places')
        .nullable(),
    })
    .describe('Invoice data associated with the pedimento'),
  no_guia_embarque_id: z
    .string()
    .describe(
      "The shipment order number is an alphanumeric identifier that varies by transport mode. For land transport, a single number is assigned like 123H456. Maritime transport gets one or two numbers per shipment, formatted for MLB ABCD12345678 and for HLB do not follow an strict format. Air transport can have either one or two numbers - a Master Air Waybill (e.g. 23456789) may or may not contain 'M' and/or a House Air Waybill (e.g. 87654321) may or may not contain 'H'."
    ),
  tipo_contenedor_vehiculo: z
    .string()
    .describe(
      'Type of container or vehicle; value of 2 numbers. They range from 1 to 69'
    )
    .nullable(),

  identificadores_pedimento: z
    .array(
      z.object({
        clave: z
          .string()
          .describe("Two-letter code in uppercase (e.g., 'CR', 'SO', 'ED')")
          .nullable(),
        complemento_1: z
          .string()
          .describe("Alphanumeric value (e.g., '4', 'AA', '0438240ZDKJQ3')")
          .nullable(),
        complemento_2: z
          .string()
          .describe('Empty field if not provided')
          .nullable(),
        complemento_3: z
          .string()
          .describe('Empty field if not provided')
          .nullable(),
      })
    )
    .describe('Array of pedimento-level identifiers'),
  observaciones_a_nivel_pedimento: z
    .string()
    .describe(
      'The exact observations at the pedimento level. Transcribe the document as it is, without adding any additional information.'
    )
    .nullable(),
  document_summary: z
    .string()
    .describe(
      'A detailed summary of the document, including details about the rights being transferred and context that can be useful for a human.'
    )
    .nullable(),
  partidas: z
    .array(partidasSchema)
    .describe('Full array of partidas (one object per partida)')
    .nullable(),
});
