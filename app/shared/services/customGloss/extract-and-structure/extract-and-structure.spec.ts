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
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15u1EQuvyES0lPex1mXBWQop7GAjJIMsDCUZk2",
        "expectedOutput": {
          "acuse_valor": "COVE257E4H7I4",
          "tipo_operacion": "Importación",
          "relacion_facturas": "SIN RELACIÓN DE FACTURAS",
          "numero_factura": "TS-25032025",
          "tipo_figura": "Agente Aduanal",
          "fecha_expedicion": new Date("2025-03-25T00:00:00.000Z"),
          "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)",
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX ID",
            "identificador": "20-8374868",
            "nombre_razon_social": "IMPERIAL ALLOYS CORP",
            "domicilio": {
              "calle": "E 103RD STREET",
              "numero_exterior": "1031",
              "numero_interior": null,
              "codigo_postal": "60628",
              "colonia": null,
              "localidad": null,
              "entidad_federativa": "ILLINOIS",
              "municipio": "CHICAGO",
              "pais": "USA"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "MALB640521U17",
            "nombre_razon_social": "BERNHARD MACHTEL LANG",
            "domicilio": {
              "calle": "PROLONGACION PASEO DE LA LLAVE",
              "numero_exterior": "8",
              "numero_interior": null,
              "codigo_postal": "76815",
              "colonia": "SAN GIL",
              "localidad": null,
              "entidad_federativa": "QUERE",
              "municipio": "SAN JUAN DEL RIO",
              "pais": "MEX"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "POLVO DE NICKEL",
              "clave_umc": "EACH",
              "cantidad_umc": 1,
              "tipo_moneda": "US Dolar",
              "valor_unitario": 7150,
              "valor_total": 7150,
              "valor_total_dolares": 7150,
              "numeros_serie": []
            }
          ]
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15XadhI2Q3p02PnBlWqwL7baCzMhxf4mHoEDc9",
        "expectedOutput": {
          "acuse_valor": "COVE214J371P6",
          "tipo_operacion": "Importación",
          "relacion_facturas": "SIN RELACION DE FACTURAS",
          "numero_factura": "S/N",
          "tipo_figura": "Agente Aduanal",
          "fecha_expedicion": new Date("2021-08-11T00:00:00.000Z"),
          "observaciones": null,
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX_ID",
            "identificador": "561893440",
            "nombre_razon_social": "ANDERSON AMERICA",
            "domicilio": {
              "calle": "SOUTHERN LOOP BLVD",
              "numero_exterior": "10620",
              "numero_interior": null,
              "codigo_postal": "28134",
              "colonia": null,
              "localidad": "PINEVILLE",
              "entidad_federativa": "PINEVILLE",
              "municipio": "PINEVILLE",
              "pais": "ESTADOS UNIDOS DE AMERICA"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "SAA200430EUA",
            "nombre_razon_social": "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR SA DE CV",
            "domicilio": {
              "calle": "EBANO",
              "numero_exterior": "301",
              "numero_interior": "B",
              "codigo_postal": "42033",
              "colonia": "LOS CEDROS",
              "localidad": "PACHUCA",
              "entidad_federativa": "HIDALGO",
              "municipio": "PACHUCA DE SOTO",
              "pais": "MEXICO (ESTADOS UNIDOS MEXICANOS)"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "PIÑON",
              "clave_umc": "piece",
              "cantidad_umc": 2,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 328,
              "valor_total": 656,
              "valor_total_dolares": 656,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "POLEAS",
              "clave_umc": "piece",
              "cantidad_umc": 2,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 172,
              "valor_total": 344,
              "valor_total_dolares": 344,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "POLEAS",
              "clave_umc": "piece",
              "cantidad_umc": 2,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 80,
              "valor_total": 160,
              "valor_total_dolares": 160,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "POLEAS",
              "clave_umc": "piece",
              "cantidad_umc": 2,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 140,
              "valor_total": 280,
              "valor_total_dolares": 280,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "POLEAS",
              "clave_umc": "piece",
              "cantidad_umc": 2,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 115,
              "valor_total": 230,
              "valor_total_dolares": 230,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "CHUMACERA",
              "clave_umc": "piece",
              "cantidad_umc": 2,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 200,
              "valor_total": 400,
              "valor_total_dolares": 400,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "PARTE PARA SIERRA",
              "clave_umc": "piece",
              "cantidad_umc": 1,
              "tipo_moneda": "US Dollar",
              "valor_unitario": 310,
              "valor_total": 310,
              "valor_total_dolares": 310,
              "numeros_serie": []
            }
          ]
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15HyVqAoWCjnmTGoQ3c9SyIxeudvRq4iEBXMF7",
        "expectedOutput": {
          "acuse_valor": "COVE2477XYCQ5",
          "tipo_operacion": "Importación",
          "relacion_facturas": "SIN RELACIÓN DE FACTURAS",
          "numero_factura": "442073",
          "tipo_figura": "Agente Aduanal",
          "fecha_expedicion": new Date("2024-11-22T00:00:00.000Z"),
          "observaciones": null,
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX ID",
            "identificador": "SN",
            "nombre_razon_social": "PIROBLOC",
            "domicilio": {
              "calle": "POL. SANTIGA C. BLANQUERS",
              "numero_exterior": "2",
              "numero_interior": null,
              "codigo_postal": "08130",
              "colonia": null,
              "localidad": null,
              "entidad_federativa": "BARCELONA",
              "municipio": "STA. PERPETUA MOGODA",
              "pais": "ESP"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "MFM030526RW7",
            "nombre_razon_social": "MISSION FOODS MEXICO, S. DE R.L. DE C.V.",
            "domicilio": {
              "calle": "AV. PROF. HUMBERTO RAMOS LOZANO",
              "numero_exterior": "882",
              "numero_interior": "S/N",
              "codigo_postal": "66610",
              "colonia": null,
              "localidad": null,
              "entidad_federativa": "NUEVO LEON",
              "municipio": "APODACA",
              "pais": "MEX"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "PRESOSTATO",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 83,
              "valor_total": 83,
              "valor_total_dolares": 86.32,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "TUBO DE PLASTICO",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 5,
              "valor_total": 5,
              "valor_total_dolares": 5.2,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "CABLES ELECTRICOS CON PIEZAS DE CONEXION",
              "clave_umc": "PIECE",
              "cantidad_umc": 3,
              "tipo_moneda": "EUR",
              "valor_unitario": 10.95,
              "valor_total": 32.88,
              "valor_total_dolares": 34.2,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "JUNTA",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 9.86,
              "valor_total": 9.86,
              "valor_total_dolares": 10.25,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "JUNTA",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 3.06,
              "valor_total": 3.06,
              "valor_total_dolares": 3.18,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "RODAMIENTOS",
              "clave_umc": "PIECE",
              "cantidad_umc": 2,
              "tipo_moneda": "EUR",
              "valor_unitario": 27.18,
              "valor_total": 54.36,
              "valor_total_dolares": 56.53,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "ACOPLAMIENTO",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 272.21,
              "valor_total": 272.21,
              "valor_total_dolares": 283.1,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "PARTES PARA BOMBAS ELEVADORES DE LIQUIDOS",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 2054.53,
              "valor_total": 2054.53,
              "valor_total_dolares": 2136.71,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "JUNTA",
              "clave_umc": "PIECE",
              "cantidad_umc": 2,
              "tipo_moneda": "EUR",
              "valor_unitario": 189.58,
              "valor_total": 379.16,
              "valor_total_dolares": 394.33,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "JUNTA",
              "clave_umc": "PIECE",
              "cantidad_umc": 2,
              "tipo_moneda": "EUR",
              "valor_unitario": 189.77,
              "valor_total": 379.58,
              "valor_total_dolares": 394.76,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "QUEMADOR DE GAS",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 7375.8,
              "valor_total": 7375.8,
              "valor_total_dolares": 7670.83,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "QUEMADOR DE GAS",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 14033.63,
              "valor_total": 14033.63,
              "valor_total_dolares": 14594.98,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "ACEITE PARAFINICO",
              "clave_umc": "PIECE",
              "cantidad_umc": 1,
              "tipo_moneda": "EUR",
              "valor_unitario": 1808.56,
              "valor_total": 1808.56,
              "valor_total_dolares": 1880.9,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "ACEITE PARAFINICO",
              "clave_umc": "PIECE",
              "cantidad_umc": 3,
              "tipo_moneda": "EUR",
              "valor_unitario": 1808.56,
              "valor_total": 5425.68,
              "valor_total_dolares": 5642.71,
              "numeros_serie": []
            }
          ]
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Fn3r61gpw0UmYxiesJuoAgDqlBLkHvzhTSZ3",
        "expectedOutput": {
          "acuse_valor": "COVE2366LNKC3",
          "tipo_operacion": "IMPORTACIÓN",
          "relacion_facturas": "SIN RELACIÓN DE FACTURAS",
          "numero_factura": "BP230828MXG064",
          "tipo_figura": "AGENTE ADUANAL",
          "fecha_expedicion": new Date("2023-08-28T00:00:00.000Z"),
          "observaciones": "FLETES AEREO: 500.00 USD",
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX ID",
            "identificador": "91370306080896344J",
            "nombre_razon_social": "ZIBO BAODA AUTO PARTS LOGISTICS CO., LTD",
            "domicilio": {
              "calle": "ZHOULONG ROAD",
              "numero_exterior": "7888",
              "numero_interior": null,
              "codigo_postal": "255000",
              "colonia": "ZHOUCUN",
              "localidad": "ZIBO",
              "entidad_federativa": "SHANDONG",
              "municipio": "NANJIAO",
              "pais": "CHINA (REPUBLICA POPULAR)"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "FCM211118K81",
            "nombre_razon_social": "FAW CAMION MEXICO SA DE CV",
            "domicilio": {
              "calle": "CANTU",
              "numero_exterior": "9",
              "numero_interior": "103",
              "codigo_postal": "11590",
              "colonia": "ANZURES",
              "localidad": null,
              "entidad_federativa": "CIUDAD DE MÉXICO",
              "municipio": "MIGUEL HIDALGO",
              "pais": "MEXICO (ESTADOS UNIDOS MEXICANOS)"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "FILTROS",
              "clave_umc": "PIECE",
              "cantidad_umc": 342,
              "tipo_moneda": "USD Dolar",
              "valor_unitario": 41.48,
              "valor_total": 14186.16,
              "valor_total_dolares": 14186.16,
              "numeros_serie": [
                "612640130438"
              ]
            }
          ]
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15IDryccR2Okng1Id8jPzMFLQmSoW4e9tbTJcr",
        "expectedOutput": {
          "acuse_valor": "COVE246Z26KR8",
          "tipo_operacion": "Importación",
          "relacion_facturas": "SIN RELACIÓN DE FACTURAS",
          "numero_factura": "12783",
          "tipo_figura": "Agente Aduanal",
          "fecha_expedicion": new Date("2024-08-07T00:00:00.000Z"),
          "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)",
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX ID",
            "identificador": "82-5221873",
            "nombre_razon_social": "GROUP CARGO LIFT INC.",
            "domicilio": {
              "calle": "KUYKENDAHL RD E. 500",
              "numero_exterior": "25420",
              "numero_interior": null,
              "codigo_postal": "77375",
              "colonia": null,
              "localidad": null,
              "entidad_federativa": "TX",
              "municipio": "THE WOODLANDS",
              "pais": "USA"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "CLI080312JG1",
            "nombre_razon_social": "CARGO LIFT, S.A. DE C.V.",
            "domicilio": {
              "calle": "TEZOZOMOC",
              "numero_exterior": "94",
              "numero_interior": null,
              "codigo_postal": "02700",
              "colonia": "SAN MIGUEL AMANTLA",
              "localidad": null,
              "entidad_federativa": "CDMX",
              "municipio": "AZCAPOTZALCO",
              "pais": "MEX"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "CABLE DE ACERO NO ROTATORIO",
              "clave_umc": "LINEAR METRE",
              "cantidad_umc": 1204,
              "tipo_moneda": "US Dolar",
              "valor_unitario": 3.660606,
              "valor_total": 4407.37,
              "valor_total_dolares": 4407.37,
              "numeros_serie": []
            }
          ]
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zkxGeSgutyXdVR43qhBYaSHWfrT9MLbDjkNA",
        "expectedOutput": {
          "acuse_valor": "COVE24762H063",
          "tipo_operacion": "Importación",
          "relacion_facturas": "SIN RELACIÓN DE FACTURAS",
          "numero_factura": "2413575",
          "tipo_figura": "Agente Aduanal",
          "fecha_expedicion": new Date("2024-11-13T00:00:00.000Z"),
          "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)",
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX ID",
            "identificador": "42-0886654",
            "nombre_razon_social": "KEMIN FOOD TECNOLOGIES, INC",
            "domicilio": {
              "calle": "MAURY STREET",
              "numero_exterior": "2100",
              "numero_interior": null,
              "codigo_postal": "50306",
              "colonia": null,
              "localidad": null,
              "entidad_federativa": "IOWA",
              "municipio": "DES MOINES",
              "pais": "USA"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "MAV940325CE8",
            "nombre_razon_social": "MOLINOS AZTECA DE VERACRUZ SA DE CV",
            "domicilio": {
              "calle": "CARRETERA XALAPA VERACRUZ",
              "numero_exterior": "KM 94",
              "numero_interior": null,
              "codigo_postal": "91697",
              "colonia": "LOMA DE TEJERIA",
              "localidad": null,
              "entidad_federativa": "VERACRUZ",
              "municipio": "VERACRUZ",
              "pais": "MEX"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "CONSERVADOR GRADO ALIMENTICIO PARA TORTILLAS DE MAIZ",
              "clave_umc": "POUND",
              "cantidad_umc": 13227.6,
              "tipo_moneda": "US Dolar",
              "valor_unitario": 1.98,
              "valor_total": 26190.65,
              "valor_total_dolares": 26190.65,
              "numeros_serie": []
            },
            {
              "descripcion_mercancia": "RECIPIENTES DE PLASTICO",
              "clave_umc": "EACH",
              "cantidad_umc": 6,
              "tipo_moneda": "US Dolar",
              "valor_unitario": 238.49,
              "valor_total": 1430.94,
              "valor_total_dolares": 1430.94,
              "numeros_serie": []
            }
          ]
        }
      },
      {
        "fileUrl": "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15MgmsGr907FYSfgKGA9JUX3rIQ2amz4bTDeNj",
        "expectedOutput": {
          "acuse_valor": "COVE246XNYVY7",
          "tipo_operacion": "Importación",
          "relacion_facturas": "SIN RELACIÓN DE FACTURAS",
          "numero_factura": "420120",
          "tipo_figura": "Agente Aduanal",
          "fecha_expedicion": new Date("2024-07-24T00:00:00.000Z"),
          "observaciones": "SE ANEXAN DOCUMENTOS DIGITALIZADOS(FACTURA, TRADUCCION, PACKING)",
          "datos_generales_proveedor": {
            "tipo_identificador": "TAX ID",
            "identificador": "741465790",
            "nombre_razon_social": "KULKONI, INC.",
            "domicilio": {
              "calle": "GARDEN OAKS",
              "numero_exterior": "502",
              "numero_interior": null,
              "codigo_postal": "77018",
              "colonia": null,
              "localidad": null,
              "entidad_federativa": "TX",
              "municipio": "HOUSTON",
              "pais": "USA"
            }
          },
          "datos_generales_destinatario": {
            "rfc_destinatario": "SER870126EA3",
            "nombre_razon_social": "SERVICABLES, S.A. DE C.V.",
            "domicilio": {
              "calle": "DR. BALMIS",
              "numero_exterior": "91",
              "numero_interior": "B",
              "codigo_postal": "06720",
              "colonia": "DOCTORES",
              "localidad": null,
              "entidad_federativa": "CDMX",
              "municipio": "MEXICO",
              "pais": "MEX"
            }
          },
          "datos_mercancia": [
            {
              "descripcion_mercancia": "GRAPAS",
              "clave_umc": "EACH",
              "cantidad_umc": 300,
              "tipo_moneda": "US Dolar",
              "valor_unitario": 1.1,
              "valor_total": 330,
              "valor_total_dolares": 330,
              "numeros_serie": []
            }
          ]
        }
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
