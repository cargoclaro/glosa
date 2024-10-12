"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { create, read } from "./model";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUserSession, isAuthenticated } from "../auth";
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
    const user = (await read({
      email: dataToValidate.email,
    })) as unknown as IUser;

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
  const dataToValidate = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    lastName: formData.get("lastName") as string,
    patentNumber: Number(formData.get("patentNumber")),
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
  cookies().set("session", "", { expires: new Date(0) });
  revalidatePath("/sign-in");
  redirect("/sign-in");
}

export async function getMe() {
  try {
    const session = await isAuthenticated();
    return await read({ id: session.userId as string });
  } catch (error) {
    console.error(error);
    return null;
  }
}
