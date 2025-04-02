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
