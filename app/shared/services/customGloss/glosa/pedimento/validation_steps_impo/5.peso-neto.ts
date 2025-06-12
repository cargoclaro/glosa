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
  carta318?: OCR,
  acuseTransporte?: OCR
) {
  const pesoBrutoPedimento = pedimento.encabezadoPrincipalDelPedimento.pesoBruto;
  const observaciones = pedimento.observacionesANivelPedimento;

  const transportDocmkdown = transportDocument?.markdown_representation;
  const invoicemkdown = invoice?.markdown_representation;
  const carta318mkdown = carta318?.markdown_representation;
  const acuseTransportemkdown = acuseTransporte?.markdown_representation;

  const validation = {
    name: 'Peso bruto',
    description:
      'Valida que los pesos declarados en el pedimento sean consistentes con documentos soporte incluyendo el acuse de transporte.',
    prompt:
      'Valida lo siguiente para el peso bruto declarado:\n\n' +
      '1. Verifica que el peso bruto en el pedimento sea igual o menor al peso declarado en documento de transporte, lista de empaque, factura, certificado de peso del almacén o acuse de transporte (artículo 20, sección 7 LADUANA).\n' +
      '2. Revisa que exista lógica y consistencia entre los pesos declarados en pedimento, carta 318, lista de empaque, factura y acuse de transporte.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Peso bruto', value: pesoBrutoPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [{ name: 'Documento de transporte', value: transportDocmkdown }],
        },
        'Lista de empaque': {
          data: [{ name: 'Lista de empaque', value: JSON.stringify(packingList, null, 2) }],
        },
        Factura: {
          data: [{ name: 'Factura', value: invoicemkdown }],
        },
        'Carta 318': {
          data: [{ name: 'Carta 318', value: carta318mkdown }],
        },
        'Acuse de transporte': {
          data: [{ name: 'Acuse de transporte', value: acuseTransportemkdown }],
        },
      },
      EXTERNAL: {
        'Ley Aduanera': {
          data: [
            {
              name: 'Artículo 20, Sección 7',
              value:
                'El peso bruto declarado en el pedimento deberá coincidir con el documento de transporte, lista de empaque, factura, certificado de peso del almacén o acuse de transporte.',
            },
          ],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId, 'gpt-4o');
}

async function validateBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR,
  acuseTransporte?: OCR
) {
  const bultosPedimento = pedimento.encabezadoPrincipalDelPedimento.marcasNumerosBultos?.totalDeBultos;
  const observaciones = pedimento.observacionesANivelPedimento;

  const transportDocmkdown = transportDocument?.markdown_representation;
  const acuseTransportemkdown = acuseTransporte?.markdown_representation;

  const validation = {
    name: 'Marcas, números y total de bultos',
    description:
      'Valida que el número total de bultos coincida entre pedimento, documento de transporte y acuse de transporte.',
    prompt:
      'Valida que el número total de bultos declarados en el pedimento coincida con el documento de transporte y el acuse de transporte. Si falta documento o acuse, márcalo como advertencia.',
    contexts: {
      PROVIDED: {
        Pedimento: {
          data: [
            { name: 'Número de bultos', value: bultosPedimento },
            { name: 'Observaciones', value: observaciones },
          ],
        },
        'Documento de transporte': {
          data: [{ name: 'Documento de transporte', value: transportDocmkdown }],
        },
        'Acuse de transporte': {
          data: [{ name: 'Acuse de transporte', value: acuseTransportemkdown }],
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
  acuseTransporte,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  packingList?: PackingList;
  invoice?: OCR;
  acuseTransporte?: OCR;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validatePesosYBultos(traceId, pedimento, transportDocument, packingList, invoice, undefined, acuseTransporte),
    validateBultos(traceId, pedimento, transportDocument, acuseTransporte),
  ]);

  return {
    sectionName: 'Pesos y bultos',
    validations: validationsPromise,
  };
}
