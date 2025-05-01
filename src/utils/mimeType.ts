export const getMimeType = (uri: string): string => {
  // Remove query parameters or fragments
  const cleanUri = uri.split('?')[0].split('#')[0];
  const ext = cleanUri.split('.').pop()?.toLowerCase();

  if (!ext) {
    // Optionally throw an error or return a generic MIME type
    return 'application/octet-stream';
  }

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';

    default:
      // Could also use application/octet-stream as a fallback
      return 'image/jpeg';
  }
};
