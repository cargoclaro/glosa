import { traceable } from 'langsmith/traceable';
import type { TransportDocument } from '../../../data-extraction/mkdown_schemas';
import type { Pedimento } from '../../../data-extraction/schemas';
import { apendice3 } from '../../anexo-22/apendice_3';
import { apendice10 } from '../../anexo-22/apendice_10';
import { glosar } from '../../validation-result';

async function validateTipoTransporte(traceId: string, pedimento: Pedimento) {
  // Extract transport type from pedimento
  const tipoTransporteEntradaSalida =
    pedimento.medios_transporte?.entrada_salida;
  const tipoTransporteArribo = pedimento.medios_transporte?.arribo;
  const tipoTransporteSalida = pedimento.medios_transporte?.salida;

  const validation = {
    name: 'Clave del tipo de transporte',
    description:
      'Verificación de que la clave del tipo de transporte esté incluida en el apéndice 10',
    prompt: 'La clave del tipo de transporte debe existir en el apéndice 10.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            {
              name: 'Tipo de transporte (entrada/salida)',
              value: tipoTransporteEntradaSalida,
            },
            {
              name: 'Tipo de transporte (arribo)',
              value: tipoTransporteArribo,
            },
            {
              name: 'Tipo de transporte (salida)',
              value: tipoTransporteSalida,
            },
          ],
        },
      },
      EXTERNAL: {
        apendices: {
          data: [{ name: 'Apéndice 10', value: JSON.stringify(apendice10) }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateModalidadMedioTransporte(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument
) {
  // Extract transport means from pedimento
  const tipoTransporteEntradaSalida =
    pedimento.medios_transporte?.entrada_salida;

  const transportDocmkdown = transportDocument?.markdown_representation;
  const validation = {
    name: 'Modalidad y medio de transporte',
    description:
      'Verificación de coherencia entre la modalidad del documento de transporte y el medio de transporte declarado en el pedimento',
    prompt:
      "La modalidad del documento de transporte y el medio de transporte deben ser coherentes entre sí. En transporte terrestre, puede no existir un documento de transporte, pero si lo hay, debe coincidir con el pedimento. Si la clave del medio de transporte es '7' (carretero) y no se proporciona modalidad de documento, esto es válido, pero se debe verificar que no falte información en documentos de transporte relacionados. Validar contra el apendice 3.",
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            {
              name: 'Tipo de transporte (entrada/salida)',
              value: tipoTransporteEntradaSalida,
            },
          ],
        },
        documentoDeTransporte: {
          data: [{ name: 'Transport Document', value: transportDocmkdown }],
        },
      },
      EXTERNAL: {
        apendices: {
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
  transportDocument?: TransportDocument
) {
  // Extract guide/shipment number from pedimento
  const numeroGuiaEmbarque = pedimento.no_guia_embarque_id;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Número de guía o embarque',
    description:
      'Verificación de que el número de guía o embarque del pedimento coincida con el documento de transporte según el tipo de transporte utilizado',
    prompt:
      'En caso de transporte terrestre, el valor es correcto porque se envía el mismo día del pago del pedimento, y puede no existir un documento de transporte. Para transporte marítimo, el número de guía o embarque del pedimento debe ser exactamente igual al número de contenedor, placa, o master y house del documento de transporte. Para transporte aéreo, el número de guía o embarque del pedimento debe ser exactamente igual al número master y house del documento de transporte. Si el documento de transporte no cuenta con estos datos, se debe validar con el documento oficial proporcionado por la naviera o agente de carga.Nota: En el pedimento pueden venir más de un valor, en caso de master y house, denotados por M y H respectivamente.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [
            { name: 'Número de guía/embarque', value: numeroGuiaEmbarque },
            {
              name: 'Tipo de transporte',
              value: pedimento.medios_transporte?.entrada_salida,
            },
          ],
        },
        documentoDeTransporte: {
          data: [{ name: 'Transport Document', value: transportDocmkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export const tracedTipoTransporte = traceable(
  async ({
    pedimento,
    transportDocument,
    traceId,
  }: {
    pedimento: Pedimento;
    transportDocument?: TransportDocument;
    traceId: string;
  }) => {
    const validationsPromise = await Promise.all([
      validateTipoTransporte(traceId, pedimento),
      validateModalidadMedioTransporte(traceId, pedimento, transportDocument),
      validateNumeroGuiaEmbarque(traceId, pedimento, transportDocument),
    ]);

    return {
      sectionName: 'Datos del transporte',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S7: Tipo de transporte' }
);
