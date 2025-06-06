'use client';

import { LoadingBar, Modal } from '@/shared/components';
import { useModal } from '@/shared/hooks';
import { Document, Upload, XMark } from '@/shared/icons';
import { analysis } from '@/shared/services/customGloss/controller';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { cn } from '~/lib/utils';

const GlossForm = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [errorDisplaying, setErrorDisplaying] = useState(false);
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await analysis(formData);
    },
    onSuccess: (data) => {
      if (data?.success) {
        window.location.href = `/gloss/${data.glossId}/analysis`;
      }
      if (!data.success) {
        closeMenu();
      }
    },
    onError: (error) => {
      // Handle redirects (which Next.js sends as 303 responses that React Query considers errors)
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        // This is a redirect, allow it to happen normally
        return;
      }
      closeMenu();
    },
  });

  const handlerAction = () => {
    if (files) {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append('files', file);
      }
      mutation.mutate(formData);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (!files) {
      return;
    }
    const updatedFileList = Array.from(files).filter((_, i) => i !== index);
    const dataTransfer = new DataTransfer();
    for (const file of updatedFileList) {
      dataTransfer.items.add(file);
    }

    if (updatedFileList.length === 0) {
      setFiles(null);
      closeMenu();
    } else {
      setFiles(dataTransfer.files);
    }
  };

  let labelColor: string;
  if (files) {
    if (mutation.error || (mutation.data && !mutation.data.success)) {
      labelColor = 'border-red-500 bg-red-50';
    } else {
      labelColor = 'border-green-500 bg-green-50';
    }
  } else {
    labelColor = 'border-gray-300 bg-gray-50 hover:bg-gray-100';
  }

  let filePickerTextColor: string;
  if (files) {
    if (mutation.error || (mutation.data && !mutation.data.success)) {
      filePickerTextColor = 'text-red-500';
    } else {
      filePickerTextColor = 'text-green-500';
    }
  } else {
    filePickerTextColor = 'text-gray-500';
  }

  return (
    <>
      <h1 className="text-center font-semibold text-xl">
        ¡Carga tu Expediente!
      </h1>
      <p className="text-center text-base">
        Recuerda incluir todos los documentos relevantes a la operación <br />{' '}
        <span>(BL, Carta 3.1.8, etc.).</span>
      </p>
      {mutation.error && (
        <p className="text-red-500">{(mutation.error as Error).message}</p>
      )}
      {mutation.data && !mutation.data.success && (
        <p className="text-red-500">{mutation.data.message}</p>
      )}
      <div className="mt-4">
        <label
          htmlFor="documents"
          className={cn(
            'mb-4 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed',
            labelColor
          )}
        >
          <div className="flex flex-col items-center justify-center p-5">
            <Upload
              size="size-10"
              color={
                files
                  ? mutation.error || (mutation.data && !mutation.data.success)
                    ? 'red'
                    : 'green'
                  : ''
              }
            />
            <p className={cn('mb-2 text-center text-sm', filePickerTextColor)}>
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
              {`Archivos cargados: ${files?.length}`}
            </p>
          )}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              disabled={!files}
              onClick={() => openMenu()}
              className={cn(
                'rounded-md border border-white px-12 py-2 text-sm shadow-black/50 shadow-md transition-colors duration-300',
                files
                  ? 'bg-primary text-white hover:bg-primary/80'
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
        menuRef={mutation.isPending ? null : menuRef}
        onClose={closeMenu}
      >
        <div className="flex h-[430px] flex-col items-center justify-center gap-2">
          {mutation.isPending ? (
            <>
              <LoadingBar />
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
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1.5 right-1.5 z-10 rounded-full bg-gray-400 p-1 text-sm text-white hover:bg-gray-600"
                      >
                        <XMark />
                      </button>
                      {errorDisplaying ? (
                        <Document />
                      ) : (
                        <iframe
                          title={file.name}
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
                  type="button"
                  onClick={() => handlerAction()}
                  className="rounded-md border border-white bg-primary px-12 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-primary/80"
                >
                  Continuar
                </button>
                <button
                  type="button"
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

export default GlossForm;
