import type { OCR } from '~/lib/utils';
import type {
  CFDI,
  Cove,
  PackingList,
  Pedimento,
} from '../extract-and-structure/schemas';
import { coveValidationStepsExpo } from './cove/validation_steps_expo';
import { pedimentoValidationStepsExpo } from './pedimento/validation_steps_expo';

export async function glosaExpo({
  pedimento,
  documentoDeTransporte,
  packingList,
  cove,
  cfdiResult,
  carta318,
  factura,
  traceId,
}: {
  pedimento: Pedimento;
  documentoDeTransporte?: OCR[];
  packingList?: PackingList[];
  cove: Cove[];
  cfdiResult?: CFDI[];
  carta318?: OCR[];
  factura?: OCR[];
  traceId: string;
}) {
  // Ensure cove exists since it's required
  if (!cove || cove.length === 0) {
    throw new Error('This should never happen');
  }

  // Procesar validaciones de pedimento con agregado de COVEs (usando el primero por ahora)
  const pedimentoValidations = await pedimentoValidationStepsExpo({
    pedimento,
    cove: cove[0]!, // Ya verificamos que existe arriba
    cfdi: cfdiResult?.[0],
    cartaSesion: carta318?.[0],
    transportDocument: documentoDeTransporte?.[0],
    packingList: packingList?.[0],
    traceId,
  });

  // Procesar validaciones para CADA COVE individualmente
  const allCoveValidations = await Promise.all(
    cove.map(async (singleCove, index) => {
      const coveSteps = await coveValidationStepsExpo({
        cove: singleCove,
        cfdi: cfdiResult?.[0],
        invoice: factura?.[0],
        traceId,
      });
      
      // En lugar de aplanar, mantener la estructura por secciones
      return coveSteps.map(step => ({
        sectionName: `COVE ${index + 1} - ${step.sectionName}`,
        validations: step.validations
      }));
    })
  );

  // Aplanar los resultados de COVEs ya que cada COVE devuelve un array de secciones
  const flattenedCoveValidations = allCoveValidations.flat();

  // Combinar resultados de pedimento + todos los COVEs
  return [...pedimentoValidations, ...flattenedCoveValidations];
}
