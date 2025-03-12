"use server";

import { config } from 'dotenv';
import { uploadFiles } from "./glosa/upload-files";
import { classifyDocuments } from "./glosa/classification";
import { auth } from "@clerk/nextjs/server";
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

    if (cfdis.length === 0) {
      return {
        success: false,
        message: "No se encontró ningún cfdi",
      };
    }

    const groupedDocuments = {
      listaDeFacturas,
      cfdis
    };

    const structuredText = await extractStructuredText(groupedDocuments);

    const cfdiUUIDs = structuredText.cfdis.map(cfdi => cfdi['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital'].UUID);

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
