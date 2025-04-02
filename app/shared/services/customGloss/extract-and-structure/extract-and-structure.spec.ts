import { describe, expect, it } from 'vitest';
import { extractAndStructurePackingList, extractAndStructureCove } from './extract-and-structure';

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
            "identificador": "20-8374868",
            "nombresORazonSocial": "IMPERIAL ALLOYS CORP",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "E 103RD STREET",
            "numeroExterior": "1031",
            "numeroInterior": "",
            "codigoPostal": "60628",
            "colonia": "",
            "localidad": "",
            "entidadFederativa": "ILLINOIS",
            "municipio": "CHICAGO",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "MALB640521U17",
            "nombresORazonSocial": "BERNHARD MACHTEL LANG",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelDestinatario": {
            "calle": "PROLONGACION PASEO DE LA LLAVE",
            "numeroExterior": "8",
            "numeroInterior": "",
            "codigoPostal": "76815",
            "colonia": "SAN GIL",
            "localidad": "",
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
            "observaciones": ""
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "Tax ID",
            "identificador": "561893440",
            "nombresORazonSocial": "ANDERSON AMERICA",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "SOUTHERN LOOP BLVD",
            "numeroExterior": "10620",
            "numeroInterior": "",
            "codigoPostal": "28134",
            "colonia": "PINEVILLE",
            "localidad": "PINEVILLE",
            "entidadFederativa": "PINEVILLE",
            "municipio": "PINEVILLE",
            "pais": "ESTADOS UNIDOS DE AMERICA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "SAA200430EUA",
            "nombresORazonSocial": "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR SA DE CV",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
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
            "observaciones": ""
          },
          "datosGeneralesDelProveedor": {
            "tipoDeIdentificador": "Tax ID",
            "identificador": "SN",
            "nombresORazonSocial": "PIROBLOC",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "POL. SANTIGA C. BLANQUERS",
            "numeroExterior": "2",
            "numeroInterior": "",
            "codigoPostal": "08130",
            "colonia": "",
            "localidad": "",
            "entidadFederativa": "BARCELONA",
            "municipio": "STA. PERPETUA MOGODA",
            "pais": "ESP"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "MFM030526RW7",
            "nombresORazonSocial": "MISSION FOODS MEXICO, S. DE R.L. DE C.V.",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelDestinatario": {
            "calle": "AV. PROF. HUMBERTO RAMOS LOZANO",
            "numeroExterior": "882",
            "numeroInterior": "S/N",
            "codigoPostal": "66610",
            "colonia": "",
            "localidad": "",
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
            "tipoDeIdentificador": "Tax ID",
            "identificador": "91370306080896344J",
            "nombresORazonSocial": "ZIBO BAODA AUTO PARTS LOGISTICS CO., LTD",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "ZHOULONG ROAD",
            "numeroExterior": "7888",
            "numeroInterior": "",
            "codigoPostal": "255000",
            "colonia": "ZHOUCUN",
            "localidad": "ZIBO",
            "entidadFederativa": "SHANDONG",
            "municipio": "NANJIAO",
            "pais": "CHINA (REPUBLICA POPULAR)"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "FCM211118K81",
            "nombresORazonSocial": "FAW CAMION MEXICO SA DE CV",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelDestinatario": {
            "calle": "CANTU",
            "numeroExterior": "9",
            "numeroInterior": "103",
            "codigoPostal": "11590",
            "colonia": "ANZURES",
            "localidad": "",
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
                "marca": "612640130438",
                "modelo": "",
                "submodelo": "",
                "numeroDeSerie": ""
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
            "tipoDeIdentificador": "Tax ID",
            "identificador": "82-5221873",
            "nombresORazonSocial": "GROUP CARGO LIFT INC.",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "KUYKENDAHL RD E. 500",
            "numeroExterior": "25420",
            "numeroInterior": "",
            "codigoPostal": "77375",
            "colonia": "",
            "localidad": "THE WOODLANDS",
            "entidadFederativa": "TX",
            "municipio": "",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "CLI080312JG1",
            "nombresORazonSocial": "CARGO LIFT, S.A. DE C.V.",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelDestinatario": {
            "calle": "TEZOZOMOC",
            "numeroExterior": "94",
            "numeroInterior": "",
            "codigoPostal": "02700",
            "colonia": "SAN MIGUEL AMANTLA",
            "localidad": "",
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
            "tipoDeIdentificador": "Tax ID",
            "identificador": "42-0886654",
            "nombresORazonSocial": "KEMIN FOOD TECNOLOGIES, INC",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "MAURY STREET",
            "numeroExterior": "2100",
            "numeroInterior": "",
            "codigoPostal": "50306",
            "colonia": "",
            "localidad": "DES MOINES",
            "entidadFederativa": "IOWA",
            "municipio": "",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "MAV940325CE8",
            "nombresORazonSocial": "MOLINOS AZTECA DE VERACRUZ SA DE CV",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelDestinatario": {
            "calle": "CARRETERA XALAPA VERACRUZ",
            "numeroExterior": "KM 94",
            "numeroInterior": "",
            "codigoPostal": "91697",
            "colonia": "LOMA DE TEJERIA",
            "localidad": "",
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
            "tipoDeIdentificador": "Tax ID",
            "identificador": "741465790",
            "nombresORazonSocial": "KULKONI, INC.",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelProveedor": {
            "calle": "GARDEN OAKS",
            "numeroExterior": "502",
            "numeroInterior": "",
            "codigoPostal": "77018",
            "colonia": "",
            "localidad": "",
            "entidadFederativa": "TX",
            "municipio": "HOUSTON",
            "pais": "USA"
          },
          "datosGeneralesDelDestinatario": {
            "tipoDeIdentificador": "RFC",
            "identificador": "SER870126EA3",
            "nombresORazonSocial": "SERVICABLES, S.A. DE C.V.",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "domicilioDelDestinatario": {
            "calle": "DR. BALMIS",
            "numeroExterior": "91",
            "numeroInterior": "B",
            "codigoPostal": "06720",
            "colonia": "DOCTORES",
            "localidad": "",
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
});
