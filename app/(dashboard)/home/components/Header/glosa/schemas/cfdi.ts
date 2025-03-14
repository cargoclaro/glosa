import { z } from "zod"
import moment from 'moment'

export const cfdiSchema = z.object({
  Comprobante: z.object({
    Emisor: z.object({
      attributes: z.object({
        Rfc: z.string(),
        Nombre: z.string(),
        RegimenFiscal: z.number()
      })
    }),
    Receptor: z.object({
      attributes: z.object({
        Rfc: z.string(),
        Nombre: z.string(),
        DomicilioFiscalReceptor: z.number(),
        RegimenFiscalReceptor: z.number(),
        ResidenciaFiscal: z.string(),
        NumRegIdTrib: z.number(),
        UsoCFDI: z.string()
      })
    }),
    Conceptos: z.object({
      Concepto: z.array(
        z.object({
          Impuestos: z.object({
            Traslados: z.object({
              Traslado: z.object({
                attributes: z.object({
                  Base: z.number(),
                  Impuesto: z.number(),
                  TipoFactor: z.string(),
                  TasaOCuota: z.number(),
                  Importe: z.number()
                })
              })
            })
          }),
          attributes: z.object({
            ObjetoImp: z.number(),
            ClaveProdServ: z.number(),
            NoIdentificacion: z.string(),
            Cantidad: z.number(),
            ClaveUnidad: z.string(),
            Unidad: z.string(),
            Descripcion: z.string(),
            ValorUnitario: z.number(),
            Importe: z.number()
          })
        })
      )
    }),
    Impuestos: z.object({
      Traslados: z.object({
        Traslado: z.object({
          attributes: z.object({
            Base: z.number(),
            Impuesto: z.number(),
            TipoFactor: z.string(),
            TasaOCuota: z.number(),
            Importe: z.number()
          })
        })
      }),
      attributes: z.object({ TotalImpuestosTrasladados: z.number() })
    }),
    Complemento: z.object({
      TimbreFiscalDigital: z.object({
        attributes: z.object({
          SelloSAT: z.string(),
          NoCertificadoSAT: z.number(),
          SelloCFD: z.string(),
          FechaTimbrado: z.string().transform((fechaTimbrado) => {
            return moment(fechaTimbrado);
          }),
          UUID: z.string(),
          Version: z.number(),
          RfcProvCertif: z.string(),
          schemaLocation: z.string()
        })
      }),
      ComercioExterior: z.object({
        Emisor: z.object({
          Domicilio: z.object({
            attributes: z.object({
              Calle: z.string(),
              CodigoPostal: z.number(),
              Municipio: z.number(),
              Estado: z.string(),
              Pais: z.string()
            })
          })
        }),
        Receptor: z.object({
          Domicilio: z.object({
            attributes: z.object({
              Calle: z.string(),
              NumeroExterior: z.number(),
              Localidad: z.string(),
              Municipio: z.string(),
              Estado: z.string(),
              CodigoPostal: z.number(),
              Pais: z.string()
            })
          }),
          attributes: z.object({ NumRegIdTrib: z.number() })
        }),
        Destinatario: z.object({
          Domicilio: z.object({
            attributes: z.object({
              Calle: z.string(),
              NumeroExterior: z.number(),
              Localidad: z.string(),
              Municipio: z.string(),
              Estado: z.string(),
              CodigoPostal: z.number(),
              Pais: z.string()
            })
          }),
          attributes: z.object({ Nombre: z.string() })
        }),
        Mercancias: z.object({
          Mercancia: z.array(
            z.object({
              attributes: z.object({
                NoIdentificacion: z.string(),
                FraccionArancelaria: z.number(),
                CantidadAduana: z.number(),
                UnidadAduana: z.number(),
                ValorUnitarioAduana: z.number(),
                ValorDolares: z.number()
              })
            })
          )
        }),
        attributes: z.object({
          Version: z.number(),
          ClaveDePedimento: z.string(),
          CertificadoOrigen: z.number(),
          Incoterm: z.string(),
          TipoCambioUSD: z.number(),
          TotalUSD: z.number()
        })
      })
    }),
    attributes: z.object({
      schemaLocation: z.string(),
      Version: z.number(),
      Serie: z.string(),
      Folio: z.number(),
      Fecha: z.string(),
      FormaPago: z.number(),
      NoCertificado: z.number(),
      Certificado: z.string(),
      SubTotal: z.number(),
      Moneda: z.string(),
      TipoCambio: z.number(),
      Exportacion: z.number(),
      Total: z.number(),
      TipoDeComprobante: z.string(),
      MetodoPago: z.string(),
      LugarExpedicion: z.number(),
      Sello: z.string()
    })
  })
})

export type Cfdi = z.infer<typeof cfdiSchema>;
