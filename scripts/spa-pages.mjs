/**
 * GitHub Pages returns HTTP 404 for SPA deep links even when 404.html = index.html.
 * Materialize index.html under known routes so direct opens get 200.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const index = join(dist, 'index.html');

if (!existsSync(index)) {
  console.error('spa-pages: dist/index.html missing — run vite build first');
  process.exit(1);
}

/** Top-level and nested paths that must open without client-side navigation. */
const routes = [
  'dealers',
  'dealers/portal',
  'catalog',
  'realizovanye-proekty',
  'gotovye-resheniya',
  'oblasti-primeneniya',
  'about',
  'contacts',
  'dostavka-i-servis',
  'support',
  'rent',
  'policy',
];

for (const route of routes) {
  const dir = join(dist, route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(index, join(dir, 'index.html'));
  // No trailing slash: Pages may serve path.html
  const flat = join(dist, `${route}.html`);
  if (!route.includes('/')) {
    copyFileSync(index, flat);
  } else {
    mkdirSync(dirname(flat), { recursive: true });
    copyFileSync(index, flat);
  }
}

console.log(`spa-pages: wrote ${routes.length} route fallbacks`);
