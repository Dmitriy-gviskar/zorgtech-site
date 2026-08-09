import categories from '../data/categories.json';
import products from '../data/products.json';
import projects from '../data/projects.json';
import solutions from '../data/solutions.json';
import pages from '../data/pages.json';
import areas from '../data/areas.json';

export { categories, products, projects, solutions, pages, areas };

/** Prefix public asset paths for GitHub Pages base (`/zorgtech-site/`). */
export function assetUrl(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(path).replace(/^\/+/, '');
  return `${base}${clean}`;
}

/**
 * Studio regen frames only (same light-grey backdrop).
 * Ordered: front → 3/4 → side/rear.
 * When present, scraped photos are NOT mixed in — they have mismatched backgrounds.
 */
const REGEN_FRAMES = {
  'beskontaktnyy-dezinfektor-agat-5': [
    '/img/regen/agat-5-frame-front.png',
    '/img/regen/agat-5-frame-34.png',
  ],
  'beskontaktnyy-dezinfektor-agat-7': [
    '/img/regen/agat-7-frame-front.png',
    '/img/regen/agat-7-frame-34.png',
  ],
  'beskontaktnyy-dezinfektor-agat-9': [
    '/img/regen/agat-9-frame-front.png',
    '/img/regen/agat-9-frame-34.png',
  ],
  apriori: ['/img/regen/apriori-19-frame-front.png', '/img/regen/apriori-19-frame-34.png'],
  'apriori-19': ['/img/regen/apriori-19-frame-front.png', '/img/regen/apriori-19-frame-34.png'],
  'apriori-19-keyboard': [
    '/img/regen/apriori-19-keyboard-frame-front.png',
    '/img/regen/apriori-19-keyboard-frame-34.png',
  ],
  'apriori-19-print': [
    '/img/regen/apriori-19-print-frame-front.png',
    '/img/regen/apriori-19-print-frame-34.png',
  ],
  'apriori-19-print-a4': [
    '/img/regen/apriori-19-print-frame-front.png',
    '/img/regen/apriori-19-print-frame-34.png',
  ],
  'interaktivnyy-kiosk-apriori-19-print': [
    '/img/regen/apriori-19-print-frame-front.png',
    '/img/regen/apriori-19-print-frame-34.png',
  ],
  'apriori-22': [
    '/img/regen/apriori-22-frame-front.png',
    '/img/regen/apriori-22-frame-34.png',
    '/img/regen/apriori-22-frame-side.png',
  ],
  'apriori-22-key': [
    '/img/regen/apriori-22-key-frame-front.png',
    '/img/regen/apriori-22-key-frame-34.png',
  ],
  'diamant-22-f': [
    '/img/regen/diamant-22-f-frame-front.png',
    '/img/regen/diamant-22-f-frame-34.png',
  ],
  'diamant-22-n': [
    '/img/regen/diamant-22-n-frame-front.png',
    '/img/regen/diamant-22-n-frame-34.png',
  ],
  'diamant-22-w': [
    '/img/regen/diamant-22-w-frame-front.png',
    '/img/regen/diamant-22-w-frame-34.png',
  ],
  'diamant-32-f': [
    '/img/regen/diamant-32-f-frame-front.png',
    '/img/regen/diamant-32-f-frame-34.png',
  ],
  'diamant-32-f-general': [
    '/img/regen/diamant-32-f-frame-front.png',
    '/img/regen/diamant-32-f-frame-34.png',
  ],
  'diamant-32-f-key': [
    '/img/regen/diamant-32-f-key-frame-front.png',
    '/img/regen/diamant-32-f-key-frame-34.png',
  ],
  'diamant-32-f-print': [
    '/img/regen/diamant-32-f-print-frame-front.png',
    '/img/regen/diamant-32-f-print-frame-34.png',
  ],
  'diamant-32-fe': [
    '/img/regen/diamant-32-fe-frame-front.png',
    '/img/regen/diamant-32-fe-frame-34.png',
    '/img/regen/diamant-32-fe-frame-rear-led.png',
  ],
  'diamant-32-fe-pro': [
    '/img/regen/diamant-32-fe-pro-frame-front.png',
    '/img/regen/diamant-32-fe-pro-frame-34.png',
    '/img/regen/diamant-32-fe-pro-frame-side.png',
  ],
  'diamant-32-n': ['/img/regen/diamant-32-n-frame-front.png', '/img/regen/diamant-32-n-frame-34.png'],
  'diamant-32-ne': [
    '/img/regen/diamant-32-ne-frame-front.png',
    '/img/regen/diamant-32-ne-frame-34.png',
  ],
  'diamant-32-w': [
    '/img/regen/diamant-32-w-frame-front.png',
    '/img/regen/diamant-32-w-frame-34.png',
    '/img/regen/diamant-32-w-frame-side.png',
  ],
  'diamant-32-w-pay': [
    '/img/regen/diamant-32-w-pay-frame-front.png',
    '/img/regen/diamant-32-w-pay-frame-34.png',
  ],
  'diamant-32-w-print': [
    '/img/regen/diamant-32-w-print-frame-front.png',
    '/img/regen/diamant-32-w-print-frame-34.png',
  ],
  'diamant-32-wa-pay': [
    '/img/regen/diamant-32-wa-pay-frame-front.png',
    '/img/regen/diamant-32-wa-pay-frame-34.png',
  ],
  'diamant-32-we': [
    '/img/regen/diamant-32-we-frame-front.png',
    '/img/regen/diamant-32-we-frame-34.png',
  ],
  'diamant-32-we-pay': [
    '/img/regen/diamant-32-we-pay-frame-front.png',
    '/img/regen/diamant-32-we-pay-frame-34.png',
  ],
  'diamant-32-wea-pay': [
    '/img/regen/diamant-32-wea-pay-frame-front.png',
    '/img/regen/diamant-32-wea-pay-frame-34.png',
  ],
  'diamant-43-f': [
    '/img/regen/diamant-43-f-frame-front.png',
    '/img/regen/diamant-43-f-frame-34.png',
    '/img/regen/diamant-43-f-frame-rear.png',
  ],
  'diamant-43-f-general': [
    '/img/regen/diamant-43-f-frame-front.png',
    '/img/regen/diamant-43-f-frame-34.png',
    '/img/regen/diamant-43-f-frame-rear.png',
  ],
  'diamant-43-f-print': [
    '/img/regen/diamant-43-f-print-frame-front.png',
    '/img/regen/diamant-43-f-print-frame-34.png',
  ],
  'diamant-43-fl': [
    '/img/regen/diamant-43-fl-frame-front.png',
    '/img/regen/diamant-43-fl-frame-34.png',
  ],
  'diamant-43-n': [
    '/img/regen/diamant-43-n-frame-front.png',
    '/img/regen/diamant-43-n-frame-34.png',
  ],
  'diamant-43-w': [
    '/img/regen/diamant-43-w-frame-front.png',
    '/img/regen/diamant-43-w-frame-34.png',
  ],
  'diamant-46-f-outdoor': [
    '/img/regen/diamant-46-f-outdoor-frame-front.png',
    '/img/regen/diamant-46-f-outdoor-frame-34.png',
    '/img/regen/diamant-46-f-outdoor-frame-rear.png',
  ],
  'diamant-49-f': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
  ],
  'diamant-49-f-general': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
  ],
  'diamant-49-f-print': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
  ],
  'diamant-49-f-retail': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
  ],
  'diamant-49-n': [
    '/img/regen/diamant-49-n-frame-front.png',
    '/img/regen/diamant-49-n-frame-34.png',
  ],
  'diamant-49-w': [
    '/img/regen/diamant-49-w-frame-front.png',
    '/img/regen/diamant-49-w-frame-34.png',
  ],
  'diamant-55-f': [
    '/img/regen/diamant-55-f-frame-front.png',
    '/img/regen/diamant-55-f-frame-34.png',
    '/img/regen/diamant-55-f-frame-rear.png',
  ],
  'diamant-55-f-outdoor': [
    '/img/regen/diamant-55-f-outdoor-frame-front.png',
    '/img/regen/diamant-55-f-outdoor-frame-34.png',
    '/img/regen/diamant-55-f-outdoor-frame-rear.png',
  ],
  'diamant-55-f-outdoor-dual': [
    '/img/regen/diamant-55-f-outdoor-dual-frame-front.png',
    '/img/regen/diamant-55-f-outdoor-dual-frame-34.png',
  ],
  'diamant-55-n': [
    '/img/regen/diamant-55-n-frame-front.png',
    '/img/regen/diamant-55-n-frame-34.png',
  ],
  'diamant-55-ne': [
    '/img/regen/diamant-55-ne-frame-front.png',
    '/img/regen/diamant-55-ne-frame-34.png',
  ],
  'diamant-55-w': [
    '/img/regen/diamant-55-w-frame-front.png',
    '/img/regen/diamant-55-w-frame-34.png',
  ],
  'diamant-65-f': [
    '/img/regen/diamant-65-f-frame-front.png',
    '/img/regen/diamant-65-f-frame-34.png',
  ],
  'diamant-75-f': [
    '/img/regen/diamant-75-f-frame-front.png',
    '/img/regen/diamant-75-f-frame-34.png',
  ],
  'diamant-86-f-grand': [
    '/img/regen/diamant-86-f-grand-frame-front.png',
    '/img/regen/diamant-86-f-grand-frame-34.png',
  ],
  'diamant-intercon': [
    '/img/regen/diamant-intercon-frame-front.png',
    '/img/regen/diamant-intercon-frame-34.png',
  ],
  'diamant-tmedical': [
    '/img/regen/diamant-tmedical-frame-front.png',
    '/img/regen/diamant-tmedical-frame-34.png',
  ],
  'eco-kid-22': ['/img/regen/eco-kid-22-frame-front.png', '/img/regen/eco-kid-22-frame-34.png'],
  'eco-kid-32': ['/img/regen/eco-kid-32-frame-front.png', '/img/regen/eco-kid-32-frame-34.png'],
  'mono-19-f': [
    '/img/regen/mono-19-f-frame-front.png',
    '/img/regen/mono-19-f-frame-34.png',
  ],
  'mono-32-f': [
    '/img/regen/mono-32-f-frame-front.png',
    '/img/regen/mono-32-f-frame-34.png',
    '/img/regen/mono-32-f-frame-side.png',
  ],
  'mono-32-f-pin': [
    '/img/regen/mono-32-f-pin-frame-front.png',
    '/img/regen/mono-32-f-pin-frame-34.png',
  ],
  'mono-32-fa-pin': [
    '/img/regen/mono-32-fa-pin-frame-front.png',
    '/img/regen/mono-32-fa-pin-frame-34.png',
  ],
  'mono-32-f-scan': [
    '/img/regen/mono-32-f-scan-frame-front.png',
    '/img/regen/mono-32-f-scan-frame-34.png',
  ],
  'mono-32-n': ['/img/regen/mono-32-n-frame-front.png', '/img/regen/mono-32-n-frame-34.png'],
  'mono-43-f': ['/img/regen/mono-43-f-frame-front.png', '/img/regen/mono-43-f-frame-34.png'],
  'mono-55-t': ['/img/regen/mono-55-t-frame-front.png', '/img/regen/mono-55-t-frame-34.png'],
};

export function getProduct(slug) {
  return products[slug] || null;
}

export function productCover(productOrSlug) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  const studio = REGEN_FRAMES[slug];
  if (studio?.length) return assetUrl(studio[0]);
  return assetUrl(product?.images?.[0] || null);
}

/** Studio-only gallery when regen exists; otherwise a single scraped cover (no mixed backdrops). */
export function productGallery(productOrSlug) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  const studio = REGEN_FRAMES[slug];
  if (studio?.length) return studio.map(assetUrl).filter(Boolean);
  const first = product?.images?.[0];
  return first ? [assetUrl(first)] : [];
}

export function getCategory(slug) {
  return categories[slug] || null;
}

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function getSolution(slug) {
  return solutions.find((s) => s.slug === slug) || null;
}

export function getPage(key) {
  return pages[key] || null;
}

export function getArea(slug) {
  return areas.find((a) => a.slug === slug) || null;
}

export function categoryList() {
  return Object.values(categories).filter(
    (c) => !c.missing && c.productSlugs && c.productSlugs.length > 0,
  );
}

export function popularProducts(limit = 8) {
  return Object.values(products).slice(0, limit);
}
