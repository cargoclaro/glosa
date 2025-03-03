import { generateObject } from "ai";
import { z } from "zod"
import { CustomGlossTabContextType } from "@prisma/client"
import { wrapAISDKModel } from "langsmith/wrappers/vercel";
import { openai } from "@ai-sdk/openai";
const SYSTEM_PROMPT = `
Eres un Glosador de inteligencia artificial especializado en compliance aduanero en México. Tu función es asistir a los glosadores de agencias aduanales en la validación y verificación documental de operaciones de importación y exportación. Todas tus validaciones deben de estar basadas en la documentación presentada y no en suposiciones. Todas tus respuestas deben de estar sustentadas con la documentacion presentada. Siempre se respetuoso y sobre todo, honesto.

Contesta con lenguaje sencillo y enunciados cortos.

Contexto:

El rol del glosador en una agencia aduanal mexicana constituye un elemento fundamental dentro del ecosistema de comercio exterior, desempeñando una función que combina aspectos técnicos, normativos y estratégicos. Su labor trasciende la mera verificación documental para convertirse en un componente esencial de la gestión de riesgos aduaneros y la garantía de cumplimiento normativo que toda operación internacional requiere. La meticulosidad, conocimiento técnico y visión integral que caracterizan a este profesional contribuyen decisivamente a la fluidez y seguridad jurídica de las transacciones comerciales internacionales.

Ejemplos de respuesta:

ejemplo 1:⚠️ Hay un problema con las fechas. El sistema está tratando de comparar la fecha de salida del pedimento con la fecha que dio el operador. Sin embargo, solo tenemos la fecha de entrada que es '21/11/2024'. No podemos hacer la comparación porque nos falta saber la fecha de salida que dio el operador. Por favor, aclara si debemos revisar la fecha de entrada o la fecha de salida.

ejemplo 2: ✅ En este paso se comprobó lo siguiente: 1) El 'Valor en dólares' del pedimento es de 11,761.12 USD, lo que es coherente con el 'Valor aduana' de 237,159.00 MXN al dividirlo por el tipo de cambio de 20.1647 (resultando aproximadamente 11,761.10 USD). 2) El 'Precio pagado/valor comercial' es de 218,164.00 MXN, el cual resulta de restar los incrementables en MXN (7,683.00 + 11,312.00 = 18,995.00 MXN) al Valor aduana (237,159.00 MXN), lo que es consistente. 3) Se observa coherencia en la relación de los valores declarados, demostrando que los datos presentados son lógicos y consistentes.

ejemplo 3: ✅ Se verifica que el 'Tipo de cambio' declarado en el pedimento es 20.1647, lo cual coincide exactamente con el 'Tipo de cambio MXN-USD oficial' publicado en el Diario Oficial de la Federación del día anterior, según el external_context proporcionado

`;

const validationResultSchema = z.object({
  name: z.string().describe(`Nombre de la validación que identifica el tipo de verificación realizada`),
  contextSummary: z.string().describe(`Lista de documentos utilizados para la validación, incluyendo pedimentos, facturas, cartas porte, COVEs, u otros documentos aduanales relevantes. Debe enumerar específicamente cada documento consultado y su origen.`),
  llmAnalysis: z.string().describe(`Análisis detallado de la validación realizado por el LLM. Debe comenzar con '✅' si es correcto, '⚠️' si hay advertencias, o '❌' si hay errores. Debe incluir una explicación paso a paso del proceso de validación, citando expresamente los valores específicos encontrados en cada documento del contexto. Si algún campo es null, debe indicar exactamente qué información falta y cómo afecta a la validación.`),
  isValid: z.boolean().describe(`Indicador booleano de si la validación es correcta (true) o si presenta errores o advertencias que requieren atención (false)`),
  actionsToTake: z.array(z.string()).describe(`Lista detallada de acciones concretas a tomar en caso de que la validación no sea correcta. Cada acción debe ser específica, factible y directamente relacionada con los problemas identificados en el análisis. Puede incluir solicitudes de documentación adicional, correcciones a realizar, o consultas específicas que deban hacerse.`),
  summary: z.string().describe(`Resumen final conciso pero completo con todos los hallazgos encontrados en los pasos de validación. Debe sintetizar los puntos clave del análisis, destacar las discrepancias principales y mencionar el resultado global de la validación. Utilizar lenguaje claro y directo apropiado para un glosador aduanal.`)
});

export async function glosar(validation: {
  name: string;
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
}) {
  const { object: glosaResult } = await generateObject({
    model: wrapAISDKModel(openai("gpt-4o"), {
      name: `Glosar ${validation.name}`,
      project_name: "glosa",
    }),
    system: SYSTEM_PROMPT,
    schema: validationResultSchema,
    prompt: `${JSON.stringify(validation, null, 2)}`,
  });

  return {
    validation: glosaResult,
    contexts: validation.contexts
  };
}
