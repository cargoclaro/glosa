import { Pedimento, TransportDocument, PackingList, Cove, Cfdi, CartaSesion } from '../data-extraction/schemas';
import {
  validateNumeroFactura,
  validateFechaExpedicion,
  validateRfc
} from './cove/validation_steps_expo/1.datos_generales';
import {
  validateDatosGeneralesProveedor,
  validateDomicilioProveedor,
  validateDatosGeneralesDestinatario,
  validateDomicilioDestinatario
} from './cove/validation_steps_expo/2.datos_proveedor_destinatario';
import {
  validateMercancias,
  validateValorTotalDolares
} from './cove/validation_steps_expo/3.validacion_mercancias';
import { validateCoherenciaOrigenDestino, validateClavePedimento, validateRegimen } from './pedimento/validation_steps_expo/2.tipo-operacion';
import { validateClaveApendice15 } from './pedimento/validation_steps_expo/3.origen-destino';
import { 
  validateFechaSalida,
  validateTipoCambio,
  validateValorComercial,
  validateValorDolares,
} from './pedimento/validation_steps_expo/4.operacion-monetaria';
import {
  validatePesosYBultos,
  validateBultos
} from './pedimento/validation_steps_expo/5.peso-neto';
import {
  validateRfcFormat,
  validateCesionDerechos,
  validateDatosImportador,
  validateDatosProveedor,
  validateFechasYFolios,
  validateMonedaYEquivalencia
} from './pedimento/validation_steps_expo/6.datos-de-factura';
import {
  validateTipoTransporte,
  validateModalidadMedioTransporte,
  validateNumeroGuiaEmbarque
} from './pedimento/validation_steps_expo/7.datos-del-transporte';
import {
  validatePreferenciaArancelaria,
  validateCoherenciaUMC,
  validateCoherenciaPeso,
  validateCalculoDTA,
  validateCalculoContribuciones,
  validatePermisosIdentificadores,
  validateRegulacionesArancelarias,
  validateRegulacionesNoArancelarias
} from './pedimento/validation_steps_expo/9.partidas';
import { traceable } from "langsmith/traceable";

export async function glosaExpo({
  pedimento,
  transportDocument,
  packingList,
  cove,
  cfdi,
  cartaSesion
}: {
  pedimento: Pedimento;
  transportDocument?: TransportDocument;
  packingList?: PackingList;
  cove: Cove;
  cfdi?: Cfdi;
  cartaSesion?: CartaSesion;
}) {
  // Group and trace the COVE validations
  const tracedCoveValidations = traceable(
    async () =>
      Promise.all([
        validateNumeroFactura(cove, cfdi),
        validateFechaExpedicion(cove, cfdi),
        validateRfc(cove, cfdi),
        validateDatosGeneralesProveedor(cove, cfdi),
        validateDomicilioProveedor(cove, cfdi),
        validateDatosGeneralesDestinatario(cove, cfdi),
        validateDomicilioDestinatario(cove, cfdi),
        validateMercancias(cove, cfdi),
        validateValorTotalDolares(cove, cfdi),
      ]),
    { name: "CoveValidations" }
  );

  // Group and trace the Pedimento validations
  const tracedPedimentoValidations = traceable(
    async () =>
      Promise.all([
        validateCoherenciaOrigenDestino(pedimento, transportDocument),
        validateClavePedimento(pedimento),
        validateRegimen(pedimento),
        validateClaveApendice15(pedimento),
        validateFechaSalida(pedimento, transportDocument),
        validateTipoCambio(pedimento),
        validateValorComercial(pedimento, cove, cfdi),
        validateValorDolares(pedimento, cove, cfdi),
        validatePesosYBultos(pedimento, transportDocument, packingList, cfdi),
        validateBultos(pedimento, transportDocument),
      ]),
    { name: "PedimentoValidations" }
  );

  // Group and trace the factura-related validations
  const tracedFacturaValidations = traceable(
    async () =>
      Promise.all([
        validateRfcFormat(pedimento, cove, cfdi),
        validateCesionDerechos(pedimento, cartaSesion, cfdi),
        validateDatosImportador(pedimento, cove, cfdi),
        validateDatosProveedor(pedimento, cove, cfdi),
        validateFechasYFolios(pedimento, cove, cfdi),
        validateMonedaYEquivalencia(pedimento, cove, cfdi),
      ]),
    { name: "FacturaValidations" }
  );

  // Group and trace the transporte validations
  const tracedTransporteValidations = traceable(
    async () =>
      Promise.all([
        validateTipoTransporte(pedimento),
        validateModalidadMedioTransporte(pedimento, transportDocument),
        validateNumeroGuiaEmbarque(pedimento, transportDocument),
      ]),
    { name: "TransporteValidations" }
  );

  // Group and trace the partidas validations
  const tracedPartidasValidations = traceable(
    async () =>
      Promise.all([
        validatePreferenciaArancelaria(pedimento),
        validateCoherenciaUMC(pedimento, cfdi),
        validateCoherenciaPeso(pedimento, cfdi),
        validateCalculoDTA(pedimento),
        validateCalculoContribuciones(pedimento, cfdi),
        validatePermisosIdentificadores(pedimento),
        validateRegulacionesArancelarias(pedimento),
        validateRegulacionesNoArancelarias(pedimento),
      ]),
    { name: "PartidasValidations" }
  );

  // Run all traced groups concurrently
  return Promise.all([
    tracedCoveValidations(),
    tracedPedimentoValidations(),
    tracedFacturaValidations(),
    tracedTransporteValidations(),
    tracedPartidasValidations()
  ]);
}
