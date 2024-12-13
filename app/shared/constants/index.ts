export const INITIAL_STATE_RESPONSE = {
  success: false,
  message: "",
  errors: {},
};

export const GLOSS_ANALYSIS_TABS = [
  { id: "pedimentNum", title: "Num. Pedimento" },
  { id: "operationType", title: "Tipo de Operación" },
  { id: "destinationOrigin", title: "Destino/Origen" },
  { id: "operation", title: "Operación" },
  { id: "grossWeight", title: "Peso Bruto" },
  { id: "invoiceData", title: "Datos de Factura" },
  { id: "transportData", title: "Datos de Transporte" },
  { id: "certification", title: "Partidas" },
];

export const DUMP_GLOSS_FOR_CREATION = {
  summary: "Custom Gloss Example Summary",
  timeSaved: 12.5,
  moneySaved: 3000.75,
  importerName: "Importer S.A.",
  pedimentNum: {
    number: 12345,
    status: "Validation",
    anio: 2024,
  },
  operationType: {
    status: "Validation",
    data: '[{"id": 1,"name":"Tipo de Operación", "value": "IMP", "is_check": true}]',
    appendices:
      '[{"id": 1, "title": "APENDICE 2", "description": "(justificacion del llm)", "status": "CHECKED", "result": "Cumplimiento Condicional", "comparisons": "[{\\"id\\": 1, \\"title\\": \\"Descripción del Producto (Ficha Técnica)\\", \\"description\\": \\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\", \\"links\\": \\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\"}]", "actions_to_take": "[{\\"id\\": 1, \\"description\\": \\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\"}]", "summary": "(sin especificar)"}]',
  },
  destinationOrigin: {
    status: "Validation",
    destinationOriginKey: "9",
    appendixValidator: "Apéndice 15",
    appendices:
      '[{"id": 1,"title":"APENDICE 2", "description": "(justificacion del llm)", "status": "CHECKED", "result": "Cumplimiento Condicional", "comparisons": "[{\\"id\\": 1, \\"title\\": \\"Descripción del Producto (Ficha Técnica)\\",\\"description\\": \\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\", \\"links\\": \\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\"}]", "actions_to_take": "[{\\"id\\": 1, \\"description\\": \\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\"}]", "summary": "(sin especificar)"}]',
  },
  operation: {
    status: "Validation",
    calculations:
      '[{"id": 1,"title":"Fecha de Entrada", "description": "(justificacion del llm)", "status": "CHECKED", "result": "(sin especificar)", "comparisons": "[{\\"id\\": 1, \\"title\\": \\"Descripción del Producto (Ficha Técnica)\\",\\"description\\": \\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\", \\"links\\": \\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\"}]", "actions_to_take": "[{\\"id\\": 1, \\"description\\": \\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\"}]", "summary": "(sin especificar)"}]',
  },
  grossWeight: {
    status: "Validation",
    calculations:
      '[{"id": 1,"title":"Peso Neto Pedimento", "description": "(justificacion del llm)", "status": "CHECKED", "result": "(sin especificar)", "comparisons": "[{\\"id\\": 1, \\"title\\": \\"Descripción del Producto (Ficha Técnica)\\",\\"description\\": \\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\", \\"links\\": \\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\"}]", "actions_to_take": "[{\\"id\\": 1, \\"description\\": \\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\"}]", "summary": "(sin especificar)"}]',
  },
  invoiceData: {
    status: "Validation",
    importerExporter:
      '{"rfc_is_check": true, "tax_address_is_check": true, "company_name_is_check": true, "details": "{\\"id\\": 1, \\"title\\": \\"Importador/Exportador\\", \\"description\\": \\"(justificacion del llm)\\", \\"status\\": \\"CHECKED\\", \\"result\\": \\"(sin especificar)\\", \\"comparisons\\": \\"[{\\\\\\"id\\\\\\": 1, \\\\\\"title\\\\\\": \\\\\\"Descripción del Producto (Ficha Técnica)\\\\\\", \\\\\\"description\\\\\\": \\\\\\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\\\\\", \\\\\\"links\\\\\\": \\\\\\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\\\\\"}]\\", \\"actions_to_take\\": \\"[{\\\\\\"id\\\\\\": 1, \\\\\\"description\\\\\\": \\\\\\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\\\\\"}]\\", \\"summary\\": \\"(sin especificar)\\"}"}',
    supplierBuyer:
      '{"company_name_is_check": true, "address_is_check": true, "tax_id": true, "details": "{\\"id\\": 1, \\"title\\": \\"Proveedor/Comprador\\", \\"description\\": \\"(justificacion del llm)\\", \\"status\\": \\"CHECKED\\", \\"result\\": \\"(sin especificar)\\", \\"comparisons\\": \\"[{\\\\\\"id\\\\\\": 1, \\\\\\"title\\\\\\": \\\\\\"Descripción del Producto (Ficha Técnica)\\\\\\",\\\\\\"description\\\\\\": \\\\\\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\\\\\", \\\\\\"links\\\\\\": \\\\\\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\\\\\"}]\\", \\"actions_to_take\\": \\"[{\\\\\\"id\\\\\\": 1, \\\\\\"description\\\\\\": \\\\\\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\\\\\"}]\\", \\"summary\\": \\"(sin especificar)\\"}"}',
  },
  transportData: {
    status: "Validation",
    type: "LAND",
    data: '[{"id": 1,"title":"Medio de Transporte", "description": "(justificacion del llm)", "status": "CHECKED", "result": "(sin especificar)", "comparisons": "[{\\"id\\": 1, \\"title\\": \\"Descripción del Producto (Ficha Técnica)\\",\\"description\\": \\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\", \\"links\\": \\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\"}]", "actions_to_take": "[{\\"id\\": 1, \\"description\\": \\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\"}]", "summary": "(sin especificar)"}]',
  },
  certification: {
    status: "Validation",
    taxes: '[{"id": 1,"tax":16, "type": "IVA", "is_check": true}]',
    restrictionsRegulations:
      '[{"id": 1,"title":"(NOM-024-SCFI-2013)", "description": "Se requiere etiquetado, a menos que...", "status": "WARNING", "result": "Cumplimiento Obligatorio", "comparisons": "[{\\"id\\": 1, \\"title\\": \\"Descripción del Producto (Ficha Técnica)\\",\\"description\\": \\"⚠️ Cumple parcialmente - El producto está correctamente descrito con nombre, marca, y modelo, **pero tiene una dimensión de 3mm, lo que no lo exenta de la norma**.\\", \\"links\\": \\"[(Ver Artículo 6.1 - Descripción técnica obligatoria para productos mayores o iguales a 3mm)](https://google.com) [(Ver Ficha Técnica - Sección de Dimensiones)](https://bing.com)\\"}]", "actions_to_take": "[{\\"id\\": 1, \\"description\\": \\"Cumplimiento Obligatorio: El producto no está exento y debe cumplir con la NOM-024-SCFI-2013. **Se ha indicado con el identificador EN en el sistema para reflejar esta obligación**.\\"}]", "summary": "(sin especificar)"}]',
  },
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
