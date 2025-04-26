import { err, ok } from 'neverthrow';
import { UTApi } from 'uploadthing/server';

export async function uploadFiles(files: File[]) {
  const utapi = new UTApi();
  const uploadedFiles = await utapi.uploadFiles(files);

  const firstError = uploadedFiles.find(({ error }) => error !== null);
  if (firstError?.error) {
    return err(firstError.error.message);
  }

  // All uploads succeeded, we can safely use the data
  const successfulUploads = uploadedFiles.map(({ data }, index) => {
    const originalFile = files[index];
    if (!originalFile) {
      throw new Error('Should never happen');
    }
    if (!data) {
      throw new Error('Should never happen');
    }
    return {
      ...data,
      originalFile,
    };
  });

  return ok(successfulUploads);
}
