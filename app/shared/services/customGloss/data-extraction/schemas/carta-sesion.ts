import { z } from "zod"

export type CartaSesion = z.infer<typeof cartaSesionSchema>;

export const cartaSesionSchema = z.object({
  assignor: z
    .object({
      name: z.string().describe("Full name of the assignor."),
      address: z.string().describe("Full address of the assignor."),
      identification_rfc: z
        .string()
        .describe("Identification number of the assignor.")
        .optional()
    })
    .describe(
      "Complete data of the assignor (who transfers the rights)."
    ),
  assignee: z
    .object({
      name: z.string().describe("Full name of the assignee."),
      address: z.string().describe("Full address of the assignee."),
      identification_rfc: z
        .string()
        .describe("Identification number of the assignee.")
        .optional()
    })
    .describe("Complete data of the assignee (who receives the rights)."),
  guide_numbers: z
    .object({
      master_guide: z
        .string()
        .describe(
          "Master guide number. Only applicable in case of air shipment."
        ),
      house_guide: z
        .string()
        .describe(
          "House guide number. Only applicable in case of air shipment."
        )
    })
    .describe(
      "Master and house guide numbers. Only applicable in case of air shipment."
    ),
  transport_document_references: z
    .array(
      z
        .string()
        .describe(
          "Reference to a transport document. It is a number that identifies the transport document."
        )
    )
    .describe("References to transport documents."),
  document_summary: z
    .string()
    .describe(
      "A detailed summary of this specific document, including details about the rights being transferred and context that can be useful for a human. This field is mandatory and must be generated by the LLM, it is not provided in the document."
    ),
  fecha_emision: z
    .string()
    .describe("The date of issuance of the document.")
})
