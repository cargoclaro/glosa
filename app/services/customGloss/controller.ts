"use server";

import { ANEXO_22_FIELDS_REQUESTS } from "@/app/constants";

export async function analysis(formData: FormData) {
  console.log(formData.getAll("documents"));

  try {
    const responses = await Promise.all(
      ANEXO_22_FIELDS_REQUESTS.map((req) => fetch(req.url, req.options))
    );

    const allOk = responses.every((res) => res.ok);
    if (!allOk) {
      return {
        success: false,
        message: "Ocurrió un error al obtener los campos del Anexo 22",
      };
    }

    const data = await Promise.all(responses.map((res) => res.text()));

    console.log(data);

    return {
      success: true,
      glossId: "123456",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
}
