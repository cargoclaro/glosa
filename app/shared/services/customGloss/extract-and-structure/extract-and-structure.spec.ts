import { describe, expect, it } from 'vitest';
import { Langfuse } from 'langfuse';
import { extractAndStructurePackingList, extractAndStructureCove, extractAndStructurePedimento } from './extract-and-structure';

const langfuse = new Langfuse();

describe('Extract and Structure', () => {
  it('should correctly extract and structure packing lists', async () => {
    const packingListFixture = [
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P5NLJRxkozZNG45DnM3Oy1CRlXrVAEjFKYBm",
        "expectedOutput": {
          "mercancias": [
            {
              "cantidad": 3
            }
          ],
          "pesoBruto": {
            "valor": 1650,
            "unidadDeMedida": "lb"
          }
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y150DvPWbozluNwmWerUvXsTP7dntpA69DgMq1C",
        "expectedOutput": {
          "mercancias": [
            {
              "cantidad": 1204
            }
          ],
          "pesoBruto": {
            "valor": 1383.48,
            "unidadDeMedida": "kg"
          }
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15YZPve7HjXIrsoaGCginAhSTQkP245ld9H0yU",
        "expectedOutput": {
          "mercancias": [
            {
              "cantidad": 6160
            },
            {
              "cantidad": 87
            },
            {
              "cantidad": 240
            }
          ],
          "pesoBruto": {
            "valor": 34514,
            "unidadDeMedida": "lb"
          }
        }
      }
    ] as const;
    const packingListResults = await Promise.all(
      packingListFixture.map(async ({ fileUrl }) => {
        const packingListResult = await extractAndStructurePackingList(fileUrl);
        return { packingListResult, fileUrl };
      })
    );

    for (const { packingListResult, fileUrl } of packingListResults) {
      // Find the expected output for the current fileUrl
      const fixture = packingListFixture.find(item => item.fileUrl === fileUrl);
      expect.soft(packingListResult, `Result data should match expected output for: ${fileUrl}`)
        .toEqual(fixture?.expectedOutput);
    }
  });

  it('should correctly extract and structure cove', async () => {
    const coveFixture = [
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15u1EQuvyES0lPex1mXBWQop7GAjJIMsDCUZk2",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE257E4H7I4",
            "tipoDeOperacion": "Importación",
            "relacionDeFacturas": "SIN RELACIÓN DE FACTURAS",
            "numeroDeFactura": "TS-25032025",
            "tipoDeFigura": "Agente Aduanal",
            "fechaExpedicion": new Date("2025-03-25T00:00:00.000Z"),
            "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)"
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "20-8374868",
            "nombresORazonSocial": "IMPERIAL ALLOYS CORP",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "E 103RD STREET",
            "numeroExterior": "1031",
            "numeroInterior": null,
            "codigoPostal": "60628",
            "colonia": null,
            "localidad": null,
            "entidadFederativa": "ILLINOIS",
            "municipio": "CHICAGO",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "MALB640521U17",
            "nombresORazonSocial": "BERNHARD MACHTEL LANG",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "PROLONGACION PASEO DE LA LLAVE",
            "numeroExterior": "8",
            "numeroInterior": null,
            "codigoPostal": "76815",
            "colonia": "SAN GIL",
            "localidad": null,
            "entidadFederativa": "QUERE",
            "municipio": "SAN JUAN DEL RIO",
            "pais": "MEX"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "POLVO DE NICKEL",
                "claveUMC": "EACH",
                "cantidadUMC": 1,
                "tipoMoneda": "US Dolar",
                "valorUnitario": 7150,
                "valorTotal": 7150,
                "valorTotalEnDolares": 7150
              },
              "descripcionDeLaMercancia": null
            }
          ]
        }
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15XadhI2Q3p02PnBlWqwL7baCzMhxf4mHoEDc9",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE214J371P6",
            "tipoDeOperacion": "Importación",
            "relacionDeFacturas": "SIN RELACION DE FACTURAS",
            "numeroDeFactura": "S/N",
            "tipoDeFigura": "Agente Aduanal",
            "fechaExpedicion": new Date("2021-08-11T00:00:00.000Z"),
            "observaciones": null
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "561893440",
            "nombresORazonSocial": "ANDERSON AMERICA",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "SOUTHERN LOOP BLVD",
            "numeroExterior": "10620",
            "numeroInterior": null,
            "codigoPostal": "28134",
            "colonia": null,
            "localidad": "PINEVILLE",
            "entidadFederativa": "PINEVILLE",
            "municipio": "PINEVILLE",
            "pais": "ESTADOS UNIDOS DE AMERICA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "SAA200430EUA",
            "nombresORazonSocial": "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR SA DE CV",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "EBANO",
            "numeroExterior": "301",
            "numeroInterior": "B",
            "codigoPostal": "42033",
            "colonia": "LOS CEDROS",
            "localidad": "PACHUCA",
            "entidadFederativa": "HIDALGO",
            "municipio": "PACHUCA DE SOTO",
            "pais": "MEXICO (ESTADOS UNIDOS MEXICANOS)"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "PIÑON",
                "claveUMC": "piece",
                "cantidadUMC": 2,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 328,
                "valorTotal": 656,
                "valorTotalEnDolares": 656
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "POLEAS",
                "claveUMC": "piece",
                "cantidadUMC": 2,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 172,
                "valorTotal": 344,
                "valorTotalEnDolares": 344
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "POLEAS",
                "claveUMC": "piece",
                "cantidadUMC": 2,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 80,
                "valorTotal": 160,
                "valorTotalEnDolares": 160
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "POLEAS",
                "claveUMC": "piece",
                "cantidadUMC": 2,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 140,
                "valorTotal": 280,
                "valorTotalEnDolares": 280
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "POLEAS",
                "claveUMC": "piece",
                "cantidadUMC": 2,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 115,
                "valorTotal": 230,
                "valorTotalEnDolares": 230
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "CHUMACERA",
                "claveUMC": "piece",
                "cantidadUMC": 2,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 200,
                "valorTotal": 400,
                "valorTotalEnDolares": 400
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "PARTE PARA SIERRA",
                "claveUMC": "piece",
                "cantidadUMC": 1,
                "tipoMoneda": "US Dollar",
                "valorUnitario": 310,
                "valorTotal": 310,
                "valorTotalEnDolares": 310
              },
              "descripcionDeLaMercancia": null
            }
          ]
        },
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15HyVqAoWCjnmTGoQ3c9SyIxeudvRq4iEBXMF7",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE2477XYCQ5",
            "tipoDeOperacion": "Importación",
            "relacionDeFacturas": "SIN RELACIÓN DE FACTURAS",
            "numeroDeFactura": "442073",
            "tipoDeFigura": "Agente Aduanal",
            "fechaExpedicion": new Date("2024-11-22T00:00:00.000Z"),
            "observaciones": null
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "SN",
            "nombresORazonSocial": "PIROBLOC",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "POL. SANTIGA C. BLANQUERS",
            "numeroExterior": "2",
            "numeroInterior": null,
            "codigoPostal": "08130",
            "colonia": null,
            "localidad": null,
            "entidadFederativa": "BARCELONA",
            "municipio": "STA. PERPETUA MOGODA",
            "pais": "ESP"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "MFM030526RW7",
            "nombresORazonSocial": "MISSION FOODS MEXICO, S. DE R.L. DE C.V.",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "AV. PROF. HUMBERTO RAMOS LOZANO",
            "numeroExterior": "882",
            "numeroInterior": "S/N",
            "codigoPostal": "66610",
            "colonia": null,
            "localidad": null,
            "entidadFederativa": "NUEVO LEON",
            "municipio": "APODACA",
            "pais": "MEX"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "PRESOSTATO",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 83,
                "valorTotal": 83,
                "valorTotalEnDolares": 86.32
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "TUBO DE PLASTICO",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 5,
                "valorTotal": 5,
                "valorTotalEnDolares": 5.2
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "CABLES ELECTRICOS CON PIEZAS DE CONEXION",
                "claveUMC": "PIECE",
                "cantidadUMC": 3,
                "tipoMoneda": "EUR",
                "valorUnitario": 10.95,
                "valorTotal": 32.88,
                "valorTotalEnDolares": 34.2
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "JUNTA",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 9.86,
                "valorTotal": 9.86,
                "valorTotalEnDolares": 10.25
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "JUNTA",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 3.06,
                "valorTotal": 3.06,
                "valorTotalEnDolares": 3.18
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "RODAMIENTOS",
                "claveUMC": "PIECE",
                "cantidadUMC": 2,
                "tipoMoneda": "EUR",
                "valorUnitario": 27.18,
                "valorTotal": 54.36,
                "valorTotalEnDolares": 56.53
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "ACOPLAMIENTO",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 272.21,
                "valorTotal": 272.21,
                "valorTotalEnDolares": 283.1
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "PARTES PARA BOMBAS ELEVADORES DE LIQUIDOS",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 2054.53,
                "valorTotal": 2054.53,
                "valorTotalEnDolares": 2136.71
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "JUNTA",
                "claveUMC": "PIECE",
                "cantidadUMC": 2,
                "tipoMoneda": "EUR",
                "valorUnitario": 189.58,
                "valorTotal": 379.16,
                "valorTotalEnDolares": 394.33
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "JUNTA",
                "claveUMC": "PIECE",
                "cantidadUMC": 2,
                "tipoMoneda": "EUR",
                "valorUnitario": 189.77,
                "valorTotal": 379.58,
                "valorTotalEnDolares": 394.76
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "QUEMADOR DE GAS",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 7375.8,
                "valorTotal": 7375.8,
                "valorTotalEnDolares": 7670.83
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "QUEMADOR DE GAS",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 14033.63,
                "valorTotal": 14033.63,
                "valorTotalEnDolares": 14594.98
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "ACEITE PARAFINICO",
                "claveUMC": "PIECE",
                "cantidadUMC": 1,
                "tipoMoneda": "EUR",
                "valorUnitario": 1808.56,
                "valorTotal": 1808.56,
                "valorTotalEnDolares": 1880.9
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "ACEITE PARAFINICO",
                "claveUMC": "PIECE",
                "cantidadUMC": 3,
                "tipoMoneda": "EUR",
                "valorUnitario": 1808.56,
                "valorTotal": 5425.68,
                "valorTotalEnDolares": 5642.71
              },
              "descripcionDeLaMercancia": null
            }
          ]
        },
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Fn3r61gpw0UmYxiesJuoAgDqlBLkHvzhTSZ3",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE2366LNKC3",
            "tipoDeOperacion": "IMPORTACIÓN",
            "relacionDeFacturas": "SIN RELACIÓN DE FACTURAS",
            "numeroDeFactura": "BP230828MXG064",
            "tipoDeFigura": "AGENTE ADUANAL",
            "fechaExpedicion": new Date("2023-08-28T00:00:00.000Z"),
            "observaciones": "FLETES AEREO: 500.00 USD"
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "91370306080896344J",
            "nombresORazonSocial": "ZIBO BAODA AUTO PARTS LOGISTICS CO., LTD",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "ZHOULONG ROAD",
            "numeroExterior": "7888",
            "numeroInterior": null,
            "codigoPostal": "255000",
            "colonia": "ZHOUCUN",
            "localidad": "ZIBO",
            "entidadFederativa": "SHANDONG",
            "municipio": "NANJIAO",
            "pais": "CHINA (REPUBLICA POPULAR)"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "FCM211118K81",
            "nombresORazonSocial": "FAW CAMION MEXICO SA DE CV",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "CANTU",
            "numeroExterior": "9",
            "numeroInterior": "103",
            "codigoPostal": "11590",
            "colonia": "ANZURES",
            "localidad": null,
            "entidadFederativa": "CIUDAD DE MÉXICO",
            "municipio": "MIGUEL HIDALGO",
            "pais": "MEXICO (ESTADOS UNIDOS MEXICANOS)"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "FILTROS",
                "claveUMC": "PIECE",
                "cantidadUMC": 342,
                "tipoMoneda": "USD Dolar",
                "valorUnitario": 41.48,
                "valorTotal": 14186.16,
                "valorTotalEnDolares": 14186.16
              },
              "descripcionDeLaMercancia": {
                "marca": null,
                "modelo": "612640130438",
                "submodelo": null,
                "numeroDeSerie": null
              }
            }
          ]
        },
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15IDryccR2Okng1Id8jPzMFLQmSoW4e9tbTJcr",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE246Z26KR8",
            "tipoDeOperacion": "Importación",
            "relacionDeFacturas": "SIN RELACIÓN DE FACTURAS",
            "numeroDeFactura": "12783",
            "tipoDeFigura": "Agente Aduanal",
            "fechaExpedicion": new Date("2024-08-07T00:00:00.000Z"),
            "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)"
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "82-5221873",
            "nombresORazonSocial": "GROUP CARGO LIFT INC.",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "KUYKENDAHL RD E. 500",
            "numeroExterior": "25420",
            "numeroInterior": null,
            "codigoPostal": "77375",
            "colonia": null,
            "localidad": null,
            "entidadFederativa": "TX",
            "municipio": "THE WOODLANDS",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "CLI080312JG1",
            "nombresORazonSocial": "CARGO LIFT, S.A. DE C.V.",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "TEZOZOMOC",
            "numeroExterior": "94",
            "numeroInterior": null,
            "codigoPostal": "02700",
            "colonia": "SAN MIGUEL AMANTLA",
            "localidad": null,
            "entidadFederativa": "CDMX",
            "municipio": "AZCAPOTZALCO",
            "pais": "MEX"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "CABLE DE ACERO NO ROTATORIO",
                "claveUMC": "LINEAR METRE",
                "cantidadUMC": 1204,
                "tipoMoneda": "US Dolar",
                "valorUnitario": 3.660606,
                "valorTotal": 4407.37,
                "valorTotalEnDolares": 4407.37
              },
              "descripcionDeLaMercancia": null
            }
          ]
        },
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zkxGeSgutyXdVR43qhBYaSHWfrT9MLbDjkNA",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE24762H063",
            "tipoDeOperacion": "Importación",
            "relacionDeFacturas": "SIN RELACIÓN DE FACTURAS",
            "numeroDeFactura": "2413575",
            "tipoDeFigura": "Agente Aduanal",
            "fechaExpedicion": new Date("2024-11-13T00:00:00.000Z"),
            "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)"
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "42-0886654",
            "nombresORazonSocial": "KEMIN FOOD TECNOLOGIES, INC",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "MAURY STREET",
            "numeroExterior": "2100",
            "numeroInterior": null,
            "codigoPostal": "50306",
            "colonia": null,
            "localidad": null,
            "entidadFederativa": "IOWA",
            "municipio": "DES MOINES",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "MAV940325CE8",
            "nombresORazonSocial": "MOLINOS AZTECA DE VERACRUZ SA DE CV",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "CARRETERA XALAPA VERACRUZ",
            "numeroExterior": "KM 94",
            "numeroInterior": null,
            "codigoPostal": "91697",
            "colonia": "LOMA DE TEJERIA",
            "localidad": null,
            "entidadFederativa": "VERACRUZ",
            "municipio": "VERACRUZ",
            "pais": "MEX"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "CONSERVADOR GRADO ALIMENTICIO PARA TORTILLAS DE MAIZ",
                "claveUMC": "POUND",
                "cantidadUMC": 13227.6,
                "tipoMoneda": "US Dolar",
                "valorUnitario": 1.98,
                "valorTotal": 26190.65,
                "valorTotalEnDolares": 26190.65
              },
              "descripcionDeLaMercancia": null
            },
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "RECIPIENTES DE PLASTICO",
                "claveUMC": "EACH",
                "cantidadUMC": 6,
                "tipoMoneda": "US Dolar",
                "valorUnitario": 238.49,
                "valorTotal": 1430.94,
                "valorTotalEnDolares": 1430.94
              },
              "descripcionDeLaMercancia": null
            }
          ]
        },
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15MgmsGr907FYSfgKGA9JUX3rIQ2amz4bTDeNj",
        expectedOutput: {
          "datosDelAcuseDeValor": {
            "idCove": "COVE246XNYVY7",
            "tipoDeOperacion": "Importación",
            "relacionDeFacturas": "SIN RELACIÓN DE FACTURAS",
            "numeroDeFactura": "420120",
            "tipoDeFigura": "Agente Aduanal",
            "fechaExpedicion": new Date("2024-07-24T00:00:00.000Z"),
            "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)"
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "TAX ID",
            "taxIdSinTaxIdRfcCurp": "741465790",
            "nombresORazonSocial": "KULKONI, INC.",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelProveedor": {
            "calle": "GARDEN OAKS",
            "numeroExterior": "502",
            "numeroInterior": null,
            "codigoPostal": "77018",
            "colonia": null,
            "localidad": null,
            "entidadFederativa": "TX",
            "municipio": "HOUSTON",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "taxIdSinTaxIdRfcCurp": "SER870126EA3",
            "nombresORazonSocial": "SERVICABLES, S.A. DE C.V.",
            "apellidoPaterno": null,
            "apellidoMaterno": null
          },
          "domicilioDelDestinatario": {
            "calle": "DR. BALMIS",
            "numeroExterior": "91",
            "numeroInterior": "B",
            "codigoPostal": "06720",
            "colonia": "DOCTORES",
            "localidad": null,
            "entidadFederativa": "CDMX",
            "municipio": "MEXICO",
            "pais": "MEX"
          },
          "mercancias": [
            {
              "datosDeLaMercancia": {
                "descripcionGenericaDeLaMercancia": "GRAPAS",
                "claveUMC": "EACH",
                "cantidadUMC": 300,
                "tipoMoneda": "US Dolar",
                "valorUnitario": 1.1,
                "valorTotal": 330,
                "valorTotalEnDolares": 330
              },
              "descripcionDeLaMercancia": null
            }
          ]
        },
      },
    ] as const;
    const coveResults = await Promise.all(
      coveFixture.map(async ({ fileUrl }) => {
        const coveResult = await extractAndStructureCove(fileUrl);
        return { coveResult, fileUrl };
      })
    );

    for (const { coveResult, fileUrl } of coveResults) {
      const fixture = coveFixture.find(item => item.fileUrl === fileUrl);
      expect.soft(coveResult, `Result data should match expected output for: ${fileUrl}`)
        .toEqual(fixture?.expectedOutput);
    }
  });

  it('should extract and structure pedimento', async () => {
    const pedimentoFixture = [
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zV3W89SgutyXdVR43qhBYaSHWfrT9MLbDjkN",
        expectedOutput: {
          "encabezadoPrincipalDelPedimento": {
            "numeroDePedimento": "25 24 3577 5005723",
            "tipoDeOperacion": "IMP",
            "claveDePedimento": "A1",
            "regimen": "IMD",
            "destino": "9",
            "tipoDeCambio": 20.2163,
            "pesoBruto": 250,
            "aduanaEntradaOSalida": "240",
            "mediosTransporte": {
              "entradaSalida": "7",
              "arribo": "7",
              "salida": "7"
            },
            "valores": {
              "valorDolares": 7498.32,
              "valorAduana": 151588,
              "precioPagadoOValorComercial": 144547
            },
            "datosImportador": {
              "rfc": "EGM981125GX4",
              "curp": null,
              "razonSocial": "HEXPOL COMPOUNDING QUERETARO S.A. DE C.V.",
              "domicilio": "LA NORIA, Num. Ext.: 115, PARQUE INDUSTRIAL QUERETARO, CP 76220, SANTA ROSA JAUREGUI, QUERE, MEX"
            },
            "incrementables": {
              "valorSeguros": 0,
              "seguros": 0,
              "fletes": 3807,
              "embalajes": 0,
              "otrosIncrementables": 3235
            },
            "decrementables": {
              "transporteDecrementables": 0,
              "seguroDecrementables": 0,
              "cargaDecrementables": 0,
              "descargaDecrementables": 0,
              "otrosDecrementables": 0
            },
            "marcasNumerosBultos": {
              "marcas": "A-66151",
              "numeroDeBulto": "1",
              "totalDeBultos": "1"
            },
            "fechas": {
              "entrada": "2025-03-25T00:00:00.000Z",
              "pago": "2025-03-25T00:00:00.000Z",
              "extraccion": null,
              "presentacion": null,
              "importacionAEstadosUnidosOCanada": null,
              "original": null
            },
            "cuadroDeLiquidacion": {
              "liquidaciones": [
                {
                  "concepto": "IVA",
                  "fp": "0",
                  "importe": 24254
                },
                {
                  "concepto": "IVA PRV",
                  "fp": "0",
                  "importe": 46
                },
                {
                  "concepto": "PRV",
                  "fp": "0",
                  "importe": 290
                }
              ],
              "totales": {
                "efectivo": 24590,
                "otros": 0,
                "total": 24590
              }
            }
          },
          "datosDelProveedorOComprador": [
            {
              "idFiscal": "13-5409005",
              "nombreRazonSocial": "EXXONMOBIL CHEMICAL COMPANY",
              "domicilio": "SPRINGWOODS VILLAGE PARKWAY Num. Ext. 22777 CP 77389 SPRING, TEXAS, USA",
              "vinculacion": "NO",
              "facturas": [
                {
                  "numeroDeCFDIODocumentoEquivalente": "TS-25032025",
                  "fecha": "2025-03-25T00:00:00.000Z",
                  "incoterm": "CPT",
                  "moneda": "USD",
                  "valorMoneda": 7150,
                  "factorMoneda": 1,
                  "valorDolares": 7150
                }
              ]
            }
          ],
          "guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte": null,
          "contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo": {
            "numero": "XXXXXX",
            "tipo": "60"
          },
          "identificadoresPedimento": [],
          "observacionesANivelPedimento": "SE ANEXAN DOCUMENTOS DIGITALIZADOS (CONF. ART. 36 A DE LA LEY ADUANERA VIGENTE Y REGLAS GENERALES DE COMERCIO EXTERIOR 3.1.8) PLAZUELA CONSOLIDADO",
          "partidas": [
            {
              "secuencia": 1,
              "fraccion": "75040001",
              "subdivisionONumeroDeIdentificacionComercial": "00",
              "vinculacion": "0",
              "metodoDeValoracion": "1",
              "unidadDeMedidaComercial": "6",
              "cantidadUnidadDeMedidaComercial": 1,
              "unidadDeMedidaDeTarifa": "1",
              "cantidadUnidadDeMedidaDeTarifa": 250,
              "paisDeVentaOCompra": "USA",
              "paisDeOrigenODestino": "USA",
              "descripcion": "POLVO DE NICKEL",
              "valorEnAduanaOValorEnUSD": 151588,
              "importeDePrecioPagadoOValorComercial": 144547,
              "precioUnitario": 144547,
              "valorAgregado": null,
              "marca": null,
              "modelo": null,
              "codigoProducto": null,
              "contribuciones": [
                {
                  "contribucion": "IGI/IGE",
                  "tasa": 0,
                  "tipoDeTasa": "1",
                  "formaDePago": "0",
                  "importe": 0
                },
                {
                  "contribucion": "IVA",
                  "tasa": 16,
                  "tipoDeTasa": "1",
                  "formaDePago": "0",
                  "importe": 24254
                }
              ],
              "regulacionesYRestriccionesNoArancelarias": [],
              "identificadores": [
                {
                  "identificador": "EO",
                  "complemento1": "1",
                  "complemento2": null,
                  "complemento3": null
                },
                {
                  "identificador": "MA",
                  "complemento1": null,
                  "complemento2": null,
                  "complemento3": null
                },
                {
                  "identificador": "PO",
                  "complemento1": "151588",
                  "complemento2": "IMPERIAL ALLOYS CORP",
                  "complemento3": null
                },
                {
                  "identificador": "TL",
                  "complemento1": "USA",
                  "complemento2": null,
                  "complemento3": null
                }
              ],
              "observacionesANivelPartida": "ORDEN No. 1"
            }
          ]
        }
      },
      {
        fileUrl: "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153CEDoxBhnLpbl6it5NaGkD4BTRJsU8jFoO2K",
        expectedOutput: null,
      }
    ] as const;
    const trace = langfuse.trace({
      name: 'Glosa de Pedimento',
    });
    const pedimentoResults = await Promise.all(
      pedimentoFixture.map(async ({ fileUrl }) => {
        const pedimentoResult = await extractAndStructurePedimento(fileUrl, trace.id);
        return { pedimentoResult, fileUrl };
      })
    );

    for (const { pedimentoResult, fileUrl } of pedimentoResults) {
      const fixture = pedimentoFixture.find(item => item.fileUrl === fileUrl);
      expect.soft(pedimentoResult, `Result data should match expected output for: ${fileUrl}`)
        .toEqual(fixture?.expectedOutput);
    }
  });
});