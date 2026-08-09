#!/usr/bin/env node
/**
 * Bake presented content from source JSON (with html) into slim runtime JSON (no html).
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
  presentAboutPage,
  presentServicePage,
} from '../src/lib/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src/data');
const sourceDir = path.join(dataDir, 'source');

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

const projectsSrc = ensureSource('projects.json');
const areasSrc = ensureSource('areas.json');
const pagesSrc = ensureSource('pages.json');

const projects = projectsSrc.map((p) => {
  const presented = presentProject(p);
  const { html, ...rest } = p;
  return { ...rest, presented };
});

const areas = areasSrc.map((a) => {
  const presented = presentArea(a);
  const { html, ...rest } = a;
  return { ...rest, presented };
});

const pages = {};
for (const key of Object.keys(pagesSrc)) {
  const page = pagesSrc[key];
  const { html, ...rest } = page;
  let presented = null;
  if (key === 'about') presented = presentAboutPage(page);
  else if (['delivery', 'support', 'rent', 'policy'].includes(key)) {
    presented = presentServicePage(key, page);
  }
  pages[key] = presented ? { ...rest, presented } : { ...rest };
}

writeRuntime('projects.json', projects);
writeRuntime('areas.json', areas);
writeRuntime('pages.json', pages);

const before =
  fs.statSync(path.join(sourceDir, 'projects.json')).size +
  fs.statSync(path.join(sourceDir, 'areas.json')).size +
  fs.statSync(path.join(sourceDir, 'pages.json')).size;
const after =
  fs.statSync(path.join(dataDir, 'projects.json')).size +
  fs.statSync(path.join(dataDir, 'areas.json')).size +
  fs.statSync(path.join(dataDir, 'pages.json')).size;
console.log(`html bake: ${(before / 1024).toFixed(0)}KB source → ${(after / 1024).toFixed(0)}KB runtime`);
