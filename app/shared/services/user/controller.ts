"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { create, read } from "./model";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUserSession, isAuthenticated } from "../auth";
import prisma from "@/app/shared/services/prisma";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  
  if (typeof email !== "string" || typeof password !== "string") {
    return {
      success: false,
      message: "Correo o contraseña inválidos"
    };
  }

  const dataToValidate = { email, password };

  const errors = validateSchema("login", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: dataToValidate.email,
      },
    });

    if (
      !user ||
      !(await bcrypt.compare(dataToValidate.password, user.password))
    ) {
      return {
        success: false,
        message: "Credenciales incorrectas",
      };
    }

    await createUserSession(user.id);
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
}

export async function register(formData: FormData) {
  const email = formData.get("email");
  if (typeof email !== "string") {
    return {
      success: false,
      message: "Correo electrónico inválido",
    };
  }
  
  const dataToValidate = {
    name: formData.get("name"),
    email,
    password: formData.get("password"),
    lastName: formData.get("lastName"),
    patentNumber: Number(formData.get("patentNumber")),
    confirmPassword: formData.get("confirmPassword"),
  };

  const errors = validateSchema("register", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      success: false,
    };
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword) {
    return {
      success: false,
      message: "Las contraseñas no coinciden",
    };
  }

  try {
    const userAlreadyExists = await read({ email });
    if (userAlreadyExists) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      };
    }

    // CHECK THEIR patentNumber IF IT EXISTS FROM THE DATABASE

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...data } = dataToValidate;

    const newUser = await create({ data });
    await createUserSession(newUser.id);
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
}

export async function logout() {
  cookies().set("glosa-session", "", { expires: new Date(0) });
  revalidatePath("/sign-in");
  redirect("/sign-in");
}

export async function getMe() {
  try {
    const session = await isAuthenticated();
    const userId = session["userId"];
    if (typeof userId !== "string") {
      throw new Error("User ID is not a string");
    }
    return await read({ id: userId });
  } catch (error) {
    console.error(error);
    return null;
  }
}
