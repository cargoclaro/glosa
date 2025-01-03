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
