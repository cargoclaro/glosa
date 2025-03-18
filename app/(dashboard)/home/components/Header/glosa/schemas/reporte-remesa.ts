import { z } from 'zod';

const reporteRemesaItemSchema = z.object({
  descripcion: z.string().describe('Descripción del producto'),
  unidad: z.string().describe('Unidad de medida (KGM, etc.)'),
  moneda: z.string().describe('Moneda utilizada (USD, etc.)'),
  cantidadComercial: z.number().describe('Cantidad comercial del producto'),
  valorUnitario: z.number().describe('Valor unitario del producto'),
  valorTotal: z.number().describe('Valor total del producto'),
  valorDolares: z.number().describe('Valor en dólares del producto'),
});

export type ReporteRemesaItem = z.infer<typeof reporteRemesaItemSchema>;

export const reporteRemesaSchema = z.object({
  productos: z
    .array(reporteRemesaItemSchema)
    .describe('Lista de productos en el reporte de remesa'),
  factura: z.string().describe('Numero de factura, es un UUID'),
});

export type ReporteRemesa = z.infer<typeof reporteRemesaSchema>;

export const reportesRemesaSchema = z.object({
  reportesRemesa: z
    .array(reporteRemesaSchema)
    .describe('Lista de reportes de remesa, ya que puede haber más de uno'),
});

export type ReportesRemesa = z.infer<typeof reportesRemesaSchema>;
