'use server';

import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import { Langfuse } from 'langfuse';
import { api } from 'lib/trpc';
import moment from 'moment';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { classifyDocuments } from './glosa/classification';
import { extractStructuredText } from './glosa/extract-structured-text';
import { uploadFiles } from './glosa/upload-files';

config();

const langfuse = new Langfuse();
const parentTraceId = randomUUID();
langfuse.trace({
  id: parentTraceId,
  name: 'Glosa de Remesa de Exportación',
});

export const glosarRemesa = api
  .input(
    zfd.formData({
      files: z.array(z.instanceof(File)),
    })
  )
  .mutation(async ({ input: { files } }) => {
    try {
      const successfulUploads = await uploadFiles(files);
      const classifications = await classifyDocuments(
        successfulUploads,
        parentTraceId
      );

      const otros = classifications.filter(
        (doc) => doc.documentType === 'otros'
      );

      if (otros.length > 0) {
        return {
          success: false,
          message: 'Se encontraron documentos no clasificables',
        };
      }

      const listasDeFacturas = classifications.filter(
        (doc) => doc.documentType === 'listaDeFacturas'
      );
      const reportesEDocumentRemesaConsolidado = classifications.filter(
        (doc) => doc.documentType === 'reporteEDocumentRemesaConsolidado'
      );

      if (listasDeFacturas.length > 1) {
        return {
          success: false,
          message:
            'Se encontraron múltiples documentos de lista de facturas. Solo debe haber uno.',
        };
      }
      if (reportesEDocumentRemesaConsolidado.length > 1) {
        return {
          success: false,
          message:
            'Se encontraron múltiples documentos de reporte de documento de remesa consolidado. Solo debe haber uno.',
        };
      }
      const listaDeFacturas = listasDeFacturas[0];
      const reporteEDocumentRemesaConsolidado =
        reportesEDocumentRemesaConsolidado[0];

      if (!listaDeFacturas) {
        return {
          success: false,
          message: 'No se encontró ningún documento de lista de facturas',
        };
      }
      if (!reporteEDocumentRemesaConsolidado) {
        return {
          success: false,
          message:
            'No se encontró ningún documento de reporte de documento de remesa consolidado',
        };
      }

      const cfdis = classifications.filter(
        (doc) => doc.documentType === 'cfdi'
      );
      const facturas = classifications.filter(
        (doc) => doc.documentType === 'factura'
      );

      if (cfdis.length === 0) {
        return {
          success: false,
          message: 'No se encontró ningún cfdi',
        };
      }
      if (facturas.length === 0) {
        return {
          success: false,
          message: 'No se encontró ninguna factura',
        };
      }

      if (cfdis.length !== facturas.length) {
        return {
          success: false,
          message: 'El número de cfdis no coincide con el número de facturas',
        };
      }

      const groupedDocuments = {
        listaDeFacturas,
        reporteEDocumentRemesaConsolidado,
        cfdis,
        facturas,
      };

      const structuredText = await extractStructuredText(
        groupedDocuments,
        parentTraceId
      );

      // Array to accumulate all validation errors
      const validationErrors = [];

      const cfdiUUIDs = structuredText.cfdis.map(
        (cfdi) =>
          cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.UUID
      );
      const listaDeFacturasUUIDs = structuredText.listaDeFacturas.facturas.map(
        (factura) => factura.facturaUUID
      );

      const cfdiUUIDsNotInListaDeFacturas = cfdiUUIDs.filter(
        (uuid) => !listaDeFacturasUUIDs.includes(uuid)
      );
      const listaDeFacturasUUIDsNotInCfdis = listaDeFacturasUUIDs.filter(
        (uuid) => !cfdiUUIDs.includes(uuid)
      );

      if (cfdiUUIDsNotInListaDeFacturas.length > 0) {
        validationErrors.push(
          `Se encontraron cfdis que no están en la lista de facturas: ${cfdiUUIDsNotInListaDeFacturas.join(', ')}`
        );
      }

      if (listaDeFacturasUUIDsNotInCfdis.length > 0) {
        validationErrors.push(
          `Se encontraron facturas que no están en los cfdis: ${listaDeFacturasUUIDsNotInCfdis.join(', ')}`
        );
      }

      const facturaCantidadTotal = structuredText.facturas.map(
        ({
          folioFiscal,
          mainTable,
          fechaYHoraDeCertificacion,
          importeTotal,
          pesoBrutoTotal,
        }) => {
          return {
            folioFiscal,
            cantidadTotal: mainTable.reduce(
              (acc, { cantidad }) => acc + cantidad,
              0
            ),
            fechaYHoraDeCertificacion,
            importeTotal,
            pesoBrutoTotal,
          };
        }
      );
      const cfdiCantidadTotal = structuredText.cfdis.map((cfdi) => {
        const uuid =
          cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.UUID;
        const fechaYHoraDeCertificacion =
          cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes
            .FechaTimbrado;
        const conceptos = cfdi.Comprobante.Conceptos.Concepto;
        const cantidadTotal = conceptos.reduce(
          (acc, { attributes: { Cantidad } }) => acc + Cantidad,
          0
        );
        const importeTotal = cfdi.Comprobante.attributes.Total;
        return {
          folioFiscal: uuid,
          cantidadTotal,
          fechaYHoraDeCertificacion,
          importeTotal,
        };
      });

      const datosFolio: Record<
        string,
        {
          facturaCantidadTotal: number;
          cfdiCantidadTotal: number;
          listaDeFacturasCantidadTotal: number;
          cfdiFechaYHoraDeCertificacion: moment.Moment;
          facturaFechaYHoraDeCertificacion: moment.Moment;
          listaDeFacturasFecha: moment.Moment;
          cfdiImporteTotal: number;
          facturaImporteTotal: number;
          listaDeFacturasImporteTotal: number;
          facturaPesoBrutoTotal: number;
        }
      > = {};

      structuredText.listaDeFacturas.facturas.forEach(
        ({ facturaUUID, cantidadEnUMC, fecha, valorFacturaEnDolares }) => {
          if (!datosFolio[facturaUUID]) {
            datosFolio[facturaUUID] = {
              facturaCantidadTotal: 0,
              cfdiCantidadTotal: 0,
              listaDeFacturasCantidadTotal: 0,
              cfdiFechaYHoraDeCertificacion: moment(),
              facturaFechaYHoraDeCertificacion: moment(),
              listaDeFacturasFecha: moment(),
              cfdiImporteTotal: 0,
              facturaImporteTotal: 0,
              listaDeFacturasImporteTotal: 0,
              facturaPesoBrutoTotal: 0,
            };
          }
          datosFolio[facturaUUID].listaDeFacturasCantidadTotal = cantidadEnUMC;
          datosFolio[facturaUUID].listaDeFacturasFecha = fecha;
          datosFolio[facturaUUID].listaDeFacturasImporteTotal =
            valorFacturaEnDolares;
        }
      );
      facturaCantidadTotal.forEach(
        ({
          folioFiscal,
          cantidadTotal,
          fechaYHoraDeCertificacion,
          importeTotal,
          pesoBrutoTotal,
        }) => {
          if (!datosFolio[folioFiscal]) {
            datosFolio[folioFiscal] = {
              facturaCantidadTotal: 0,
              cfdiCantidadTotal: 0,
              listaDeFacturasCantidadTotal: 0,
              cfdiFechaYHoraDeCertificacion: moment(),
              facturaFechaYHoraDeCertificacion: moment(),
              listaDeFacturasFecha: moment(),
              cfdiImporteTotal: 0,
              facturaImporteTotal: 0,
              listaDeFacturasImporteTotal: 0,
              facturaPesoBrutoTotal: 0,
            };
          }
          datosFolio[folioFiscal].facturaCantidadTotal = cantidadTotal;
          datosFolio[folioFiscal].facturaFechaYHoraDeCertificacion =
            fechaYHoraDeCertificacion;
          datosFolio[folioFiscal].facturaImporteTotal = importeTotal;
          datosFolio[folioFiscal].facturaPesoBrutoTotal += pesoBrutoTotal;
        }
      );
      cfdiCantidadTotal.forEach(
        ({
          folioFiscal,
          cantidadTotal,
          fechaYHoraDeCertificacion,
          importeTotal,
        }) => {
          if (!datosFolio[folioFiscal]) {
            datosFolio[folioFiscal] = {
              facturaCantidadTotal: 0,
              cfdiCantidadTotal: 0,
              listaDeFacturasCantidadTotal: 0,
              cfdiFechaYHoraDeCertificacion: moment(),
              facturaFechaYHoraDeCertificacion: moment(),
              listaDeFacturasFecha: moment(),
              cfdiImporteTotal: 0,
              facturaImporteTotal: 0,
              listaDeFacturasImporteTotal: 0,
              facturaPesoBrutoTotal: 0,
            };
          }
          datosFolio[folioFiscal].cfdiCantidadTotal = cantidadTotal;
          datosFolio[folioFiscal].cfdiFechaYHoraDeCertificacion =
            fechaYHoraDeCertificacion;
          datosFolio[folioFiscal].cfdiImporteTotal = importeTotal;
        }
      );

      for (const [
        folioFiscal,
        {
          facturaCantidadTotal,
          cfdiCantidadTotal,
          listaDeFacturasCantidadTotal,
          facturaFechaYHoraDeCertificacion,
          cfdiFechaYHoraDeCertificacion,
          listaDeFacturasFecha,
          facturaImporteTotal,
          cfdiImporteTotal,
          listaDeFacturasImporteTotal,
        },
      ] of Object.entries(datosFolio)) {
        if (
          new Set([
            facturaCantidadTotal,
            cfdiCantidadTotal,
            listaDeFacturasCantidadTotal,
          ]).size !== 1
        ) {
          validationErrors.push(
            `Se encontraron diferencias en la cantidad total de la factura ${folioFiscal}: cantidad en lista de facturas ${listaDeFacturasCantidadTotal}, cantidad en factura ${facturaCantidadTotal}, cantidad en CFDI ${cfdiCantidadTotal}`
          );
        }

        // Formatear con el formato visual (dd/MM/yyyy)
        const facturaFechaSoloDate =
          facturaFechaYHoraDeCertificacion.format('DD/MM/YYYY');
        const cfdiFechaSoloDate =
          cfdiFechaYHoraDeCertificacion.format('DD/MM/YYYY');
        const listaFacturasFechaSoloDate =
          listaDeFacturasFecha.format('DD/MM/YYYY');

        // Verificar si las fechas son diferentes
        const fechasSonDiferentes =
          new Set([
            facturaFechaSoloDate,
            cfdiFechaSoloDate,
            listaFacturasFechaSoloDate,
          ]).size !== 1;

        if (fechasSonDiferentes) {
          validationErrors.push(
            `Se encontraron diferencias en la fecha de la factura ${folioFiscal}: fecha en lista de facturas ${listaFacturasFechaSoloDate}, fecha en factura ${facturaFechaSoloDate}, fecha en CFDI ${cfdiFechaSoloDate}`
          );
        }

        if (
          new Set([
            facturaImporteTotal,
            cfdiImporteTotal,
            listaDeFacturasImporteTotal,
          ]).size !== 1
        ) {
          validationErrors.push(
            `Se encontraron diferencias en el importe total de la factura ${folioFiscal}: importe en lista de facturas ${listaDeFacturasImporteTotal}, importe en factura ${facturaImporteTotal}, importe en CFDI ${cfdiImporteTotal}`
          );
        }
      }

      const pesoBrutoTotal = structuredText.listaDeFacturas.peso;
      const facturasPesoBrutoTotal = Object.values(datosFolio).reduce(
        (acc, { facturaPesoBrutoTotal }) => acc + facturaPesoBrutoTotal,
        0
      );

      if (pesoBrutoTotal !== facturasPesoBrutoTotal) {
        validationErrors.push(
          `Se encontraron diferencias en el peso bruto total: peso en lista de facturas ${pesoBrutoTotal}, peso en facturas ${facturasPesoBrutoTotal}`
        );
      }

      // Check if we have any validation errors
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: validationErrors,
        };
      }

      return {
        success: true,
        message: 'No se encontraron errores',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Ocurrió un error interno',
      };
    }
  });
