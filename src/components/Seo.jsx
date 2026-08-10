import { useEffect } from 'react';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://zorgtech.com').replace(/\/$/, '');

const DEFAULT_TITLE = 'Zorgtech — интерактивное оборудование';
const DEFAULT_DESCRIPTION =
  'Производство и продажа сенсорных столов и интерактивных терминалов с доставкой по России, Белоруссии и Казахстану';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

/** Client-side title / description / OG / canonical from scraped meta. */
export default function Seo({ title, description, path, image }) {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const canonical = absoluteUrl(path || window.location.pathname);

    document.title = pageTitle;
    upsertMeta('name', 'description', pageDescription);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:locale', 'ru_RU');
    upsertMeta('property', 'og:site_name', 'Zorgtech');
    upsertLink('canonical', canonical);

    if (image) {
      upsertMeta('property', 'og:image', absoluteUrl(image));
    }
  }, [title, description, path, image]);

  return null;
}

export { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION };
