import { z } from "zod"

export const cfdiSchema = z.object({
  "?xml": z.object({ version: z.string(), encoding: z.string() }),
  "cfdi:Comprobante": z.object({
    "cfdi:Conceptos": z.object({
      "cfdi:Concepto": z.array(z.object({
        Cantidad: z.string(),
      })),
    }),
    "cfdi:Complemento": z.object({
      "tfd:TimbreFiscalDigital": z.object({
        UUID: z.string(),
      }),
    }),
  })
})

export type Cfdi = z.infer<typeof cfdiSchema>;
