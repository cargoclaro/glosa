import { UTApi } from 'uploadthing/server';

export async function uploadFiles(files: File[]) {
  const utapi = new UTApi();
  const uploadedFiles = await utapi.uploadFiles(files);

  // Check if any uploads failed
  const failedUploads = uploadedFiles.filter(({ error }) => error !== null);
  if (failedUploads.length > 0) {
    throw new Error(
      `Error al subir ${failedUploads.length} archivo(s): ${failedUploads.map((f) => f.error?.message || 'Error desconocido').join(', ')}`
    );
  }

  // All uploads succeeded, we can safely use the data
  const successfulUploads = uploadedFiles.map((result, index) => {
    const originalFile = files[index];
    if (!originalFile) {
      throw new Error('Should never happen');
    }
    if (!result.data) {
      throw new Error('Should never happen');
    }
    return {
      ...result.data,
      originalFile,
    };
  });

  return successfulUploads;
}
