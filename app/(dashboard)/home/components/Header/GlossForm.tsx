"use client";

import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { Loading, Modal } from "@/app/shared/components";
import { Document, Upload, XMark } from "@/app/shared/icons";
import { useModal, useServerAction } from "@/app/shared/hooks";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { analysis } from "@/app/shared/services/customGloss/controller";
import type { IGlossAnalysisState } from "@/app/shared/interfaces";

const GlossForm = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [errorDisplaying, setErrorDisplaying] = useState(false);
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);
  const { response, isLoading, setResponse, setIsLoading } =
    useServerAction<IGlossAnalysisState>(INITIAL_STATE_RESPONSE);

  const handlerAction = async () => {
    setIsLoading(true);
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      const res = await analysis(formData);
      if (res && res.success) {
        window.location.href = `/gloss/${res.glossId}/analysis`;
      } else {
        setResponse(res);
      }
    }
    setIsLoading(false);
    closeMenu();
  };

  const handleRemoveFile = (index: number) => {
    if (!files) return;
    const updatedFileList = Array.from(files).filter((_, i) => i !== index);
    const dataTransfer = new DataTransfer();
    updatedFileList.forEach((file) => dataTransfer.items.add(file));

    if (updatedFileList.length === 0) {
      setFiles(null);
      closeMenu();
    } else {
      setFiles(dataTransfer.files);
    }
  };

  return (
    <>
      <h1 className="text-center font-semibold text-xl">
        ¡Carga tu Expediente!
      </h1>
      <p className="text-center text-base">
        Recuerda incluir todos los documentos relevantes a la operación <br />{" "}
        <span>(BL, Carta 3.1.8, etc.).</span>
      </p>
      {response.message && <p className="text-red-500">{response.message}</p>}
      <div className="mt-4">
        <label
          htmlFor="documents"
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer mb-4",
            files
              ? response.errors && response.errors.documents
                ? "bg-red-50 border-red-500"
                : "bg-green-50 border-green-500"
              : "bg-gray-50 hover:bg-gray-100 border-gray-300"
          )}
        >
          <div className="flex flex-col items-center justify-center p-5">
            <Upload
              size="size-10"
              color={
                files
                  ? response.errors && response.errors.documents
                    ? "red"
                    : "green"
                  : ""
              }
            />
            <p
              className={cn(
                "mb-2 text-sm text-center",
                files
                  ? response.errors && response.errors.documents
                    ? "text-red-500"
                    : "text-green-500"
                  : "text-gray-500"
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
            onChange={(event) => {
              setFiles(event.target.files);
            }}
          />
        </label>
        <div className="text-center">
          {files && (
            <p className="font-semibold">
              {"Archivos cargados: " + files?.length}
            </p>
          )}
          <p className="block text-red-500 text-sm mb-2">
            {response.errors && response.errors.documents}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              disabled={!files}
              onClick={() => openMenu()}
              className={cn(
                "px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm transition-colors duration-300",
                files
                  ? "bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              Glosar
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        menuRef={isLoading ? null : menuRef}
        onClose={isLoading ? () => {} : closeMenu}
      >
        <div className="flex flex-col gap-2 items-center justify-center h-[430px]">
          {isLoading ? (
            <>
              <Loading color="cargoClaro" size="size-20" />
              <p className="text-xl text-center font-semibold">
                Analizando los documentos... <br />
                <small>
                  No actualice ni cierre la página, por favor, espere.
                </small>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-center font-bold text-xl">
                ¿Deseas continuar con la carga de estos archivos?
              </h2>
              <ul className="flex gap-2 overflow-x-auto items-start w-full max-w-min">
                {files &&
                  Array.from(files).map((file, index) => (
                    <li
                      key={index}
                      className="relative flex flex-col gap-2 w-[260px] h-[260px]"
                    >
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-sm z-10 hover:bg-red-600"
                      >
                        <XMark />
                      </button>
                      {errorDisplaying ? (
                        <Document />
                      ) : (
                        <iframe
                          width="260px"
                          height="260px"
                          src={URL.createObjectURL(file)}
                          onError={() => setErrorDisplaying(true)}
                        />
                      )}
                      <p
                        title={file.name}
                        className="text-center truncate px-2"
                      >
                        {file.name}
                      </p>
                    </li>
                  ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => handlerAction()}
                  className="px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover text-white"
                >
                  Continuar
                </button>
                <button
                  onClick={() => closeMenu()}
                  className="px-12 py-2 rounded-md shadow-black/50 shadow-md border border-white text-sm bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default GlossForm;
