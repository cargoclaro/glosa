'use client';

import { LoadingBar, Modal } from '@/shared/components';
import { INITIAL_STATE_RESPONSE } from '@/shared/constants';
import { useModal, useServerAction } from '@/shared/hooks';
import { Document, Upload, XMark } from '@/shared/icons';
import type { IGlossAnalysisState } from '@/shared/interfaces';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';
import { glosarRemesa } from './api';

const GlossFormRemesa = () => {
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
        formData.append('files', file);
      });
      const res = await glosarRemesa(formData);
      setResponse(res);
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
        Recuerda incluir todos los documentos relevantes a la operación <br />{' '}
        <span>(BL, Carta 3.1.8, etc.).</span>
      </p>
      {response.message && (
        <div
          className={`rounded-md p-4 ${response.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {Array.isArray(response.message) ? (
            <ul className="list-disc space-y-1 pl-5">
              {response.message.map((msg, index) => (
                <li key={index} className="text-sm">
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">{response.message}</p>
          )}
        </div>
      )}
      <div className="mt-4">
        <label
          htmlFor="documents"
          className={cn(
            'mb-4 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed',
            files
              ? response.errors && response.errors.documents
                ? 'border-red-500 bg-red-50'
                : 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          )}
        >
          <div className="flex flex-col items-center justify-center p-5">
            <Upload
              size="size-10"
              color={
                files
                  ? response.errors && response.errors.documents
                    ? 'red'
                    : 'green'
                  : ''
              }
            />
            <p
              className={cn(
                'mb-2 text-center text-sm',
                files
                  ? response.errors && response.errors.documents
                    ? 'text-red-500'
                    : 'text-green-500'
                  : 'text-gray-500'
              )}
            >
              <span className="font-semibold">Click para subir</span>
              <br />o arrastra los archivos aquí
            </p>
          </div>
          <input
            multiple
            type="file"
            accept=".pdf,.xml"
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
              {'Archivos cargados: ' + files?.length}
            </p>
          )}
          <p className="mb-2 block text-red-500 text-sm">
            {response.errors && response.errors.documents}
          </p>
          <div className="flex justify-center gap-2">
            <button
              disabled={!files}
              onClick={() => openMenu()}
              className={cn(
                'rounded-md border border-white px-12 py-2 text-sm shadow-black/50 shadow-md transition-colors duration-300',
                files
                  ? 'bg-cargoClaroOrange text-white hover:bg-cargoClaroOrange-hover'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
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
        <div className="flex h-[430px] flex-col items-center justify-center gap-2">
          {isLoading ? (
            <>
              <LoadingBar />
              <p className="text-center font-semibold text-xl">
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
              <ul className="flex w-full max-w-min items-start gap-2 overflow-x-auto">
                {files &&
                  Array.from(files).map((file, index) => (
                    <li
                      key={index}
                      className="relative flex h-[260px] w-[260px] flex-col gap-2"
                    >
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1.5 right-1.5 z-10 rounded-full bg-gray-400 p-1 text-sm text-white hover:bg-gray-600"
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
                        className="truncate px-2 text-center"
                      >
                        {file.name}
                      </p>
                    </li>
                  ))}
              </ul>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  onClick={() => handlerAction()}
                  className="rounded-md border border-white bg-cargoClaroOrange px-12 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-cargoClaroOrange-hover"
                >
                  Continuar
                </button>
                <button
                  onClick={() => closeMenu()}
                  className="rounded-md border border-white bg-gray-400 px-12 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-gray-500"
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

export default GlossFormRemesa;
