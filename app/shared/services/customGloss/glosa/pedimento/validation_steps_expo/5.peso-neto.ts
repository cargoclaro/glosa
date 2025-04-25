import type { OCR } from '~/lib/utils';
import type { CFDI, Pedimento } from '../../../extract-and-structure/schemas';
import type { PackingList } from '../../../extract-and-structure/schemas';
import { glosar } from '../../validation-result';

async function validatePesosYBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR,
  packingList?: PackingList,
  cfdi?: CFDI
) {
  // Extract weight values from pedimento
  const pesoBrutoPedimento =
    pedimento.encabezadoPrincipalDelPedimento.pesoBruto;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Validación de pesos y bultos',
    description:
      'Verificación de la consistencia de pesos brutos, netos y número de bultos entre el pedimento y los documentos soporte',
    prompt:
      'Para validar los pesos y bultos, sigue estos pasos detallados:\n\n1. Verifica que el peso bruto declarado en el pedimento sea igual o menor a alguno de los pesos declarados en el documento de transporte, packing list o CFDI.\n2. Asegúrate de que el peso bruto declarado en el pedimento coincida con el peso declarado en el documento de transporte, carta 318 o packing list. La relación entre estos pesos debe ser lógica y consistente.\n3. Comprueba que el peso neto declarado en el pedimento sea menor que el peso bruto y que sea consistente con los documentos soporte.\n4. Verifica que el número total de bultos coincida entre el pedimento, documento de transporte y/o CFDI',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Peso bruto', value: pesoBrutoPedimento }],
        },
        documentoDeTransporte: {
          data: [{ name: 'Transport Document', value: transportDocmkdown }],
        },
        listaDeEmpaque: {
          data: [
            {
              name: 'Packing List',
              value: JSON.stringify(packingList, null, 2),
            },
          ],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdi }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: OCR
) {
  // Extract bultos values from pedimento
  const bultosPedimento =
    pedimento.encabezadoPrincipalDelPedimento.marcasNumerosBultos
      ?.totalDeBultos;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Coincidencia de bultos',
    description:
      'Verificación de que el número total de bultos coincida entre el pedimento y el documento de transporte',
    prompt:
      'El número total de bultos debe coincidir entre el pedimento y el documento de transporte. Si no hay documento de transporte, marcar como advertencia.',
    contexts: {
      PROVIDED: {
        pedimento: {
          data: [{ name: 'Número de bultos', value: bultosPedimento }],
        },
        documentoDeTransporte: {
          data: [{ name: 'Transport Document', value: transportDocmkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

export async function pesosYBultos({
  pedimento,
  transportDocument,
  packingList,
  cfdi,
  traceId,
}: {
  pedimento: Pedimento;
  transportDocument?: OCR;
  packingList?: PackingList;
  cfdi?: CFDI;
  traceId: string;
}) {
  const validationsPromise = await Promise.all([
    validatePesosYBultos(
      traceId,
      pedimento,
      transportDocument,
      packingList,
      cfdi
    ),
    validateBultos(traceId, pedimento, transportDocument),
  ]);

  return {
    sectionName: 'Pesos y bultos',
    validations: validationsPromise,
  };
}
