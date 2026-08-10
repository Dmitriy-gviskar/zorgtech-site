#!/usr/bin/env node
/**
 * Bake presented content from source JSON (with html) into slim runtime JSON (no html/text).
 * Source with html: src/data/source/*.json (not imported by the app).
 *
 * Run via: npm run bake:content  (vite-node)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  presentProject,
  presentArea,
  presentSolution,
  presentAboutPage,
  presentServicePage,
  getProduct,
  presentProduct,
  productCoverPath,
  categoryList,
} from '../src/lib/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src/data');
const sourceDir = path.join(dataDir, 'source');

const SERVICE_KEYS = ['delivery', 'support', 'rent', 'policy'];

function ensureSource(name) {
  const runtime = path.join(dataDir, name);
  const source = path.join(sourceDir, name);
  fs.mkdirSync(sourceDir, { recursive: true });
  if (!fs.existsSync(source)) {
    if (!fs.existsSync(runtime)) throw new Error(`Missing ${name}`);
    fs.copyFileSync(runtime, source);
    console.log(`seeded source/${name}`);
  }
  return JSON.parse(fs.readFileSync(source, 'utf8'));
}

function writeRuntime(name, data) {
  const out = path.join(dataDir, name);
  fs.writeFileSync(out, `${JSON.stringify(data)}\n`);
  console.log(`wrote ${name} (${(fs.statSync(out).size / 1024).toFixed(0)}KB)`);
}

/** Drop bulky scrape fields once `presented` is baked. */
function slimRest(record, extraDrop = []) {
  const drop = new Set(['html', 'text', ...extraDrop]);
  const rest = {};
  for (const [key, value] of Object.entries(record)) {
    if (drop.has(key)) continue;
    rest[key] = value;
  }
  return rest;
}

const SOLUTION_SCRAPE_FIELDS = [
  'features',
  'tasks',
  'advantages',
  'capabilities',
  'applications',
  'sections',
];

const projectsSrc = ensureSource('projects.json');
const areasSrc = ensureSource('areas.json');
const pagesSrc = ensureSource('pages.json');
const solutionsSrc = ensureSource('solutions.json');

const projects = projectsSrc.map((p) => {
  const presented = presentProject(p);
  return { ...slimRest(p), presented };
});

const areas = areasSrc.map((a) => {
  const presented = presentArea(a);
  return { ...slimRest(a), presented };
});

const solutions = solutionsSrc.map((s) => {
  const presented = presentSolution(s);
  return { ...slimRest(s, SOLUTION_SCRAPE_FIELDS), presented };
});

const pages = {};
for (const key of Object.keys(pagesSrc)) {
  const page = pagesSrc[key];
  let presented = null;
  if (key === 'about') presented = presentAboutPage(page);
  else if (SERVICE_KEYS.includes(key)) presented = presentServicePage(key, page);
  else if (key === 'contacts') {
    presented = {
      title: 'Контакты',
      lead: 'Единый контактный центр, офис продаж и шоурум, производство в Дубне.',
    };
  }
  pages[key] = presented ? { ...slimRest(page), presented } : { ...slimRest(page) };
}

writeRuntime('projects.json', projects);
writeRuntime('areas.json', areas);
writeRuntime('solutions.json', solutions);
writeRuntime('pages.json', pages);

/** Slim home teasers — keep full projects.json off the main chunk. */
const projectTeasers = [...projects]
  .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0))
  .slice(0, 3)
  .map((p) => ({
    slug: p.slug,
    title: p.presented?.title || p.title,
    images: (p.images || []).slice(0, 1),
  }));
writeRuntime('project-teasers.json', projectTeasers);

/** Slim home catalog — keep products.json / categories.json off the main chunk. */
const HOME_TOP = [
  { slug: 'diamant-32-fe', kicker: 'Флагман' },
  { slug: 'diamant-55-n', kicker: 'Сенсорный стол' },
  { slug: 'diamant-46-f-outdoor', kicker: 'Уличный' },
  { slug: 'apriori-22', kicker: 'Apriori' },
];
const HOME_LINE_COVER = {
  napolnye: 'diamant-32-fe',
  stoly: 'diamant-55-n',
  nastennyy: 'diamant-32-w',
  ulichnye: 'diamant-46-f-outdoor',
  apriori: 'apriori-22',
  'kioski-samoobsluzhivaniya': 'diamant-32-w-pay',
};
const HOME_LINES = ['napolnye', 'stoly', 'nastennyy', 'ulichnye', 'apriori', 'kioski-samoobsluzhivaniya'];

