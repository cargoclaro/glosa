import type { OCR } from '~/lib/utils';
import type {
  Cove,
  PackingList,
  Pedimento,
} from '../extract-and-structure/schemas';
import type { Factura } from '../extract-and-structure/schemas/factura';
import { coveValidationStepsImpo } from './cove/validation_steps_impo';
import { pedimentoValidationStepsImpo } from './pedimento/validation_steps_impo';

export async function glosaImpo({
  pedimento,
  documentoDeTransporte,
  packingList,
  cove,
  facturas,
  factura,
  carta318,
  traceId,
}: {
  pedimento: Pedimento;
  documentoDeTransporte?: OCR[];
  packingList?: PackingList[];
  cove: Cove[];
  facturas?: Factura[];
  factura?: OCR[];
  carta318?: OCR[];
  traceId: string;
}) {
  // Ensure cove exists since it's required
  if (!cove || cove.length === 0) {
    throw new Error('This should never happen');
  }

  // Procesar validaciones de pedimento con múltiples COVEs y facturas
  const pedimentoValidations = await pedimentoValidationStepsImpo({
    pedimento,
    cove: cove[0]!, // Compatibilidad hacia atrás
    coves: cove, // Pasar todos los COVEs
    facturas, // Pasar facturas estructuradas
    transportDocument: documentoDeTransporte?.[0],
    packingList: packingList?.[0],
    invoice: factura?.[0],
    carta318: carta318?.[0],
    traceId,
  });

  // Procesar validaciones para CADA COVE individualmente
  const allCoveValidations = await Promise.all(
    cove.map(async (singleCove, index) => {
      const coveSteps = await coveValidationStepsImpo({
        cove: singleCove,
        invoice: factura?.[0],
        carta318: carta318?.[0],
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
