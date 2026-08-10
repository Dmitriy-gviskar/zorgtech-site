/** Dataset + presenters. Prefer `./data/<zone>` imports in pages for route-level code splitting. */
export { assetUrl, mediaUrl } from './data/asset.js';
export {
  categories,
  products,
  getProduct,
  productCoverPath,
  productCover,
  productGallery,
  getCategory,
  categoryList,
  popularProducts,
  splitProductCopy,
  presentPrice,
  presentFeatures,
  presentFeatureAnchor,
  presentProduct,
  groupProductSpecs,
  presentSpecGlance,
  presentCategoryBlurb,
} from './data/catalog.js';
export { projects, getProject, presentProject } from './data/projects.js';
export { solutions, getSolution, presentSolution } from './data/solutions.js';
export { areas, getArea, presentArea } from './data/areas.js';
export { pages, getPage, presentAboutPage, presentServicePage } from './data/pages.js';
