import { z } from 'zod';
import { transformStringToDate } from '~/lib/utils';

export const datosGeneralesSchema = z.object({
  datosDelAcuseDeValor: z.object({
    idCove: z.string().describe("Ejemplo: 'COVE247163T13'."),
    tipoDeOperacion: z.string(),
    relacionDeFacturas: z.string(),
    numeroDeFactura: z.string(),
    tipoDeFigura: z.string(),
    fechaExpedicion: z
      .string()
      .describe("Fecha de emisión del documento en formato 'DD-MM-YYYY'.")
      .transform(transformStringToDate),
    observaciones: z.string().nullable(),
  }),
  datosGeneralesDelProveedor: z.object({
    tipoDeIdentificador: z.enum(['TAX ID', 'RFC']),
    taxIdSinTaxIdRfcCurp: z.string(),
    nombresORazonSocial: z.string(),
    apellidoPaterno: z.string().nullable(),
    apellidoMaterno: z.string().nullable(),
  }),
  domicilioDelProveedor: z.object({
    calle: z.string(),
    numeroExterior: z.string(),
    numeroInterior: z.string().nullable(),
    codigoPostal: z.string(),
    colonia: z.string().nullable(),
    localidad: z.string().nullable(),
    entidadFederativa: z.string(),
    municipio: z.string(),
    pais: z.string(),
  }),
  datosGeneralesDelDestinatario: z.object({
    tipoDeIdentificador: z.enum(['TAX ID', 'RFC']),
    taxIdSinTaxIdRfcCurp: z.string(),
    nombresORazonSocial: z.string(),
    apellidoPaterno: z.string().nullable(),
    apellidoMaterno: z.string().nullable(),
  }),
  domicilioDelDestinatario: z.object({
    calle: z.string(),
    numeroExterior: z.string(),
    numeroInterior: z.string().nullable(),
    codigoPostal: z.string(),
    colonia: z.string().nullable(),
    localidad: z.string().nullable(),
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
  descripcionDeLaMercancia: z
    .object({
      marca: z.string().nullable(),
      modelo: z.string(),
      submodelo: z.string().nullable(),
      numeroDeSerie: z.string().nullable(),
    })
    .nullable()
    .describe('Casi nunca aparece'),
});

const coveSchema = datosGeneralesSchema.extend({
  mercancias: z.array(mercanciaSchema),
});

export type Cove = z.infer<typeof coveSchema>;
