// Utility to resolve image paths for tour images.
// Uses the public folder's /assets/img/index/ directory when only a filename is provided.

export function resolveImageUrl(image) {
  if (!image || typeof image !== 'string') return '';

  const trimmed = image.trim();
  if (!trimmed) return '';

  // If already a full URL or a data URI, use as-is.
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // If it is already an absolute path, use as-is.
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Otherwise, treat it as a filename inside public/assets/img/index
  return `/assets/img/index/${trimmed}`;
}
