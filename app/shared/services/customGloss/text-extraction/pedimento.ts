export const prompt = `
- Identifica los datos del pedimento
- Identifica con cuidado las múltiples fracciones que puede haber en el documento, para llenar adecuadamente toda la sección de partidas
`;

import { z } from "zod";

/**
 * Encabezado del Pedimento Schema
 */
const EncabezadoDelPedimentoSchema = z.object({
  num_pedimento: z
    .string()
    .describe(
      "A 15-digit number formatted as XX XX XXXX XXXXXXX (2 digits, 2 digits, 4 digits, 7 digits)"
    ),
  tipo_oper: z
    .string()
    .describe("3-letter code indicating operation type (e.g., 'IMP' for imports)"),
  cve_pedim: z
    .string()
    .describe("2-character code (e.g., 'A1') indicating pedimento type"),
  regimen: z
    .string()
    .describe("3-letter code indicating customs regime (e.g., 'IMD')"),
  destino: z
    .string()
    .describe("Single digit number indicating destination"),
  tipo_cambio: z
    .number()
    .describe("Exchange rate with 5 decimal places (e.g., 16.86600)"),
  peso_bruto: z
    .number()
    .describe("Gross weight in kilograms with 3 decimal places"),
  aduana_entrada_salida: z
    .string()
    .describe("3-digit code indicating customs office"),
});

/**
 * Medios de Transporte Schema
 */
const MediosTransporteSchema = z.object({
  entrada_salida: z
    .string()
    .describe("Single digit code for entry/exit transport"),
  arribo: z
    .string()
    .describe("Single digit code for arrival transport"),
  salida: z
    .string()
    .describe("Single digit code for departure transport"),
});

/**
 * Valores Schema
 */
const ValoresSchema = z.object({
  valor_dolares: z
    .number()
    .describe("Value in USD with 2 decimal places"),
  valor_aduana: z
    .number()
    .describe("Customs value in MXN"),
  precio_pagado_valor_comercial: z
    .number()
    .describe("Commercial value/paid price in MXN"),
});

/**
 * Datos Importador Schema
 */
const DatosImportadorSchema = z.object({
  rfc: z
    .string()
    .describe("12-character RFC code for companies or 13 for individuals"),
  curp: z
    .string()
    .optional()
    .describe("18-character CURP identifier (optional)"),
  razon_social: z
    .string()
    .describe("Company or individual's full legal name"),
  domicilio: z
    .string()
    .describe(
      "Complete address including street, number, postal code, city, and state"
    ),
});

/**
 * Incrementables Schema
 */
const IncrementablesSchema = z.object({
  val_seguros: z.number().describe("Insurance value in MXN"),
  seguros: z.number().describe("Insurance costs in MXN"),
  fletes: z.number().describe("Freight costs in MXN"),
  embalajes: z.number().describe("Packaging costs in MXN"),
  otros_incrementables: z.number().describe("Other additional costs in MXN"),
});

/**
 * Decrementables Schema
 */
const DecrementablesSchema = z.object({
  transporte_decrementables: z.number().describe("Deductible transport costs in MXN"),
  seguro_decrementables: z.number().describe("Deductible insurance costs in MXN"),
  carga_decrementables: z.number().describe("Deductible loading costs in MXN"),
  descarga_decrementables: z.number().describe("Deductible unloading costs in MXN"),
  otros_decrementables: z.number().describe("Other deductible costs in MXN"),
});

/**
 * Identificadores a Nivel Pedimento Schema
 */
const IdentificadoresNivelPedimentoSchema = z.object({
  clave_seccion_aduanera: z
    .string()
    .describe("Three-digit numeric code (e.g., '470')"),
  marcas_numeros_bultos: z
    .string()
    .describe("Text field showing quantity and type of packages (e.g., '4 BULTOS')"),
});

/**
 * Datos Factura (items for datos_factura array)
 */
const DatosFacturaItemSchema = z.object({
  num_factura: z
    .string()
    .describe("The Mexican invoice number; alphanumeric; if none, leave blank"),
  fecha_factura: z
    .string()
    .describe("Date in DD/MM/YYYY format (e.g., '07/05/2024')"),
  incoterm: z
    .string()
    .describe("Three-letter code in uppercase (e.g., 'FCA')"),
  moneda_factura: z
    .string()
    .describe("Three-letter currency code (e.g., 'USD')"),
  valor_moneda_factura: z
    .number()
    .describe("Decimal number with 2 decimal places (e.g., '1068.75')"),
  factor_moneda_factura: z
    .number()
    .describe("Decimal number with 8 decimal places (e.g., '1.00000000')"),
  valor_dolares_factura: z
    .number()
    .describe("Value in USD with 2 decimal places"),
});

/**
 * Identificadores Pedimento (items for identificadores_pedimento array)
 */
const IdentificadorPedimentoItemSchema = z.object({
  clave: z.string().describe("Two-letter code in uppercase (e.g., 'CR', 'SO', 'ED')"),
  complemento_1: z
    .string()
    .describe("Alphanumeric value (e.g., '4', 'AA', '0438240ZDKJQ3')"),
  complemento_2: z
    .string()
    .optional()
    .describe("Empty field if not provided"),
  complemento_3: z
    .string()
    .optional()
    .describe("Empty field if not provided"),
});

