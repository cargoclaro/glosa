import moment from 'moment';
import { z } from 'zod';

export const coveSchema = z.object({
  datosDelAcuseDeValor: z.object({
    idCove: z
      .string()
      .describe(
        "Ejemplo: 'COVE247163T13'."
      ),
    tipoDeOperacion: z.string(),
    relacionDeFacturas: z.string(),
    numeroDeFactura: z.string(),
    tipoDeFigura: z.string(),
    fechaExpedicion: z
      .string()
      .describe("Fecha de emisión del documento en formato 'DD-MM-YYYY'.")
      .transform((dateStr, ctx) => {
        if (!dateStr) {
          return null;
        }

        const parsedDate = moment(dateStr, 'DD/MM/YYYY');

        if (!parsedDate.isValid()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY.`,
          });
          return null;
        }

        return parsedDate.toDate();
      }),
    observaciones: z.string(),
  }),
  rfcConPermisosDeConsulta: z.object({
    rfcDeConsulta: z.string(),
    nombreORazonSocial: z.string(),
  }),
  numeroDePatenteAduanal: z.object({
    numeroAutorizacionAduanal: z.string()
  }),
  datosDeLaFactura: z.object({
    subdivision: z.string(),
    certificadoDeOrigen: z.string(),
    numeroDeExportadorAutorizado: z.string(),
  }),
  datosGeneralesDelProveedor: z.object({
    tipoDeIdentificador: z.string(),
    identificador: z
      .string()
      .describe("Aparece como 'Tax ID/Sin Tax ID/RFC/CURP'"),
    nombresORazonSocial: z.string(),
    apellidoPaterno: z.string(),
    apellidoMaterno: z.string(),
  }),
  domicilioDelProveedor: z.object({
    calle: z.string(),
    numeroExterior: z.string(),
    numeroInterior: z.string(),
    codigoPostal: z.string(),
    colonia: z.string(),
    localidad: z.string(),
    entidadFederativa: z.string(),
    municipio: z.string(),
    pais: z.string(),
  }),
  datosGeneralesDelDestinatario: z.object({
    tipoDeIdentificador: z.string(),
    identificador: z
      .string()
      .describe("Aparece como 'Tax ID/Sin Tax ID/RFC/CURP'"),
    nombresORazonSocial: z.string(),
    apellidoPaterno: z.string(),
    apellidoMaterno: z.string(),
  }),
  domicilioDelDestinatario: z.object({
    calle: z.string(),
    numeroExterior: z.string(),
    numeroInterior: z.string(),
    codigoPostal: z.string(),
    colonia: z.string(),
    localidad: z.string(),
    entidadFederativa: z.string(),
    municipio: z.string(),
    pais: z.string(),
  }),
  datosMercancia: z.array(
    z
      .object({
        descripcionMercancia: z
          .string()
          .describe(
            "Descripción genérica de la mercancía, ej., 'PIGMENTOS A BASE DE DIOXIDO DE TITANIO'."
          )
          .nullable(),
        claveUmc: z
          .string()
          .describe("Código para la unidad de medida, ej., 'POUND'.")
          .nullable(),
        cantidadUmc: z
          .number()
          .describe(
            "Cantidad de mercancía en la unidad de medida especificada, ej., '11023.00'."
          )
          .nullable(),
        tipoMoneda: z
          .string()
          .describe(
            "Tipo de moneda utilizada en la transacción, ej., 'US Dollar'."
          )
          .nullable(),
        valorUnitario: z
          .number()
          .describe("Valor unitario de la mercancía, ej., '1.69'.")
          .nullable(),
        valorTotal: z
          .number()
          .describe("Valor total de la mercancía, ej., '18628.87'.")
          .nullable(),
        valorTotalDolares: z
          .number()
          .describe("Valor total de la mercancía en USD, ej., '1866.00'.")
          .nullable(),
        numerosSerie: z
          .array(z.string())
          .describe(
            "Array de números de serie de la mercancía, ej., ['1234567890', '0987654321']."
          ),
      })
      .describe('Detalles sobre la mercancía.')
  ),
});

export type Cove = z.infer<typeof coveSchema>;
