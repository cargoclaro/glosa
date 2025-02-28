import { numeroDePedimentoValidations } from "./pedimento/numero-de-pedimento";
import { DocumentType } from "../classification";
import type { z } from "zod";
import { documentToSchema } from "../data-extraction";

export async function glosa({
  pedimento,
}: Record<DocumentType, z.infer<typeof documentToSchema[keyof typeof documentToSchema]>>) {
  const validations = await numeroDePedimentoValidations(pedimento);
}
