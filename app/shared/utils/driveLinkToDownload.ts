export function convertDriveLinkToDownload(link: string) {
  const match = link.match(/\/file\/d\/([^/]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  throw new Error('Invalid Google Drive link format');
}
