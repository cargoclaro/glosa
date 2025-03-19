import { traceable } from 'langsmith/traceable';
import type {
  Cfdi,
  PackingList,
  TransportDocument,
} from '../../../data-extraction/mkdown_schemas';
import type { Pedimento } from '../../../data-extraction/schemas';
import { glosar } from '../../validation-result';

async function validatePesosYBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument,
  packingList?: PackingList,
  cfdi?: Cfdi
) {
  // Extract weight values from pedimento
  const pesoBrutoPedimento = pedimento.encabezado_del_pedimento?.peso_bruto;
  const cfdiMkdown = cfdi?.markdown_representation;
  const packingListMkdown = packingList?.markdown_representation;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Validación de pesos y bultos',
    description:
      'Verificación de la consistencia de pesos brutos, netos y número de bultos entre el pedimento y los documentos soporte',
    prompt:
      'Para validar los pesos y bultos, sigue estos pasos detallados:\n\n1. Verifica que el peso bruto declarado en el pedimento sea igual o menor a alguno de los pesos declarados en el documento de transporte, packing list o CFDI.\n2. Asegúrate de que el peso bruto declarado en el pedimento coincida con el peso declarado en el documento de transporte, carta 318 o packing list. La relación entre estos pesos debe ser lógica y consistente.\n3. Comprueba que el peso neto declarado en el pedimento sea menor que el peso bruto y que sea consistente con los documentos soporte.\n4. Verifica que el número total de bultos coincida entre el pedimento, documento de transporte y/o CFDI',
    contexts: {
      "PROVIDED": {
        pedimento: {
          data: [{ name: 'Peso bruto', value: pesoBrutoPedimento }],
        },
        documentoDeTransporte: {
          data: [{ name: 'Transport Document', value: transportDocmkdown }],
        },
        listaDeEmpaque: {
          data: [{ name: 'Packing List', value: packingListMkdown }],
        },
        cfdi: {
          data: [{ name: 'CFDI', value: cfdiMkdown }],
        },
      },
    },
  } as const;

  return await glosar(validation, traceId);
}

async function validateBultos(
  traceId: string,
  pedimento: Pedimento,
  transportDocument?: TransportDocument
) {
  // Extract bultos values from pedimento
  const bultosPedimento =
    pedimento.identificadores_nivel_pedimento?.marcas_numeros_bultos;
  const transportDocmkdown = transportDocument?.markdown_representation;

  const validation = {
    name: 'Coincidencia de bultos',
    description:
      'Verificación de que el número total de bultos coincida entre el pedimento y el documento de transporte',
    prompt:
      'El número total de bultos debe coincidir entre el pedimento y el documento de transporte. Si no hay documento de transporte, marcar como advertencia.',
    contexts: {
      "PROVIDED": {
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

export const tracedPesosYBultos = traceable(
  async ({
    pedimento,
    transportDocument,
    packingList,
    cfdi,
    traceId,
  }: {
    pedimento: Pedimento;
    transportDocument?: TransportDocument;
    packingList?: PackingList;
    cfdi?: Cfdi;
    traceId: string;
  }) => {
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
  },
  { name: 'Pedimento S5: Pesos y bultos' }
);
