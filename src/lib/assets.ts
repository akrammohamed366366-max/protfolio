/**
 * Resolves an asset path to respect Vite's BASE_URL.
 * Supports GitHub Pages sub-paths (e.g. /REPO_NAME/).
 * If the path is an external URL (http/https/data:), it returns it as-is.
 */
export function resolveAssetUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}
