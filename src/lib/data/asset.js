import mediaWebp from '../../data/media-webp.json';

const WEBP_PATHS = new Set(
  (Array.isArray(mediaWebp) ? mediaWebp : []).map((p) => String(p).replace(/^\/+/, '')),
);

/** Prefer sibling .webp when optimize:images produced one. Original PNG/JPG stays on disk. */
function preferWebp(cleanPath) {
  if (!/\.(png|jpe?g)$/i.test(cleanPath)) return cleanPath;
  const webp = cleanPath.replace(/\.(png|jpe?g)$/i, '.webp');
  return WEBP_PATHS.has(webp) ? webp : cleanPath;
}

/** Prefix public asset paths for GitHub Pages base (`/zorgtech-site/`). Idempotent. */
export function assetUrl(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const value = String(path);
  if (base !== '/' && (value.startsWith(base) || value.startsWith(base.replace(/\/$/, '')))) {
    return value.startsWith('/') ? value : `/${value}`;
  }
  const clean = preferWebp(value.replace(/^\/+/, ''));
  return `${base}${clean}`;
}

/** Alias — same as assetUrl (webp preference is built-in). */
export function mediaUrl(path) {
  return assetUrl(path);
}
