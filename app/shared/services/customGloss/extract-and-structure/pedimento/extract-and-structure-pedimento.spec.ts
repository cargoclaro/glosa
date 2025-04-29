import { Langfuse } from 'langfuse';
import { fetchFileFromUrl } from 'lib/utils';
import { describe, expect, it } from 'vitest';
import { extractAndStructurePedimento } from './extract-and-structure-pedimento';

const langfuse = new Langfuse();

describe('Extract and Structure Pedimento', () => {
  it('should extract and structure pedimento', async () => {
    const pedimentoFixture = [
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zV3W89SgutyXdVR43qhBYaSHWfrT9MLbDjkN',
        expectedOutput: {
          encabezadoPrincipalDelPedimento: {
            numeroDePedimento: '25 24 3577 5005723',
            tipoDeOperacion: 'IMP',
            claveDePedimento: 'A1',
            regimen: 'IMD',
            destino: '9',
            tipoDeCambio: 20.2163,
            pesoBruto: 250,
            aduanaEntradaOSalida: '240',
            mediosTransporte: {
              entradaSalida: '7',
              arribo: '7',
              salida: '7',
            },
            valores: {
              valorDolares: 7498.32,
              valorAduana: 151588,
              precioPagadoOValorComercial: 144547,
            },
            datosImportador: {
              rfc: 'EGM981125GX4',
              curp: null,
              razonSocial: 'HEXPOL COMPOUNDING QUERETARO S.A. DE C.V.',
              domicilio:
                'LA NORIA, Num. Ext.: 115, PARQUE INDUSTRIAL QUERETARO, CP 76220, SANTA ROSA JAUREGUI, QUERE, MEX',
            },
            incrementables: {
              valorSeguros: 0,
              seguros: 0,
              fletes: 3807,
              embalajes: 0,
              otrosIncrementables: 3235,
            },
            decrementables: {
              transporteDecrementables: 0,
              seguroDecrementables: 0,
              cargaDecrementables: 0,
              descargaDecrementables: 0,
              otrosDecrementables: 0,
            },
            marcasNumerosBultos: {
              marcas: 'A-66151',
              numeroDeBulto: '1/1',
              totalDeBultos: 1,
            },
            fechas: {
              entrada: new Date('2025-03-25T00:00:00.000Z'),
              pago: new Date('2025-03-25T00:00:00.000Z'),
              extraccion: null,
              presentacion: null,
              importacionAEstadosUnidosOCanada: null,
              original: null,
            },
            cuadroDeLiquidacion: {
              liquidaciones: [
                {
                  concepto: 'IVA',
                  fp: '0',
                  importe: 24254,
                },
                {
                  concepto: 'IVA PRV',
                  fp: '0',
                  importe: 46,
                },
                {
                  concepto: 'PRV',
                  fp: '0',
                  importe: 290,
                },
              ],
              totales: {
                efectivo: 24590,
                otros: 0,
                total: 24590,
              },
            },
          },
          datosDelProveedorOComprador: [
            {
              idFiscal: '13-5409005',
              nombreRazonSocial: 'EXXONMOBIL CHEMICAL COMPANY',
              domicilio:
                'SPRINGWOODS VILLAGE PARKWAY Num. Ext. 22777 CP 77389 SPRING, TEXAS, USA',
              vinculacion: 'NO',
              facturas: [
                {
                  numeroDeCFDIODocumentoEquivalente: 'TS-25032025',
                  fecha: new Date('2025-03-25T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 7150,
                  factorMoneda: 1,
                  valorDolares: 7150,
                },
              ],
            },
          ],
          guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte:
            null,
          contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo: {
            numero: 'XXXXXX',
            tipo: '60',
          },
          identificadoresPedimento: [],
          observacionesANivelPedimento:
            'SE ANEXAN DOCUMENTOS DIGITALIZADOS (CONF. ART. 36 A DE LA LEY ADUANERA VIGENTE Y REGLAS GENERALES DE COMERCIO EXTERIOR 3.1.8) PLAZUELA CONSOLIDADO',
          partidas: [
            {
              secuencia: 1,
              fraccion: '75040001',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '6',
              cantidadUnidadDeMedidaComercial: 1,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 250,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'USA',
              descripcion: 'POLVO DE NICKEL',
              valorEnAduanaOValorEnUSD: 151588,
              importeDePrecioPagadoOValorComercial: 144547,
              precioUnitario: 144547,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 24254,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '151588',
                  complemento2: 'IMPERIAL ALLOYS CORP',
                  complemento3: null,
                },
                {
                  identificador: 'TL',
                  complemento1: 'USA',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: 'ORDEN No. 1',
            },
          ],
        },
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153CEDoxBhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
        expectedOutput: {
          encabezadoPrincipalDelPedimento: {
            numeroDePedimento: '25 24 3577 5006361',
            tipoDeOperacion: 'IMP',
            claveDePedimento: 'A1',
            regimen: 'IMD',
            destino: '9',
            tipoDeCambio: 20.438,
            pesoBruto: 6184,
            aduanaEntradaOSalida: '240',
            mediosTransporte: {
              entradaSalida: '7',
              arribo: '7',
              salida: '7',
            },
            valores: {
              valorDolares: 61123.99,
              valorAduana: 1249251,
              precioPagadoOValorComercial: 1216298,
            },
            datosImportador: {
              rfc: 'EGM981125GX4',
              curp: null,
              razonSocial: 'HEXPOL COMPOUNDING QUERETARO S.A. DE C.V.',
              domicilio:
                'LA NORIA, Num. Ext.: 115, PARQUE INDUSTRIAL QUERETARO, CP 76220, SANTA ROSA JAUREGUI, QUERE, MEX',
            },
            incrementables: {
              valorSeguros: 1216298,
              seguros: 243,
              fletes: 18995,
              embalajes: 471,
              otrosIncrementables: 13244,
            },
            decrementables: {
              transporteDecrementables: 0,
              seguroDecrementables: 0,
              cargaDecrementables: 0,
              descargaDecrementables: 0,
              otrosDecrementables: 0,
            },
            marcasNumerosBultos: {
              marcas: 'A-66288',
              numeroDeBulto: '1/10',
              totalDeBultos: 10,
            },
            fechas: {
              entrada: new Date('2025-04-02T00:00:00.000Z'),
              pago: new Date('2025-04-02T00:00:00.000Z'),
              extraccion: null,
              presentacion: null,
              importacionAEstadosUnidosOCanada: null,
              original: null,
            },
            cuadroDeLiquidacion: {
              liquidaciones: [
                {
                  concepto: 'IGI/IGE',
                  fp: '0',
                  importe: 3748,
                },
                {
                  concepto: 'IVA',
                  fp: '0',
                  importe: 200550,
                },
                {
                  concepto: 'IVA PRV',
                  fp: '0',
                  importe: 46,
                },
                {
                  concepto: 'DTA',
                  fp: '0',
                  importe: 445,
                },
                {
                  concepto: 'PRV',
                  fp: '0',
                  importe: 290,
                },
              ],
              totales: {
                efectivo: 205079,
                otros: 0,
                total: 205079,
              },
            },
          },
          datosDelProveedorOComprador: [
            {
              idFiscal: '20-1329172',
              nombreRazonSocial: 'HEXPOL COMPOUNDING',
              domicilio: 'KINSMAN ROAD Num. Ext. 14330 CP 44021 BURTON,OH, USA',
              vinculacion: 'NO',
              facturas: [
                {
                  numeroDeCFDIODocumentoEquivalente: '3005917289',
                  fecha: new Date('2025-03-31T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 612.28,
                  factorMoneda: 1,
                  valorDolares: 612.28,
                },
                {
                  numeroDeCFDIODocumentoEquivalente: '3005917420',
                  fecha: new Date('2025-04-01T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 778.99,
                  factorMoneda: 1,
                  valorDolares: 778.99,
                },
                {
                  numeroDeCFDIODocumentoEquivalente: '3005917431',
                  fecha: new Date('2025-04-01T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 1581.07,
                  factorMoneda: 1,
                  valorDolares: 1581.07,
                },
              ],
            },
            {
              idFiscal: '20-8775856',
              nombreRazonSocial: 'LION COPOLYMER GEISMAR LLC',
              domicilio:
                'LOUISIANA HIGHWAY 30 Num. Ext. 36191 CP 70734 GEISMAR,LA, USA',
              vinculacion: 'NO',
              facturas: [
                {
                  numeroDeCFDIODocumentoEquivalente: '90165203',
                  fecha: new Date('2025-03-31T00:00:00.000Z'),
                  incoterm: 'FCA',
                  moneda: 'USD',
                  valorMoneda: 6529.46,
                  factorMoneda: 1,
                  valorDolares: 6529.46,
                },
              ],
            },
            {
              idFiscal: '82-5017927',
              nombreRazonSocial: 'CELANECE POLYMERS HOLDING INC',
              domicilio:
                'W. LAS COLINAS BLVD Num. Ext. 222 Num. Int. 900N CP 75039 IRVING,TX, USA',
              vinculacion: 'NO',
              facturas: [
                {
                  numeroDeCFDIODocumentoEquivalente: '979738924',
                  fecha: new Date('2025-03-29T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 28170,
                  factorMoneda: 1,
                  valorDolares: 28170,
                },
                {
                  numeroDeCFDIODocumentoEquivalente: '979738925',
                  fecha: new Date('2025-03-29T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 11242.5,
                  factorMoneda: 1,
                  valorDolares: 11242.5,
                },
                {
                  numeroDeCFDIODocumentoEquivalente: '979738926',
                  fecha: new Date('2025-03-29T00:00:00.000Z'),
                  incoterm: 'CPT',
                  moneda: 'USD',
                  valorMoneda: 10777.5,
                  factorMoneda: 1,
                  valorDolares: 10777.5,
                },
              ],
            },
          ],
          guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte:
            null,
          contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo: {
            numero: '2540',
            tipo: '56',
          },
          identificadoresPedimento: [
            {
              clave: 'SO',
              complemento1: 'AA',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '017025115C0R3',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '01922510NQMD1',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '01922510NQML7',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '01922510NQMT1',
              complemento2: null,
              complemento3: null,
            },
          ],
          observacionesANivelPedimento:
            'SE ANEXAN DOCUMENTOS DIGITALIZADOS (CONF. ART. 36A DE LA LEY ADUANERA VIGENTE Y REGLAS GENERALES DE COMERCIO EXTERIOR. SE SUBDIVIDE LA PRESENTE FACTURA 90165203, DE CONFORMIDAD CON EL ARTICULO 65 2DO. PARRAFO DEL REGLAMENTO DE LA LEY ADUANERA EN VIGOR.',
          partidas: [
            {
              secuencia: 1,
              fraccion: '25262001',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 204.1,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 204.1,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'USA',
              descripcion: 'TALCO',
              valorEnAduanaOValorEnUSD: 4264,
              importeDePrecioPagadoOValorComercial: 4151,
              precioUnitario: 20.33807,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 682,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '4264',
                  complemento2: 'HEXPOL COMPOUNDING',
                  complemento3: '.',
                },
                {
                  identificador: 'TL',
                  complemento1: 'USA',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '1',
            },
            {
              secuencia: 2,
              fraccion: '39019099',
              subdivisionONumeroDeIdentificacionComercial: '99',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 150,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 150,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'CHN',
              descripcion: 'POLIETILENO CLORINATADO',
              valorEnAduanaOValorEnUSD: 8589,
              importeDePrecioPagadoOValorComercial: 8362,
              precioUnitario: 55.74667,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 5,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 429,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 1478,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '2',
            },
            {
              secuencia: 3,
              fraccion: '39094099',
              subdivisionONumeroDeIdentificacionComercial: '99',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 79.8,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 79.8,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'USA',
              descripcion: 'RESINA DE FENOL-FORMALEIDO',
              valorEnAduanaOValorEnUSD: 16352,
              importeDePrecioPagadoOValorComercial: 15921,
              precioUnitario: 199.51128,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 2616,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'DH',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '16352',
                  complemento2: 'HEXPOL COMPOUNDING',
                  complemento3: '.',
                },
                {
                  identificador: 'TL',
                  complemento1: 'USA',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '3',
            },
            {
              secuencia: 4,
              fraccion: '40025999',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 500,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 500,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'MEX',
              descripcion: 'CAUCHO ACRILONITRILO BUTADIENO DIENO',
              valorEnAduanaOValorEnUSD: 33189,
              importeDePrecioPagadoOValorComercial: 32314,
              precioUnitario: 64.628,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 10,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 3319,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 5877,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '4',
            },
            {
              secuencia: 5,
              fraccion: '40027001',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 2250.033,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 2250.033,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'USA',
              descripcion: 'CAUCHO ETILENO PROPILENO DIENO',
              valorEnAduanaOValorEnUSD: 133283,
              importeDePrecioPagadoOValorComercial: 129767,
              precioUnitario: 57.67338,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 21325,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'DH',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '133283',
                  complemento2: 'LION COPOLYMER GEISMAR LLC',
                  complemento3: '.',
                },
                {
                  identificador: 'TL',
                  complemento1: 'USA',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '5',
            },
            {
              secuencia: 6,
              fraccion: '39069099',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 1500,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 1500,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'USA',
              descripcion: 'COPOLIMERO DE ACRILATO',
              valorEnAduanaOValorEnUSD: 591337,
              importeDePrecioPagadoOValorComercial: 575738,
              precioUnitario: 383.82533,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 94614,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '591337',
                  complemento2: 'CELANECE POLYMERS HOLDING INC',
                  complemento3: '.',
                },
                {
                  identificador: 'TL',
                  complemento1: 'USA',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '11',
            },
            {
              secuencia: 7,
              fraccion: '39069099',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 750,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 750,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'USA',
              descripcion: 'COPOLIMERO DE ACRILATO',
              valorEnAduanaOValorEnUSD: 235999,
              importeDePrecioPagadoOValorComercial: 229774,
              precioUnitario: 306.36533,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 37760,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '235999',
                  complemento2: 'CELANECE POLYMERS HOLDING INC',
                  complemento3: '.',
                },
                {
                  identificador: 'TL',
                  complemento1: 'USA',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '12',
            },
            {
              secuencia: 8,
              fraccion: '39069099',
              subdivisionONumeroDeIdentificacionComercial: '00',
              vinculacion: '0',
              metodoDeValoracion: '1',
              unidadDeMedidaComercial: '1',
              cantidadUnidadDeMedidaComercial: 750,
              unidadDeMedidaDeTarifa: '1',
              cantidadUnidadDeMedidaDeTarifa: 750,
              paisDeVentaOCompra: 'USA',
              paisDeOrigenODestino: 'CAN',
              descripcion: 'COPOLIMERO DE ACRILATO',
              valorEnAduanaOValorEnUSD: 226238,
              importeDePrecioPagadoOValorComercial: 220271,
              precioUnitario: 293.69467,
              valorAgregado: null,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  tasa: 0,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 0,
                },
                {
                  contribucion: 'IVA',
                  tasa: 16,
                  tipoDeTasa: '1',
                  formaDePago: '0',
                  importe: 36198,
                },
              ],
              regulacionesYRestriccionesNoArancelarias: [],
              identificadores: [
                {
                  identificador: 'EO',
                  complemento1: '1',
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'MA',
                  complemento1: null,
                  complemento2: null,
                  complemento3: null,
                },
                {
                  identificador: 'PO',
                  complemento1: '226238',
                  complemento2: 'CELANECE POLYMERS HOLDING INC',
                  complemento3: '.',
                },
                {
                  identificador: 'TL',
                  complemento1: 'CAN',
                  complemento2: null,
                  complemento3: null,
                },
              ],
              observacionesANivelPartida: '13',
            },
          ],
        },
      },
      {
        fileUrl:
          'https://kvt8mwzpgv.ufs.sh/f/MV48gJe0bTvETRbz7hL76vl9dqARLirIB8Hk3cW0PmtFSjua',
        expectedOutput: {
          contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo: {
            numero: 'XXXX',
            tipo: '60',
          },
          datosDelProveedorOComprador: [
            {
              domicilio:
                'S.NEW STREET SUITE 110 Num. Ext. 306 CP 18015 BETHLEHEM, PA, USA',
              facturas: [
                {
                  factorMoneda: 1,
                  fecha: new Date('2024-01-02T00:00:00.000Z'),
                  incoterm: 'DAP',
                  moneda: 'USD',
                  numeroDeCFDIODocumentoEquivalente: '12202024',
                  valorDolares: 11948.8,
                  valorMoneda: 11948.8,
                },
                {
                  factorMoneda: 1,
                  fecha: new Date('2024-01-02T00:00:00.000Z'),
                  incoterm: 'DAP',
                  moneda: 'USD',
                  numeroDeCFDIODocumentoEquivalente: 'COVE257D72PG3',
                  valorDolares: 11948.8,
                  valorMoneda: 11948.8,
                },
              ],
              idFiscal: '85-3822651',
              nombreRazonSocial: 'OM DIGITAL SOLUTIONS AMERICAS INC',
              vinculacion: 'NO',
            },
          ],
          encabezadoPrincipalDelPedimento: {
            aduanaEntradaOSalida: '240',
            claveDePedimento: 'A1',
            cuadroDeLiquidacion: {
              liquidaciones: [
                {
                  concepto: 'DTA',
                  fp: '0',
                  importe: 1967,
                },
                {
                  concepto: 'PRV',
                  fp: '0',
                  importe: 290,
                },
                {
                  concepto: 'IVA',
                  fp: '0',
                  importe: 39644,
                },
                {
                  concepto: 'IVA PRV',
                  fp: '0',
                  importe: 46,
                },
              ],
              totales: {
                efectivo: 41947,
                otros: 0,
                total: 41947,
              },
            },
            datosImportador: {
              curp: null,
              domicilio:
                'BOULEVARD MANUEL AVILA CAMACHO, Num. Ext.: 261, Num. Int.: PISO 5 , COL. POLANCO I SECCION, CP 11510, MIGUEL HIDALGO, CDMX, MEX',
              razonSocial: 'IMPORTADORA AMAZON MEXICO S DE RL DE CV',
              rfc: 'ACA140623TXA',
            },
            decrementables: {
              cargaDecrementables: 0,
              descargaDecrementables: 0,
              otrosDecrementables: 0,
              seguroDecrementables: 0,
              transporteDecrementables: 0,
            },
            destino: '9',
            fechas: {
              entrada: new Date('2025-03-18T00:00:00.000Z'),
              extraccion: null,
              importacionAEstadosUnidosOCanada: null,
              original: null,
              pago: new Date('2025-03-18T00:00:00.000Z'),
              presentacion: null,
            },
            incrementables: {
              embalajes: 0,
              fletes: 0,
              otrosIncrementables: 5825,
              seguros: 0,
              valorSeguros: 0,
            },
            marcasNumerosBultos: {
              marcas: 'A-65777',
              numeroDeBulto: '1/2',
              totalDeBultos: 2,
            },
            mediosTransporte: {
              arribo: '7',
              entradaSalida: '7',
              salida: '7',
            },
            numeroDePedimento: '25 24 3577 5003745',
            pesoBruto: 19.958,
            regimen: 'IMD',
            tipoDeCambio: 20.0848,
            tipoDeOperacion: 'IMP',
            valores: {
              precioPagadoOValorComercial: 239990,
              valorAduana: 245814,
              valorDolares: 12238.8,
            },
          },
          guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte:
            null,
          identificadoresPedimento: [
            {
              clave: 'SO',
              complemento1: 'AA',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '01702510K4GI3',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '019225106VVI6',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '019225106VVS6',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '019225106VXE2',
              complemento2: null,
              complemento3: null,
            },
            {
              clave: 'ED',
              complemento1: '019225106VWQ6',
              complemento2: null,
              complemento3: null,
            },
          ],
          observacionesANivelPedimento:
            'SE ANEXAN DOCUMENTOS DIGITALIZADOS (CONF. ART. 36 A DE LA LEY ADUANERA VIGENTE Y REGLAS GENERALES DE COMERCIO EXTERIOR 3.1.8) SE SUBDIVIDE LA PRESENTE FACTURA DE CONFORMIDAD CON EL ARTÍCULO 65 2DO. PÁRRAFO DEL REGLAMENTO DE LA LEY ADUANERA EN VIGOR. PLAZUELA CONSOLIDADO. DE CONFORMIDAD CON EL CAPÍTULO 2.4 REGLA 2.4.11 FRACCIÓN XI, DEL ACUERDO POR EL QUE LA SECRETARÍA DE ECONOMÍA EMITE REGLAS Y CRITERIOS DE CARÁCTER GENERAL EN MATERIA DE COMERCIO EXTERIOR. SE ADJUNTA FACTURA, DOCUMENTO EMITIDO POR ÓRGANO CERTIFICADOR, SE REALIZA IMPORTACIÓN DE MUESTRAS QUE SE DEPOSITARÁN EN EL DOMICILIO DEL ÓRGANO CERTIFICADOR Y SE SOMETERÁN A PRUEBAS PARA OBTENER CERTIFICACIÓN Y CUMPLIR CON LA NOM RESPECTIVA.',
          partidas: [
            {
              cantidadUnidadDeMedidaComercial: 3,
              cantidadUnidadDeMedidaDeTarifa: 3,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  formaDePago: '0',
                  importe: 0,
                  tasa: 0,
                  tipoDeTasa: '1',
                },
                {
                  contribucion: 'IVA',
                  formaDePago: '0',
                  importe: 7433,
                  tasa: 16,
                  tipoDeTasa: '1',
                },
              ],
              descripcion: 'CAMARA DIGITAL',
              fraccion: '98060001',
              identificadores: [
                {
                  complemento1: 'XI',
                  complemento2: '1.1',
                  complemento3: null,
                  identificador: 'EN',
                },
              ],
              importeDePrecioPagadoOValorComercial: 44998,
              metodoDeValoracion: '1',
              observacionesANivelPartida: `MARCA: OLYMPUS
MODELO: IM021
NUMERO DE SOLICITUD: 2025CERT0002270-CA-M01
SERIES: BJGA86117,BJGA86118,BJGA85685`,
              paisDeOrigenODestino: 'VNM',
              paisDeVentaOCompra: 'USA',
              precioUnitario: 14999.33333,
              regulacionesYRestriccionesNoArancelarias: [],
              secuencia: 1,
              subdivisionONumeroDeIdentificacionComercial: '00',
              unidadDeMedidaComercial: '6',
              unidadDeMedidaDeTarifa: '6',
              valorAgregado: null,
              valorEnAduanaOValorEnUSD: 46090,
              vinculacion: '0',
            },
            {
              cantidadUnidadDeMedidaComercial: 2,
              cantidadUnidadDeMedidaDeTarifa: 2,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  formaDePago: '0',
                  importe: 0,
                  tasa: 0,
                  tipoDeTasa: '1',
                },
                {
                  contribucion: 'IVA',
                  formaDePago: '0',
                  importe: 4956,
                  tasa: 16,
                  tipoDeTasa: '1',
                },
              ],
              descripcion: 'CAMARA DIGITAL CON FLASH',
              fraccion: '98060001',
              identificadores: [
                {
                  complemento1: 'XI',
                  complemento2: '1.1',
                  complemento3: null,
                  identificador: 'EN',
                },
              ],
              importeDePrecioPagadoOValorComercial: 29999,
              metodoDeValoracion: '1',
              observacionesANivelPartida: `MARCA: OM SYSTEM
MODELO: IM027
NUMERO DE SOLICITUD: 2025CERT0002274-CA-M01
SERIES: BJRA21329, BJRA21248`,
              paisDeOrigenODestino: 'VNM',
              paisDeVentaOCompra: 'USA',
              precioUnitario: 14999.5,
              regulacionesYRestriccionesNoArancelarias: [],
              secuencia: 2,
              subdivisionONumeroDeIdentificacionComercial: '00',
              unidadDeMedidaComercial: '6',
              unidadDeMedidaDeTarifa: '6',
              valorAgregado: null,
              valorEnAduanaOValorEnUSD: 30727,
              vinculacion: '0',
            },
            {
              cantidadUnidadDeMedidaComercial: 3,
              cantidadUnidadDeMedidaDeTarifa: 3,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  formaDePago: '0',
                  importe: 0,
                  tasa: 0,
                  tipoDeTasa: '1',
                },
                {
                  contribucion: 'IVA',
                  formaDePago: '0',
                  importe: 7433,
                  tasa: 16,
                  tipoDeTasa: '1',
                },
              ],
              descripcion: 'CAMARA DIGITAL',
              fraccion: '98060001',
              identificadores: [
                {
                  complemento1: 'XI',
                  complemento2: '1.1',
                  complemento3: null,
                  identificador: 'EN',
                },
              ],
              importeDePrecioPagadoOValorComercial: 44998,
              metodoDeValoracion: '1',
              observacionesANivelPartida: `MARCA: OM SYSTEM
MODELO: IM030
NUMERO DE SOLICITUD: 2025CERT0002271-CA-M01
SERIES: BJNA19175, BJNA19174, BJOA23644`,
              paisDeOrigenODestino: 'VNM',
              paisDeVentaOCompra: 'USA',
              precioUnitario: 14999.33333,
              regulacionesYRestriccionesNoArancelarias: [],
              secuencia: 3,
              subdivisionONumeroDeIdentificacionComercial: '00',
              unidadDeMedidaComercial: '6',
              unidadDeMedidaDeTarifa: '6',
              valorAgregado: null,
              valorEnAduanaOValorEnUSD: 46090,
              vinculacion: '0',
            },
            {
              cantidadUnidadDeMedidaComercial: 3,
              cantidadUnidadDeMedidaDeTarifa: 3,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  formaDePago: '0',
                  importe: 0,
                  tasa: 0,
                  tipoDeTasa: '1',
                },
                {
                  contribucion: 'IVA',
                  formaDePago: '0',
                  importe: 7433,
                  tasa: 16,
                  tipoDeTasa: '1',
                },
              ],
              descripcion: 'CAMARA DIGITAL CON LENTE',
              fraccion: '98060001',
              identificadores: [
                {
                  complemento1: 'XI',
                  complemento2: '1.1',
                  complemento3: null,
                  identificador: 'EN',
                },
              ],
              importeDePrecioPagadoOValorComercial: 44998,
              metodoDeValoracion: '1',
              observacionesANivelPartida: `MARCA: OM SYSTEM
MODELO: IM030
NUMERO DE SOLICITUD: 2025CERT0002272-CA-M01
SERIES: BJNA19175, BJNA19174, BJOA23644`,
              paisDeOrigenODestino: 'VNM',
              paisDeVentaOCompra: 'USA',
              precioUnitario: 14999.33333,
              regulacionesYRestriccionesNoArancelarias: [],
              secuencia: 4,
              subdivisionONumeroDeIdentificacionComercial: '00',
              unidadDeMedidaComercial: '6',
              unidadDeMedidaDeTarifa: '6',
              valorAgregado: null,
              valorEnAduanaOValorEnUSD: 46090,
              vinculacion: '0',
            },
            {
              cantidadUnidadDeMedidaComercial: 2,
              cantidadUnidadDeMedidaDeTarifa: 2,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  formaDePago: '0',
                  importe: 0,
                  tasa: 0,
                  tipoDeTasa: '1',
                },
                {
                  contribucion: 'IVA',
                  formaDePago: '0',
                  importe: 4956,
                  tasa: 16,
                  tipoDeTasa: '1',
                },
              ],
              descripcion: 'CAMARA DIGITAL CON LENTE Y FLASH',
              fraccion: '98060001',
              identificadores: [
                {
                  complemento1: 'XI',
                  complemento2: '1.1',
                  complemento3: null,
                  identificador: 'EN',
                },
              ],
              importeDePrecioPagadoOValorComercial: 29999,
              metodoDeValoracion: '1',
              observacionesANivelPartida: `MARCA: OM SYSTEM
MODELO: IM027
NUMERO DE SOLICITUD: 2025CERT0002268-CA-M01`,
              paisDeOrigenODestino: 'VNM',
              paisDeVentaOCompra: 'USA',
              precioUnitario: 14999.5,
              regulacionesYRestriccionesNoArancelarias: [],
              secuencia: 5,
              subdivisionONumeroDeIdentificacionComercial: '00',
              unidadDeMedidaComercial: '6',
              unidadDeMedidaDeTarifa: '6',
              valorAgregado: null,
              valorEnAduanaOValorEnUSD: 30727,
              vinculacion: '0',
            },
            {
              cantidadUnidadDeMedidaComercial: 3,
              cantidadUnidadDeMedidaDeTarifa: 3,
              codigoProducto: null,
              contribuciones: [
                {
                  contribucion: 'IGI/IGE',
                  formaDePago: '0',
                  importe: 0,
                  tasa: 0,
                  tipoDeTasa: '1',
                },
                {
                  contribucion: 'IVA',
                  formaDePago: '0',
                  importe: 7433,
                  tasa: 16,
                  tipoDeTasa: '1',
                },
              ],
              descripcion: 'CAMARA DIGITAL',
              fraccion: '98060001',
              identificadores: [
                {
                  complemento1: 'XI',
                  complemento2: '1.1',
                  complemento3: null,
                  identificador: 'EN',
                },
              ],
              importeDePrecioPagadoOValorComercial: 44998,
              metodoDeValoracion: '1',
              observacionesANivelPartida: `MARCA: OM SYSTEM
MODELO: IM032
NUMERO DE SOLICITUD: 2025CERT0002269-CA-M01`,
              paisDeOrigenODestino: 'VNM',
              paisDeVentaOCompra: 'USA',
              precioUnitario: 14999.33333,
              regulacionesYRestriccionesNoArancelarias: [],
              secuencia: 6,
              subdivisionONumeroDeIdentificacionComercial: '00',
              unidadDeMedidaComercial: '6',
              unidadDeMedidaDeTarifa: '6',
              valorAgregado: null,
              valorEnAduanaOValorEnUSD: 46090,
              vinculacion: '0',
            },
          ],
        },
      },
    ] as const;

    const trace = langfuse.trace({
      name: 'Test Pedimento Extract and Structure',
    });

    // Fetch all files before processing
    const pedimentoFiles = await Promise.all(
      pedimentoFixture.map(async ({ fileUrl }) => {
        const file = await fetchFileFromUrl(fileUrl);
        return { file, fileUrl };
      })
    );

    const pedimentoResults = await Promise.all(
      pedimentoFiles.map(async ({ file, fileUrl }) => {
        const pedimentoResult = await extractAndStructurePedimento(
          file,
          trace.id
        );
        return { pedimentoResult, fileUrl };
      })
    );

    for (const { pedimentoResult, fileUrl } of pedimentoResults) {
      const fixture = pedimentoFixture.find((item) => item.fileUrl === fileUrl);
      if (!fixture) {
        throw new Error('Should never happen');
      }
      expect
        .soft(
          pedimentoResult,
          `Result data should match expected output for: ${fileUrl}`
        )
        .toEqual(fixture.expectedOutput);
    }
  });
});
