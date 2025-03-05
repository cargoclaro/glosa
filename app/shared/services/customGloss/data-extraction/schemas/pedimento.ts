import { z } from "zod"
import { partidasSchema } from "./partidas"

export type Pedimento = z.infer<typeof pedimentoSchema>;

export const pedimentoSchema = z.object({
  encabezado_del_pedimento: z
    .object({
      num_pedimento: z
        .string()
        .describe(
          "A 15-digit number formatted as XX XX XXXX XXXXXXX (2 digits, 2 digits, 4 digits, 7 digits)"
        )
        .optional(),
      tipo_oper: z
        .string()
        .describe(
          "3-letter code indicating operation type (e.g., 'IMP' for imports)"
        )
        .optional(),
      cve_pedim: z
        .string()
        .describe(
          "2-character code (e.g., 'A1') indicating pedimento type"
        )
        .optional(),
      regimen: z
        .string()
        .describe("3-letter code indicating customs regime (e.g., 'IMD')")
        .optional(),
      destino_origen: z
        .string()
        .describe("Single digit number indicating destination")
        .optional(),
      tipo_cambio: z
        .number()
        .describe("Exchange rate with 5 decimal places (e.g., 16.86600)")
        .optional(),
      peso_bruto: z
        .number()
        .describe("Gross weight in kilograms with 3 decimal places")
        .optional(),
      aduana_entrada_salida: z
        .string()
        .describe("3-digit code indicating customs office")
        .optional()
    })
    .describe("Header information of the pedimento (customs document)")
    .optional(),
  medios_transporte: z
    .object({
      entrada_salida: z
        .string()
        .describe("Single digit code for entry/exit transport")
        .optional(),
      arribo: z
        .string()
        .describe("Single digit code for arrival transport")
        .optional(),
      salida: z
        .string()
        .describe("Single digit code for departure transport")
        .optional()
    })
    .describe("Transportation means")
    .optional(),
  valores: z
    .object({
      valor_dolares: z
        .number()
        .describe("Value in USD with 2 decimal places, always together it is never separated by commas, spaces or any other character")
        .optional(),
      valor_aduana: z
        .number()
        .describe("Customs value in MXN, always together it is never separated by commas, spaces or any other character")
        .optional(),
      precio_pagado_valor_comercial: z
        .number()
        .describe("Commercial value/paid price in MXN, always together it is never separated by commas, spaces or any other character")
        .optional()
    })
    .describe("Values related to the transaction")
    .optional(),
  datos_importador: z
    .object({
      rfc: z
        .string()
        .describe(
          "12-character RFC code for companies or 13 for individuals"
        )
        .optional(),
      curp: z
        .string()
        .describe("18-character CURP identifier (optional)")
        .optional(),
      razon_social: z
        .string()
        .describe("Company or individual's full legal name")
        .optional(),
      domicilio: z
        .string()
        .describe(
          "Complete address including street, number, postal code, city, and state"
        )
        .optional()
    })
    .describe("Importer information")
    .optional(),
  incrementables: z
    .object({
      val_seguros: z
        .number()
        .describe("Insurance value in MXN")
        .optional(),
      seguros: z
        .number()
        .describe("Insurance costs in MXN")
        .optional(),
      fletes: z
        .number()
        .describe("Freight costs in MXN")
        .optional(),
      embalajes: z
        .number()
        .describe("Packaging costs in MXN")
        .optional(),
      otros_incrementables: z
        .number()
        .describe("Other additional costs in MXN")
        .optional()
    })
    .describe("Additional costs to be added")
    .optional(),
  decrementables: z
    .object({
      transporte_decrementables: z
        .number()
        .describe("Deductible transport costs in MXN")
        .optional(),
      seguro_decrementables: z
        .number()
        .describe("Deductible insurance costs in MXN")
        .optional(),
      carga_decrementables: z
        .number()
        .describe("Deductible loading costs in MXN")
        .optional(),
      descarga_decrementables: z
        .number()
        .describe("Deductible unloading costs in MXN")
        .optional(),
      otros_decrementables: z
        .number()
        .describe("Other deductible costs in MXN")
        .optional()
    })
    .describe("Costs to be deducted")
    .optional(),
  fecha_entrada_presentacion: z
    .string()
    .describe("Date in DD/MM/YYYY format (e.g., '13/05/2024')")
    .optional(),
  identificadores_nivel_pedimento: z
    .object({
      clave_seccion_aduanera: z
        .string()
        .describe("Three-digit numeric code (shown as '470' in document)")
        .optional(),
      marcas_numeros_bultos: z
        .string()
        .describe(
          "Text field showing quantity and type of packages (e.g., 'S/M S/N 4 BULTOS')"
        )
        .optional()
    })
    .describe("Identifiers at the pedimento level")
    .optional(),
  id_fiscal: z
    .string()
    .describe(
      "Alphanumeric code representing the foreign invoice number; if none, leave blank"
    )
    .optional(),
  cove: z
    .string()
    .describe(
      "Alphanumeric code (shown as 'COVE'); important and has 11 characters"
    )
    .optional(),
  nombre_razon_social: z
    .string()
    .describe(
      "Company name in uppercase letters (e.g., 'SAIC MOTOR INTERNATIONAL CO., LTD')"
    )
    .optional(),
  domicilio: z
    .string()
    .describe(
      "Full address with specific format (e.g., 'YESHENG ROAD No. 188 No. Int. ROOM 429H, C.P. 200135, PILOT FREE TRADE ZONE SHANGHAI, CHINA (REPUBLICA POPULAR)')"
    )
    .optional(),
  vinculacion: z
    .string()
    .describe("Two-letter text field ('SI' or 'NO')")
    .optional(),
  datos_factura: z
    .array(
      z.object({
        num_factura: z
          .string()
          .describe(
            "The Mexican invoice number; alphanumeric; if none, leave blank"
          )
          .optional(),
        fecha_factura: z
          .string()
          .describe("Date in DD/MM/YYYY format (e.g., '07/05/2024')")
          .optional(),
        incoterm: z
          .string()
          .describe("Three-letter code in uppercase (e.g., 'FCA')")
          .optional(),
        moneda_factura: z
          .string()
          .describe("Three-letter currency code (e.g., 'USD')")
          .optional(),
        valor_moneda_factura: z
          .number()
          .describe(
            "Decimal number with 2 decimal places (e.g., '1068.75')"
          )
          .optional(),
        factor_moneda_factura: z
          .number()
          .describe(
            "Decimal number with 8 decimal places (e.g., '1.00000000')"
          )
          .optional(),
        valor_dolares_factura: z
          .number()
          .describe("Value in USD with 2 decimal places")
          .optional()
      })
    )
    .describe(
      "Array of invoices associated with the pedimento. There can be more than one, but it always should have all of the values. There should be a box per invoice."
    )
    .optional(),
  no_guia_embarque_id: z
    .string()
    .describe(
      "Shipment order number; alphanumeric; if none, leave blank; sometimes there could be two, identifiable with 'M' and 'H' for Master and House."
    )
    .optional(),
  identificadores_pedimento: z
    .array(
      z.object({
        clave: z
          .string()
          .describe(
            "Two-letter code in uppercase (e.g., 'CR', 'SO', 'ED')"
          )
          .optional(),
        complemento_1: z
          .string()
          .describe(
            "Alphanumeric value (e.g., '4', 'AA', '0438240ZDKJQ3')"
          )
          .optional(),
        complemento_2: z
          .string()
          .describe("Empty field if not provided")
          .optional(),
        complemento_3: z
          .string()
          .describe("Empty field if not provided")
          .optional()
      })
    )
    .describe("Array of pedimento-level identifiers")
    .optional(),
  observaciones_a_nivel_pedimento: z
    .string()
    .describe(
      "The exact observations at the pedimento level. Transcribe the document as it is, without adding any additional information."
    )
    .optional(),
  document_summary: z
    .string()
    .describe(
      "A detailed summary of the document, including details about the rights being transferred and context that can be useful for a human."
    )
    .optional(),
  partidas: z
    .array(partidasSchema)
    .describe("Full array of partidas (one object per partida)")
    .optional()
})