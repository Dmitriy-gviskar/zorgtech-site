#!/usr/bin/env node
/**
 * Pixel dimensions of scraped product photos → src/data/media-dims.json
 * ({ "/img/products/x.jpg": [w, h] }). Used by the “Живые фото” gallery to pick a
 * landscape lead shot and to avoid cropping portrait photos. No deps: reads PNG IHDR / JPEG SOF.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(root, 'src/data/products.json'), 'utf8'));

function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    const isSOF = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isSOF) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return null;
}

const out = {};
for (const product of Object.values(products)) {
  for (const src of product.images || []) {
    if (!src || out[src]) continue;
    const abs = path.join(root, 'public', src);
    if (!fs.existsSync(abs)) continue;
    const buf = fs.readFileSync(abs);
    const size = pngSize(buf) || jpegSize(buf);
    if (size) out[src] = size;
  }
}

const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
const json = JSON.stringify(sorted, null, 2).replace(/\[\s+(\d+),\s+(\d+)\s+\]/g, '[$1, $2]');
fs.writeFileSync(path.join(root, 'src/data/media-dims.json'), json + '\n');
console.log(`media-dims: ${Object.keys(sorted).length} images`);
