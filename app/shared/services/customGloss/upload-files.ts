import { err, ok } from 'neverthrow';
import { UTApi } from 'uploadthing/server';
import type { Classification } from './classification/classification';

// Type definition for the result of createExpedienteWithoutData
type NonPedimentoClassification = Exclude<Exclude<Classification, 'Otro'>, 'Pedimento'>;
type GroupedByClassification = {
  Pedimento: File;
} & {
  [K in NonPedimentoClassification]: File[];
};

export async function uploadFiles(
  groupedFiles: GroupedByClassification
) {
  const utapi = new UTApi();
  
  // Flatten all files with their classification type
  const filesToUpload: Array<{ file: File; classification: string }> = [];
  
  // Add Pedimento (single file)
  filesToUpload.push({
    file: groupedFiles.Pedimento,
    classification: 'Pedimento'
  });
  
  // Add other document types (arrays of files)
  for (const [classification, files] of Object.entries(groupedFiles)) {
    if (classification !== 'Pedimento' && Array.isArray(files)) {
      for (const file of files) {
        filesToUpload.push({
          file,
          classification
        });
      }
    }
  }
  
  // Extract just the File objects for uploading
  const files = filesToUpload.map(item => item.file);
  
  // Upload all files
  const uploadedFiles = await utapi.uploadFiles(files);

  // Check for errors
  const firstError = uploadedFiles.find(({ error }) => error !== null);
  if (firstError?.error) {
    return err(firstError.error.message);
  }

  return ok(filesToUpload.map((item, index) => {
    const data = uploadedFiles[index]?.data;
    if (!data) {
      throw new Error('Should never happen');
    }
    
    return {
      ...data,
      classification: item.classification,
    };
  }));
}
