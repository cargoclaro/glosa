export const INITIAL_STATE_RESPONSE = {
  success: false,
  message: "",
  errors: {},
};

export const DUMP_GLOSS_FOR_CREATION = {
  summary: "Custom Gloss Example Summary",
  timeSaved: 12.5,
  moneySaved: 3000.75,
  importerName: "Importer S.A.",
  tabs: [
    {
      name: "Número de Pedimento",
      isCorrect: false,
      fullContext: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Número de pedimento",
              value: "123456789012345",
            },
            {
              name: "Año del pedimento",
              value: "23",
            },
            {
              name: "Año actual",
              value: "2024",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 15",
          data: [
            {
              name: "Claves de destino válidas",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Longitud",
          description: "El número de pedimento debe tener 15 dígitos",
          llmAnalysis:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          isCorrect: true,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          actionsToTake: [
            {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf)",
            },
          ],
        },
        {
          name: "Año del pedimento",
          description:
            "El año del pedimento (dígitos 3 y 4) debe ser igual al año actual",
          llmAnalysis:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          isCorrect: false,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          actionsToTake: [
            {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf)",
            },
          ],
        },
      ],
    },
    {
      name: "Tipo de Operación",
      isCorrect: false,
      fullContext: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Tipo de operación",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 15",
          data: [
            {
              name: "Claves de destino válidas",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Tipo de operación",
          description: "El tipo de operación debe ser válido",
          llmAnalysis:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          isCorrect: true,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          actionsToTake: [
            {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf)",
            },
          ],
        },
      ],
    },
    {
      name: "Destino/Origen",
      isCorrect: false,
      fullContext: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Clave de destino",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
              name: "Clave de origen",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 15",
          data: [
            {
              name: "Claves de destino válidas",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
              name: "Claves de origen válidas",
              value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Clave de destino",
          description: "La clave de destino debe ser válida",
          llmAnalysis:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          isCorrect: true,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          actionsToTake: [
            {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf)",
            },
          ],
        },
        {
          name: "Clave de origen",
          description: "La clave de origen debe ser válida",
          llmAnalysis:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          isCorrect: false,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          actionsToTake: [
            {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf)",
            },
          ],
        },
      ],
    },
  ],
  files: [
    {
      name: "BL.pdf",
      url: "https://dummycloud.com/glosas/files/gloss28/proforma.pdf",
    },
    {
      name: "Carta 3.1.8.pdf",
      url: "https://dummycloud.com/glosas/files/gloss28/ficha_tecnica.pdf",
    },
    {
      name: "Carta 3.1.8.pdf",
      url: "https://dummycloud.com/glosas/files/gloss28/carta_318.pdf",
    },
    {
      name: "Certificado de Origen.pdf",
      url: "https://dummycloud.com/glosas/files/gloss28/certificado_origen.pdf",
    },
    {
      name: "Sedena.pdf",
      url: "https://dummycloud.com/glosas/files/gloss28/sedena.pdf",
    },
    {
      name: "Pedimento.pdf",
      url: "/assets/pdfs/pedimento_format_modified.pdf",
    },
  ],
  alerts: [
    {
      type: "HIGH",
      description: "NUM. FACTURA",
    },
    {
      type: "LOW",
      description: "# CONTENEDOR",
    },
    {
      type: "LOW",
      description: "PRECIO UNIT",
    },
    {
      type: "LOW",
      description: "CANTIDAD UMT",
    },
    {
      type: "LOW",
      description: "PESO BRUTO",
    },
  ],
};
