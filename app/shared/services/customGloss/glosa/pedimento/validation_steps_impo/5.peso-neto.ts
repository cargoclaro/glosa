import type { OCR } from '~/lib/utils';
import type { Pedimento } from '../../../extract-and-structure/schemas';
import type { PackingList } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

async function validatePesosYBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR,
  packingList?: PackingList,
  invoice?: OCR,
  carta318?: OCR
) {
  // Extract weight values from pedimento
  const pesoBrutoPedimento = pedimento.encabezadoPrincipalDelPedimento.pesoBruto;
  const observaciones = pedimento.observacionesANivelPedimento;

  // Get markdown representations
  const transportDocmkdown = transportDocument?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;

  const validation = {
    name: 'Peso bruto',
    description:
      'Valida que los pesos y bultos declarados en el pedimento coincidan con los documentos anexos',
    prompt:
      'Para validar los pesos y bultos, sigue estos pasos detallados:\n\n1. Verifica que el peso bruto declarado en el pedimento sea igual o menor a alguno de los pesos declarados en el documento de transporte, packing list o factura.\n2. Asegúrate de que el peso bruto declarado en el pedimento coincida con el peso declarado en el documento de transporte, carta 318 o packing list. La relación entre estos pesos debe ser lógica y consistente.',
    contexts: {
      PROVIDED: {
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
          data: [
            {
              name: 'Lista de empaque',
              value: JSON.stringify(packingList, null, 2),
            },
          ],
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
  transportDocument?: OCR
) {
  // Extract bultos values from pedimento
  const bultosPedimento =
    pedimento.encabezadoPrincipalDelPedimento.marcasNumerosBultos?.totalDeBultos;
  const observaciones = pedimento.observacionesANivelPedimento;

  // Get markdown representation
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Marcas, números y total de bultos',
    description:
      'Valida que el número total de bultos coincida entre el pedimento y el documento de transporte',
    prompt:
      'El número total de bultos debe coincidir entre el pedimento y el documento de transporte. Si no hay documento de transporte, marcar como advertencia.',
    contexts: {
      PROVIDED: {
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

export async function pesosYBultos({
  pedimento,
  transportDocument,
  packingList,
  invoice,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  packingList?: PackingList;
  invoice?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validatePesosYBultos(
      traceId,
      pedimento,
      transportDocument,
      packingList,
      invoice
    ),
    validateBultos(traceId, pedimento, transportDocument),
  ]);

  return {
    sectionName: 'Pesos y bultos',
    validations: validationsPromise,
  };
}
