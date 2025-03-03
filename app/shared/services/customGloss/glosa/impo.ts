import { Pedimento, TransportDocument, PackingList, Cove, CartaSesion, Invoice, Carta318 } from '../data-extraction/schemas';
import {
  validateNumeroFactura,
  validateFechaExpedicion,
} from './cove/validation_steps_impo/1.datos_generales';
import {
  validateDatosGeneralesProveedor,
  validateDomicilioProveedor,
  validateDatosGeneralesDestinatario,
  validateDomicilioDestinatario
} from './cove/validation_steps_impo/2.datos_proveedor_destinatario';
import {
  validateMercancias,
  validateValorTotalDolares
} from './cove/validation_steps_impo/3.validacion_mercancias';
import { validateCoherenciaOrigenDestino, validateClavePedimento, validateRegimen } from './pedimento/validation_steps_impo/2.tipo-operacion';
import { validateClaveApendice15 } from './pedimento/validation_steps_impo/3.origen-destino';
import { 
  validateTransportDocumentEntryDate,
  validateTipoCambio,
  validateIncrementables,
  validateValoresPedimento
} from './pedimento/validation_steps_impo/4.operacion-monetaria';
import {
  validatePesosYBultos,
  validateBultos
} from './pedimento/validation_steps_impo/5.peso-neto';
import {
  validateRfcFormat,
  validateCesionDerechos,
  validateDatosImportador,
  validateDatosProveedor,
  validateFechasYFolios,
  validateMonedaYEquivalencia
} from './pedimento/validation_steps_impo/6.datos-de-factura';
import {
  validateTipoTransporte,
  validateModalidadMedioTransporte,
  validateNumeroGuiaEmbarque
} from './pedimento/validation_steps_impo/7.datos-del-transporte';
import {
  validatePreferenciaArancelaria,
  validateCoherenciaUMC,
  validateCoherenciaPeso,
  validateCalculoDTA,
  validateCalculoContribuciones,
  validatePermisosIdentificadores,
  validateRegulacionesArancelarias,
  validateRegulacionesNoArancelarias
} from './pedimento/validation_steps_impo/9.partidas';
import { traceable } from "langsmith/traceable";

export async function glosaImpo({
  pedimento,
  transportDocument,
  packingList,
  cove,
  cartaSesion,
  invoice,
  carta318
}: {
  pedimento: Pedimento;
  transportDocument?: TransportDocument;
  packingList?: PackingList;
  cove: Cove;
  cartaSesion?: CartaSesion;
  invoice?: Invoice;
  carta318?: Carta318;
}) {
  // Group and trace COVE-related validations
  const tracedCoveValidations = traceable(
    async () =>
      Promise.all([
        validateNumeroFactura(cove, invoice, carta318),
        validateFechaExpedicion(cove, invoice, carta318),
        validateDatosGeneralesProveedor(cove, invoice, carta318),
        validateDomicilioProveedor(cove, invoice, carta318),
        validateDatosGeneralesDestinatario(cove, invoice, carta318),
        validateDomicilioDestinatario(cove, invoice, carta318),
        validateMercancias(cove, invoice, carta318),
        validateValorTotalDolares(cove, invoice, carta318),
      ]),
    { name: "CoveValidationsImpo" }
  );

  // Group and trace Pedimento validations (tipo-operacion & origen-destino)
  const tracedPedimentoValidations = traceable(
    async () =>
      Promise.all([
        validateCoherenciaOrigenDestino(pedimento, transportDocument),
        validateClavePedimento(pedimento),
        validateRegimen(pedimento),
        validateClaveApendice15(pedimento),
      ]),
    { name: "PedimentoValidationsImpo" }
  );

  // Group and trace monetary validations (operacion-monetaria)
  const tracedMonetaryValidations = traceable(
    async () =>
      Promise.all([
        validateTransportDocumentEntryDate(pedimento, transportDocument),
        validateTipoCambio(pedimento),
        validateIncrementables(pedimento, invoice, transportDocument, carta318),
        validateValoresPedimento(pedimento, invoice, transportDocument, carta318),
      ]),
    { name: "MonetaryValidationsImpo" }
  );

  // Group and trace peso-neto validations
  const tracedPesoValidations = traceable(
    async () =>
      Promise.all([
        validatePesosYBultos(pedimento, transportDocument, packingList, invoice),
        validateBultos(pedimento, transportDocument),
      ]),
    { name: "PesoValidationsImpo" }
  );

  // Group and trace factura-related validations (datos-de-factura)
  const tracedFacturaValidations = traceable(
    async () =>
      Promise.all([
        validateRfcFormat(pedimento, cove, carta318),
        validateCesionDerechos(pedimento, cartaSesion, carta318),
        validateDatosImportador(pedimento, cove, carta318),
        validateDatosProveedor(pedimento, cove, carta318),
        validateFechasYFolios(pedimento, cove, invoice, carta318),
        validateMonedaYEquivalencia(pedimento, cove, carta318, invoice),
      ]),
    { name: "FacturaValidationsImpo" }
  );

  // Group and trace transporte validations
  const tracedTransporteValidations = traceable(
    async () =>
      Promise.all([
        validateTipoTransporte(pedimento),
        validateModalidadMedioTransporte(pedimento, transportDocument),
        validateNumeroGuiaEmbarque(pedimento, transportDocument),
      ]),
    { name: "TransporteValidationsImpo" }
  );

  // Group and trace partidas validations
  const tracedPartidasValidations = traceable(
    async () =>
      Promise.all([
        validatePreferenciaArancelaria(pedimento),
        validateCoherenciaUMC(pedimento, invoice),
        validateCoherenciaPeso(pedimento),
        validateCalculoDTA(pedimento),
        validateCalculoContribuciones(pedimento),
        validatePermisosIdentificadores(pedimento),
        validateRegulacionesArancelarias(pedimento),
        validateRegulacionesNoArancelarias(pedimento),
      ]),
    { name: "PartidasValidationsImpo" }
  );

  // Run all traced groups concurrently
  return Promise.all([
    tracedCoveValidations(),
    tracedPedimentoValidations(),
    tracedMonetaryValidations(),
    tracedPesoValidations(),
    tracedFacturaValidations(),
    tracedTransporteValidations(),
    tracedPartidasValidations(),
  ]);
}
