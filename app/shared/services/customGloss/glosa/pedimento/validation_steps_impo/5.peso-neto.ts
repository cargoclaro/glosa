import { CustomGlossTabContextType } from '@prisma/client';
import { traceable } from 'langsmith/traceable';
import type { Carta318 } from '../../../data-extraction/mkdown_schemas/carta-318';
import type { Invoice } from '../../../data-extraction/mkdown_schemas/invoice';
import type { PackingList } from '../../../data-extraction/mkdown_schemas/packing-list';
import type { TransportDocument } from '../../../data-extraction/mkdown_schemas/transport-document';
import type { Pedimento } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

async function validatePesosYBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument,
  packingList?: PackingList,
  invoice?: Invoice,
  carta318?: Carta318
) {
  // Extract weight values from pedimento
  const pesoBrutoPedimento = pedimento.encabezado_del_pedimento?.peso_bruto;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  // Get markdown representations
  const transportDocmkdown = transportDocument?.markdown_representation;
  const packingListmkdown = packingList?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Validación de pesos y bultos',
    description:
      'Valida que los pesos y bultos declarados en el pedimento coincidan con los documentos anexos',
    prompt:
      'Para validar los pesos y bultos, sigue estos pasos detallados:\n\n1. Verifica que el peso bruto declarado en el pedimento sea igual o menor a alguno de los pesos declarados en el documento de transporte, packing list o factura.\n2. Asegúrate de que el peso bruto declarado en el pedimento coincida con el peso declarado en el documento de transporte, carta 318 o packing list. La relación entre estos pesos debe ser lógica y consistente.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        Pedimento: {
          data: [
            { name: 'Peso bruto', value: pesoBrutoPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [
            { name: 'Documento de transporte', value: transportDocmkdown },
          ],
        },
        'Lista de empaque': {
          data: [{ name: 'Lista de empaque', value: packingListmkdown }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o');
}

async function validateBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument
) {
  // Extract bultos values from pedimento
  const bultosPedimento =
    pedimento.identificadores_nivel_pedimento?.marcas_numeros_bultos;
  const observaciones = pedimento.observaciones_a_nivel_pedimento;

  // Get markdown representation
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Coincidencia de bultos',
    description:
      'Valida que el número total de bultos coincida entre el pedimento y el documento de transporte',
    prompt:
      'El número total de bultos debe coincidir entre el pedimento y el documento de transporte. Si no hay documento de transporte, marcar como advertencia.',
    contexts: {
      [CustomGlossTabContextType.PROVIDED]: {
        Pedimento: {
          data: [
            { name: 'Número de bultos', value: bultosPedimento },
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

  return await glosar(validation, traceId, 'o3-mini');
}

export const tracedPesosYBultos = traceable(
  async ({
    pedimento,
    transportDocument,
    packingList,
    invoice,
    traceId,
  }: {
    pedimento: Pedimento;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    invoice?: Invoice;
    traceId: string;
  }) => {
    const validationsPromise = await Promise.all([
      validatePesosYBultos(traceId, pedimento, transportDocument, packingList, invoice),
      validateBultos(traceId, pedimento, transportDocument),
    ]);

    return {
      sectionName: 'Pesos y bultos',
      validations: validationsPromise,
    };
  },
  { name: 'Pedimento S5: Pesos y bultos' }
);
