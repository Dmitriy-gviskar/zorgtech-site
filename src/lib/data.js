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

/** Studio regen covers — preferred over scraped product photos when present. */
const REGEN_COVERS = {
  'diamant-32-fe': '/img/regen/diamant-32-fe-frame-front.png',
  'diamant-32-fe-pro': '/img/regen/diamant-32-fe-pro-frame-front.png',
  'diamant-32-w': '/img/regen/diamant-32-w-frame-front.png',
  'diamant-32-we': '/img/regen/diamant-32-we-frame-front.png',
  'diamant-32-n': '/img/regen/diamant-32-n-frame-front.png',
  'diamant-32-w-pay': '/img/regen/diamant-32-w-pay-frame-front.png',
  'diamant-43-f': '/img/regen/diamant-43-f-frame-front.png',
  'diamant-43-w': '/img/regen/diamant-43-w-frame-front.png',
  'diamant-46-f-outdoor': '/img/regen/diamant-46-f-outdoor-frame-front.png',
  'diamant-55-f': '/img/regen/diamant-55-f-frame-front.png',
  'diamant-55-f-outdoor': '/img/regen/diamant-55-f-outdoor-frame-front.png',
  'diamant-55-f-outdoor-dual': '/img/regen/diamant-55-f-outdoor-dual-frame-front.png',
  'diamant-55-n': '/img/regen/diamant-55-n-frame-front.png',
  'apriori': '/img/regen/apriori-19-frame-front.png',
  'apriori-19': '/img/regen/apriori-19-frame-front.png',
  'apriori-22': '/img/regen/apriori-22-frame-front.png',
  'mono-32-f': '/img/regen/mono-32-f-frame-front.png',
  'mono-32-n': '/img/regen/mono-32-n-frame-front.png',
  'mono-55-t': '/img/regen/mono-55-t-frame-front.png',
};

export function getProduct(slug) {
  return products[slug] || null;
}

export function productCover(productOrSlug) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  return assetUrl(REGEN_COVERS[slug] || product?.images?.[0] || null);
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