const homeTopProducts = HOME_TOP.map((item) => {
  const product = getProduct(item.slug);
  if (!product) return null;
  const copy = presentProduct(product);
  return {
    slug: product.slug,
    kicker: item.kicker,
    title: product.title,
    tag: copy.slogan || copy.hook || '',
    price: copy.price,
    gift: Boolean(copy.gift),
    cover: productCoverPath(product),
  };
}).filter(Boolean);

const cats = categoryList();
const homeLines = HOME_LINES.map((slug) => {
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return null;
  const coverProduct =
    getProduct(HOME_LINE_COVER[slug]) || getProduct(cat.productSlugs?.[0]);
  return {
    slug: cat.slug,
    name: cat.name,
    modelCount: cat.productSlugs?.length || 0,
    cover: coverProduct ? productCoverPath(coverProduct) : null,
  };
}).filter(Boolean);

/** Home extras: popular products, blog teasers, museum spotlight — keep heavy JSON off the home chunk. */
const homeBlocks = JSON.parse(fs.readFileSync(path.join(dataDir, 'home-blocks.json'), 'utf8'));
const blogSrc = JSON.parse(fs.readFileSync(path.join(dataDir, 'blog.json'), 'utf8'));
const blogBySlug = new Map(blogSrc.map((p) => [p.slug, p]));

const HOME_BLOG_EXCERPTS = {
  'varianty-blokirovki-dlya-kioskov-i-displeev':
    'На современном рынке представлено множество замковых решений, включая как механические, так и электронные модели.',
  'kak-obsluzhivat-kiosk-kotoryy-perestal-rabotat':
    'Размещение киосков это только начало их пути. Поскольку они часто используются для самообслуживания, им периодически требуется техническое обслуживание, чтобы поддерживать',
  'sotrudnichestvo-s-nadezhnoy-kompaniey-po-ustanovke-programm-dlya-kioskov-i-displeev':
    'При организации киосков самообслуживания или программ для розничной торговли установка может включать множество участников, начиная от производителей оборудования',
};

const homePopular = (homeBlocks.popular?.slugs || []).map((slug) => {
  const product = getProduct(slug);
  if (!product) return null;
  const copy = presentProduct(product);
  return {
    slug: product.slug,
    title: product.title,
    desc: copy.slogan || copy.hook || product.lead || '',
    price: copy.price,
    cover: productCoverPath(product),
  };
}).filter(Boolean);

const homeBlog = (homeBlocks.blog?.slugs || []).map((slug) => {
  const post = blogBySlug.get(slug);
  if (!post) return null;
  const image =
    (post.images || []).find((src) => src && !/OG_logo_zorgtech/i.test(src)) || null;
  return {
    slug: post.slug,
    title: post.title,
    date: post.date || '',
    excerpt: HOME_BLOG_EXCERPTS[slug] || post.lead || post.meta?.description || '',
    image,
    href: post.sourceUrl || `https://zorgtech.com/blog/${post.slug}/`,
  };
}).filter(Boolean);

const museumSolution = solutions.find((s) => s.slug === homeBlocks.museum?.solutionSlug);
const museumProduct = getProduct(homeBlocks.museum?.productSlug);
const homeMuseum = museumSolution
  ? {
      title: homeBlocks.museum.title,
      text: homeBlocks.museum.text,
      cover: museumSolution.images?.[0] || null,
      productCover: museumProduct ? productCoverPath(museumProduct) : null,
    }
  : null;

writeRuntime('home-catalog.json', {
  topProducts: homeTopProducts,
  lines: homeLines,
  popular: homePopular,
  blog: homeBlog,
  museum: homeMuseum,
});

const sourceNames = ['projects.json', 'areas.json', 'pages.json', 'solutions.json'];
const before = sourceNames.reduce((sum, name) => sum + fs.statSync(path.join(sourceDir, name)).size, 0);
const after = sourceNames.reduce((sum, name) => sum + fs.statSync(path.join(dataDir, name)).size, 0);
console.log(`html bake: ${(before / 1024).toFixed(0)}KB source → ${(after / 1024).toFixed(0)}KB runtime`);
