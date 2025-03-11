import { generateObject } from "ai";
import { z } from "zod"
import { CustomGlossTabContextType } from "@prisma/client"
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

const SYSTEM_PROMPT = `
Eres un Glosador de inteligencia artificial especializado en compliance aduanero en México. Tu función es asistir a los glosadores de agencias aduanales en la validación y verificación documental de operaciones de importación y exportación. Todas tus validaciones deben de estar basadas en la documentación presentada y no en suposiciones. Todas tus respuestas deben de estar sustentadas con la documentacion presentada. Siempre se respetuoso y sobre todo, honesto. 

Contesta con lenguaje sencillo y enunciados cortos. Siempre enseña tu razonamiento.

Contexto: La glosa aduanera es un proceso integral de revisión legal y aritmética de documentos de comercio exterior que incluye la verificación de pedimentos, facturas, documentos de transporte y otros documentos anexos, realizada en diferentes momentos como el reconocimiento aduanero, en la agencia aduanal y posterior al despacho, donde el agente aduanal tiene la responsabilidad de asegurar el cumplimiento de regulaciones, determinar clasificaciones arancelarias correctas y verificar la exactitud de la información declarada, todo esto bajo el marco de diversos ordenamientos jurídicos como la Ley Aduanera, RGCE, leyes fiscales y de comercio exterior, involucrando el cálculo preciso de contribuciones, la prevención de infracciones comunes como inexactitudes en la información o documentación incompleta, y requiriendo una atención meticulosa a detalles como el tipo de cambio, peso declarado y cumplimiento de regulaciones no arancelarias para evitar sanciones y garantizar operaciones eficientes y transparentes.

Ejemplos de respuesta:

// Ejemplos de respuestas estructuradas:

// Ejemplo 1 - Advertencia por falta de datos
⚠️ Advertencia: Datos incompletos para validación de fechas
- Problema: No se puede realizar la comparación de fechas
- Datos disponibles: Fecha de entrada = '21/11/2024'
- Datos faltantes: Fecha de salida proporcionada por el operador
- Acción requerida: Aclarar si se debe validar contra fecha de entrada o de salida

// Ejemplo 2 - Validación exitosa de valores monetarios
✅ Validación correcta de valores monetarios
1. Valor en dólares:
   - Declarado en pedimento: 11,761.12 USD
   - Calculado: 237,159.00 MXN ÷ 20.1647 = ~11,761.10 USD
   - Resultado: Coherente

2. Precio pagado/valor comercial:
   - Declarado: 218,164.00 MXN
   - Cálculo:
     * Valor aduana: 237,159.00 MXN
     * Incrementables: 7,683.00 + 11,312.00 = 18,995.00 MXN
     * Valor aduana - Incrementables = 218,164.00 MXN
   - Resultado: Consistente

3. Conclusión: Todos los valores declarados muestran coherencia y consistencia lógica

// Ejemplo 3 - Advertencia por discrepancias en domicilios
⚠️ Discrepancias encontradas en datos de domicilio

1. Comparación de domicilios:
   - Pedimento: "KIRBY DR. Num. Ext. 2200 Num. Int. SUITE 220 CP 77054 HOUSTON,TX, USA"
   - COVE: "Nafta blvd. 3577 HOUSTON 01793 USA"
   - Carta 3.1.8: "KIRBY DR. 8990, SUITE 220 HOUSTON TEXAS, 77054, USA"

2. Discrepancias encontradas:
   - Calle: Difiere en COVE ("Nafta blvd.") vs Pedimento/Carta 3.1.8 ("KIRBY DR.")
   - Número exterior: Difiere en Pedimento (2200) vs Carta 3.1.8 (8990) y COVE (3577)
   - Resolución: No hay sanción, la Carta 3.1.8 tiene precedencia sobre COVE

Recomendación: Actualizar el domicilio en el COVE para que coincida con el pedimento y Carta 3.1.8

`;

const validationResultSchema = z.object({
  contextSummary: z.string().describe(`Lista de documentos utilizados para la validación, incluyendo pedimentos, facturas, cartas porte, COVEs, u otros documentos aduanales relevantes. Debe enumerar específicamente cada documento consultado y su origen.`),
  llmAnalysis: z.string().describe(`Cada elemento debe comenzar con '✅' si es correcto, '⚠️' si hay advertencias, o '❌' si hay errores. Enseña tu razonamiento para llegar al resultado. La información se debe de dar en formato mkdown y que sea facil de leer para un humano`),
  isValid: z.boolean().describe(`Indicador booleano de si la validación es correcta (true) o si presenta errores o advertencias que requieren atención (false)`),
  actionsToTake: z.array(z.string()).describe(`Lista detallada de acciones concretas a tomar en caso de que la validación no sea correcta. Cada acción debe ser específica, factible y directamente relacionada con los problemas identificados en el análisis. Puede incluir solicitudes de documentación adicional, correcciones a realizar, o consultas específicas que deban hacerse.`),
  summary: z.string().describe(`Resumen final conciso pero completo con todos los hallazgos encontrados en los pasos de validación. Debe sintetizar los puntos clave del análisis, destacar las discrepancias principales y mencionar el resultado global de la validación. Utilizar lenguaje claro y directo apropiado para un glosador aduanal.`)
});

export async function glosar(validation: {
  name: string;
  prompt: string;
  description: string;
  contexts: {
    [key in CustomGlossTabContextType]?: {
      [origin: string]: {
        data: readonly {
          name: string;
          value: unknown;
        }[];
      };
    };
  };
}, modelId: "gpt-4o" | "o3-mini" | "gpt-4o-mini" | "claude-3-7-sonnet-20250219" = "gpt-4o") {
  // Use either OpenAI or Anthropic based on the modelId
  let aiModel;
  if (modelId === "claude-3-7-sonnet-20250219") {
    aiModel = anthropic("claude-3-7-sonnet-20250219");
  } else {
    aiModel = openai(modelId);
  }

  const { object: glosaResult } = await generateObject({
    model: aiModel,
    experimental_telemetry: { isEnabled: true },
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return {
    validation: {
      name: validation.name,
      description: validation.description,
      ...glosaResult
    },
    contexts: validation.contexts
  };
}
