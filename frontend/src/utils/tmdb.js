const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Constructs a full TMDB image URL from a relative image path.
 * Supported poster sizes: 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'
 * Supported backdrop sizes: 'w300', 'w780', 'w1280', 'original'
 *
 * @param {string|null} path - The relative path from TMDB (e.g. '/gKY6q7...jpg')
 * @param {string} size - The desired TMDB image size (default 'w500')
 * @returns {string|null} - The complete image URL or null if path is invalid
 */
export function getTmdbImageUrl(path, size = 'w500') {
  if (!path || typeof path !== 'string' || !path.trim()) {
    return null;
  }
  const cleanPath = path.trim().startsWith('/') ? path.trim() : `/${path.trim()}`;
  return `${TMDB_IMAGE_BASE_URL}/${size}${cleanPath}`;
}

export default getTmdbImageUrl;
