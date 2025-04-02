import moment from 'moment';
import { z } from 'zod';

export const datosGeneralesSchema = z.object({
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
});

export const mercanciaSchema = z.object({
  datosDeLaMercancia: z.object({
    descripcionGenericaDeLaMercancia: z.string(),
    claveUMC: z.string(),
    cantidadUMC: z.number(),
    tipoMoneda: z.string(),
    valorUnitario: z.number(),
    valorTotal: z.number(),
    valorTotalEnDolares: z.number(),
  }),
  descripcionDeLaMercancia: z.object({
    marca: z.string(),
    modelo: z.string(),
    submodelo: z.string(),
    numeroDeSerie: z.string(),
  }).nullable().describe("Casi nunca aparece"),
});

const coveSchema = datosGeneralesSchema.extend({
  mercancias: z.array(mercanciaSchema),
});

export type Cove = z.infer<typeof coveSchema>;
