"use server";

import { config } from 'dotenv';
import { uploadFiles } from "./glosa/upload-files";
import { classifyDocuments } from "./glosa/classification";
import { auth } from "@clerk/nextjs/server";
import { extractStructuredText } from "./glosa/extract-structured-text";
import { randomUUID } from "crypto";

config();

const parentTraceId = randomUUID();

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

    const cfdiUUIDs = structuredText.cfdis.map(cfdi => cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.UUID);
    const listaDeFacturasUUIDs = structuredText.listaDeFacturas.map(factura => factura.facturaUUID);

    const cfdiUUIDsNotInListaDeFacturas = cfdiUUIDs.filter(uuid => !listaDeFacturasUUIDs.includes(uuid));
    const listaDeFacturasUUIDsNotInCfdis = listaDeFacturasUUIDs.filter(uuid => !cfdiUUIDs.includes(uuid));

    if (cfdiUUIDsNotInListaDeFacturas.length > 0) {
      return {
        success: false,
        message: `Se encontraron cfdis que no están en la lista de facturas: ${cfdiUUIDsNotInListaDeFacturas.join(', ')}`,
      };
    }
    if (listaDeFacturasUUIDsNotInCfdis.length > 0) {
      return {
        success: false,
        message: `Se encontraron facturas que no están en los cfdis: ${listaDeFacturasUUIDsNotInCfdis.join(', ')}`,
      };
    }

    const facturaCantidadTotal = structuredText.facturas.map(({ folioFiscal, cantidades }) => {
      return {
        folioFiscal,
        cantidadTotal: cantidades.reduce((acc, cantidad) => acc + cantidad, 0),
      };
    });

    const cfdiCantidadTotal = structuredText.cfdis.map((cfdi) => {
      const uuid = cfdi.Comprobante.Complemento.TimbreFiscalDigital.attributes.UUID;
      const conceptos = cfdi.Comprobante.Conceptos.Concepto;
      const cantidadTotal = conceptos.reduce((acc, { attributes: { Cantidad } }) => acc + Cantidad, 0);
      return {
        folioFiscal: uuid,
        cantidadTotal,
      };
    });
    
    const cantidadesTotalesPorFolio: Record<string, { facturaCantidadTotal: number, cfdiCantidadTotal: number }> = {};
    
    facturaCantidadTotal.forEach(({ folioFiscal, cantidadTotal }) => {
      if (!cantidadesTotalesPorFolio[folioFiscal]) {
        cantidadesTotalesPorFolio[folioFiscal] = { facturaCantidadTotal: 0, cfdiCantidadTotal: 0 };
      }
      cantidadesTotalesPorFolio[folioFiscal].facturaCantidadTotal = cantidadTotal;
    });
    
    cfdiCantidadTotal.forEach(({ folioFiscal, cantidadTotal }) => {
      if (!cantidadesTotalesPorFolio[folioFiscal]) {
        cantidadesTotalesPorFolio[folioFiscal] = { facturaCantidadTotal: 0, cfdiCantidadTotal: 0 };
      }
      cantidadesTotalesPorFolio[folioFiscal].cfdiCantidadTotal = cantidadTotal;
    });

    for (const [folioFiscal, { facturaCantidadTotal, cfdiCantidadTotal }] of Object.entries(cantidadesTotalesPorFolio)) {
      if (facturaCantidadTotal !== cfdiCantidadTotal) {
        return {
          success: false,
          message: `Se encontraron diferencias en la cantidad total de la factura ${folioFiscal}: cantidad en factura ${facturaCantidadTotal}, cantidad en CFDI ${cfdiCantidadTotal}`,
        };
      }
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
