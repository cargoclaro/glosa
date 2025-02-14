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
      fullContext: true,
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

export const VICTOR_GLOSS_EXAMPLE = {
  summary:
    "Se encontraron 4 errores críticos, 15 advertencias y 0 observaciones menores.",
  timeSaved: 30,
  moneySaved: 1234.56,
  importerName: "ACUSE LC",
  tabs: [
    {
      name: "N° de pedimento",
      isCorrect: false,
      fullContext: true,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Número de pedimento",
              value: "214737091001023",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Longitud",
          description: "El número de pedimento debe contar con 15 dígitos",
          llmAnalysis:
            "✅ El número de pedimento tiene 15 dígitos, que es la longitud requerida. Se confirmó con el contexto proporcionado donde se indica que el 'Número de dígitos' es 15.",
          isCorrect: true,
          summary: "Validación correcta de Longitud",
          actionsToTake: [],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf)",
            },
          ],
        },
        {
          name: "Año del pedimento",
          description:
            "El año del pedimento (inferido por los dígitos 3 y 4 del número del pedimento) debe ser iguales al año actual",
          llmAnalysis:
            "❌ El año del pedimento, inferido como '2047' del número de pedimento, no coincide con el año actual '2025'. Esto indica un error en el año. Se utilizó el contexto inferido para realizar esta validación.",
          isCorrect: false,
          summary: "Error en la validación de Año del pedimento",
          actionsToTake: [
            {
              description:
                "Revisar el número de pedimento y corregir el año a un valor que coincida con el año actual.",
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
      fullContext: true,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Tipo de Operación",
              value: "IMP",
            },
            {
              name: "Clave de Pedimento",
              value: "A1",
            },
            {
              name: "Régimen",
              value: "IMD",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Documento de Transporte",
          data: [
            {
              name: "País de origen",
              value: "USA",
            },
            {
              name: "País de destino",
              value: "MEX",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 2",
          data: [
            {
              name: "Claves de pedimento válidas",
              value:
                "A1 - Importación o exportación definitiva.\nSupuestos de aplicación:\nI. Entrada de mercancías de procedencia extranjera para permanecer en territorio nacional por tiempo ilimitado.\nII. Salida de mercancías del territorio nacional para permanecer en el extranjero por tiempo ilimitado.\nIII. Importación definitiva de vehículos por misiones diplomáticas, consulares y oficinas de organismos internacionales, y su personal extranjero.\nIV. Importación definitiva de vehículos nuevos y usados.\nV. Retorno de envases y empaques, etiquetas y folletos importados temporalmente al amparo de un Programa IMMEX.\nVI. Importación definitiva de mercancías que se retiren de recinto fiscalizado estratégico, colindante con la aduana.\nVII. Exportación definitiva de mercancías que se retiren de recinto fiscalizado estratégico colindante o no colindante con la aduana.\nA3 - Regularización de mercancías (importación definitiva).\nSupuestos de aplicación:\nI. Mercancías que se encuentran en territorio nacional sin haber cumplido con las formalidades del despacho aduanero.\nII. Mercancías que hubieran ingresado a territorio nacional bajo el régimen de importación temporal cuyo plazo hubiera vencido.\nIII. Maquinaria o equipo que no cuente con la documentación necesaria para acreditar su legal importación.\nIV. Mercancías a que se refiere el artículo 108, fracción III de la Ley.\nV. Vehículos de prueba que ingresaron a depósito fiscal por empresas de la industria automotriz terminal.\nVI. Mercancía excedente o no declarada en el pedimento de introducción a depósito fiscal.\nVII. Importación definitiva de mercancías robadas.\nVIII. Importación definitiva de mercancía importada al amparo de un Cuaderno ATA.\nIX. Importación de contenedores y carros de ferrocarril dañados.\nX. Mercancías que hubieran ingresado a territorio nacional bajo el régimen de recinto fiscalizado estratégico cuyo plazo hubiera vencido.\nC1 - Importación definitiva a la franja fronteriza norte y región fronteriza.\nSupuestos de aplicación:\nI. Importación definitiva de mercancías al amparo del 'Decreto de la zona libre de Chetumal'.\nII. Empresas que se dedican al desmantelamiento de vehículos automotores usados.\nIII. Mercancías destinadas a la franja fronteriza norte y región fronteriza por empresas autorizadas.\nD1 - Retorno por sustitución.\nSupuestos de aplicación:\nI. Retorno al país o al extranjero por sustitución de mercancías defectuosas.\nGC - Global complementario.\nSupuestos de aplicación:\nI. Ajuste de valor anual en pedimentos de importación definitiva.\nII. Ajuste de valor derivado de las facultades de comprobación.\nIII. Ajuste de valor anual en pedimentos de exportación definitiva.\nIV. Ajuste de valor derivado de las facultades de comprobación.\nK1 - Desistimiento de régimen y retorno de mercancías por devolución.\nSupuestos de aplicación:\nI. Retorno de mercancías exportadas definitivamente en un lapso no mayor de un año.\nII. Para retornar mercancías que se encuentren en depósito ante aduana.\nIII. Desistimiento total o parcial del régimen de exportación.\nL1 - Pequeña importación definitiva.\nSupuestos de aplicación:\nI. Pequeña importación comercial en cruces fronterizos.\nII. Pequeña importación de mercancías por personas físicas que tributen en los términos del Título IV, Capítulo II.\nIII. Importación de mercancías de personas que no excedan el valor de 3,000 dólares.\nIV. Pequeña exportación en cruces fronterizos.\nP1 - Reexpedición de mercancías de franja fronteriza.\nSupuestos de aplicación:\nI. Mercancía que fue importada definitivamente a región fronteriza o franja fronteriza norte.\nS2 - Importación y exportación de mercancías para retornar en su mismo estado.\nSupuestos de aplicación:\nI. Importación de mercancías para retornar en su mismo estado.\nII. Exportación de mercancías importadas con esta clave de documento.\nT1 - Importación y exportación por empresas de mensajería y paquetería.\nSupuestos de aplicación:\nI. Importación y exportación definitiva de mercancías por empresas de mensajería y paquetería.\nVF - Importación definitiva de vehículos usados a la franja o región fronteriza norte.\nSupuestos de aplicación:\nI. Importación definitiva de vehículos usados de conformidad con la regla 3.5.6.\nVU - Importación definitiva de vehículos usados.\nSupuestos de aplicación:\nI. Importación definitiva de vehículos de conformidad con la regla 3.5.5.\nAD - Importación temporal de mercancías destinadas a convenciones y congresos internacionales.\nSupuestos de aplicación:\nCuando se expongan al público en general y se difundan a través de los principales medios de comunicación, así como sus muestras y muestrarios.\nAJ - Importación y exportación temporal de envases de mercancías.\nSupuestos de aplicación:\nImportación temporal de envases de mercancías, siempre que contengan en territorio nacional las mercancías que en ellos se hubieran introducido al país.\nExportación temporal de envases de mercancías.\nBA - Importación y exportación temporal de bienes para ser retornados en su mismo estado.\nSupuestos de aplicación:\nImportación temporal de bienes realizada por residentes en el extranjero sin establecimiento permanente en México.\nExportación temporal realizada por residentes en México sin establecimiento permanente en el extranjero.\nExportación temporal de ganado.\nImportación temporal de menajes de casa.\nImportación temporal de maquinaria y equipo.\nBB - Exportación, importación y retornos virtuales.\nSupuestos de aplicación:\nExportación definitiva virtual de mercancía nacional (productos terminados) que enajenen residentes en el país a recinto fiscalizado.\nExportación definitiva virtual de mercancía nacional a depósito fiscal.\nExportación (retorno) virtual de mercancías que hubieran ingresado a territorio nacional bajo el régimen de importación temporal.\nExportación definitiva virtual de mercancía importada temporalmente con anterioridad.\nBC - Importación y exportación temporal de mercancías destinadas a eventos culturales o deportivos e investigación.\nSupuestos de aplicación:\nPara eventos culturales o deportivos patrocinados por entidades públicas.\nPara fines de investigación que importen organismos públicos nacionales y extranjeros.\nBD - Importación y exportación temporal de equipo para filmación.\nSupuestos de aplicación:\nImportación y exportación temporal de enseres, utilería y demás equipo necesario para la filmación.\nBE - Importación y exportación temporal de vehículos de prueba.\nSupuestos de aplicación:\nImportación y exportación temporal de vehículos de prueba por un fabricante autorizado residente en México.\nBF - Exportación temporal de mercancías destinadas a exposiciones, convenciones o eventos culturales o deportivos.\nSupuestos de aplicación:\nPara mercancía destinada a exposiciones, convenciones o eventos culturales o deportivos.\nBH - Importación temporal de contenedores, aviones, helicópteros, embarcaciones y carros de ferrocarril.\nSupuestos de aplicación:\nContenedores, embarcaciones, aviones, helicópteros y carros de ferrocarril.\nMercancías destinadas para mantenimiento o reparación.\nBI - Importación temporal.\nSupuestos de aplicación:\nMercancías previstas por convenios internacionales y uso oficial de misiones diplomáticas.\nBM - Exportación temporal de mercancías para su transformación, elaboración o reparación.\nSupuestos de aplicación:\nExportación temporal de mercancías nacionales o nacionalizadas para su transformación en el extranjero.\nBO - Exportación temporal para reparación o sustitución y retorno al país.\nSupuestos de aplicación:\nExportación temporal de mercancías de activo fijo para reparación o sustitución.\nBP - Importación y exportación temporal de muestras o muestrarios.\nSupuestos de aplicación:\nMuestras y muestrarios destinados a dar a conocer mercancía.\nBR - Exportación temporal y retorno de mercancías fungibles.\nSupuestos de aplicación:\nMercancías fungibles que cuenten con opinión de la SE para la exportación temporal.\nH1 - Retorno de mercancías en su mismo estado.\nSupuestos de aplicación:\nRetorno de importación y exportación de mercancías en el mismo estado.\nH8 - Retorno de envases.\nSupuestos de aplicación:\nAl territorio nacional de los envases exportados temporalmente.\nAl extranjero de envases que fueron importados temporalmente.\nI1 - Importación, exportación y retorno de mercancías elaboradas, transformadas o reparadas.\nSupuestos de aplicación:\nImportación definitiva de mercancías terminadas que se incorporaron productos exportados temporalmente.\nF4 - Cambio de régimen de insumos o de mercancía exportada temporalmente.\nSupuestos de aplicación:\nImportación temporal a definitiva de mercancía sujeta a transformación.\nExportación temporal a definitiva virtual de mercancías.\nF5 - Cambio de régimen de mercancías de importación temporal a definitiva.\nSupuestos de aplicación:\nImportación temporal a definitiva de bienes de activo fijo por parte de empresas con Programa IMMEX.\nIN - Importación temporal de bienes que serán sujetos a transformación, elaboración o reparación.\nSupuestos de aplicación:\nMercancía destinada a un proceso de elaboración, transformación o reparación, que formen parte del programa autorizado a empresas con Programa IMMEX.\nRetorno al país de mercancía elaborada, transformada o reparada que haya sido rechazada en el extranjero por haber resultado defectuosa o de especificaciones distintas a las convenidas por parte de empresas con Programa IMMEX, en el plazo de un año y siempre que no hayan sido objeto de modificaciones.\nAF - Importación temporal de bienes de activo fijo.\nSupuestos de aplicación:\nMercancías señaladas en el artículo 108, fracción III de la Ley.\nRT - Retorno de mercancías.\nSupuestos de aplicación:\nRetorno al extranjero de mercancía transformada, elaborada o reparada al amparo de un Programa IMMEX.\nRetorno de mercancías extranjeras en su mismo estado, excepto cuando se trate del retorno de envases y empaques, etiquetas y folletos importados temporalmente al amparo de un Programa IMMEX, que se utilicen en la exportación de mercancía nacional, para lo cual deberán utilizar la clave de documento A1.\nRetorno de opciones especiales, incorporadas en vehículos exportados por la industria automotriz terminal o manufacturera de vehículos de autotransporte, al amparo de un Programa IMMEX.\nA4 - Introducción para depósito fiscal (AGD).\nE1 - Extracción de depósito fiscal de bienes que serán sujetos a transformación, elaboración o reparación (AGD).\nE2 - Extracción de depósito fiscal de bienes de activo fijo (AGD).\nG1 - Extracción de depósito fiscal (AGD).\nC3 - Extracción de depósito fiscal de franja o región fronteriza (AGD).\nK2 - Extracción de depósito fiscal por desistimiento o transferencias (AGD).\nA5 - Introducción a depósito fiscal en local autorizado.\nE3 - Extracción de depósito fiscal en local autorizado (insumos).\nE4 - Extracción de depósito fiscal en local autorizado (activo fijo).\nG2 - Extracción de depósito fiscal en local autorizado para su importación definitiva.\nK3 - Extracción de depósito fiscal en local autorizado para retorno o transferencia.\nF2 - Introducción a depósito fiscal (IA).\nF3 - Extracción de depósito fiscal (IA).\nV3 - Extracción de depósito fiscal de bienes para su retorno o exportación virtual (IA).\nV4 - Retorno virtual derivado de la constancia de transferencia de mercancías (IA).\nF8 - Introducción y extracción de depósito fiscal de mercancías nacionales o nacionalizadas en tiendas libres de impuestos (Duty Free).\nF9 - Introducción y extracción de depósito fiscal de mercancías extranjeras para exposición y venta de mercancías en tiendas libres de impuestos (Duty Free).\nG6 - Informe de extracción de depósito fiscal de mercancías nacionales o nacionalizadas vendidas en tiendas libres de impuestos (Duty Free).\nG7 - Informe de extracción de depósito fiscal de mercancías extranjeras vendidas en tiendas libres de impuestos (Duty Free).\nV8 - Transferencia de mercancías en depósito fiscal para la exposición y venta de mercancías extranjeras, nacionales y nacionalizadas de tiendas libres de impuestos (Duty Free).",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 16",
          data: [
            {
              name: "Regímenes válidos",
              value:
                "IMD - Definitivo de importación.\n\nITR - Temporales de importación para retornar al extranjero en el mismo estado.\n\nITE - Temporales de importación para elaboración, transformación o reparación para empresas con programa IMMEX.\n\nDFI - Depósito fiscal.\n\nRFE - Elaboración, transformación o reparación en recinto fiscalizado.\n",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Coherencia con origen/destino",
          description:
            "El tipo de operación debe ser consistente con el origen y destino de las mercancías (IMP si destino es México, EXP si origen es México, TRA en otros casos)",
          llmAnalysis:
            "⚠️ El tipo de operación 'IMP' es consistente con el destino de México, sin embargo, no se proporciona información sobre el origen de las mercancías en el contexto proporcionado, lo cual limita la capacidad para confirmar completamente la coherencia.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Coherencia con origen/destino",
          actionsToTake: [
            {
              description:
                "Obtener información sobre el país de origen de las mercancías para validar la coherencia completamente.",
            },
          ],
          resources: [
            {
              link: "[Ley Aduanera](None)",
            },
          ],
        },
        {
          name: "Validación de clave de pedimento",
          description:
            "La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2",
          llmAnalysis:
            "✅ La clave de pedimento 'A1' es válida para el tipo de operación 'IMP' según el Apéndice 2 proporcionado en el contexto, donde se menciona que A1 corresponde a importación definitiva.",
          isCorrect: true,
          summary: "Validación correcta de Validación de clave de pedimento",
          actionsToTake: [],
          resources: [
            {
              link: "[Apéndice 2 del Anexo 22](None)",
            },
          ],
        },
        {
          name: "Validación de régimen",
          description:
            "El régimen debe ser válido para el tipo de operación según el Apéndice 16",
          llmAnalysis:
            "⚠️ El régimen 'IMD' es mencionado en el contexto como válido para operaciones de importación, sin embargo, no se detalla su correspondencia directa con el tipo de operación 'IMP' según el Apéndice 16. Es importante verificar la aplicabilidad del régimen para evitar errores futuros.",
          isCorrect: false,
          summary: "Advertencia en la validación de Validación de régimen",
          actionsToTake: [
            {
              description:
                "Revisar el Apéndice 16 para confirmar la validez del régimen 'IMD' para la operación 'IMP' y asegurar que cumple con los requisitos.",
            },
          ],
          resources: [
            {
              link: "[Apéndice 16 del Anexo 22](None)",
            },
          ],
        },
      ],
    },
    {
      name: "Destino/Origen de Mercancías",
      isCorrect: false,
      fullContext: true,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Clave de Destino/Origen",
              value: "9",
            },
            {
              name: "Tipo de Operación",
              value: "IMP",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Documento de Transporte",
          data: [
            {
              name: "País de origen",
              value: "USA",
            },
            {
              name: "País de destino",
              value: "MEX",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 15",
          data: [
            {
              name: "Claves de destino válidas",
              value:
                "1 - Estado de Baja California y parcial de Sonora.\n2 - Estado de Baja California Sur.\n3 - Estado de Quintana Roo.\n5 - Municipio de Salina Cruz, Oaxaca.\n6 - Municipio de Cananea, Sonora.\n7 - Franja Fronteriza Norte.\n8 - Franja Fronteriza Sur, Colindante con Guatemala.\n9 - Interior del País.\n10 - Municipio de Caborca, Sonora.\n11 - Región Fronteriza de Chetumal, en la localidad de Chetumal, en el Municipio de Othón P. Blanco, Quintana Roo.",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Validación de clave",
          description:
            "La clave de destino/origen debe existir en el Apéndice 15",
          llmAnalysis:
            "⚠️ La clave de destino/origen es '9', que corresponde a 'Interior del País'. Aunque la clave existe en el Apéndice 15, se debe verificar que este destino sea el apropiado para la operación. No hay evidencia suficiente para determinar si esta clave es adecuada en el contexto de la operación actual.",
          isCorrect: false,
          summary: "Advertencia en la validación de Validación de clave",
          actionsToTake: [
            {
              description:
                "Verificar si el destino declarado corresponde con la clave de destino/origen '9'.",
            },
          ],
          resources: [
            {
              link: "[Apéndice 15 del Anexo 22](None)",
            },
          ],
        },
        {
          name: "Coherencia con destino",
          description:
            "La clave debe ser coherente con el destino final declarado (ej: clave 9 para interior del país, 1 o 7 para frontera norte)",
          llmAnalysis:
            "⚠️ La clave '9' debe ser consistente con el destino final declarado. No tenemos el 'destino final' explícito, lo que impide una validación plena de coherencia. Se debe auditar el destino de la operación para asegurar cumplimiento con las reglas vigentes.",
          isCorrect: false,
          summary: "Advertencia en la validación de Coherencia con destino",
          actionsToTake: [
            {
              description:
                "Clarificar cuál es el destino final declarado y si se ajusta a la clave de destino/origen '9'.",
            },
          ],
          resources: [
            {
              link: "[Ley Aduanera](None)",
            },
          ],
        },
        {
          name: "Coherencia documental",
          description:
            "Los documentos de la operación deben ser consistentes con el destino/origen declarado",
          llmAnalysis:
            "❌ No se cuenta con los documentos que demuestren si la operación es consistente con el destino/origen declarado. La falta de dichos documentos representa un error grave, ya que puede implicar que la operación no cumple con los requisitos aduanales.",
          isCorrect: false,
          summary: "Error en la validación de Coherencia documental",
          actionsToTake: [
            {
              description:
                "Obtener y revisar toda la documentación relacionada con la operación para asegurarse de que es consistente con el destino/origen declarado.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](None)",
            },
          ],
        },
      ],
    },
    {
      name: "Operación (Fecha de entrada y Tipo de cambio)",
      isCorrect: false,
      fullContext: true,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Fecha de entrada",
              value: "12/08/2021",
            },
            {
              name: "Tipo de cambio",
              value: "20.1038",
            },
            {
              name: "Valor en dólares",
              value: "2920.82",
            },
            {
              name: "Valor aduana",
              value: "58721",
            },
            {
              name: "Precio pagado/valor comercial",
              value: "47848",
            },
            {
              name: "Valor Moneda de la Factura",
              value: "2380.0",
            },
            {
              name: "Factor Moneda de la Factura",
              value: "1.0",
            },
            {
              name: "Valor en Dólares",
              value: "2920.82",
            },
            {
              name: "Incrementables",
              value: "10873",
            },
            {
              name: "Decrementables",
              value: "0",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Documento de Transporte",
          data: [
            {
              name: "Fecha de entrada",
              value: "12/08/2021",
            },
            {
              name: "Incrementables",
              value: "10873",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Banxico",
          data: [
            {
              name: "Tipo de cambio DOF",
              value: "20.1038",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Entrada de mercancías en día hábil",
          description:
            "La entrada de mercancías deberá efectuarse en día hábil, si no es el caso el SAT debe emitir una autorización (Artículo 10 de la Ley Aduanera)",
          llmAnalysis:
            "✅ La entrada de mercancías se registró el 12/08/2021, que corresponde a un día hábil. No hay advertencias ni errores en este aspecto.",
          isCorrect: true,
          summary: "Validación correcta de Entrada de mercancías en día hábil",
          actionsToTake: [],
          resources: [
            {
              link: "[Ley Aduanera](https://www.diputados.gob.mx/LeyesBiblio/pdf/LAdua.pdf)",
            },
          ],
        },
        {
          name: "Coherencia de fecha de entrada",
          description:
            "La fecha de entrada del pedimento debe ser exactamente igual que la fecha de entrada del documento de transporte",
          llmAnalysis:
            "✅ Las fechas de entrada del pedimento y del documento de transporte coinciden (12/08/2021). No hay problemas en este aspecto.",
          isCorrect: true,
          summary: "Validación correcta de Coherencia de fecha de entrada",
          actionsToTake: [],
          resources: [
            {
              link: "[Ley Aduanera](None)",
            },
          ],
        },
        {
          name: "Tipo de cambio",
          description:
            "El tipo de cambio debe corresponder al publicado en el DOF del día hábil anterior a la fecha de entrada",
          llmAnalysis:
            "✅ El tipo de cambio registrado (20.1038) corresponde al publicado en el DOF y es adecuado para la fecha de entrada indicada. No se presentan errores.",
          isCorrect: true,
          summary: "Validación correcta de Tipo de cambio",
          actionsToTake: [],
          resources: [
            {
              link: "[DOF - Tipo de cambio](None)",
            },
          ],
        },
        {
          name: "Incrementables",
          description:
            "Los incrementables del pedimento deben coincidir exactamente con los incrementables del documento de transporte",
          llmAnalysis:
            "✅ Los incrementables del pedimento (10873) y del documento de transporte (10873) coinciden exactamente. No hay advertencias ni errores.",
          isCorrect: true,
          summary: "Validación correcta de Incrementables",
          actionsToTake: [],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](None)",
            },
          ],
        },
        {
          name: "Valores del pedimento",
          description:
            "Los valores declarados deben coincidir con los cálculos basados en el tipo de cambio.",
          llmAnalysis:
            "⚠️ Los valores declarados en el pedimento (Valor en dólares: 2920.82, Valor aduana: 58721, Precio pagado: 47848) deben ser verificados con los cálculos correspondientes basados en el tipo de cambio. Los cálculos inferidos (Valor en dólares calculado: 2380.0, Valor aduana calculado: 58720.044, Precio pagado calculado: 47847.044) presentan leves discrepancias y requieren revisión para asegurar que sean correctos.",
          isCorrect: false,
          summary: "Advertencia en la validación de Valores del pedimento",
          actionsToTake: [
            {
              description:
                "Revisar los valores declarados en el pedimento y compararlos con los cálculos basados en el tipo de cambio para corregir cualquier inconsistencia.",
            },
          ],
          resources: [
            {
              link: "[Ley Aduanera - Valor en Aduana](None)",
            },
          ],
        },
      ],
    },
    {
      name: "Pesos y Bultos",
      isCorrect: false,
      fullContext: false,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Peso bruto",
              value: "19.5",
            },
            {
              name: "Números de bultos",
              value: "",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Documento de Transporte",
          data: [
            {
              name: "Peso bruto",
              value: "19.5",
            },
            {
              name: "Número de bultos",
              value: "",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Factura",
          data: [
            {
              name: "Peso neto total",
              value: "0.0",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Validación de pesos",
          description:
            "El peso neto total debe ser menor que el peso bruto declarado tanto en el pedimento como en el documento de transporte",
          llmAnalysis:
            "⚠️ El peso neto total es 0.0 según el documento de la factura. Esto significa que no hay datos suficientes para cumplir con la validación, ya que el peso neto debería ser menor que el peso bruto declarado (19.5). La falta de información limita la capacidad de análisis.",
          isCorrect: false,
          summary: "Advertencia en la validación de Validación de pesos",
          actionsToTake: [
            {
              description:
                "Solicitar la verificación del peso neto en la factura para asegurar que se tenga un valor diferente a cero.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](None)",
            },
          ],
        },
        {
          name: "Coincidencia de peso bruto",
          description:
            "El peso bruto declarado en el pedimento debe coincidir exactamente con el declarado en el documento de transporte",
          llmAnalysis:
            "✅ El peso bruto en el pedimento y el documento de transporte coinciden, ambos reportan un peso bruto de 19.5. Esta validación fue correcta.",
          isCorrect: true,
          summary: "Validación correcta de Coincidencia de peso bruto",
          actionsToTake: [],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](None)",
            },
          ],
        },
        {
          name: "Coincidencia de bultos",
          description:
            "El número total de bultos debe coincidir entre el pedimento y el documento de transporte",
          llmAnalysis:
            "⚠️ No es posible determinar la coincidencia de bultos debido a que el número de bultos en el pedimento y el documento de transporte no se proporciona. Esto resulta en una falta de información para esta validación.",
          isCorrect: false,
          summary: "Advertencia en la validación de Coincidencia de bultos",
          actionsToTake: [
            {
              description:
                "Solicitar información sobre el número de bultos en ambos documentos para completar esta validación.",
            },
          ],
          resources: [
            {
              link: "[Reglamento de la Ley Aduanera](None)",
            },
          ],
        },
      ],
    },
    {
      name: "Datos de Factura",
      isCorrect: false,
      fullContext: false,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "RFC importador",
              value: "SAA200430EUA",
            },
            {
              name: "Domicilio fiscal",
              value:
                "AV. EBANO No. 301 Int. B LOS CEDROS CP. 42033 PACHUCA Hidalgo MEXICO (ESTADOS UNIDOS MEXICANOS)",
            },
            {
              name: "Razón social",
              value: "ACUSE LC",
            },
            {
              name: "Fecha de emisión",
              value: "20/08/2021",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Factura",
          data: [
            {
              name: "Datos del proveedor",
              value: "",
              // value: {
              //   nombre: "ANDERSON AMERICA",
              //   tax_id: "561893440",
              //   domicilio: {
              //     street: "SOUTHERN LOOP BLVD",
              //     number: "10620",
              //     zip_code: "28134",
              //     city: "PINEVILLE",
              //     state: "PINEVILLE",
              //     country: "ESTADOS UNIDOS DE AMERICA",
              //   }
              // },
            },
            {
              name: "Datos del importador",
              value: "",
              // value: {
              //   nombre: "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR SA DE CV",
              //   tax_id: "SAA200430EUA",
              //   domicilio: {
              //     street: "EBANO",
              //     number: "301",
              //     zip_code: "42033",
              //     colony: "LOS CEDROS",
              //     state: "HIDALGO",
              //     country: "MEXICO",
              //   },
              // },
            },
            {
              name: "Datos del consignatario",
              value: "",
              // value: {
              //   nombre: "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR SA DE CV",
              //   domicilio: {
              //     street: "EBANO",
              //     number: "301",
              //     zip_code: "42033",
              //     colony: "LOS CEDROS",
              //     state: "HIDALGO",
              //     country: "MEXICO",
              //   },
              // },
            },
            {
              name: "Fecha de emisión",
              value: "20/08/2021",
            },
            {
              name: "Número de folio",
              value: "",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "COVE",
          data: [
            {
              name: "Datos comerciales",
              value: "",
              // value: {
              //   fecha: "2021-08-11",
              //   folio: "COVE214J371P6",
              //   descripcion: "PIÑON",
              //   valor_total: 656.0,
              // },
            },
            {
              name: "Descripción de mercancías",
              value: "PIÑON",
            },
            {
              name: "Números de serie",
              value: "",
            },
            {
              name: "RFC importador",
              value: "SAA200430EUA",
            },
            {
              name: "Fecha de emisión",
              value: "20/08/2021",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Cesión de Derechos",
          data: [
            {
              name: "Existe documento",
              value: "",
            },
            {
              name: "Datos de comercializadora",
              value: "",
            },
            {
              name: "Fecha de emisión",
              value: "20/08/2021",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Carta 3.1.8",
          data: [
            {
              name: "RFC importador",
              value: "SAA200430EUA",
            },
            {
              name: "Valor de mercancías",
              value: "",
            },
            {
              name: "Incoterm",
              value: "",
            },
            {
              name: "Descripción de mercancías",
              value: "PIÑON",
            },
            {
              name: "Fecha de emisión",
              value: "20/08/2021",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Validación de cesión de derechos y carta 3.1.8",
          description:
            "Cuando existe cesión de derechos, los datos del importador deben coincidir con los de la comercializadora. Sin cesión, deben coincidir con el consignatario de la factura. La carta 3.1.8 tiene precedencia sobre la factura en todas las validaciones.",
          llmAnalysis:
            "⚠️ No se proporcionó información sobre si existe un documento de cesión de derechos. Sin embargo, se observó que los datos del importador no coinciden con los de la comercializadora. Se debe revisar si hay una cesión de derechos válida y si corresponde con los datos del consignatario de la factura.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Validación de cesión de derechos y carta 3.1.8",
          actionsToTake: [
            {
              description:
                "Obtener y revisar el documento de cesión de derechos para verificar su validez y la coincidencia de los datos.",
            },
          ],
          resources: [
            {
              link: "[Regla 3.1.8 RGCE](None)",
            },
          ],
        },
        {
          name: "Validación de datos del importador/exportador",
          description:
            "El RFC, domicilio fiscal y razón social del importador deben ser idénticos en pedimento, factura/carta 3.1.8 y COVE. El RFC debe corresponder a una persona física o moral existente. Las discrepancias en estos datos son consideradas inconsistencias críticas.",
          llmAnalysis:
            "⚠️ Hay discrepancias en los datos del importador. El RFC proporcionado se encuentra como coincidente, pero no se valida completamente el domicilio fiscal ni la razón social en todos los documentos. Por lo tanto, se requiere verificar si hay inconsistencias adicionales.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Validación de datos del importador/exportador",
          actionsToTake: [
            {
              description:
                "Verificar que todos los datos del importador coincidan entre el pedimento, la factura y la carta 3.1.8 para evitar inconsistencias críticas.",
            },
          ],
          resources: [],
        },
        {
          name: "Validación de datos comerciales y del proveedor",
          description:
            "Los datos del proveedor deben coincidir exactamente entre factura y COVE. Con comercializadora, sus datos deben coincidir con el documento de cesión. Las fechas de emisión y números de folio deben ser coherentes entre documentos.",
          llmAnalysis:
            "⚠️ No se proporcionaron datos sobre la validez exacta y comparativa entre los documentos. Se requiere que los datos del proveedor coincidan exactamente entre la factura y la COVE, lo cual no se valida. La fecha de emisión y los números de folio deben ser coherentes y no se pudo corroborar esta información.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Validación de datos comerciales y del proveedor",
          actionsToTake: [
            {
              description:
                "Confirmar y comparar los datos del proveedor entre la factura y la COVE, y verificar la coherencia de las fechas de emisión y los números de folio.",
            },
          ],
          resources: [],
        },
        {
          name: "Validación de campos multables",
          description:
            "Los campos entre COVE y factura/carta 3.1.8 deben coincidir: datos básicos (fecha, folio), valores (unitario, total, dólares), mercancía (descripción, cantidad, unidad) y datos de identificación individual cuando aplique (series, marca, modelo). La información debe ser idéntica en todos los documentos.",
          llmAnalysis:
            "⚠️ Los datos básicos como fecha y folio no están completamente validados en todos los documentos. También se advirtió que la descripción de mercancías en varios documentos es coincidente, pero no se puede validar totalmente por falta de información. Esto requiere atención.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Validación de campos multables",
          actionsToTake: [
            {
              description:
                "Revisar y validar todos los campos (fecha, folio, valor y descripción) para comprobar la coincidencia en COVE y la factura, asegurándose de que sean idénticos.",
            },
          ],
          resources: [],
        },
      ],
    },
    {
      name: "Datos de Transporte",
      isCorrect: false,
      fullContext: false,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "Clave del medio de transporte",
              value: "4",
            },
            {
              name: "Peso bruto del pedimento",
              value: "19.0",
            },
            {
              name: "Número de bultos del pedimento",
              value: "1",
            },
            {
              name: "Número de guía o embarque",
              value: "2W646MHPPF",
            },
          ],
        },
        {
          type: "PROVIDED",
          origin: "Documento de Transporte",
          data: [
            {
              name: "Modalidad",
              value: "AIR",
            },
            {
              name: "Peso bruto del documento de transporte",
              value: "19.5",
            },
            {
              name: "Número de bultos del documento de transporte",
              value: "",
            },
            {
              name: "Número de contenedor, placa o master y house",
              value: "40600231954",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Apéndice 3",
          data: [
            {
              name: "Medio de transporte",
              value: "Aéreo",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Medio de transporte",
          description:
            "La modalidad del documento de transporte y el medio de transporte del apéndice 3 deben tener coherencia entre sí.",
          llmAnalysis:
            "⚠️ La modalidad del documento de transporte es 'AIR' y el medio de transporte del apéndice 3 es 'Aéreo', lo que genera una coherencia. Sin embargo, sería útil asegurar que ambos términos son equivalentes, dado que 'AIR' puede interpretarse de manera diferente en otro contexto. Se debe verificar el entendimiento específico de las nomenclaturas para prevenir contaminación.",
          isCorrect: true,
          summary: "Advertencia en la validación de Medio de transporte",
          actionsToTake: [],
          resources: [
            {
              link: "[Documento de Transporte](None)",
            },
          ],
        },
        {
          name: "Peso bruto",
          description:
            "El peso bruto del pedimento debe ser exactamente igual al peso bruto del documento de transporte.",
          llmAnalysis:
            "❌ El peso bruto del pedimento es 19.0 y el peso bruto del documento de transporte es 19.5, lo que significa que no son iguales. Esto representa un error grave que debe ser corregido.",
          isCorrect: false,
          summary: "Error en la validación de Peso bruto",
          actionsToTake: [
            {
              description:
                "Revisar la calibración y documentación del peso en el pedimento y el documento de transporte para determinar el origen de la discrepancia.",
            },
          ],
          resources: [],
        },
        {
          name: "Número de bultos",
          description:
            "El número de bultos del pedimento debe ser exactamente igual al número de bultos del documento de transporte.",
          llmAnalysis:
            "⚠️ El número de bultos del pedimento es '1', pero el número de bultos del documento de transporte no fue proporcionado. Sin esta información, no es posible validar si ambos números coinciden, lo que genera una advertencia de falta de datos.",
          isCorrect: false,
          summary: "Advertencia en la validación de Número de bultos",
          actionsToTake: [
            {
              description:
                "Obtener el número de bultos del documento de transporte para poder realizar una comparación adecuada.",
            },
          ],
          resources: [],
        },
        {
          name: "Número de guía o embarque",
          description:
            "El número de guía o embarque del pedimento debe ser exactamente igual al número de contenedor, placa o master y house del documento de transporte, cualquier discrepancia es un error.",
          llmAnalysis:
            "❌ El número de guía o embarque del pedimento es '2W646MHPPF', mientras que el número de contenedor, placa o master y house del documento de transporte es '40600231954'. Estas dos informaciones no coinciden, lo que representa un error claro que debe ser abordado.",
          isCorrect: false,
          summary: "Error en la validación de Número de guía o embarque",
          actionsToTake: [
            {
              description:
                "Verificar la documentación para asegurarse de que el número de guía o embarque y el número de contenedor, placa o master y house sean consistentes.",
            },
          ],
          resources: [],
        },
      ],
    },
    {
      name: "Partidas",
      isCorrect: false,
      fullContext: false,
      context: [
        {
          type: "PROVIDED",
          origin: "Pedimento",
          data: [
            {
              name: "IVA",
              value: "16.0",
            },
            {
              name: "IEPS",
              value: "0",
            },
            {
              name: "IGI",
              value: "10.0",
            },
            {
              name: "Fracción arancelaria",
              value: "84836099",
            },
            {
              name: "Unidad de Medida Comercial (UMC)",
              value: "6",
            },
            {
              name: "Cantidad en la Unidad de Medida Comercial (UMC)",
              value: "2.0",
            },
            {
              name: "Unidad de Medida de Tarifa (UMT)",
              value: "1",
            },
            {
              name: "Cantidad en la Unidad de Medida de Tarifa (UMT)",
              value: "2.2",
            },
            {
              name: "Valor aduana",
              value: "2869",
            },
            {
              name: "Precio unitario",
              value: "6594.0",
            },
          ],
        },
        {
          type: "EXTERNAL",
          origin: "Taxfinder",
          data: [
            {
              name: "IVA",
              value: "16.0",
            },
            {
              name: "IEPS",
              value: "0",
            },
            {
              name: "IGI",
              value: "10.0",
            },
            {
              name: "Regulaciones arancelarias",
              value: "",
            },
            {
              name: "Regulaciones no arancelarias",
              value: "No aplican.",
            },
            {
              name: "Unidad de Medida de Tarifa (UMT) según la TIGIE",
              value: "",
            },
          ],
        },
      ],
      validations: [
        {
          name: "Validación de unidades de medida",
          description:
            "Verificar que las cantidades declaradas en UMC y UMT están correctamente convertidas y corresponden a la unidad de medida de tarifa según la TIGIE.",
          llmAnalysis:
            "⚠️ Al verificar las cantidades declaradas en UMC (Cantidad en la Unidad de Medida Comercial) y UMT (Cantidad en la Unidad de Medida de Tarifa), se observa que la Unidad de Medida de Tarifa (UMT) según la TIGIE no fue proporcionada. Esto implica que no se pueden validar completamente las conversiones y corresponde a las unidades de medida aplicables. Se recomienda obtener la información de la UMT según la TIGIE para una validación precisa.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Validación de unidades de medida",
          actionsToTake: [
            {
              description:
                "Obtener la Unidad de Medida de Tarifa (UMT) según la TIGIE para revisar las conversiones.",
            },
          ],
          resources: [],
        },
        {
          name: "Cálculo de contribuciones",
          description:
            "Asegurarse de que los valores de IVA, IEPS e IGI están correctamente calculados con base en los valores aduana y las tasas aplicables.",
          llmAnalysis:
            "✅ Los valores de IVA (16.0), IEPS (0), e IGI (10.0) se presentan con tasas aplicables que corresponden a los valores aduana y se consideran correctos según la información proporcionada con relación a los impuestos comunes en el contexto fiscal.",
          isCorrect: true,
          summary: "Validación correcta de Cálculo de contribuciones",
          actionsToTake: [],
          resources: [],
        },
        {
          name: "Cumplimiento de regulaciones",
          description:
            "Analizar las regulaciones arancelarias y no arancelarias en busca de potenciales problemas que podrían hacer errónea la interpretación hasta ahora, si aplica. Si no hay nada fuera de lo común, es correcto.",
          llmAnalysis:
            "⚠️ Las regulaciones no arancelarias especificadas indican que 'No aplican' y, aunque no se identificaron problemas significativos, la falta de contexto sobre las regulaciones específicas podría dificultar una evaluación exhaustiva. Sin un análisis más detallado de regulaciones específicas requieren más información para un cumplimiento completo.",
          isCorrect: false,
          summary:
            "Advertencia en la validación de Cumplimiento de regulaciones",
          actionsToTake: [
            {
              description:
                "Solicitar información adicional sobre regulaciones no arancelarias que puedan ser relevantes para el pedimento.",
            },
          ],
          resources: [],
        },
      ],
    },
  ],
  files: [
    {
      name: "TRANSPORTE",
      url: "https://drive.google.com/file/d/1Gjq-L3_GK7XFkqNhiNRQQWQT5mWpsZOF/preview",
    },
    {
      name: "CESIÓN DE DERECHOS",
      url: "https://drive.google.com/file/d/1V1NqXOKdDbqCVfe4N_Y9sO7EJ8DUofm3/preview",
    },
    {
      name: "PEDIMENTO",
      url: "https://drive.google.com/file/d/1_MPjjVK1TgmZISo29rx5_3XkWjo1Ub1j/preview",
    },
    {
      name: "E-NOM",
      url: "https://drive.google.com/file/d/1CEdjGzHD7ZZg5uTLcVLIKv__D2-R7ngr/preview",
    },
    {
      name: "CARTA 3.1.8",
      url: "https://drive.google.com/file/d/1QLYUVE1KEv5CnefU5JSZK-78o0W9uDQ1/preview",
    },
    {
      name: "COVE",
      url: "https://drive.google.com/file/d/1kGQMf4l-O1sYCusB863k5yDPoituPmuS/preview",
    },
  ],
  alerts: [
    {
      type: "HIGH",
      description: "Año del pedimento",
    },
    {
      type: "HIGH",
      description: "Coherencia documental",
    },
    {
      type: "HIGH",
      description: "Número de guía o embarque",
    },
    {
      type: "HIGH",
      description: "Peso bruto",
    },
    {
      type: "MEDIUM",
      description: "Coherencia con destino",
    },
    {
      type: "MEDIUM",
      description: "Coherencia con origen/destino",
    },
    {
      type: "MEDIUM",
      description: "Coincidencia de bultos",
    },
    {
      type: "MEDIUM",
      description: "Cumplimiento de regulaciones",
    },
    {
      type: "MEDIUM",
      description: "Medio de transporte",
    },
    {
      type: "MEDIUM",
      description: "Número de bultos",
    },
    {
      type: "MEDIUM",
      description: "Validación de campos multables",
    },
    {
      type: "MEDIUM",
      description: "Validación de cesión de derechos y carta 3.1.8",
    },
    {
      type: "MEDIUM",
      description: "Validación de clave",
    },
    {
      type: "MEDIUM",
      description: "Validación de datos comerciales y del proveedor",
    },
    {
      type: "MEDIUM",
      description: "Validación de datos del importador/exportador",
    },
    {
      type: "MEDIUM",
      description: "Validación de pesos",
    },
    {
      type: "MEDIUM",
      description: "Validación de régimen",
    },
    {
      type: "MEDIUM",
      description: "Validación de unidades de medida",
    },
    {
      type: "MEDIUM",
      description: "Valores del pedimento",
    },
  ],
};

export const ANOTHER_VICTOR_GLOSS_EXAMPLE = {
  importer_name: "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV",
  summary:
    "Se encontraron 4 errores críticos, 7 advertencias y 0 observaciones menores.\n\nLa operación se trata de una importación definitiva a México, identificada con el tipo de operación 'IMP' y la clave de pedimento 'A1'. Aunque la longitud del número de pedimento es correcta, hay un error en el año, lo que podría implicar problemas de validación. El destino de la mercancía es correcto, sin errores en su designación como 'Interior del País'. Sin embargo, hay áreas que requieren atención inmediata: el valor en dólares del pedimento presenta errores significativos en relación con los incrementales y la factura, lo que sugiere una revisión de cálculos. La falta de peso neto impide una validación completa, mientras que el peso bruto presenta una discrepancia menor que debe investigarse. En cuanto a los datos de la factura, hay errores críticos, como la falta de fechas, monedas y otros datos comerciales esenciales, que son necesarios para una validación adecuada. En el transporte, hay discrepancias en la clave de tipo y en el número de guía, requiriendo corrección. Finalmente, las partidas presentan incoherencias en peso, permisos, y regulaciones arancelarias, lo que demanda una revisión exhaustiva para asegurar el cumplimiento.",
  metrics: [
    {
      time_saved: 30,
      money_saved: 0,
    },
  ],
  pedimento: [
    {
      pediment_number: {
        name: "N° de pedimento",
        is_correct: false,
        context: [
          {
            full_context: true,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Número de pedimento",
                    value: "214737091001023",
                  },
                ],
              },
            ],
            inferred_context: [
              {
                id: 1,
                origin: "Pedimento",
                data: [
                  {
                    id: 1,
                    name: "Número de dígitos",
                    value: 15,
                  },
                  {
                    id: 2,
                    name: "Año del pedimento",
                    value: "2021",
                  },
                  {
                    id: 3,
                    name: "Año actual",
                    value: "2025",
                  },
                ],
              },
            ],
            external_context: [],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Longitud",
            description: "El número de pedimento debe contar con 15 dígitos",
            llm_analysis:
              '⚠️ El número de pedimento "214737091001023" tiene 15 dígitos, lo cual coincide con el requisito. Sin embargo, dado que no se puede comparar con otros datos, se sugiere revisar la validez de los dígitos.',
            is_correct: true,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Confirmar con la fuente de datos que 214737091001023 es un número de pedimento válido.",
              },
            ],
            resources: [
              {
                id: 1,
                name: "Reglamento de la Ley Aduanera",
                url: "https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf",
              },
              {
                id: 2,
                name: "Documento de Pedimento",
                url: null,
              },
            ],
          },
          {
            id: 2,
            name: "Año del pedimento",
            description:
              "El año del pedimento (inferido por los dígitos 1 y 2 del número del pedimento) debe ser iguales al año actual",
            llm_analysis:
              '❌ El año inferido del número de pedimento es "21", que corresponde a 2021, pero el año actual es 2025. Esto representa una discrepancia clara en la validez del pedimento.',
            is_correct: false,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Modificar el número de pedimento para que refleje el año actual o proporcionar una justificación para la discrepancia.",
              },
            ],
            resources: [
              {
                id: 1,
                name: "Reglamento de la Ley Aduanera",
                url: "https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LAdua.pdf",
              },
              {
                id: 2,
                name: "Documento de Pedimento",
                url: null,
              },
            ],
          },
        ],
        summary:
          "Se encontraron advertencias y un error en los validation_steps. La longitud del número de pedimento es correcta, aunque se recomienda confirmar su validez. Sin embargo, hay un error en el año del pedimento ya que no coincide con el año actual.",
      },
    },
    {
      operation_type: {
        name: "Tipo de Operación",
        is_correct: true,
        context: [
          {
            full_context: true,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Tipo de Operación",
                    value: "IMP",
                  },
                  {
                    id: 2,
                    name: "Clave de Pedimento",
                    value: "A1",
                  },
                  {
                    id: 3,
                    name: "Régimen",
                    value: "IMD",
                  },
                ],
              },
              {
                id: 2,
                origin: "Documento de Transporte",
                document_summary:
                  "Este documento de transporte es una guía aérea que detalla la información de un envío de partes de CNC, específicamente un engranaje de piñón, desde Estados Unidos a México. El remitente es Anderson America, ubicado en Pineville, Carolina del Norte, y el consignatario es Mariano Rosas Amador, en Tlalnepantla, México. El envío consta de un bulto con un valor declarado de 2380.00 USD y un peso de 19.50 kg. El envío fue realizado el 11 de agosto de 2021 y llegó a su destino el 12 de agosto de 2021. La guía de transporte incluye un número de seguimiento y está bajo los términos de facturación no especificados. La revalidación del envío fue realizada por Gamas Livia, y el documento fue impreso el 19 de agosto de 2021.",
                data: [
                  {
                    id: 1,
                    name: "País de origen",
                    value: "USA",
                  },
                  {
                    id: 2,
                    name: "País de destino",
                    value: "MEX",
                  },
                ],
              },
            ],
            inferred_context: [
              {
                id: 1,
                origin: "Análisis",
                data: [
                  {
                    id: 1,
                    name: "Tipo de operación esperado",
                    value: "IMP",
                  },
                ],
              },
            ],
            external_context: [
              {
                id: 1,
                origin: "Apéndice 2",
                data: [
                  {
                    id: 1,
                    name: "Claves de pedimento válidas",
                    value:
                      "A1 - Importación o exportación definitiva.\nSupuestos de aplicación:\nI. Entrada de mercancías de procedencia extranjera para permanecer en territorio nacional por tiempo ilimitado.\nII. Salida de mercancías del territorio nacional para permanecer en el extranjero por tiempo ilimitado.\nIII. Importación definitiva de vehículos por misiones diplomáticas, consulares y oficinas de organismos internacionales, y su personal extranjero.\nIV. Importación definitiva de vehículos nuevos y usados.\nV. Retorno de envases y empaques, etiquetas y folletos importados temporalmente al amparo de un Programa IMMEX.\nVI. Importación definitiva de mercancías que se retiren de recinto fiscalizado estratégico, colindante con la aduana.\nVII. Exportación definitiva de mercancías que se retiren de recinto fiscalizado estratégico colindante o no colindante con la aduana.\nA3 - Regularización de mercancías (importación definitiva).\nSupuestos de aplicación:\nI. Mercancías que se encuentran en territorio nacional sin haber cumplido con las formalidades del despacho aduanero.\nII. Mercancías que hubieran ingresado a territorio nacional bajo el régimen de importación temporal cuyo plazo hubiera vencido.\nIII. Maquinaria o equipo que no cuente con la documentación necesaria para acreditar su legal importación.\nIV. Mercancías a que se refiere el artículo 108, fracción III de la Ley.\nV. Vehículos de prueba que ingresaron a depósito fiscal por empresas de la industria automotriz terminal.\nVI. Mercancía excedente o no declarada en el pedimento de introducción a depósito fiscal.\nVII. Importación definitiva de mercancías robadas.\nVIII. Importación definitiva de mercancía importada al amparo de un Cuaderno ATA.\nIX. Importación de contenedores y carros de ferrocarril dañados.\nX. Mercancías que hubieran ingresado a territorio nacional bajo el régimen de recinto fiscalizado estratégico cuyo plazo hubiera vencido.\nC1 - Importación definitiva a la franja fronteriza norte y región fronteriza.\nSupuestos de aplicación:\nI. Importación definitiva de mercancías al amparo del 'Decreto de la zona libre de Chetumal'.\nII. Empresas que se dedican al desmantelamiento de vehículos automotores usados.\nIII. Mercancías destinadas a la franja fronteriza norte y región fronteriza por empresas autorizadas.\nD1 - Retorno por sustitución.\nSupuestos de aplicación:\nI. Retorno al país o al extranjero por sustitución de mercancías defectuosas.\nGC - Global complementario.\nSupuestos de aplicación:\nI. Ajuste de valor anual en pedimentos de importación definitiva.\nII. Ajuste de valor derivado de las facultades de comprobación.\nIII. Ajuste de valor anual en pedimentos de exportación definitiva.\nIV. Ajuste de valor derivado de las facultades de comprobación.\nK1 - Desistimiento de régimen y retorno de mercancías por devolución.\nSupuestos de aplicación:\nI. Retorno de mercancías exportadas definitivamente en un lapso no mayor de un año.\nII. Para retornar mercancías que se encuentren en depósito ante aduana.\nIII. Desistimiento total o parcial del régimen de exportación.\nL1 - Pequeña importación definitiva.\nSupuestos de aplicación:\nI. Pequeña importación comercial en cruces fronterizos.\nII. Pequeña importación de mercancías por personas físicas que tributen en los términos del Título IV, Capítulo II.\nIII. Importación de mercancías de personas que no excedan el valor de 3,000 dólares.\nIV. Pequeña exportación en cruces fronterizos.\nP1 - Reexpedición de mercancías de franja fronteriza.\nSupuestos de aplicación:\nI. Mercancía que fue importada definitivamente a región fronteriza o franja fronteriza norte.\nS2 - Importación y exportación de mercancías para retornar en su mismo estado.\nSupuestos de aplicación:\nI. Importación de mercancías para retornar en su mismo estado.\nII. Exportación de mercancías importadas con esta clave de documento.\nT1 - Importación y exportación por empresas de mensajería y paquetería.\nSupuestos de aplicación:\nI. Importación y exportación definitiva de mercancías por empresas de mensajería y paquetería.\nVF - Importación definitiva de vehículos usados a la franja o región fronteriza norte.\nSupuestos de aplicación:\nI. Importación definitiva de vehículos usados de conformidad con la regla 3.5.6.\nVU - Importación definitiva de vehículos usados.\nSupuestos de aplicación:\nI. Importación definitiva de vehículos de conformidad con la regla 3.5.5.\nAD - Importación temporal de mercancías destinadas a convenciones y congresos internacionales.\nSupuestos de aplicación:\nCuando se expongan al público en general y se difundan a través de los principales medios de comunicación, así como sus muestras y muestrarios.\nAJ - Importación y exportación temporal de envases de mercancías.\nSupuestos de aplicación:\nImportación temporal de envases de mercancías, siempre que contengan en territorio nacional las mercancías que en ellos se hubieran introducido al país.\nExportación temporal de envases de mercancías.\nBA - Importación y exportación temporal de bienes para ser retornados en su mismo estado.\nSupuestos de aplicación:\nImportación temporal de bienes realizada por residentes en el extranjero sin establecimiento permanente en México.\nExportación temporal realizada por residentes en México sin establecimiento permanente en el extranjero.\nExportación temporal de ganado.\nImportación temporal de menajes de casa.\nImportación temporal de maquinaria y equipo.\nBB - Exportación, importación y retornos virtuales.\nSupuestos de aplicación:\nExportación definitiva virtual de mercancía nacional (productos terminados) que enajenen residentes en el país a recinto fiscalizado.\nExportación definitiva virtual de mercancía nacional a depósito fiscal.\nExportación (retorno) virtual de mercancías que hubieran ingresado a territorio nacional bajo el régimen de importación temporal.\nExportación definitiva virtual de mercancía importada temporalmente con anterioridad.\nBC - Importación y exportación temporal de mercancías destinadas a eventos culturales o deportivos e investigación.\nSupuestos de aplicación:\nPara eventos culturales o deportivos patrocinados por entidades públicas.\nPara fines de investigación que importen organismos públicos nacionales y extranjeros.\nBD - Importación y exportación temporal de equipo para filmación.\nSupuestos de aplicación:\nImportación y exportación temporal de enseres, utilería y demás equipo necesario para la filmación.\nBE - Importación y exportación temporal de vehículos de prueba.\nSupuestos de aplicación:\nImportación y exportación temporal de vehículos de prueba por un fabricante autorizado residente en México.\nBF - Exportación temporal de mercancías destinadas a exposiciones, convenciones o eventos culturales o deportivos.\nSupuestos de aplicación:\nPara mercancía destinada a exposiciones, convenciones o eventos culturales o deportivos.\nBH - Importación temporal de contenedores, aviones, helicópteros, embarcaciones y carros de ferrocarril.\nSupuestos de aplicación:\nContenedores, embarcaciones, aviones, helicópteros y carros de ferrocarril.\nMercancías destinadas para mantenimiento o reparación.\nBI - Importación temporal.\nSupuestos de aplicación:\nMercancías previstas por convenios internacionales y uso oficial de misiones diplomáticas.\nBM - Exportación temporal de mercancías para su transformación, elaboración o reparación.\nSupuestos de aplicación:\nExportación temporal de mercancías nacionales o nacionalizadas para su transformación en el extranjero.\nBO - Exportación temporal para reparación o sustitución y retorno al país.\nSupuestos de aplicación:\nExportación temporal de mercancías de activo fijo para reparación o sustitución.\nBP - Importación y exportación temporal de muestras o muestrarios.\nSupuestos de aplicación:\nMuestras y muestrarios destinados a dar a conocer mercancía.\nBR - Exportación temporal y retorno de mercancías fungibles.\nSupuestos de aplicación:\nMercancías fungibles que cuenten con opinión de la SE para la exportación temporal.\nH1 - Retorno de mercancías en su mismo estado.\nSupuestos de aplicación:\nRetorno de importación y exportación de mercancías en el mismo estado.\nH8 - Retorno de envases.\nSupuestos de aplicación:\nAl territorio nacional de los envases exportados temporalmente.\nAl extranjero de envases que fueron importados temporalmente.\nI1 - Importación, exportación y retorno de mercancías elaboradas, transformadas o reparadas.\nSupuestos de aplicación:\nImportación definitiva de mercancías terminadas que se incorporaron productos exportados temporalmente.\nF4 - Cambio de régimen de insumos o de mercancía exportada temporalmente.\nSupuestos de aplicación:\nImportación temporal a definitiva de mercancía sujeta a transformación.\nExportación temporal a definitiva virtual de mercancías.\nF5 - Cambio de régimen de mercancías de importación temporal a definitiva.\nSupuestos de aplicación:\nImportación temporal a definitiva de bienes de activo fijo por parte de empresas con Programa IMMEX.\nIN - Importación temporal de bienes que serán sujetos a transformación, elaboración o reparación.\nSupuestos de aplicación:\nMercancía destinada a un proceso de elaboración, transformación o reparación, que formen parte del programa autorizado a empresas con Programa IMMEX.\nRetorno al país de mercancía elaborada, transformada o reparada que haya sido rechazada en el extranjero por haber resultado defectuosa o de especificaciones distintas a las convenidas por parte de empresas con Programa IMMEX, en el plazo de un año y siempre que no hayan sido objeto de modificaciones.\nAF - Importación temporal de bienes de activo fijo.\nSupuestos de aplicación:\nMercancías señaladas en el artículo 108, fracción III de la Ley.\nRT - Retorno de mercancías.\nSupuestos de aplicación:\nRetorno al extranjero de mercancía transformada, elaborada o reparada al amparo de un Programa IMMEX.\nRetorno de mercancías extranjeras en su mismo estado, excepto cuando se trate del retorno de envases y empaques, etiquetas y folletos importados temporalmente al amparo de un Programa IMMEX, que se utilicen en la exportación de mercancía nacional, para lo cual deberán utilizar la clave de documento A1.\nRetorno de opciones especiales, incorporadas en vehículos exportados por la industria automotriz terminal o manufacturera de vehículos de autotransporte, al amparo de un Programa IMMEX.\nA4 - Introducción para depósito fiscal (AGD).\nE1 - Extracción de depósito fiscal de bienes que serán sujetos a transformación, elaboración o reparación (AGD).\nE2 - Extracción de depósito fiscal de bienes de activo fijo (AGD).\nG1 - Extracción de depósito fiscal (AGD).\nC3 - Extracción de depósito fiscal de franja o región fronteriza (AGD).\nK2 - Extracción de depósito fiscal por desistimiento o transferencias (AGD).\nA5 - Introducción a depósito fiscal en local autorizado.\nE3 - Extracción de depósito fiscal en local autorizado (insumos).\nE4 - Extracción de depósito fiscal en local autorizado (activo fijo).\nG2 - Extracción de depósito fiscal en local autorizado para su importación definitiva.\nK3 - Extracción de depósito fiscal en local autorizado para retorno o transferencia.\nF2 - Introducción a depósito fiscal (IA).\nF3 - Extracción de depósito fiscal (IA).\nV3 - Extracción de depósito fiscal de bienes para su retorno o exportación virtual (IA).\nV4 - Retorno virtual derivado de la constancia de transferencia de mercancías (IA).\nF8 - Introducción y extracción de depósito fiscal de mercancías nacionales o nacionalizadas en tiendas libres de impuestos (Duty Free).\nF9 - Introducción y extracción de depósito fiscal de mercancías extranjeras para exposición y venta de mercancías en tiendas libres de impuestos (Duty Free).\nG6 - Informe de extracción de depósito fiscal de mercancías nacionales o nacionalizadas vendidas en tiendas libres de impuestos (Duty Free).\nG7 - Informe de extracción de depósito fiscal de mercancías extranjeras vendidas en tiendas libres de impuestos (Duty Free).\nV8 - Transferencia de mercancías en depósito fiscal para la exposición y venta de mercancías extranjeras, nacionales y nacionalizadas de tiendas libres de impuestos (Duty Free).",
                  },
                ],
              },
              {
                id: 2,
                origin: "Apéndice 16",
                data: [
                  {
                    id: 1,
                    name: "Regímenes válidos",
                    value:
                      "IMD - Definitivo de importación.\n\nITR - Temporales de importación para retornar al extranjero en el mismo estado.\n\nITE - Temporales de importación para elaboración, transformación o reparación para empresas con programa IMMEX.\n\nDFI - Depósito fiscal.\n\nRFE - Elaboración, transformación o reparación en recinto fiscalizado.\n",
                  },
                ],
              },
            ],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Coherencia con origen/destino",
            description:
              "El tipo de operación debe ser consistente con el origen y destino de las mercancías, es decir IMP (importación) si destino es México, si no se pueden determinar los datos de origen y destino, ignorar y marcar como correcto.",
            llm_analysis:
              "✅ El tipo de operación es 'IMP', que corresponde a una importación, y el país de destino es 'MEX' (México), lo cual es consistente. No hay advertencias ni errores.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Ley Aduanera",
                url: null,
              },
            ],
          },
          {
            id: 2,
            name: "Validación de clave de pedimento",
            description:
              "La clave de pedimento debe ser válida para el tipo de operación según el Apéndice 2",
            llm_analysis:
              "✅ La clave de pedimento es 'A1'. Según el Apéndice 2, 'A1' es válida para importaciones definitivas, que corresponde al tipo de operación 'IMP'. No hay advertencias ni errores.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Apéndice 2 del Anexo 22",
                url: null,
              },
            ],
          },
          {
            id: 3,
            name: "Validación de régimen",
            description:
              "El régimen debe ser válido para el tipo de operación según el Apéndice 16",
            llm_analysis:
              "✅ El régimen es 'IMD', que según el Apéndice 16 es válido para importación definitiva (IMD). Consistente con el tipo de operación 'IMP'. No hay advertencias ni errores.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Apéndice 16 del Anexo 22",
                url: null,
              },
            ],
          },
        ],
        summary:
          "Todos los 'validation_steps' son correctos (✅). El tipo de operación 'IMP' es coherente con el destino 'MEX'. La clave de pedimento 'A1' y el régimen 'IMD' son válidos y apropiados para la operación de importación definitiva. No se encontraron advertencias ni errores.",
      },
    },
    {
      destination_origin: {
        name: "Destino/Origen de Mercancías",
        is_correct: true,
        context: [
          {
            full_context: true,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Clave de Destino/Origen",
                    value: "9",
                  },
                  {
                    id: 2,
                    name: "Tipo de Operación",
                    value: "IMP",
                  },
                ],
              },
              {
                id: 2,
                origin: "Documento de Transporte",
                document_summary:
                  "Este documento de transporte es una guía aérea que detalla la información de un envío de partes de CNC, específicamente un engranaje de piñón, desde Estados Unidos a México. El remitente es Anderson America, ubicado en Pineville, Carolina del Norte, y el consignatario es Mariano Rosas Amador, en Tlalnepantla, México. El envío consta de un bulto con un valor declarado de 2380.00 USD y un peso de 19.50 kg. El envío fue realizado el 11 de agosto de 2021 y llegó a su destino el 12 de agosto de 2021. La guía de transporte incluye un número de seguimiento y está bajo los términos de facturación no especificados. La revalidación del envío fue realizada por Gamas Livia, y el documento fue impreso el 19 de agosto de 2021.",
                data: [
                  {
                    id: 1,
                    name: "País de origen (Transporte)",
                    value: "USA",
                  },
                  {
                    id: 2,
                    name: "País de destino (Transporte)",
                    value: "MEX",
                  },
                ],
              },
            ],
            inferred_context: [],
            external_context: [
              {
                id: 1,
                origin: "Apéndice 15",
                data: [
                  {
                    id: 1,
                    name: "Claves de destino válidas",
                    value:
                      "1 - Estado de Baja California y parcial de Sonora.\n2 - Estado de Baja California Sur.\n3 - Estado de Quintana Roo.\n5 - Municipio de Salina Cruz, Oaxaca.\n6 - Municipio de Cananea, Sonora.\n7 - Franja Fronteriza Norte.\n8 - Franja Fronteriza Sur, Colindante con Guatemala.\n9 - Interior del País.\n10 - Municipio de Caborca, Sonora.\n11 - Región Fronteriza de Chetumal, en la localidad de Chetumal, en el Municipio de Othón P. Blanco, Quintana Roo.",
                  },
                ],
              },
            ],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Validación de clave",
            description:
              "La clave de destino/origen debe existir en el Apéndice 15",
            llm_analysis:
              "✅ La clave de destino/origen es '9', que corresponde al 'Interior del País' según el Apéndice 15. Esta información coincide perfectamente con el contexto proporcionado del pedimento y el documento de transporte. La clave existe y es válida. No se necesitan acciones adicionales.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Apéndice 15 del Anexo 22",
                url: null,
              },
            ],
          },
        ],
        summary:
          "La clave de destino/origen '9' es correcta y corresponde a 'Interior del País' según el Apéndice 15. Todo está en orden, sin advertencias ni errores, y no se requiere ninguna acción adicional.",
      },
    },
    {
      operation: {
        name: "Operación (Fecha de entrada y Tipo de cambio)",
        is_correct: false,
        context: [
          {
            full_context: false,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Fecha de entrada (Pedimento)",
                    value: "12/08/2021",
                  },
                  {
                    id: 2,
                    name: "Tipo de cambio (Pedimento)",
                    value: 20.1038,
                  },
                  {
                    id: 3,
                    name: "Valor en dólares (Pedimento)",
                    value: 2920.82,
                  },
                  {
                    id: 4,
                    name: "Valor aduana (Pedimento)",
                    value: 58721,
                  },
                  {
                    id: 5,
                    name: "Precio pagado/valor comercial (Pedimento)",
                    value: 47848,
                  },
                  {
                    id: 6,
                    name: "Datos de facturas (Pedimento)",
                    value: [
                      {
                        num_factura: "561893440",
                        fecha_factura: "11/08/2021",
                        incoterm: "EXW",
                        moneda_factura: "USD",
                        valor_moneda_factura: 2380,
                        factor_moneda_factura: 1,
                        valor_dolares_factura: 2380,
                      },
                    ],
                  },
                  {
                    id: 7,
                    name: "Incrementables (Pedimento)",
                    value: {
                      seguros: 0,
                      fletes: 10873,
                      embalajes: 0,
                      otros: 0,
                    },
                  },
                  {
                    id: 8,
                    name: "Decrementables (Pedimento)",
                    value: {
                      fletes: 0,
                      seguros: 0,
                      carga: 0,
                      descarga: 0,
                      otros: 0,
                    },
                  },
                ],
              },
              {
                id: 2,
                origin: "Factura",
                document_summary: null,
                data: [
                  {
                    id: 1,
                    name: "Número de factura (Factura)",
                    value: null,
                  },
                  {
                    id: 2,
                    name: "Fecha (Factura)",
                    value: null,
                  },
                  {
                    id: 3,
                    name: "Valor comercial (Factura)",
                    value: {
                      valor: null,
                      moneda: null,
                    },
                  },
                  {
                    id: 4,
                    name: "Mercancías (Factura)",
                    value: [],
                  },
                  {
                    id: 5,
                    name: "Incrementables (Factura)",
                    value: {
                      seguros: {
                        valor: null,
                        moneda: null,
                      },
                      fletes: {
                        valor: null,
                        moneda: null,
                      },
                      embalajes: {
                        valor: null,
                        moneda: null,
                      },
                      otros: {
                        valor: null,
                        moneda: null,
                      },
                    },
                  },
                ],
              },
              {
                id: 3,
                origin: "COVE",
                document_summary:
                  "Este documento COVE corresponde a una operación de importación sin relación de facturas, con fecha de expedición el 11 de agosto de 2021. El proveedor es Anderson America, ubicado en Estados Unidos, y el destinatario es SACC Asesores Aduaneros en Comercio Exterior SA de CV, ubicado en México. Se incluyen varias mercancías como piñones, poleas, chumaceras y partes para sierra, todas valoradas en dólares estadounidenses.",
                data: [
                  {
                    id: 1,
                    name: "Número de COVE (COVE)",
                    value: "COVE214J371P6",
                  },
                  {
                    id: 2,
                    name: "Fecha (COVE)",
                    value: "2021-08-11",
                  },
                  {
                    id: 3,
                    name: "Valor comercial (COVE)",
                    value: {
                      valor: null,
                      moneda: null,
                    },
                  },
                  {
                    id: 4,
                    name: "Mercancías (COVE)",
                    value: [
                      {
                        descripcion: "PIÑON",
                        cantidad: 2,
                        unidad: "piece",
                        precio_unitario: 328,
                        precio_total: 656,
                        moneda: "US Dollar",
                      },
                      {
                        descripcion: "POLEAS",
                        cantidad: 2,
                        unidad: "piece",
                        precio_unitario: 172,
                        precio_total: 344,
                        moneda: "US Dollar",
                      },
                      {
                        descripcion: "POLEAS",
                        cantidad: 2,
                        unidad: "piece",
                        precio_unitario: 80,
                        precio_total: 160,
                        moneda: "US Dollar",
                      },
                      {
                        descripcion: "POLEAS",
                        cantidad: 2,
                        unidad: "piece",
                        precio_unitario: 140,
                        precio_total: 280,
                        moneda: "US Dollar",
                      },
                      {
                        descripcion: "POLEAS",
                        cantidad: 2,
                        unidad: "piece",
                        precio_unitario: 115,
                        precio_total: 230,
                        moneda: "US Dollar",
                      },
                      {
                        descripcion: "CHUMACERA",
                        cantidad: 2,
                        unidad: "piece",
                        precio_unitario: 200,
                        precio_total: 400,
                        moneda: "US Dollar",
                      },
                      {
                        descripcion: "PARTE PARA SIERRA",
                        cantidad: 1,
                        unidad: "piece",
                        precio_unitario: 310,
                        precio_total: 310,
                        moneda: "US Dollar",
                      },
                    ],
                  },
                  {
                    id: 5,
                    name: "Incrementables (COVE)",
                    value: {
                      fletes: {
                        valor: 0,
                        moneda: "",
                      },
                      seguros: {
                        valor: 0,
                        moneda: "",
                      },
                      embalajes: {
                        valor: 0,
                        moneda: "",
                      },
                      otros: {
                        valor: 0,
                        moneda: "",
                      },
                    },
                  },
                ],
              },
              {
                id: 4,
                origin: "Carta 3.1.8",
                document_summary:
                  "Este documento es una declaración bajo protesta de decir verdad emitida por Sandra Quintero López, representante legal de SACC Asesores Aduanales en Comercio Exterior S.A. DE C.V., dirigida al Administrador de la Aduana del Aeropuerto Internacional de la Ciudad de México. La declaración se refiere a una factura comercial sin número del proveedor Anderson America Corp, detallando mercancías importadas, sus cantidades, precios y términos de facturación.",
                data: [
                  {
                    id: 1,
                    name: "Fecha de emisión (Carta 3.1.8)",
                    value: "2021-08-19",
                  },
                  {
                    id: 2,
                    name: "Valor comercial (Carta 3.1.8)",
                    value: {
                      valor: 2380,
                      moneda: "USD",
                    },
                  },
                  {
                    id: 3,
                    name: "Mercancías (Carta 3.1.8)",
                    value: [
                      {
                        descripcion: "Piñón",
                        cantidad: 2,
                        unidad: "Pieza",
                        precio_unitario: 328,
                        precio_total: 656,
                        moneda: "USD",
                      },
                      {
                        descripcion: "Poleas",
                        cantidad: 2,
                        unidad: "Pieza",
                        precio_unitario: 172,
                        precio_total: 344,
                        moneda: "USD",
                      },
                      {
                        descripcion: "Poleas",
                        cantidad: 2,
                        unidad: "Pieza",
                        precio_unitario: 80,
                        precio_total: 160,
                        moneda: "USD",
                      },
                      {
                        descripcion: "Poleas",
                        cantidad: 2,
                        unidad: "Pieza",
                        precio_unitario: 140,
                        precio_total: 280,
                        moneda: "USD",
                      },
                      {
                        descripcion: "Poleas",
                        cantidad: 2,
                        unidad: "Pieza",
                        precio_unitario: 115,
                        precio_total: 230,
                        moneda: "USD",
                      },
                      {
                        descripcion: "Chumacera",
                        cantidad: 2,
                        unidad: "Pieza",
                        precio_unitario: 200,
                        precio_total: 400,
                        moneda: "USD",
                      },
                      {
                        descripcion: "Partes para sierra",
                        cantidad: 1,
                        unidad: "Pieza",
                        precio_unitario: 310,
                        precio_total: 310,
                        moneda: "USD",
                      },
                    ],
                  },
                  {
                    id: 4,
                    name: "Incrementables (Carta 3.1.8)",
                    value: {
                      fletes: {
                        valor: 0,
                        moneda: "USD",
                      },
                      seguros: {
                        valor: 0,
                        moneda: "USD",
                      },
                      embalajes: {
                        valor: 0,
                        moneda: "USD",
                      },
                      otros: {
                        valor: 0,
                        moneda: "USD",
                      },
                    },
                  },
                ],
              },
              {
                id: 5,
                origin: "Documento de Transporte",
                document_summary:
                  "Este documento de transporte es una guía aérea que detalla la información de un envío de partes de CNC, específicamente un engranaje de piñón, desde Estados Unidos a México. El remitente es Anderson America, ubicado en Pineville, Carolina del Norte, y el consignatario es Mariano Rosas Amador, en Tlalnepantla, México. El envío consta de un bulto con un valor declarado de 2380.00 USD y un peso de 19.50 kg. El envío fue realizado el 11 de agosto de 2021 y llegó a su destino el 12 de agosto de 2021. La guía de transporte incluye un número de seguimiento y está bajo los términos de facturación no especificados. La revalidación del envío fue realizada por Gamas Livia, y el documento fue impreso el 19 de agosto de 2021.",
                data: [
                  {
                    id: 1,
                    name: "Fecha de entrada (Transporte)",
                    value: "2021-08-12",
                  },
                  {
                    id: 2,
                    name: "Valor comercial (Transporte)",
                    value: {
                      valor: 2380,
                      moneda: "USD",
                    },
                  },
                  {
                    id: 3,
                    name: "Mercancías (Transporte)",
                    value: [],
                  },
                  {
                    id: 4,
                    name: "Incrementables (Transporte)",
                    value: {
                      fletes: {
                        valor: 0,
                        moneda: "USD",
                      },
                      seguros: {
                        valor: 0,
                        moneda: "USD",
                      },
                      embalajes: {
                        valor: 0,
                        moneda: "USD",
                      },
                      otros: {
                        valor: 0,
                        moneda: "USD",
                      },
                    },
                  },
                ],
              },
            ],
            inferred_context: [
              {
                id: 1,
                origin: "Cálculos Pedimento",
                data: [
                  {
                    id: 1,
                    name: "Valor en dólares calculado (Pedimento)",
                    value: 2920.82,
                  },
                  {
                    id: 2,
                    name: "Valor aduana calculado (Pedimento)",
                    value: 58721,
                  },
                  {
                    id: 3,
                    name: "Valor comercial calculado (Pedimento)",
                    value: 47848,
                  },
                ],
              },
              {
                id: 2,
                origin: "Cálculos Factura",
                data: [
                  {
                    id: 1,
                    name: "Valor en dólares calculado (Factura)",
                    value: "No se encontró el valor comercial en factura",
                  },
                  {
                    id: 2,
                    name: "Valor aduana calculado (Factura)",
                    value: "No se encontró el valor comercial en factura",
                  },
                  {
                    id: 3,
                    name: "Valor comercial calculado (Factura)",
                    value: "No se encontró el valor comercial en factura",
                  },
                ],
              },
              {
                id: 3,
                origin: "Cálculos COVE",
                data: [
                  {
                    id: 1,
                    name: "Valor en dólares calculado (COVE)",
                    value: 2380,
                  },
                  {
                    id: 2,
                    name: "Valor aduana calculado (COVE)",
                    value: 47847.044,
                  },
                  {
                    id: 3,
                    name: "Valor comercial calculado (COVE)",
                    value: 47847.044,
                  },
                ],
              },
              {
                id: 4,
                origin: "Cálculos Carta 3.1.8",
                data: [
                  {
                    id: 1,
                    name: "Valor en dólares calculado (Carta 3.1.8)",
                    value: 2380,
                  },
                  {
                    id: 2,
                    name: "Valor aduana calculado (Carta 3.1.8)",
                    value: 47847.044,
                  },
                  {
                    id: 3,
                    name: "Valor comercial calculado (Carta 3.1.8)",
                    value: 47847.044,
                  },
                ],
              },
              {
                id: 5,
                origin: "Cálculos Transporte",
                data: [
                  {
                    id: 1,
                    name: "Valor en dólares calculado (Transporte)",
                    value: "No se encontró el valor comercial en transporte",
                  },
                  {
                    id: 2,
                    name: "Valor aduana calculado (Transporte)",
                    value: "No se encontró el valor comercial en transporte",
                  },
                  {
                    id: 3,
                    name: "Valor comercial calculado (Transporte)",
                    value: "No se encontró el valor comercial en transporte",
                  },
                ],
              },
            ],
            external_context: [
              {
                id: 1,
                origin: "Banxico",
                data: [
                  {
                    id: 1,
                    name: "Tipo de cambio DOF",
                    value: 20.1038,
                  },
                ],
              },
              {
                id: 2,
                origin: "Apéndice 14",
                data: [
                  {
                    id: 1,
                    name: "Grupo del INCOTERM",
                    value: "EXW: Grupo III",
                  },
                  {
                    id: 2,
                    name: "Descripción del INCOTERM",
                    value: "EXW: En fabrica (lugar convenido).",
                  },
                ],
              },
            ],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Fecha de entrada",
            description:
              "La fecha de entrada del pedimento debe ser parecida a la fecha de entrada del documento de transporte. ",
            llm_analysis:
              "⚠️ La fecha de entrada en el pedimento es el 12/08/2021, lo cual es consistente con el documento de transporte que muestra una fecha de entrada también el 12/08/2021. Sin embargo, la fecha de la factura está en blanco, lo que impide una verificación cruzada completa y precisa de todos los documentos mencionados en el contexto proporcionado.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Artículo 56 Fracción I",
                url: null,
              },
            ],
          },
          {
            id: 2,
            name: "Tipo de cambio",
            description:
              "El tipo de cambio debe ser exactamente igual al publicado en el DOF el día hábil anterior a la fecha de entrada",
            llm_analysis:
              "✅ El tipo de cambio declarado es 20.1038, coincide exactamente con el tipo de cambio DOF proporcionado. Esto asegura que el tipo de cambio utilizado es el correcto según la normativa.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "DOF - Tipo de cambio",
                url: "https://dof.gob.mx/indicadores.php#gsc.tab=0",
              },
            ],
          },
          {
            id: 3,
            name: "Incrementables",
            description:
              "Sigue estos pasos para validar los incrementables correctamente. Piensa paso por paso antes de dar una respuesta.\n\nPaso 1: Identificar los incrementables.\n• Los incrementables son los costos adicionales de la operación, como seguros, fletes, embalajes y otros conceptos similares.\n• Deben incluirse en el cálculo de impuestos.\n\nPaso 2: Comparar entre documentos.\n• Verifica que los valores desglosados (VAL.SEGUROS, SEGUROS, FLETES, EMBALAJES, OTROS INCREMENTABLES) sean consistentes en:\n• El pedimento.\n• El documento de transporte y/o la carta 3.1.8.\n• Si no hay documento de transporte, compara solo entre el pedimento y la carta 3.1.8.\n\nPaso 3: Convertir moneda si es necesario.\n• Si los valores están en dólares, usa el tipo de cambio proporcionado.\n• Si no se proporciona un tipo de cambio, usa 20 pesos por dólar como referencia.\n• Convierte los valores en dólares a pesos antes de compararlos.\n\nPaso 4: Verificar que no se declare de menos.\n• El valor en el pedimento debe ser mayor o muy similar al valor calculado.\n• Si el valor en el pedimento es menor al calculado, marca una discrepancia porque el riesgo es declarar de menos.\n\nPaso 5: Explicar el resultado paso a paso.\n• Indica los valores en cada documento y la conversión si aplica.\n• Explica si hay diferencias y si representan un riesgo.\n• Resalta si se está declarando un valor menor del que debería.",
            llm_analysis:
              "✅ Se declaran incrementales como fletes de 10873 MXN en el pedimento, coincidiendo con la información del transporte y la carta 3.1.8 que indican fletes de 0 USD (se verifica equivalencia al controlearlos). Todos los demás conceptos de seguros, embalajes y otros son 0 en ambos documentos. No hay discrepancias notables.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Reglamento de la Ley Aduanera",
                url: null,
              },
            ],
          },
          {
            id: 4,
            name: "Valores del pedimento",
            description:
              'Sigue estos pasos para validar correctamente los valores declarados. Piensa paso por paso antes de dar una respuesta, razonando con base en la información que se te proporciona. Usa datos para fundamentar tu respuesta, como si tuvieras que citar todos tus argumentos.\n\nPaso 1: Confirmar el Valor en dólares\n• Verifica si el Valor en dólares (valor aduana / tipo de cambio) declarado en el pedimento tiene sentido comparándolo con los datos proporcionados:\n• Valor de la factura.\n• Incrementables (en USD).\n• Razona si este valor es consistente con los datos dados. No realices cálculos, solo evalúa la coherencia.\n\nPaso 2: Validar el Valor comercial\n• Confirma si el Valor comercial declarado en el pedimento se alinea con el cálculo obtenido al restar a la aduana en MXN los incrementables en MXN, considerando que el valor aduana se obtiene al multiplicar el valor en dólares total (suma de incrementables convertidos a USD y factura en USD) por el tipo de cambio DOF.\n• Evalúa si la relación entre el Valor comercial y los demás valores proporcionados es razonable, considerando la coherencia de los datos.\n\nPaso 3: Verificar el Valor aduana\n• Verifica si el Valor aduana declarado en el pedimento tiene sentido con base en los datos dados:\n• Valor comercial.\n• Incrementables.\n• Decrementables.\n• Evalúa si el resultado final es consistente con lo esperado según la información.\n\nPaso 4: Explicar el resultado con lógica\n• Razona paso por paso por qué los valores tienen sentido o, si detectas alguna discrepancia, explica por qué puede haber un problema.\n• Ejemplo esperado de respuesta:\n"El valor en dólares del pedimento es [x], hace sentido porque el valor de la factura ([y]) más los incrementables convertidos a USD da un total consistente. Al aplicar el tipo de cambio, el Valor aduana y el Valor comercial resultan coherentes con los datos proporcionados."\n\nNota: utiliza únicamente la información proporcionada para llegar a las conclusiones de manera lógica y detallada. Si necesitas realizar un cálculo para argumentar, hazlo. Siempre indica dónde está el problema y adjunta la data sobre el mismo.',
            llm_analysis:
              "❌ El valor en USD del pedimento es de 2920.82, no hace sentido ya que el valor en dólares de la factura es 2380.00, indicando discrepancia. Incrementables son 10873 MXN, al convertir a USD es inconsistente al sumarse a la factura en USD. Se debe revisar los cálculos por posible error.",
            is_correct: false,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Revisar y corregir el valor en dólares en el pedimento comparándolo con los valores de factura y incrementables convertidos correctamente.",
              },
            ],
            resources: [
              {
                id: 1,
                name: "Ley Aduanera - Valor en Aduana",
                url: null,
              },
            ],
          },
        ],
        summary:
          "En el análisis, las fechas de entrada muestran consistencia pero hay advertencias debido a datos de factura faltantes. El tipo de cambio es exactamente correcto. Los incrementables están bien declarados y son coherentes entre documentos. Sin embargo, hay un error significativo en la declaración del valor en dólares del pedimento; se sugiere corregir los cálculos de los valores en relación con los incrementales y la factura.",
      },
    },
    {
      gross_weight: {
        name: "Pesos y Bultos",
        is_correct: false,
        context: [
          {
            full_context: true,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Peso bruto (Pedimento)",
                    value: 19,
                  },
                  {
                    id: 2,
                    name: "Número de bultos (Pedimento)",
                    value: "1",
                  },
                ],
              },
              {
                id: 2,
                origin: "Documento de Transporte",
                document_summary:
                  "Este documento de transporte es una guía aérea que detalla la información de un envío de partes de CNC, específicamente un engranaje de piñón, desde Estados Unidos a México. El remitente es Anderson America, ubicado en Pineville, Carolina del Norte, y el consignatario es Mariano Rosas Amador, en Tlalnepantla, México. El envío consta de un bulto con un valor declarado de 2380.00 USD y un peso de 19.50 kg. El envío fue realizado el 11 de agosto de 2021 y llegó a su destino el 12 de agosto de 2021. La guía de transporte incluye un número de seguimiento y está bajo los términos de facturación no especificados. La revalidación del envío fue realizada por Gamas Livia, y el documento fue impreso el 19 de agosto de 2021.",
                data: [
                  {
                    id: 1,
                    name: "Peso bruto (Transporte)",
                    value: 19.5,
                  },
                  {
                    id: 2,
                    name: "Número de bultos (Transporte)",
                    value: 1,
                  },
                ],
              },
              {
                id: 3,
                origin: "Factura",
                document_summary: null,
                data: [
                  {
                    id: 1,
                    name: "Peso neto total (Factura)",
                    value: "No proveído",
                  },
                ],
              },
              {
                id: 4,
                document_summary: null,
                origin: "Packing List",
                data: [
                  {
                    id: 1,
                    name: "Peso neto total (Packing List)",
                    value: "No proveído",
                  },
                  {
                    id: 2,
                    name: "Peso bruto (Packing List)",
                    value: "No proveído",
                  },
                  {
                    id: 3,
                    name: "Número de bultos (Packing List)",
                    value: "No proveído",
                  },
                ],
              },
              {
                id: 5,
                origin: "COVE",
                document_summary:
                  "Este documento COVE corresponde a una operación de importación sin relación de facturas, con fecha de expedición el 11 de agosto de 2021. El proveedor es Anderson America, ubicado en Estados Unidos, y el destinatario es SACC Asesores Aduaneros en Comercio Exterior SA de CV, ubicado en México. Se incluyen varias mercancías como piñones, poleas, chumaceras y partes para sierra, todas valoradas en dólares estadounidenses.",
                data: [
                  {
                    id: 1,
                    name: "Subdivisión (COVE)",
                    value: "Sin subdivisión",
                  },
                ],
              },
            ],
            inferred_context: [],
            external_context: [
              {
                id: 1,
                origin: "Apéndice 7",
                data: [
                  {
                    id: 1,
                    name: "Unidad de Medida",
                    value: "No proveído",
                  },
                ],
              },
            ],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Validación de pesos",
            description:
              "El peso neto total debe ser menor que el peso bruto declarado tanto en el pedimento como en el documento de transporte, si no hay peso neto, ignorar y marcar como correcto",
            llm_analysis:
              "⚠️ El peso neto total no se proporcionó en la Factura ni en el Packing List, por lo tanto no es posible validar si el peso neto es menor que el peso bruto como requiere esta validación. El peso bruto en el pedimento es 19.0, mientras que en el documento de transporte es 19.5. Sin el peso neto, no se puede concluir estrictamente, pero no hay conflictos aparentes.",
            is_correct: true,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Obtener el peso neto total actualizado en la factura o en el Packing List para validaciones futuras.",
              },
            ],
            resources: [
              {
                id: 1,
                name: "Reglamento de la Ley Aduanera",
                url: null,
              },
            ],
          },
          {
            id: 2,
            name: "Coincidencia de peso bruto",
            description:
              "El peso bruto declarado en el pedimento debe coincidir con el declarado en el documento de transporte. Si no hay documento de transporte, intentar validar entre el pedimento y la carta 3.1.8",
            llm_analysis:
              "⚠️ Discrepancia menor: El peso bruto declarado en el pedimento es 19.0 kg y en el documento de transporte es 19.5 kg. Esta diferencia no es significativa normalmente, pero debe revisarse para asegurar precisión. El contexto del documento de transporte está disponible y no se requiere validación con otro documento.",
            is_correct: false,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Revisar las causas de la discrepancia en peso bruto entre el pedimento y el documento de transporte.",
              },
            ],
            resources: [
              {
                id: 1,
                name: "Reglamento de la Ley Aduanera",
                url: null,
              },
            ],
          },
          {
            id: 3,
            name: "Coincidencia de bultos",
            description:
              "El número total de bultos debe coincidir entre el pedimento, documento de transporte y/o carta 3.1.8 / invoice. Si no hay documento de transporte, validar entre el pedimento y la carta 3.1.8/invoice",
            llm_analysis:
              "✅ El número de bultos coinciden correctamente entre el pedimento y el documento de transporte, ambos indicando un '1'. Dado que la coincidencia es clara y el contexto proporcionado es completo, este paso es correcto.",
            is_correct: true,
            actions_to_take: [],
            resources: [
              {
                id: 1,
                name: "Reglamento de la Ley Aduanera",
                url: null,
              },
            ],
          },
        ],
        summary:
          "En la validación de pesos (1), la ausencia de peso neto impide una validación completa, sugiriendo la obtención de estos datos. El peso bruto muestra una discrepancia menor (2), que aunque no es significativa, debe investigarse para garantizar precisión. La coincidencia de bultos (3) es correcta y consistente entre documentos, sin errores o advertencias.",
      },
    },
    {
      invoice_data: {
        name: "Datos de Factura",
        is_correct: false,
        context: [
          {
            full_context: false,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "RFC importador",
                    value: "SAA200430EUA",
                  },
                  {
                    id: 2,
                    name: "Domicilio fiscal",
                    value:
                      "AV. EBANO No. 301 Int. B LOS CEDROS CP. 42033 PACHUCA Hidalgo MEXICO (ESTADOS UNIDOS MEXICANOS)",
                  },
                  {
                    id: 3,
                    name: "Razón social",
                    value:
                      "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV",
                  },
                  {
                    id: 4,
                    name: "Fecha de entrada (Pedimento)",
                    value: "12/08/2021",
                  },
                  {
                    id: 5,
                    name: "Número de COVE",
                    value: "COVE214J371P6",
                  },
                  {
                    id: 6,
                    name: "ID fiscal proveedor/comprador (Pedimento)",
                    value: "561893440",
                  },
                  {
                    id: 7,
                    name: "Domicilio fiscal proveedor/comprador (Pedimento)",
                    value: "No proveído",
                  },
                  {
                    id: 8,
                    name: "Razón social proveedor/comprador (Pedimento)",
                    value: "ANDERSON AMERICA",
                  },
                  {
                    id: 9,
                    name: "Datos de facturas",
                    value: [
                      {
                        num_factura: "561893440",
                        fecha_factura: "11/08/2021",
                        incoterm: "EXW",
                        moneda_factura: "USD",
                        valor_moneda_factura: 2380,
                        factor_moneda_factura: 1,
                        valor_dolares_factura: 2380,
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                origin: "Factura",
                document_summary: null,
                data: [
                  {
                    id: 1,
                    name: "Datos del proveedor (Factura)",
                    value: "No proveído",
                  },
                  {
                    id: 2,
                    name: "Datos del importador (Factura)",
                    value: "No proveído",
                  },
                  {
                    id: 3,
                    name: "Datos del consignatario (Factura)",
                    value: "No proveído",
                  },
                  {
                    id: 4,
                    name: "Fecha de emisión (Factura)",
                    value: "No proveído",
                  },
                  {
                    id: 5,
                    name: "Número de folio (Factura)",
                    value: "No proveído",
                  },
                  {
                    id: 6,
                    name: "Moneda",
                    value: null,
                  },
                  {
                    id: 7,
                    name: "Valor de la factura",
                    value: "No proveído",
                  },
                ],
              },
              {
                id: 3,
                origin: "COVE",
                document_summary:
                  "Este documento COVE corresponde a una operación de importación sin relación de facturas, con fecha de expedición el 11 de agosto de 2021. El proveedor es Anderson America, ubicado en Estados Unidos, y el destinatario es SACC Asesores Aduaneros en Comercio Exterior SA de CV, ubicado en México. Se incluyen varias mercancías como piñones, poleas, chumaceras y partes para sierra, todas valoradas en dólares estadounidenses.",
                data: [
                  {
                    id: 1,
                    name: "Datos del proveedor/comprador (COVE)",
                    value: "Razón social: ANDERSON AMERICA\nTax ID: 561893440",
                  },
                  {
                    id: 2,
                    name: "RFC importador (COVE)",
                    value: "SAA200430EUA",
                  },
                  {
                    id: 3,
                    name: "Fecha de emisión (COVE)",
                    value: "2021-08-11",
                  },
                  {
                    id: 4,
                    name: "Número de COVE",
                    value: "COVE214J371P6",
                  },
                  {
                    id: 5,
                    name: "Moneda (COVE)",
                    value: "US Dollar",
                  },
                  {
                    id: 6,
                    name: "Valor de la factura (COVE)",
                    value: 2380,
                  },
                ],
              },
              {
                id: 4,
                origin: "Carta 3.1.8",
                document_summary:
                  "Este documento es una declaración bajo protesta de decir verdad emitida por Sandra Quintero López, representante legal de SACC Asesores Aduanales en Comercio Exterior S.A. DE C.V., dirigida al Administrador de la Aduana del Aeropuerto Internacional de la Ciudad de México. La declaración se refiere a una factura comercial sin número del proveedor Anderson America Corp, detallando mercancías importadas, sus cantidades, precios y términos de facturación.",
                data: [
                  {
                    id: 1,
                    name: "RFC importador (Carta 3.1.8)",
                    value: "SAA020430EUA",
                  },
                  {
                    id: 2,
                    name: "INCOTERM (Carta 3.1.8)",
                    value: "EXW",
                  },
                  {
                    id: 3,
                    name: "Fecha de emisión (Carta 3.1.8)",
                    value: "2021-08-19",
                  },
                  {
                    id: 4,
                    name: "Moneda (Carta 3.1.8)",
                    value: "No proveído",
                  },
                  {
                    id: 5,
                    name: "Valor de la factura (Carta 3.1.8)",
                    value: {
                      valor: 2380,
                      moneda: "USD",
                    },
                  },
                ],
              },
              {
                id: 5,
                origin: "Cesión de Derechos",
                document_summary:
                  "Este documento es una carta de cesión de derechos en la que Mariano Rosas Amador, con domicilio en Tlalnepantla, Estado de México, cede los derechos y obligaciones derivados de la importación de mercancías a SACC Asesores Aduaneros en Comercio Exterior S.A. de C.V., ubicada en Pachuca de Soto. La cesión incluye la autorización para la liberación de las mercancías y la realización de todos los trámites de importación. Se menciona un número de guía y una factura sin número de fecha 11 de agosto.",
                data: [
                  {
                    id: 1,
                    name: "RFC de comercializadora (Cesión de Derechos)",
                    value: "SAA200430EUA",
                  },
                  {
                    id: 2,
                    name: "Fecha de emisión (Cesión de Derechos)",
                    value: "No proveído",
                  },
                ],
              },
            ],
            inferred_context: [
              {
                id: 1,
                origin: "Análisis",
                data: [
                  {
                    id: 1,
                    name: "Validación de los RFC",
                    value: {
                      "RFC importador": true,
                      "RFC importador (COVE)": true,
                      "RFC importador (Carta 3.1.8)": true,
                      "RFC de comercializadora (Cesión de Derechos)": true,
                    },
                  },
                ],
              },
            ],
            external_context: [
              {
                id: 1,
                origin: "DOF",
                data: [
                  {
                    id: 1,
                    name: "Factor de equivalencia DOF",
                    value: null,
                  },
                ],
              },
            ],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Validación de los RFC",
            description:
              "Validar que los RFC cumplan con los siguientes criterios:\n\n1. Formato válido:\n• RFC Moral: 12 caracteres (ej: ABC850101AAA)\n• RFC Física: 13 caracteres (ej: ABCD850101AAA)\n\n2. Existencia real:\n• Consultar el RFC ante el SAT (servicio web)\n\n3. Consistencia entre documentos:\n• RFC del importador en Pedimento (ID1), COVE (ID2), y Carta 3.1.8 (ID1) deben ser idénticos\n• Si hay Cesión de Derechos, el RFC de la comercializadora (ID1) debe coincidir con el RFC del importador en la Carta 3.1.8",
            llm_analysis:
              "✅ Todos los RFC coinciden y cumplen con el formato estándar. Sin embargo, no se ha verificado la existencia real ante el SAT. Se ha confirmado consistencia entre documentos, por lo que se marca como correcto aunque se sugiere validar existencia digital con el SAT.",
            is_correct: true,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Consultar el RFC ante el servicio web del SAT para verificar su existencia real.",
              },
            ],
            resources: [],
          },
          {
            id: 2,
            name: "Validación de cesión de derechos y carta 3.1.8",
            description:
              "Si existe Cesión de Derechos (ID5):\n\nComparar:\n• RFC comercializadora (ID5.1) vs. RFC importador (Carta 3.1.8 ID1)\n• Fecha de emisión (Cesión ID2) debe ser anterior a Fecha de entrada (Pedimento ID6)\n\nPrecedencia:\n• La Carta 3.1.8 anula cualquier discrepancia en Factura/COVE\n• Si no hay Cesión, omitir y marcar como válido",
            llm_analysis:
              "⚠️ La cesión de derechos no proporciona fecha de emisión, lo que impide verificar su precedencia respecto a la fecha de entrada del Pedimento. Sin embargo, los RFC sí coinciden. Se resalta esta advertencia ya que la fecha de emisión es un dato importante que falta.",
            is_correct: false,
            actions_to_take: [
              {
                id: 2,
                step_description:
                  "Verificar la fecha de emisión de la Cesión de Derechos para asegurar precedencia correcta con relación a la Fecha de Entrada del Pedimento.",
              },
            ],
            resources: [
              {
                id: 1,
                name: "Regla 3.1.8 RGCE",
                url: null,
              },
            ],
          },
          {
            id: 3,
            name: "Validación de datos del importador/exportador",
            description:
              "Validar que los siguientes campos coincidan literalmente entre documentos:\n\nRFC: Pedimento ID1 = Carta 3.1.8 ID1 = COVE ID2.\nDomicilio fiscal: Pedimento ID2 = Carta 3.1.8 (implícito) = Factura ID2 (importador).\nRazón social: Pedimento ID3 = Carta 3.1.8 (implícito) = COVE ID1.\nRegla de precedencia:\nSi la Carta 3.1.8 existe, sus datos tienen prioridad sobre Factura/COVE. Cualquier discrepancia en otros documentos se marca como error.",
            llm_analysis:
              "⚠️ El domicilio fiscal del importador en la factura no se proporcionó, lo que dificulta la validación completa. Sin embargo, el RFC y razón social del importador coinciden entre todos los documentos presentes.",
            is_correct: false,
            actions_to_take: [
              {
                id: 3,
                step_description:
                  "Obtener el domicilio fiscal del importador en la factura para validar su consistencia con otros documentos.",
              },
            ],
            resources: [],
          },
          {
            id: 4,
            name: "Validación de datos comerciales del proveedor/comprador",
            description:
              "Validar los siguientes pasos:\n1. Los datos del proveedor/comprador deben coincidir exactamente entre factura, COVE y Cesión de Derechos\n2. Si hay comercializadora, sus datos deben coincidir con el documento de cesión\n3. La Carta 3.1.8 tiene precedencia sobre la factura",
            llm_analysis:
              "⚠️ No se proporcionan datos completos del proveedor/comprador en la factura, limitando la comparación entre documentos. Sin embargo, los datos de COVE y Cesión de Derechos coinciden.",
            is_correct: false,
            actions_to_take: [
              {
                id: 4,
                step_description:
                  "Proveer datos completos del proveedor/comprador de la factura para verificar la consistencia entre todos los documentos.",
              },
            ],
            resources: [],
          },
          {
            id: 5,
            name: "Validación de fechas de emisión, números de folio y COVE",
            description:
              "Verificar secuencias lógicas y coincidencias exactas:\n\nFechas:\n• Fecha emisión Factura (ID4) ≤ Fecha entrada Pedimento (ID6)\n• Fecha COVE (ID3) = Fecha Factura (ID4)\n\nNúmeros:\n• Número COVE (Pedimento ID8) = Número COVE (COVE ID4)\n• Número Factura (Factura ID5) debe ser único y no repetido en otras operaciones",
            llm_analysis:
              "❌ La fecha de emisión de la factura no se ha proporcionado, impidiendo comparación con la Fecha de Entrada del Pedimento y fecha de emisión del COVE. Este es un error significativo.",
            is_correct: false,
            actions_to_take: [
              {
                id: 5,
                step_description:
                  "Obtener la fecha de emisión de la factura para poder completar la comparación de fechas y números con COVE y otros registros.",
              },
            ],
            resources: [],
          },
          {
            id: 6,
            name: "Validación de moneda y factor de equivalencia",
            description:
              "Validar los siguientes aspectos:\n\nMoneda:\n• La moneda declarada debe coincidir entre:\n  - Factura (ID6)\n  - COVE (ID5) \n  - Carta 3.1.8 (ID4)\n\nCálculo en USD:\n• El valor en dólares del pedimento (ID12) debe ser igual a:\n  - Valor de Factura (ID7) multiplicado por Factor DOF (ID1)\n• Se permite una tolerancia máxima de ±0.5%\n\nFactor DOF:\n• Debe corresponder al tipo de cambio publicado el día de la fecha de emisión de la Factura (ID4)",
            llm_analysis:
              "❌ La moneda de la factura no se ha proporcionado y el factor de equivalencia DOF está ausente, impidiendo la consistencia con los cálculos de valores en dólares. Esto representa un error grave que debe corregirse.",
            is_correct: false,
            actions_to_take: [
              {
                id: 6,
                step_description:
                  "Cubrir información de moneda y verificar que se alinee con COVE y Carta 3.1.8. Obtener el factor DOF correspondiente para validación del cálculo en USD.",
              },
            ],
            resources: [],
          },
        ],
        summary:
          "El análisis de los validation_steps revela varias advertencias y errores críticos. Destacan la falta de fechas y monedas en algunos documentos, lo que impide una validación completa. Los errores en las fechas de emisión (❌) y la ausencia de moneda y factor de equivalencia (❌) requieren atención urgente. Se identificaron advertencias respecto a la falta de domicilio fiscal y datos comerciales completos (⚠️). Es crucial obtener estos datos faltantes para una validación adecuada.",
      },
    },
    {
      transport_data: {
        name: "Datos de Transporte",
        is_correct: false,
        context: [
          {
            full_context: true,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Clave del medio de transporte (Pedimento)",
                    value: "4",
                  },
                  {
                    id: 2,
                    name: "Número de guía o embarque (master y house o master) (Pedimento)",
                    value: "2W646MHPPF",
                  },
                  {
                    id: 3,
                    name: "Medios de transporte (Pedimento)",
                    value: {
                      entrada_salida: "4",
                      arribo: "4",
                      salida: "12",
                    },
                  },
                ],
              },
              {
                id: 2,
                origin: "Documento de Transporte",
                document_summary:
                  "Este documento de transporte es una guía aérea que detalla la información de un envío de partes de CNC, específicamente un engranaje de piñón, desde Estados Unidos a México. El remitente es Anderson America, ubicado en Pineville, Carolina del Norte, y el consignatario es Mariano Rosas Amador, en Tlalnepantla, México. El envío consta de un bulto con un valor declarado de 2380.00 USD y un peso de 19.50 kg. El envío fue realizado el 11 de agosto de 2021 y llegó a su destino el 12 de agosto de 2021. La guía de transporte incluye un número de seguimiento y está bajo los términos de facturación no especificados. La revalidación del envío fue realizada por Gamas Livia, y el documento fue impreso el 19 de agosto de 2021.",
                data: [
                  {
                    id: 1,
                    name: "Modalidad (Transporte)",
                    value: "AIR",
                  },
                  {
                    id: 4,
                    name: "Número de guía o embarque (master y house o master) (Transporte)",
                    value: "72W846MHPPEF",
                  },
                ],
              },
            ],
            inferred_context: [],
            external_context: [
              {
                id: 1,
                origin: "Apéndice 3",
                document_summary: null,
                data: [
                  {
                    id: 1,
                    name: "Descripción del medio de transporte",
                    value: "4 - Aéreo",
                  },
                ],
              },
              {
                id: 2,
                origin: "Apéndice 10",
                document_summary: null,
                data: [
                  {
                    id: 1,
                    name: "Descripción de la clave del medio de transporte",
                    value: "No proveído",
                  },
                ],
              },
            ],
          },
        ],
        validation_steps: [
          {
            id: 1,
            name: "Clave del tipo de transporte",
            description:
              "La clave del tipo de transporte debe existir en el apéndice 10",
            llm_analysis:
              "Clave del tipo de transporte en pedimento es '4'. Revisando Apéndice 10, no se provee descripción para esta clave, no se puede validar sin información adicional.",
            is_correct: false,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Obtener la descripción de la clave '4' en el apéndice 10 o confirmar con una fuente confiable.",
              },
            ],
            resources: [],
          },
          {
            id: 1,
            name: "Modalidad y medio de transporte",
            description:
              "La modalidad del documento de transporte y el medio de transporte del apéndice 3 deben tener coherencia entre sí",
            llm_analysis:
              "La modalidad 'AIR' del documento de transporte debe coincidir con un medio aéreo. Según Apéndice 3, la clave '4' corresponde a 'Aéreo', por lo que hay coherencia en el medio de transporte de entrada y arribo.",
            is_correct: true,
            actions_to_take: [],
            resources: [],
          },
          {
            id: 3,
            name: "Número de guía o embarque",
            description:
              "El número de guía o embarque del pedimento debe ser exactamente igual al número de contenedor, placa o master y house del documento de transporte, cualquier discrepancia es un error",
            llm_analysis:
              "El número de guía en el pedimento es '2W646MHPPF' y en el documento de transporte es '72W846MHPPEF'. Existen diferencias claras en los números, lo cual es un error en concordancia.",
            is_correct: false,
            actions_to_take: [
              {
                id: 1,
                step_description:
                  "Revisar y corregir el número de guía o embarque en el pedimento para que coincida con el documento de transporte.",
              },
            ],
            resources: [],
          },
        ],
        summary:
          "Se detectaron 2 discrepancias principales: ⚠️ No es posible validar la clave '4' del tipo de transporte con Apéndice 10 debido a falta de información, y ❌ existe un error en la coincidencia del número de guía o embarque entre el pedimento y el documento de transporte. Se recomienda obtener la descripción del Apéndice 10 y corregir el número de guía.",
      },
    },
    {
      partidas: {
        name: "Partidas",
        is_correct: false,
        context: [
          {
            full_context: true,
            provided_context: [
              {
                id: 1,
                origin: "Pedimento",
                document_summary:
                  "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI.",
                data: [
                  {
                    id: 1,
                    name: "Valor en dólares",
                    value: 2920.82,
                  },
                  {
                    id: 2,
                    name: "Valor aduana",
                    value: "58721",
                  },
                  {
                    id: 3,
                    name: "Precio pagado o Valor comercial",
                    value: 47848,
                  },
                  {
                    id: 4,
                    name: "Partidas (Pedimento)",
                    value: [
                      {
                        sec: 1,
                        fraccion: "84836099",
                        nico: "00",
                        umc: "6",
                        cantidad_umc: 2,
                        umt: "1",
                        cantidad_umt: 2.2,
                        p_v_c: "USA",
                        p_o_d: "TWN",
                        val_adu: 16185,
                        imp_precio_pag: 13188,
                        precio_unit: 6594,
                        val_agreg: null,
                        identificadores: [],
                        contribuciones: [
                          {
                            con: "IVA",
                            tasa: 16,
                            t_t: "1",
                            f_p: "0",
                            importe: 2869,
                          },
                          {
                            con: "IGI",
                            tasa: 10,
                            t_t: "1",
                            f_p: "0",
                            importe: 1618,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                origin: "COVE",
                document_summary:
                  "Este documento COVE corresponde a una operación de importación sin relación de facturas, con fecha de expedición el 11 de agosto de 2021. El proveedor es Anderson America, ubicado en Estados Unidos, y el destinatario es SACC Asesores Aduaneros en Comercio Exterior SA de CV, ubicado en México. Se incluyen varias mercancías como piñones, poleas, chumaceras y partes para sierra, todas valoradas en dólares estadounidenses.",
                data: [
                  {
                    id: 1,
                    name: "Certificado de origen",
                    value: {
                      funge_certificado: false,
                      subdivision: "Sin subdivisión",
                    },
                  },
                ],
              },
              {
                id: 3,
                origin: "RRNAS",
                document_summary: null,
                data: [
                  {
                    id: 1,
                    name: "Regulación (RRNAS)",
                    value: "DGNV.318.01.2020.3301",
                  },
                  {
                    id: 2,
                    name: "Periodo de validez (RRNAS)",
                    value: "",
                  },
                  {
                    id: 3,
                    name: "País de origen del productor (RRNAS)",
                    value:
                      "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR S.A. DE C.V., PACHUCA DE SOTO, HIDALGO",
                  },
                  {
                    id: 4,
                    name: "Descripción del producto (RRNAS)",
                    value: "CHUMACERA AMPARADO CON FACTURA",
                  },
                  {
                    id: 5,
                    name: "Cantidad autorizada a retirar y contabilizar (RRNAS)",
                    value: "",
                  },
                  {
                    id: 6,
                    name: "Oficinas de aduanas autorizadas (RRNAS)",
                    value: "AEROPUERTO INTERNACIONAL DE LA CIUDAD DE MEXICO",
                  },
                  {
                    id: 7,
                    name: "Código arancelario (RRNAS)",
                    value: "",
                  },
                ],
              },
            ],
            inferred_context: [
              {
                id: 1,
                origin: "Cálculos",
                data: [
                  {
                    id: 1,
                    name: "Prorrateo",
                    value: 1.22724042802207,
                  },
                  {
                    id: 2,
                    name: "DTA",
                    value: 469.76800000000003,
                  },
                  {
                    id: 3,
                    name: "Cálculo de partidas",
                    value: [
                      {
                        sec: 1,
                        fraccion: "84836099",
                        precio_pagado: 13188,
                        precio_unitario: 6594,
                        valor_aduana: 16184.846764755057,
                        igi: 1618.4846764755057,
                        iva: 2869.2496344557767,
                      },
                    ],
                  },
                ],
              },
            ],
            external_context: [
              {
                id: 1,
                origin: "Taxfinder",
                data: [
                  {
                    id: 1,
                    name: "Partidas (Taxfinder)",
                    value: [
                      {
                        sec: 1,
                        fraccion: "84836099",
                        nico: "00",
                        umt: "01 (KILO)",
                        identificadores: "",
                        contribuciones: [
                          {
                            con: "IGI",
                            tasa: "No aplica",
                          },
                          {
                            con: "IVA",
                            tasa: "No aplica",
                          },
                          {
                            con: "IEPS",
                            tasa: "No aplica",
                          },
                        ],
                        permisos: "",
                        restricciones_arancelarias: [
                          {
                            articulo: "A4|PROSEC|5",
                            tipo_regulacion: "PROSEC",
                            industria:
                              "De la Industria Química, De la Industria del Café, De la Industria Minera y Metalúrgica, De la Industria de Bienes de Capital, De la Industria de Maquinaria Agrícola, De la Industria Eléctrica, De las Industrias Automotriz y de Autopartes, De la Industria Siderúrgica, De las Industrias Diversas y De la Industria del Mueble",
                            descripcion:
                              "ARTÍCULO 5.- Para los efectos del artículo 4 anterior, los bienes para producir las mercancías a que se refieren las fracciones de dicho artículo y clasificados en las fracciones arancelarias de la Tarifa de la Ley de los Impuestos Generales de Importación y de Exportación que se establecen a continuación, podrán ser importados con el arancel del impuesto general de importación que se indica, de acuerdo al programa que le corresponda:\n\n\n\nI. De la Industria Eléctrica:\n\n\n\nII.\tDe la Industria Electrónica:\n\n\n\n\ta) Para los bienes a que se refiere la fracción II, inciso a) o b), del artículo 4 de este Decreto:\n\n\n\n\tb) Para los bienes a que se refiere la fracción II, inciso b), del artículo 4 de este Decreto:\n\n\t\n\nIII. De la Industria del Mueble:\n\n\t\n\nIV. De la Industria del Juguete, Juegos de Recreo y Artículos Deportivos:\n\n\t\n\nV. De la Industria del Calzado:\n\n\t\n\nVI. De la Industria Minera y Metalúrgica:\n\n\t\n\nVII. De la Industria de Bienes de Capital:\n\n\t\n\nVIII. De la Industria Fotográfica:\n\n\t\n\nIX. De la Industria de Maquinaria Agrícola:\n\n\t\n\nX. De las Industrias Diversas:\n\n\t\n\nXI. De la Industria Química:\n\n\t\n\nXII. De la Industria de Manufacturas del Caucho y Plástico:\n\n\t\n\nXIII. De la Industria Siderúrgica:\n\n\t\n\nXIV. De la Industria de Productos Farmoquímicos, Medicamentos y Equipo Médico:\n\n\t\n\nXV. De la Industria del Transporte, excepto el Sector de la Industria Automotriz y de Autopartes:\n\n\n\n\ta)\tPara los bienes a que se refiere la fracción XV, inciso a), del artículo 4 de este Decreto:\n\n\n\n\tb)\tPara los bienes a que se refiere la fracción XV, inciso b), del artículo 4 de este Decreto.\n\n\t\n\nXVI. De la Industria del Papel y Cartón:\n\n\t\n\nXVII. De la Industria de la Madera:\n\n\t\n\nXVIII. De la Industria del Cuero y Pieles:\n\n\t\n\nXIX. De las Industrias Automotriz y de Autopartes:\n\n\t\n\nXX. De las Industrias Textil y de la Confección:\n\n\t\n\n\ta) Para los bienes a que se refiere la fracción XX, inciso a), del artículo 4 de este Decreto:\n\n\n\n\tb)\tPara los bienes a que se refiere la fracción XX, inciso b), del artículo 4 de este Decreto:\n\n\n\n\tc)\tPara los bienes a que se refiere la fracción XX, inciso c), del artículo 4 de este Decreto:\n\n\t\n\nXXI. De la Industria de Chocolates, Dulces y Similares:\n\n\t\n\nXXII. De la Industria del Café:",
                          },
                        ],
                        restricciones_no_arancelarias: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                origin: "Apéndice 8",
                data: [
                  {
                    id: 1,
                    name: "Partidas (Apéndice 8)",
                    value: [],
                  },
                ],
              },
            ],
            context_summary:
              "El documento detalla un pedimento de importación definitiva bajo el régimen IMD, con un valor en dólares de 2,920.82 y un valor aduana de 58,721 MXN. El importador es SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV, con domicilio en Pachuca, Hidalgo, México. Se incluyen identificadores de pedimento y detalles de las partidas, que comprenden productos como piñones y poleas, con contribuciones de IVA e IGI. Varios documentos asociados: COVE, RRNAS, Taxfinder y Apéndice 8 sobresalen entre otros.",
          },
        ],
        validation_steps: [
          {
            id: 1,
            fraccion: "84836099",
            steps: [
              {
                id: 1,
                name: "Preferencia arancelaria y certificado de origen",
                llm_analysis:
                  "⚠️ La fracción arancelaria es 84836099 y no tiene preferencia arancelaria indicada en el COVE. Por lo tanto, no se puede determinar correctamente sin un certificado de origen o documento anexo.",
                is_correct: false,
                actions_to_take: [
                  {
                    id: 1,
                    step_description:
                      "Verificar si existe un certificado de origen o documento anexo que respalde la preferencia arancelaria.",
                  },
                ],
              },
              {
                id: 2,
                name: "Coherencia de UMC y cantidad UMC",
                llm_analysis:
                  "✅ La UMC es '6' y la cantidad UMC es 2.0, lo cual coincide con los datos disponibles del pedimento y COVE. La UMT declarada es '1', que es correcta según las normativas.",
                is_correct: true,
                actions_to_take: [],
              },
              {
                id: 3,
                name: "Coherencia de peso",
                llm_analysis:
                  "❌ El peso no ha sido especificado para validar la coherencia respecto al peso bruto del pedimento. Esto puede causar discrepancias en la interpretación.",
                is_correct: false,
                actions_to_take: [
                  {
                    id: 2,
                    step_description:
                      "Obtener y revisar el peso de las partidas para verificar la coherencia total respecto al peso bruto del pedimento.",
                  },
                ],
              },
              {
                id: 4,
                name: "Cálculo del prorrateo y DTA",
                llm_analysis:
                  "✅ El prorrateo se determinó correcto con un valor de 1.227 y el DTA calculado es 469.77, coincidiendo con el DTA declarado de 469.768.",
                is_correct: true,
                actions_to_take: [],
              },
              {
                id: 5,
                name: "Cálculo de contribuciones",
                llm_analysis:
                  "✅ Los valores de precio pagado, precio unitario, valor aduana, IGI, IVA y DTA coinciden con los cálculos proporcionados.",
                is_correct: true,
                actions_to_take: [],
              },
              {
                id: 6,
                name: "Coincidencia de permisos e identificadores",
                llm_analysis:
                  "⚠️ No se encontraron permisos o identificadores tanto en el pedimento como en Taxfinder. Se debe verificar que no falten estos datos cruciales.",
                is_correct: false,
                actions_to_take: [
                  {
                    id: 3,
                    step_description:
                      "Revisar que todos los permisos e identificadores requeridos estén listados adecuadamente.",
                  },
                ],
              },
              {
                id: 7,
                name: "Regulaciones arancelarias",
                llm_analysis:
                  "⚠️ Existen regulaciones arancelarias identificadas, pero se necesita detallar los fundamentos legales y confirmarlos en el pedimento. Aparece un PROSEC en Taxfinder pero sin especificaciones adicionales.",
                is_correct: false,
                actions_to_take: [
                  {
                    id: 4,
                    step_description:
                      "Detallar y verificar las regulaciones arancelarias (PROSEC) y confirmar si están reflejadas adecuadamente en el pedimento.",
                  },
                ],
              },
              {
                id: 8,
                name: "Regulaciones no arancelarias",
                llm_analysis:
                  "⚠️ No se pudieron determinar regulaciones no arancelarias, se debe verificar si existen y si están correctamente declaradas.",
                is_correct: false,
                actions_to_take: [
                  {
                    id: 5,
                    step_description:
                      "Verificar e incluir las regulaciones no arancelarias pertinentes y validar su presencia en el pedimento.",
                  },
                ],
              },
            ],
          },
        ],
        summary:
          "Se han identificado varios problemas y advertencias. Los errores principales incluyen falta de coherencia de peso y permisos e identificadores no verificados. Advertencias se presentan en preferencia arancelaria, regulaciones arancelarias y no arancelarias. Se requiere una revisión exhaustiva para corregir estos fallos.",
      },
    },
  ],
  files: [
    {
      name: "CESIÓN DE DERECHOS",
      url: "https://drive.google.com/file/d/1JP1K20ViNkLbzXhivFtkNvqucidlVK-p/preview",
    },
    {
      name: "COVE",
      url: "https://drive.google.com/file/d/1YTs71oCNJ89Ewkn7f-naUgO-FT0i1Zxn/preview",
    },
    {
      name: "RRNAS",
      url: "https://drive.google.com/file/d/1cCHx5OGUX54Fr6ZmKPL7J_EzjGkH8Cyz/preview",
    },
    {
      name: "TRANSPORTE",
      url: "https://drive.google.com/file/d/1hByFYkwYkymBs1tnP4WbhxROg5NIdTRu/preview",
    },
    {
      name: "PEDIMENTO",
      url: "https://drive.google.com/file/d/1Wnvt8FZnT3DFqVa24ciaJNmOBwR9JNDX/preview",
    },
    {
      name: "CARTA 3.1.8",
      url: "https://drive.google.com/file/d/1ehAIeeHfbfrpx0zOVFnh4QWmmeuQB4v0/preview",
    },
  ],
  alerts: {
    high: [
      {
        id: 1,
        validation_step_name: "Año del pedimento",
      },
      {
        id: 2,
        validation_step_name:
          "Validación de fechas de emisión, números de folio y COVE",
      },
      {
        id: 3,
        validation_step_name: "Validación de moneda y factor de equivalencia",
      },
      {
        id: 4,
        validation_step_name: "Valores del pedimento",
      },
    ],
    medium: [
      {
        id: 1,
        validation_step_name: "Coincidencia de peso bruto",
      },
      {
        id: 2,
        validation_step_name: "Fecha de entrada",
      },
      {
        id: 3,
        validation_step_name: "Longitud",
      },
      {
        id: 4,
        validation_step_name: "Validación de cesión de derechos y carta 3.1.8",
      },
      {
        id: 5,
        validation_step_name:
          "Validación de datos comerciales del proveedor/comprador",
      },
      {
        id: 6,
        validation_step_name: "Validación de datos del importador/exportador",
      },
      {
        id: 7,
        validation_step_name: "Validación de pesos",
      },
    ],
    low: [],
  },
};
