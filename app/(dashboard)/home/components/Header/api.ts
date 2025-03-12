"use server";

import { config } from 'dotenv';
import { uploadFiles } from "./glosa/upload-files";
import { classifyDocuments } from "./glosa/classification";
import { auth } from "@clerk/nextjs/server";
import { ClassifiedDocumentSet } from "./glosa/types";
import { extractStructuredText } from "./glosa/extract-structured-text";

config();

export async function glosarRemesa(formData: FormData) {
  try {
    await auth.protect();
    const files = formData.getAll("files") as File[]; // TODO: We should use trpc instead of this
    const successfulUploads = await uploadFiles(files);
    const classifications = await classifyDocuments(successfulUploads);

    const otros = classifications.filter(doc => doc.documentType === 'otros');

    if (otros.length > 0) {
      return {
        success: false,
        message: "Se encontraron documentos no clasificables",
      };
    }
    const listasDeFacturas = classifications.filter(doc => doc.documentType === 'listaDeFacturas');
    const packingLists = classifications.filter(doc => doc.documentType === 'packingList');
    const reportesDeDocumentosDeRemesaConsolidada = classifications.filter(doc => doc.documentType === 'reporteEDocumentRemesaConsolidado');
    
    if (listasDeFacturas.length === 0) {
      return {
        success: false,
        message: "No se encontró ninguna lista de facturas",
      };
    }
    if (packingLists.length === 0) {
      return {
        success: false,
        message: "No se encontró ningún documento de packing list",
      };
    }
    if (reportesDeDocumentosDeRemesaConsolidada.length === 0) {
      return {
        success: false,
        message: "No se encontró ningún reporte de documentos de remesa consolidada",
      };
    }

    if (listasDeFacturas.length > 1) {
      return {
        success: false,
        message: "Se encontraron múltiples documentos de lista de facturas. Solo debe haber uno.",
      };
    }
    if (packingLists.length > 1) {
      return {
        success: false,
        message: "Se encontraron múltiples documentos de packing list. Solo debe haber uno.",
      };
    }
    if (reportesDeDocumentosDeRemesaConsolidada.length > 1) {
      return {
        success: false,
        message: "Se encontraron múltiples documentos de reporte de documentos de remesa consolidada. Solo debe haber uno.",
      };
    }
    
    const listaDeFacturas = listasDeFacturas[0];
    const packingList = packingLists[0];
    const reporteDeDocumentosDeRemesaConsolidada = reportesDeDocumentosDeRemesaConsolidada[0];

    if (!listaDeFacturas || !packingList || !reporteDeDocumentosDeRemesaConsolidada) {
      throw new Error("This check needs to happen due to noUncheckedIndexedAccess, but this code will NEVER be reached (;");
    }

    const facturas = classifications.filter(doc => doc.documentType === 'factura');
    const cfdis = classifications.filter(doc => doc.documentType === 'cfdi');

    if (facturas.length === 0) {
      return {
        success: false,
        message: "No se encontró ninguna factura",
      };
    }
    if (cfdis.length === 0) {
      return {
        success: false,
        message: "No se encontró ningún cfdi",
      };
    }

    // Verificar que la cantidad de facturas y cfdis sea idéntica
    if (facturas.length !== cfdis.length) {
      return {
        success: false,
        message: `La cantidad de facturas y cfdis debe ser idéntica. Se encontraron: ${facturas.length} facturas y ${cfdis.length} cfdis.`,
      };
    }

    // Group documents by type
    const groupedDocuments: ClassifiedDocumentSet = {
      listaDeFacturas,
      packingList,
      reporteDeDocumentosDeRemesaConsolidada,
      facturas,
      cfdis
    };

    const structuredText = await extractStructuredText(groupedDocuments);

    const cfdiUUIDs = structuredText.cfdis.map(cfdi => cfdi['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital']._attributes.UUID);

    const listaDeFacturasUUIDs = structuredText.listaDeFacturas.facturasUUIDs;

    const cfdiUUIDsNotInListaDeFacturas = cfdiUUIDs.filter(uuid => !listaDeFacturasUUIDs.includes(uuid));
    const listaDeFacturasUUIDsNotInCfdis = listaDeFacturasUUIDs.filter(uuid => !cfdiUUIDs.includes(uuid));

    if (cfdiUUIDsNotInListaDeFacturas.length > 0) {
      return {
        success: false,
        message: "Se encontraron cfdis que no están en la lista de facturas",
      };
    }
    if (listaDeFacturasUUIDsNotInCfdis.length > 0) {
      return {
        success: false,
        message: "Se encontraron facturas que no están en los cfdis",
      };
    }

    return {
      success: true,
      glossId: "Pending",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
}
