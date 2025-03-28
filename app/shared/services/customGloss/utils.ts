const documentTypes = [
  'pedimento',
  'documentoDeTransporte',
  'factura',
  'carta318',
  'cartaCesionDeDerechos',
  'cove',
  'rrna',
  'listaDeEmpaque',
  'cfdi',
  'otros',
] as const;

export type DocumentType = (typeof documentTypes)[number];
