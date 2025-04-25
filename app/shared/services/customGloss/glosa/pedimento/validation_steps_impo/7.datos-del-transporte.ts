import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import { apendice3 } from '../../anexo-22/apendice-3';
import { apendice10 } from '../../anexo-22/apendice-10';
import { glosar } from '../../validation-result';

async function validateTipoTransporte(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  // Extract transport type from pedimento
  const tipoTransporte =
    pedimento.contenedoresOEquipoFerrocarrilONumeroEconomicoVehiculo?.tipo;
  const observaciones = pedimento.observacionesANivelPedimento;
  const tipoTransporteEntradaSalida =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Tipo de transporte',
    description:
      'Valida que la clave del tipo de transporte coincida con el tipo de transporte utilizado',
    prompt:
      'La clave del tipo de transporte debe existir en el apéndice 10. Debe hacer sentido con el tipo de transporte que se proporciona (apendice 3 para saber el tipo de transporte), si es un BL terrestre, debe de ser una clave de un vehículo terrestre, lo mismo para marítimo, ferroviario o aero. Analiza el documento de transporte para determinar que tipo de transporte hay. Si no hay documento de transporte y la clave del pedimento corresponde a algo terrestre, asume que esta bien, por que a veces en operaciones terrestre no se pone documento de transporte.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Tipo de transporte', value: tipoTransporte },
            { name: 'Observaciones', value: observaciones },
            {
              name: 'Tipo de transporte (entrada/salida)',
              value: tipoTransporteEntradaSalida,
            },
          ],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Anexo 22 -> Apendices': {
          data: [
            { name: 'Apéndice 10', value: JSON.stringify(apendice10) },
            { name: 'Apéndice 3', value: JSON.stringify(apendice3) },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateModalidadMedioTransporte(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  // Extract transport means from pedimento
  const tipoTransporteEntradaSalida =
    pedimento.encabezadoPrincipalDelPedimento.tipoDeOperacion;
  const observaciones = pedimento.observacionesANivelPedimento;

  // Get markdown representation
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Modalidad y medio de transporte',
    description:
      'Valida que la modalidad del documento de transporte coincida con el medio de transporte declarado en el pedimento según el Apéndice 3',
    prompt:
      "La modalidad del documento de transporte y el medio de transporte deben ser coherentes entre sí. En transporte terrestre, puede no existir un documento de transporte, pero si lo hay, debe coincidir con el pedimento. Si la clave del medio de transporte es '7' (carretero) y no se proporciona modalidad de documento, esto es válido, pero se debe verificar que no falte información en documentos de transporte relacionados. Validar contra el apendice 3.",
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            {
              name: 'Tipo de transporte (entrada/salida)',
              value: tipoTransporteEntradaSalida,
            },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
      EXTERNAL: {
        'Anexo 22 -> Apendices': {
          data: [{ name: 'Apéndice 3', value: JSON.stringify(apendice3) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateNumeroGuiaEmbarque(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  // Extract guide/shipment number from pedimento
  // TODO: No se si deberia ser el Master o el House number
  const numeroGuiaEmbarque =
    pedimento.guiasOManifiestosOConocimientosDeEmbarqueODocumentosDeTransporte
      ?.numeroMaster;
  const observaciones = pedimento.observacionesANivelPedimento;

  // Get markdown representation
  const transportDocmkdown = transportDocument?.markdown_representation;
  const validation = {
    name: 'Número de guía o embarque',
    description:
      'Valida que el número de guía o embarque del pedimento coincida con el documento de transporte según el tipo de transporte utilizado',
    prompt:
      'En caso de transporte terrestre, el valor es correcto porque se envía el mismo día del pago del pedimento, y puede no existir un documento de transporte. Para transporte marítimo, el número de guía o embarque del pedimento debe ser exactamente igual al número de contenedor, placa, o master y house del documento de transporte. Para transporte aéreo, el número de guía o embarque del pedimento debe ser exactamente igual al número master y house del documento de transporte. Si el documento de transporte no cuenta con estos datos, se debe validar con el documento oficial proporcionado por la naviera o agente de carga.Nota: En el pedimento pueden venir más de un valor, en caso de master y house, denotados por M y H respectivamente.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Número de guía/embarque', value: numeroGuiaEmbarque },
            {
              name: 'Tipo de transporte',
              value:
                pedimento.encabezadoPrincipalDelPedimento.mediosTransporte
                  .entradaSalida,
            },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function datosDelTransporte({
  pedimento,
  transportDocument,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validateTipoTransporte(traceId, pedimento, transportDocument),
    validateModalidadMedioTransporte(traceId, pedimento, transportDocument),
    validateNumeroGuiaEmbarque(traceId, pedimento, transportDocument),
  ]);

  return {
    sectionName: 'Datos del transporte',
    validations: validationsPromise,
  };
}
