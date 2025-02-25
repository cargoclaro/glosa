import z, { type UnknownKeysParam, type ZodRawShape } from "zod";

const baseSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico no es válido",
  }),
});

const loginSchema = baseSchema.extend({
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
});

const registerSchema = baseSchema.extend({
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: z.string().min(8, {
    message: "La confirmación de la contraseña es requerida",
  }),
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  lastName: z.string().min(1, {
    message: "El apellido es requerido",
  }),
  patentNumber: z.number().int().min(1, {
    message: "El número de patente es requerido",
  }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  login: loginSchema,
  register: registerSchema,
};

export function validateSchema(action: string, data: unknown) {
  const schema = schemas[action];

  if (!schema) {
    throw new Error("Invalid action");
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  } else {
    const errors = result.error.errors.reduce(
      (acc: { [key: string]: string }, error) => {
        if (error.path[0] !== undefined) {
          acc[error.path[0]] = error.message;
        }
        return acc;
      },
      {}
    );
    return errors;
  }
}
