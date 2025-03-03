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
import { 
  validateCoherenciaOrigenDestino, 
  validateClavePedimento, 
  validateRegimen 
} from './pedimento/validation_steps_impo/2.tipo-operacion';
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
  // COVE validations split by module sections

  // Section 1: datos_generales validations
  const tracedDatosGeneralesCove = traceable(
    async () =>
      Promise.all([
        validateNumeroFactura(cove, invoice, carta318),
        validateFechaExpedicion(cove, invoice, carta318),
      ]),
    { name: "1. datos_generales" }
  );

  // Section 2: datos_proveedor_destinatario validations
  const tracedDatosProveedorDestinatarioCove = traceable(
    async () =>
      Promise.all([
        validateDatosGeneralesProveedor(cove, invoice, carta318),
        validateDomicilioProveedor(cove, invoice, carta318),
        validateDatosGeneralesDestinatario(cove, invoice, carta318),
        validateDomicilioDestinatario(cove, invoice, carta318),
      ]),
    { name: "2. datos_proveedor_destinatario" }
  );

  // Section 3: validacion_mercancias validations
  const tracedMercanciasCove = traceable(
    async () =>
      Promise.all([
        validateMercancias(cove, invoice, carta318),
        validateValorTotalDolares(cove, invoice, carta318),
      ]),
    { name: "3. validacion_mercancias" }
  );

  // Pedimento validations split by module sections

  // Section 2: tipo-operacion validations
  const tracedTipoOperacionPedimento = traceable(
    async () =>
      Promise.all([
        validateCoherenciaOrigenDestino(pedimento, transportDocument),
        validateClavePedimento(pedimento),
        validateRegimen(pedimento),
      ]),
    { name: "2. tipo-operacion" }
  );

  // Section 3: origen-destino validations
  const tracedOrigenDestinoPedimento = traceable(
    async () =>
      Promise.all([
        validateClaveApendice15(pedimento),
      ]),
    { name: "3. origen-destino" }
  );

  // Monetary validations (Section 4: operacion-monetaria)
  const tracedMonetaryValidations = traceable(
    async () =>
      Promise.all([
        validateTransportDocumentEntryDate(pedimento, transportDocument),
        validateTipoCambio(pedimento),
        validateIncrementables(pedimento, invoice, transportDocument, carta318),
        validateValoresPedimento(pedimento, invoice, transportDocument, carta318),
      ]),
    { name: "4. operacion-monetaria" }
  );

  // Peso validations (Section 5: peso-neto)
  const tracedPesoValidations = traceable(
    async () =>
      Promise.all([
        validatePesosYBultos(pedimento, transportDocument, packingList, invoice),
        validateBultos(pedimento, transportDocument),
      ]),
    { name: "5. peso-neto" }
  );

  // Factura validations (Section 6: datos-de-factura)
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
    { name: "6. datos-de-factura" }
  );

  // Transporte validations (Section 7: datos-del-transporte)
  const tracedTransporteValidations = traceable(
    async () =>
      Promise.all([
        validateTipoTransporte(pedimento),
        validateModalidadMedioTransporte(pedimento, transportDocument),
        validateNumeroGuiaEmbarque(pedimento, transportDocument),
      ]),
    { name: "7. datos-del-transporte" }
  );

  // Partidas validations (Section 9: partidas)
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
    { name: "9. partidas" }
  );

  // Run all traced groups concurrently
  return Promise.all([
    tracedDatosGeneralesCove(),
    tracedDatosProveedorDestinatarioCove(),
    tracedMercanciasCove(),
    tracedTipoOperacionPedimento(),
    tracedOrigenDestinoPedimento(),
    tracedMonetaryValidations(),
    tracedPesoValidations(),
    tracedFacturaValidations(),
    tracedTransporteValidations(),
    tracedPartidasValidations(),
  ]);
}
