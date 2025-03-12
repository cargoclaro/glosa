import { UploadedFileData } from "uploadthing/types";
import { Cfdi, ListaDeFacturas } from "./schemas";

export interface ClassifiedDocumentSet {
  listaDeFacturas: UploadedFileData & { originalFile: File };
  packingList: UploadedFileData & { originalFile: File };
  reporteDeDocumentosDeRemesaConsolidada: (UploadedFileData & { originalFile: File });
  facturas: (UploadedFileData & { originalFile: File })[];
  cfdis: (UploadedFileData & { originalFile: File })[];
}

export interface StructuredDocumentSet {
  listaDeFacturas: ListaDeFacturas;
  cfdis: Cfdi[];
}
