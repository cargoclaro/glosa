"use server";

import bcrypt from "bcrypt";
import { create, read } from "./model";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { createUserSession } from "../auth";
import type { IUser } from "@/app/interfaces";

export async function login(formData: FormData) {
  const dataToValidate = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const errors = validateSchema("login", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    const user = (await read({ email: dataToValidate.email })) as IUser;

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
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
  redirect("/auth/dashboard");
}

export async function register(formData: FormData) {
  const dataToValidate = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    lastName: formData.get("lastName") as string,
    position: formData.get("position") as string,
    confirmPassword: formData.get("confirmPassword") as string,
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
    const userAlreadyExists = await read({ email: dataToValidate.email });
    if (userAlreadyExists) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...data } = dataToValidate;

    const newUser = await create({ data });
    await createUserSession(newUser.id);
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
  redirect("/auth/dashboard");
}
