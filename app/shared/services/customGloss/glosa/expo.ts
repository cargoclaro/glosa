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
  // COVE validations - Section 1: datos_generales
  const tracedCoveValidations_1 = traceable(
    async () =>
      Promise.all([
        validateNumeroFactura(cove, cfdi),
        validateFechaExpedicion(cove, cfdi),
        validateRfc(cove, cfdi),
      ]),
    { name: "1.datos_generales" }
  );

  // COVE validations - Section 2: datos_proveedor_destinatario
  const tracedCoveValidations_2 = traceable(
    async () =>
      Promise.all([
        validateDatosGeneralesProveedor(cove, cfdi),
        validateDomicilioProveedor(cove, cfdi),
        validateDatosGeneralesDestinatario(cove, cfdi),
        validateDomicilioDestinatario(cove, cfdi),
      ]),
    { name: "2.datos_proveedor_destinatario" }
  );

  // COVE validations - Section 3: validacion_mercancias
  const tracedCoveValidations_3 = traceable(
    async () =>
      Promise.all([
        validateMercancias(cove, cfdi),
        validateValorTotalDolares(cove, cfdi),
      ]),
    { name: "3.validacion_mercancias" }
  );

  // Pedimento validations - Section 2: tipo-operacion
  const tracedPedimentoValidations_2 = traceable(
    async () =>
      Promise.all([
        validateCoherenciaOrigenDestino(pedimento, transportDocument),
        validateClavePedimento(pedimento),
        validateRegimen(pedimento),
      ]),
    { name: "2.tipo-operacion" }
  );

  // Pedimento validations - Section 3: origen-destino
  const tracedPedimentoValidations_3 = traceable(
    async () =>
      Promise.all([
        validateClaveApendice15(pedimento),
      ]),
    { name: "3.origen-destino" }
  );

  // Pedimento validations - Section 4: operacion-monetaria
  const tracedPedimentoValidations_4 = traceable(
    async () =>
      Promise.all([
        validateFechaSalida(pedimento, transportDocument),
        validateTipoCambio(pedimento),
        validateValorComercial(pedimento, cove, cfdi),
        validateValorDolares(pedimento, cove, cfdi),
      ]),
    { name: "4.operacion-monetaria" }
  );

  // Pedimento validations - Section 5: peso-neto
  const tracedPedimentoValidations_5 = traceable(
    async () =>
      Promise.all([
        validatePesosYBultos(pedimento, transportDocument, packingList, cfdi),
        validateBultos(pedimento, transportDocument),
      ]),
    { name: "5.peso-neto" }
  );

  // Factura validations - Section 6: datos-de-factura
  const tracedFacturaValidations_6 = traceable(
    async () =>
      Promise.all([
        validateRfcFormat(pedimento, cove, cfdi),
        validateCesionDerechos(pedimento, cartaSesion, cfdi),
        validateDatosImportador(pedimento, cove, cfdi),
        validateDatosProveedor(pedimento, cove, cfdi),
        validateFechasYFolios(pedimento, cove, cfdi),
        validateMonedaYEquivalencia(pedimento, cove, cfdi),
      ]),
    { name: "6.datos-de-factura" }
  );

  // Transporte validations - Section 7: datos-del-transporte
  const tracedTransporteValidations_7 = traceable(
    async () =>
      Promise.all([
        validateTipoTransporte(pedimento),
        validateModalidadMedioTransporte(pedimento, transportDocument),
        validateNumeroGuiaEmbarque(pedimento, transportDocument),
      ]),
    { name: "7.datos-del-transporte" }
  );

  // Partidas validations - Section 9: partidas
  const tracedPartidasValidations_9 = traceable(
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
    { name: "9.partidas" }
  );

  // Run all traced groups concurrently
  return Promise.all([
    tracedCoveValidations_1(),
    tracedCoveValidations_2(),
    tracedCoveValidations_3(),
    tracedPedimentoValidations_2(),
    tracedPedimentoValidations_3(),
    tracedPedimentoValidations_4(),
    tracedPedimentoValidations_5(),
    tracedFacturaValidations_6(),
    tracedTransporteValidations_7(),
    tracedPartidasValidations_9()
  ]);
}
