import { assetUrl } from '../lib/data/asset.js';

/** Derive 3/4 studio frame path from a front cover path. */
export function studioAltCover(cover) {
  if (!cover || typeof cover !== 'string') return null;
  if (cover.includes('-frame-front.')) return cover.replace('-frame-front.', '-frame-34.');
  return null;
}

/**
 * Dual-layer studio product shot: front by default, 3/4 on parent hover/focus.
 */
export default function StudioHoverMedia({ cover, className = '' }) {
  const alt = studioAltCover(cover);
  if (!cover) return null;

  return (
    <div className={`studio-hover-media${alt ? ' studio-hover-media--duo' : ''}${className ? ` ${className}` : ''}`}>
      <img className="studio-hover-media-front" src={assetUrl(cover)} alt="" loading="lazy" />
      {alt ? <img className="studio-hover-media-alt" src={assetUrl(alt)} alt="" loading="lazy" /> : null}
    </div>
  );
}
