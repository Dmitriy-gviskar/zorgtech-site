import categories from '../data/categories.json';
import products from '../data/products.json';
import projects from '../data/projects.json';
import solutions from '../data/solutions.json';
import pages from '../data/pages.json';
import areas from '../data/areas.json';

export { categories, products, projects, solutions, pages, areas };

/** Studio regen covers — preferred over scraped product photos when present. */
const REGEN_COVERS = {
  'diamant-32-fe': '/img/regen/diamant-32-fe-frame-front.png',
  'diamant-32-fe-pro': '/img/regen/diamant-32-fe-pro-frame-front.png',
  'diamant-32-w': '/img/regen/diamant-32-w-frame-front.png',
  'diamant-43-f': '/img/regen/diamant-43-f-frame-front.png',
  'diamant-46-f-outdoor': '/img/regen/diamant-46-f-outdoor-frame-front.png',
  'diamant-55-f': '/img/regen/diamant-55-f-frame-front.png',
  'diamant-55-f-outdoor': '/img/regen/diamant-55-f-outdoor-frame-front.png',
  'diamant-55-n': '/img/regen/diamant-55-n-frame-front.png',
  'apriori-22': '/img/regen/apriori-22-frame-front.png',
  'mono-32-f': '/img/regen/mono-32-f-frame-front.png',
};

export function getProduct(slug) {
  return products[slug] || null;
}

export function productCover(productOrSlug) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  return REGEN_COVERS[slug] || product?.images?.[0] || null;
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
