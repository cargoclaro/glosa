import { UploadedFileData } from "uploadthing/types";
import { Cfdi, ListaDeFacturas, Factura, ReporteRemesaItem } from "./schemas";

export interface ClassifiedDocumentSet {
  listaDeFacturas: UploadedFileData & { originalFile: File };
  packingList: UploadedFileData & { originalFile: File };
  reporteEDocumentRemesaConsolidado: (UploadedFileData & { originalFile: File });
  facturas: (UploadedFileData & { originalFile: File })[];
  cfdis: (UploadedFileData & { originalFile: File })[];
}

export interface StructuredDocumentSet {
  listaDeFacturas: ListaDeFacturas;
  cfdis: Cfdi[];
  facturas: Factura[];
  reporteRemesa: ReporteRemesaItem[];
}
