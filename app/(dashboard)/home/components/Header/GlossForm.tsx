"use client";

import { cn } from "@/app/utils/cn";
import { Upload } from "@/public/icons";

const GlossForm = () => {
  return (
    <>
      <h1 className="text-center font-semibold text-xl">
        ¡Carga tu Expediente!
      </h1>
      <small className="text-center text-base">
        Recuerda incluir todos los documentos relevantes a la operación <br />{" "}
        (BL, Carta 3.1.8, etc.).
      </small>
      <form encType="multipart/form-data" className="mt-4">
        <fieldset>
          <label
            htmlFor="documents"
            className={cn(
              "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer mb-4"
              // file
              //   ? badResponse.errors &&
              //     Object.keys(badResponse.errors as object).length > 0
              //     ? "bg-red-50 dark:bg-red-700 dark:border-red-600 border-red-500"
              //     : "bg-green-50 dark:bg-green-700 dark:border-green-600 border-green-500"
              //   : "bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
            )}
          >
            <div className="flex flex-col items-center justify-center p-5">
              <Upload
                size="size-10"
                //   color={
                //     file
                //       ? badResponse.errors &&
                //         Object.keys(badResponse.errors as object).length > 0
                //         ? "red"
                //         : "green"
                //       : ""
                //   }
              />
              <p
                className={cn(
                  "mb-2 text-sm text-center"
                  // file
                  //   ? badResponse.errors &&
                  //     Object.keys(badResponse.errors as object).length > 0
                  //     ? "text-red-500 dark:text-red-400"
                  //     : "text-green-500 dark:text-green-400"
                  //   : "text-gray-500 dark:text-gray-400"
                )}
              >
                <span className="font-semibold">Click para subir</span>
                <br />o arrastra los archivos aquí
              </p>
            </div>
            <input
              multiple
              type="file"
              accept=".pdf"
              id="documents"
              name="documents"
              className="hidden"
              // onChange={(event) => {
              //   setFile(event.target.files?.[0] || null);
              // }}
            />
          </label>
          <div className="text-center">
            <button className="px-12 py-2 rounded-md shadow-black/50 shadow-md text-white bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover border border-white text-sm">
              Glosar
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default GlossForm;
