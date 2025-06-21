// Feature flag for V2 (section-based) validation
// This file controls which validation implementation to use.
// When set to true, uses the new prompt-based validation system.
// When set to false, uses the legacy validation implementation.
export const USE_SECTION_VALIDATION = {
  numeroDePedimento: true,
  tipoOperacion: true,
  origenDestino: true,
  operacionMonetaria: true,
  pesoNeto: true,
  datosDeFactura: true,
  datosDelTransporte: true,
  cuadroDeLiquidacion: true,
  partidas: true,
} as const;