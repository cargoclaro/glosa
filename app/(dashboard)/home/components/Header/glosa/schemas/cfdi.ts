import { z } from "zod"

export const cfdiSchema = z.object({
  _declaration: z.object({
    _attributes: z.object({ version: z.string(), encoding: z.string() })
  }),
  "cfdi:Comprobante": z.object({
    _attributes: z.object({
      "xsi:schemaLocation": z.string(),
      Version: z.string(),
      Serie: z.string(),
      Folio: z.string(),
      Fecha: z.string(),
      FormaPago: z.string(),
      NoCertificado: z.string(),
      Certificado: z.string(),
      CondicionesDePago: z.string(),
      SubTotal: z.string(),
      Moneda: z.string(),
      TipoCambio: z.string(),
      Exportacion: z.string(),
      Total: z.string(),
      TipoDeComprobante: z.string(),
      MetodoPago: z.string(),
      LugarExpedicion: z.string(),
      "xmlns:cfdi": z.string(),
      "xmlns:xsi": z.string(),
      "xmlns:cce20": z.string(),
      Sello: z.string()
    }),
    "cfdi:Emisor": z.object({
      _attributes: z.object({
        Rfc: z.string(),
        Nombre: z.string(),
        RegimenFiscal: z.string()
      })
    }),
    "cfdi:Receptor": z.object({
      _attributes: z.object({
        Rfc: z.string(),
        Nombre: z.string(),
        DomicilioFiscalReceptor: z.string(),
        RegimenFiscalReceptor: z.string(),
        ResidenciaFiscal: z.string(),
        NumRegIdTrib: z.string(),
        UsoCFDI: z.string()
      })
    }),
    "cfdi:Conceptos": z.object({
      "cfdi:Concepto": z.array(
        z.object({
          _attributes: z.object({
            ObjetoImp: z.string(),
            ClaveProdServ: z.string(),
            NoIdentificacion: z.string(),
            Cantidad: z.string(),
            ClaveUnidad: z.string(),
            Unidad: z.string(),
            Descripcion: z.string(),
            ValorUnitario: z.string(),
            Importe: z.string()
          }),
          "cfdi:Impuestos": z.object({
            "cfdi:Traslados": z.object({
              "cfdi:Traslado": z.object({
                _attributes: z.object({
                  Base: z.string(),
                  Impuesto: z.string(),
                  TipoFactor: z.string(),
                  TasaOCuota: z.string(),
                  Importe: z.string()
                })
              })
            })
          })
        })
      )
    }),
    "cfdi:Impuestos": z.object({
      _attributes: z.object({ TotalImpuestosTrasladados: z.string() }),
      "cfdi:Traslados": z.object({
        "cfdi:Traslado": z.object({
          _attributes: z.object({
            Base: z.string(),
            Impuesto: z.string(),
            TipoFactor: z.string(),
            TasaOCuota: z.string(),
            Importe: z.string()
          })
        })
      })
    }),
    "cfdi:Complemento": z.object({
      "tfd:TimbreFiscalDigital": z.object({
        _attributes: z.object({
          SelloSAT: z.string(),
          NoCertificadoSAT: z.string(),
          SelloCFD: z.string(),
          FechaTimbrado: z.string(),
          UUID: z.string(),
          Version: z.string(),
          RfcProvCertif: z.string(),
          "xsi:schemaLocation": z.string(),
          "xmlns:tfd": z.string(),
          "xmlns:xsi": z.string()
        })
      }),
      "cce20:ComercioExterior": z.object({
        _attributes: z.object({
          Version: z.string(),
          ClaveDePedimento: z.string(),
          CertificadoOrigen: z.string(),
          Incoterm: z.string(),
          TipoCambioUSD: z.string(),
          TotalUSD: z.string()
        }),
        "cce20:Emisor": z.object({
          "cce20:Domicilio": z.object({
            _attributes: z.object({
              Calle: z.string(),
              CodigoPostal: z.string(),
              Municipio: z.string(),
              Estado: z.string(),
              Pais: z.string(),
              Colonia: z.string()
            })
          })
        }),
        "cce20:Receptor": z.object({
          _attributes: z.object({ NumRegIdTrib: z.string() }),
          "cce20:Domicilio": z.object({
            _attributes: z.object({
              Calle: z.string(),
              NumeroExterior: z.string(),
              Colonia: z.string(),
              Localidad: z.string(),
              Municipio: z.string(),
              Estado: z.string(),
              CodigoPostal: z.string(),
              Pais: z.string()
            })
          })
        }),
        "cce20:Destinatario": z.object({
          _attributes: z.object({ Nombre: z.string() }),
          "cce20:Domicilio": z.object({
            _attributes: z.object({
              Calle: z.string(),
              NumeroExterior: z.string(),
              Colonia: z.string(),
              Localidad: z.string(),
              Municipio: z.string(),
              Estado: z.string(),
              CodigoPostal: z.string(),
              Pais: z.string()
            })
          })
        }),
        "cce20:Mercancias": z.object({
          "cce20:Mercancia": z.array(
            z.object({
              _attributes: z.object({
                NoIdentificacion: z.string(),
                FraccionArancelaria: z.string(),
                CantidadAduana: z.string(),
                UnidadAduana: z.string(),
                ValorUnitarioAduana: z.string(),
                ValorDolares: z.string()
              }),
              "cce20:DescripcionesEspecificas": z.object({
                _attributes: z.object({ Marca: z.string() })
              })
            })
          )
        })
      })
    })
  })
})

export type Cfdi = z.infer<typeof cfdiSchema>;
