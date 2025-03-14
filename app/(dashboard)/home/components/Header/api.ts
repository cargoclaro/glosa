"use server";

import { config } from 'dotenv';
import { uploadFiles } from "./glosa/upload-files";
import { classifyDocuments } from "./glosa/classification";
import { auth } from "@clerk/nextjs/server";
import { extractStructuredText } from "./glosa/extract-structured-text";
import { randomUUID } from "crypto";
import { Langfuse } from "langfuse";
import moment from "moment";

config();

const langfuse = new Langfuse();
const parentTraceId = randomUUID();
langfuse.trace({
  id: parentTraceId,
  name: "Glosa de Remesa de Exportación",
});

export async function glosarRemesa(formData: FormData) {
  try {
    await auth.protect();
    const files = formData.getAll("files") as File[]; // TODO: We should use trpc instead of this
    const successfulUploads = await uploadFiles(files);
    const classifications = await classifyDocuments(successfulUploads, parentTraceId);

    const otros = classifications.filter(doc => doc.documentType === 'otros');

    if (otros.length > 0) {
      return {
        success: false,
        message: "Se encontraron documentos no clasificables",
      };
    }
    const listasDeFacturas = classifications.filter(doc => doc.documentType === 'listaDeFacturas');

    if (listasDeFacturas.length > 1) {
      return {
        success: false,
        message: "Se encontraron múltiples documentos de lista de facturas. Solo debe haber uno.",
      };
    }
    
    const listaDeFacturas = listasDeFacturas[0];

    if (!listaDeFacturas) {
      throw new Error("This check needs to happen due to noUncheckedIndexedAccess, but this code will NEVER be reached (;");
    }

    const cfdis = classifications.filter(doc => doc.documentType === 'cfdi');
    const facturas = classifications.filter(doc => doc.documentType === 'factura');

    if (cfdis.length === 0) {
      return {
        success: false,
        message: "No se encontró ningún cfdi",
      };
    }
    if (facturas.length === 0) {
      return {
        success: false,
        message: "No se encontró ninguna factura",
      };
    }

    if (cfdis.length !== facturas.length) {
      return {
        success: false,
        message: "El número de cfdis no coincide con el número de facturas",
      };
    }

    const groupedDocuments = {
      listaDeFacturas,
      cfdis,
      facturas
    };

    const structuredText = await extractStructuredText(groupedDocuments, parentTraceId);

    // Array to accumulate all validation errors
    const validationErrors = [];

    const cfdiUUIDs = structuredText.cfdis.map(cfdi => cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.UUID);
    const listaDeFacturasUUIDs = structuredText.listaDeFacturas.map(factura => factura.facturaUUID);

    const cfdiUUIDsNotInListaDeFacturas = cfdiUUIDs.filter(uuid => !listaDeFacturasUUIDs.includes(uuid));
    const listaDeFacturasUUIDsNotInCfdis = listaDeFacturasUUIDs.filter(uuid => !cfdiUUIDs.includes(uuid));

    if (cfdiUUIDsNotInListaDeFacturas.length > 0) {
      validationErrors.push(`Se encontraron cfdis que no están en la lista de facturas: ${cfdiUUIDsNotInListaDeFacturas.join(', ')}`);
    }
    
    if (listaDeFacturasUUIDsNotInCfdis.length > 0) {
      validationErrors.push(`Se encontraron facturas que no están en los cfdis: ${listaDeFacturasUUIDsNotInCfdis.join(', ')}`);
    }

    const facturaCantidadTotal = structuredText.facturas.map(({ folioFiscal, mainTable, fechaYHoraDeCertificacion }) => {
      return {
        folioFiscal,
        cantidadTotal: mainTable.reduce((acc, { cantidad }) => acc + cantidad, 0),
        fechaYHoraDeCertificacion,
      };
    });
    const cfdiCantidadTotal = structuredText.cfdis.map((cfdi) => {
      const uuid = cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.UUID;
      const fechaYHoraDeCertificacion = cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.FechaTimbrado;
      const conceptos = cfdi.Comprobante.Conceptos.Concepto;
      const cantidadTotal = conceptos.reduce((acc, { attributes: { Cantidad } }) => acc + Cantidad, 0);
      return {
        folioFiscal: uuid,
        cantidadTotal,
        fechaYHoraDeCertificacion,
      };
    });
    
    const datosFolio: Record<string, {
      facturaCantidadTotal: number,
      cfdiCantidadTotal: number,
      listaDeFacturasCantidadTotal: number,
      cfdiFechaYHoraDeCertificacion: moment.Moment,
      facturaFechaYHoraDeCertificacion: moment.Moment,
      listaDeFacturasFecha: moment.Moment,
    }> = {};
   
    structuredText.listaDeFacturas.forEach(({ facturaUUID, cantidadEnUMC, fecha }) => {
      if (!datosFolio[facturaUUID]) {
        datosFolio[facturaUUID] = { facturaCantidadTotal: 0, cfdiCantidadTotal: 0, listaDeFacturasCantidadTotal: 0, cfdiFechaYHoraDeCertificacion: moment(), facturaFechaYHoraDeCertificacion: moment(), listaDeFacturasFecha: moment() };
      }
      datosFolio[facturaUUID].listaDeFacturasCantidadTotal = cantidadEnUMC;
      datosFolio[facturaUUID].listaDeFacturasFecha = fecha;
    });
    facturaCantidadTotal.forEach(({ folioFiscal, cantidadTotal, fechaYHoraDeCertificacion }) => {
      if (!datosFolio[folioFiscal]) {
        datosFolio[folioFiscal] = { facturaCantidadTotal: 0, cfdiCantidadTotal: 0, listaDeFacturasCantidadTotal: 0, cfdiFechaYHoraDeCertificacion: moment(), facturaFechaYHoraDeCertificacion: moment(), listaDeFacturasFecha: moment() };
      }
      datosFolio[folioFiscal].facturaCantidadTotal = cantidadTotal;
      datosFolio[folioFiscal].facturaFechaYHoraDeCertificacion = fechaYHoraDeCertificacion;
    });
    cfdiCantidadTotal.forEach(({ folioFiscal, cantidadTotal, fechaYHoraDeCertificacion }) => {
      if (!datosFolio[folioFiscal]) {
        datosFolio[folioFiscal] = { facturaCantidadTotal: 0, cfdiCantidadTotal: 0, listaDeFacturasCantidadTotal: 0, cfdiFechaYHoraDeCertificacion: moment(), facturaFechaYHoraDeCertificacion: moment(), listaDeFacturasFecha: moment() };
      }
      datosFolio[folioFiscal].cfdiCantidadTotal = cantidadTotal;
      datosFolio[folioFiscal].cfdiFechaYHoraDeCertificacion = fechaYHoraDeCertificacion;
    });

    for (const [folioFiscal, { facturaCantidadTotal, cfdiCantidadTotal, listaDeFacturasCantidadTotal, facturaFechaYHoraDeCertificacion, cfdiFechaYHoraDeCertificacion, listaDeFacturasFecha }] of Object.entries(datosFolio)) {
      if (new Set([facturaCantidadTotal, cfdiCantidadTotal, listaDeFacturasCantidadTotal]).size !== 1) {
        validationErrors.push(`Se encontraron diferencias en la cantidad total de la factura ${folioFiscal}: cantidad en lista de facturas ${listaDeFacturasCantidadTotal}, cantidad en factura ${facturaCantidadTotal}, cantidad en CFDI ${cfdiCantidadTotal}`);
      }

      // Formatear con el formato visual (dd/MM/yyyy)
      const facturaFechaSoloDate = facturaFechaYHoraDeCertificacion.format('DD/MM/YYYY');
      const cfdiFechaSoloDate = cfdiFechaYHoraDeCertificacion.format('DD/MM/YYYY');
      const listaFacturasFechaSoloDate = listaDeFacturasFecha.format('DD/MM/YYYY');
      
      // Verificar si las fechas son diferentes
      const fechasSonDiferentes = new Set([
        facturaFechaSoloDate,
        cfdiFechaSoloDate,
        listaFacturasFechaSoloDate
      ]).size !== 1;
      
      if (fechasSonDiferentes) {
        validationErrors.push(`Se encontraron diferencias en la fecha de la factura ${folioFiscal}: fecha en lista de facturas ${listaFacturasFechaSoloDate}, fecha en factura ${facturaFechaSoloDate}, fecha en CFDI ${cfdiFechaSoloDate}`);
      }
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
      message: "No se encontraron errores",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
}