/**
 * Contribuciones (items within partidas[].contribuciones)
 */
const ContribucionesSchema = z.object({
  con: z.string().describe("Contribución"),
  tasa: z.number().describe("Tasa de contribución"),
  t_t: z.string().describe("Tipo de tasa"),
  f_p: z.string().describe("Forma de pago"),
  importe: z.number().describe("Importe de la contribución"),
});

/**
 * Identificadores dentro de cada Partida (items for partidas[].identificadores)
 */
const PartidaIdentificadorSchema = z.object({
  clave: z.string().describe("Clave de identificador"),
  complemento1: z.string().optional().describe("Primer complemento"),
  complemento2: z.string().optional().describe("Segundo complemento"),
  complemento3: z.string().optional().describe("Tercer complemento"),
});

/**
 * Partidas Schema (items for the partidas array)
 */
const PartidaSchema = z.object({
  sec: z.number().describe("Número de sección"),
  fraccion: z
    .string()
    .regex(/^\d{8}$/, "Must be 8 digits")
    .describe("Fracción arancelaria (8 digits)"),
  nico: z
    .string()
    .regex(/^\d{2}$/, "Must be 2 digits")
    .describe("Número de identificación comercial (2 digits)"),
  vinc: z
    .enum(["0", "1"])
    .describe('Vínculo: "0" or "1"'),
  met_val: z
    .enum(["1"])
    .describe('Método de valoración: "1"'),
  umc: z.string().describe("Unidad de medida comercial"),
  cantidad_umc: z.number().describe("Cantidad en unidad de medida comercial"),
  umt: z.string().describe("Unidad de medida de tarifa"),
  cantidad_umt: z.number().describe("Cantidad en unidad de medida de tarifa"),
  p_v_c: z
    .string()
    .length(3, "Must be a 3-letter country code")
    .describe("País de venta o compra (3-letter code)"),
  p_o_d: z
    .string()
    .length(3, "Must be a 3-letter country code")
    .describe("País de origen o destino (3-letter code)"),
  contribuciones: z.array(ContribucionesSchema).optional(),
  descripcion: z.string().describe("Descripción del producto"),
  val_adu: z.number().describe("Valor aduanero"),
  imp_precio_pag: z.number().describe("Importe de precio pagado"),
  precio_unit: z.number().describe("Precio unitario"),
  identificadores: z.array(PartidaIdentificadorSchema).optional(),
  observaciones: z.array(z.string()).optional(),
  document_summary: z
    .string()
    .describe(
      "Un resumen detallado de la sección de partidas, generado por el LLM."
    ),
});

/**
 * Main "Documents" item schema (each element of the 'documents' array)
 */
export const pedimentoSchema = z.object({
  encabezado_del_pedimento: EncabezadoDelPedimentoSchema,
  medios_transporte: MediosTransporteSchema,
  valores: ValoresSchema,
  datos_importador: DatosImportadorSchema,
  incrementables: IncrementablesSchema,
  decrementables: DecrementablesSchema,
  fecha_entrada_presentacion: z
    .string()
    .describe("Date in DD/MM/YYYY format (e.g., '13/05/2024')"),
  identificadores_nivel_pedimento: IdentificadoresNivelPedimentoSchema,
  id_fiscal: z
    .string()
    .describe(
      "Alphanumeric code representing the foreign invoice number; if none, leave blank"
    ),
  cove: z
    .string()
    .describe("Alphanumeric code of 11 characters (COVE)"),
  nombre_razon_social: z
    .string()
    .describe("Company name in uppercase letters (e.g., 'SAIC MOTOR ...')"),
  domicilio: z
    .string()
    .describe(
      "Full address with specific format (e.g., 'YESHENG ROAD No. 188 ...')"
    ),
  vinculacion: z
    .enum(["SI", "NO"])
    .describe("Two-letter text field ('SI' or 'NO')"),
  datos_factura: z.array(DatosFacturaItemSchema).describe(
    "Array of invoices associated with the pedimento"
  ),
  /**
   * Note: The JSON schema has `"type": "string"`, `is_many: true`.
   * Depending on your use case, you could allow this to be an array of strings or a single string.
   * We'll keep it as string (since the base type is string) but mention it can hold multiple refs.
   */
  no_guia_embarque_id: z
    .string()
    .describe(
      "Shipment order number; alphanumeric; if none, leave blank. Sometimes can be two (Master/House)."
    ),
  identificadores_pedimento: z.array(IdentificadorPedimentoItemSchema).describe(
    "Array of pedimento-level identifiers"
  ),
  observaciones_a_nivel_pedimento: z
    .string()
    .describe("Exact observations at the pedimento level"),
  document_summary: z
    .string()
    .describe(
      "A detailed summary of the document, including details about the rights being transferred..."
    ),
  partidas: z
    .array(PartidaSchema)
    .describe("Full array of partidas (one object per partida)"),
});
