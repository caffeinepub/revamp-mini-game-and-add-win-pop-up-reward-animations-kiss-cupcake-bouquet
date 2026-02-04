const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a JPG or PNG image.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 5MB.';
  }

  return null;
}
