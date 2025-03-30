import { google } from '@ai-sdk/google';
import { generateObject, NoObjectGeneratedError } from 'ai';
import { coveSchema, pedimentoSchema, billOfLadingSchema, airWaybillSchema, facturaSchema, cartaRegla318Schema, packingListSchema } from './schemas';

export async function extractAndStructureCoves(
  fileUrls: string[],
  parentTraceId?: string,
) {
  return await Promise.all(fileUrls.map(async (url) => {
    const telemetryConfig = parentTraceId
      ? {
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'Cove',
          metadata: {
            langfuseTraceId: parentTraceId,
            langfuseUpdateParent: false,
            fileUrl: url,
          },
        },
      }
      : {};
    try {
      const { object } = await generateObject({
        model: google('gemini-2.0-flash-001'),
        ...telemetryConfig,
        schema: coveSchema,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Estructura el documento en base al esquema proporcionado.',
              },
              {
                type: 'file',
                data: `${url}`,
                mimeType: 'application/pdf',
              },
            ],
          },
        ],
      });
      return object;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return {
          error: {
            type: 'NoObjectGenerated',
            message: error.message,
            cause: error.cause,
            fileUrl: url,
          },
        };
      }
      return {
        error: {
          type: 'UnknownError',
          message: 'Unknown error',
          fileUrl: url,
        },
      };
    }
  })
  );
}

export async function extractAndStructurePedimento(
  fileUrl: string,
  parentTraceId?: string,
) {
  const telemetryConfig = parentTraceId
    ? {
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Pedimento',
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
    }
    : {};
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      ...telemetryConfig,
      schema: pedimentoSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Estructura el documento en base al esquema proporcionado.',
            },
            {
              type: 'file',
              data: `${fileUrl}`,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return object;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return {
        error: {
          type: 'NoObjectGenerated',
          message: error.message,
          cause: error.cause,
        },
      };
    }
    return {
      error: {
        type: 'UnknownError',
        message: 'Unknown error',
      },
    };
  }
}

export async function extractAndStructureCartasRegla318(
  fileUrls: string[],
  parentTraceId?: string,
) {
  return await Promise.all(
    fileUrls.map(async (url) => {
      const telemetryConfig = parentTraceId
        ? {
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'Carta Regla 3.1.8',
            metadata: {
              langfuseTraceId: parentTraceId,
              langfuseUpdateParent: false,
              fileUrl: url,
            },
          },
        }
        : {};
      try {
        const { object } = await generateObject({
          model: google('gemini-2.0-flash-001'),
          seed: 42,
          ...telemetryConfig,
          schema: cartaRegla318Schema,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Estructura el documento en base al esquema proporcionado.',
                },
                {
                  type: 'file',
                  data: `${url}`,
                  mimeType: 'application/pdf',
                },
              ],
            },
          ],
        });

        return object;
      } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
          return {
            error: {
              type: 'NoObjectGenerated',
              message: error.message,
              cause: error.cause,
              fileUrl: url,
            },
          };
        }
        return {
          error: {
            type: 'UnknownError',
            message: 'Unknown error',
            fileUrl: url,
          },
        };
      }
    })
  );
}

export async function extractAndStructureFacturas(
  fileUrls: string[],
  parentTraceId?: string,
) {
  return await Promise.all(
    fileUrls.map(async (url) => {
      const telemetryConfig = parentTraceId
        ? {
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'Factura',
            metadata: {
              langfuseTraceId: parentTraceId,
              langfuseUpdateParent: false,
              fileUrl: url,
            },
          },
        }
        : {};
      try {
        const { object } = await generateObject({
          model: google('gemini-2.0-flash-001'),
          seed: 42,
          ...telemetryConfig,
          schema: facturaSchema,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Estructura el documento en base al esquema proporcionado.',
                },
                {
                  type: 'file',
                  data: `${url}`,
                  mimeType: 'application/pdf',
                },
              ],
            },
          ],
        });

        return object;
      } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
          return {
            error: {
              type: 'NoObjectGenerated',
              message: error.message,
              cause: error.cause,
              fileUrl: url,
            },
          };
        }
        return {
          error: {
            type: 'UnknownError',
            message: 'Unknown error',
            fileUrl: url,
          },
        };
      }
    })
  );
}

export async function extractAndStructurePackingList(
  fileUrl: string,
  parentTraceId?: string,
) {
  const telemetryConfig = parentTraceId
    ? {
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Packing List',
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
    }
    : {};
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      ...telemetryConfig,
      schema: packingListSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Estructura el documento en base al esquema proporcionado.',
            },
            {
              type: 'file',
              data: `${fileUrl}`,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return object;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return {
        error: {
          type: 'NoObjectGenerated',
          message: error.message,
          cause: error.cause,
        },
      };
    }
    return {
      error: {
        type: 'UnknownError',
        message: 'Unknown error',
      },
    };
  }
}

export async function extractAndStructureBillOfLading(
  fileUrl: string,
  parentTraceId?: string,
) {
  const telemetryConfig = parentTraceId
    ? {
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Bill of Lading',
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
    }
    : {};
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      ...telemetryConfig,
      schema: billOfLadingSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Estructura el documento en base al esquema proporcionado.',
            },
            {
              type: 'file',
              data: `${fileUrl}`,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return object;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return {
        error: {
          type: 'NoObjectGenerated',
          message: error.message,
          cause: error.cause,
        },
      };
    }
    return {
      error: {
        type: 'UnknownError',
        message: 'Unknown error',
      },
    };
  }
}

export async function extractAndStructureAirWaybill(
  fileUrl: string,
  parentTraceId?: string,
) {
  const telemetryConfig = parentTraceId
    ? {
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'Air Waybill',
        metadata: {
          langfuseTraceId: parentTraceId,
          langfuseUpdateParent: false,
          fileUrl,
        },
      },
    }
    : {};
  try {
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      seed: 42,
      ...telemetryConfig,
      schema: airWaybillSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Estructura el documento en base al esquema proporcionado.',
            },
            {
              type: 'file',
              data: `${fileUrl}`,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return object;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return {
        error: {
          type: 'NoObjectGenerated',
          message: error.message,
          cause: error.cause,
        },
      };
    }
    return {
      error: {
        type: 'UnknownError',
        message: 'Unknown error',
      },
    };
  }
}
