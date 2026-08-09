#!/usr/bin/env node
/**
 * Create high-quality WebP next to originals. NEVER deletes/modifies source PNG/JPG.
 *
 * regen / home studio: q=92, max edge 2048 (no upscale)
 * other large assets:  q=85, max edge 1600 (downscale only if wider)
 *
 * Writes src/data/media-webp.json — list of public paths that have .webp.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const cwebp = process.env.CWEBP || 'cwebp';

const ROOTS = [
  'img/regen',
  'img/home',
  'img/products',
  'img/projects',
  'img/pages',
  'img/solutions',
  'img/about',
  'img/brand',
];

const SKIP_DIR = new Set(['_precut', '_prewhite', 'blog']);
const SKIP_NAME = /^(?:_qa|ref-)/i;
const MIN_BYTES_OTHER = 300 * 1024;

function isStudioPath(relPosix) {
  return relPosix.startsWith('img/regen/') || relPosix.startsWith('img/home/');
}

function shouldSkip(abs, relPosix) {
  const parts = relPosix.split('/');
  if (parts.some((p) => SKIP_DIR.has(p))) return true;
  if (SKIP_NAME.test(path.basename(abs))) return true;
  return false;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (SKIP_DIR.has(name)) continue;
      walk(abs, out);
      continue;
    }
    if (!/\.(png|jpe?g)$/i.test(name)) continue;
    out.push(abs);
  }
  return out;
}

function publicRel(abs) {
  return path.relative(publicDir, abs).split(path.sep).join('/');
}

function pixelWidth(srcAbs) {
  const r = spawnSync('sips', ['-g', 'pixelWidth', srcAbs], { encoding: 'utf8' });
  const m = String(r.stdout || '').match(/pixelWidth:\s*(\d+)/);
  return m ? Number(m[1]) : 0;
}

function convertOne(srcAbs) {
  const rel = publicRel(srcAbs);
  if (shouldSkip(srcAbs, rel)) return null;

  const studio = isStudioPath(rel);
  const size = fs.statSync(srcAbs).size;
  if (!studio && size < MIN_BYTES_OTHER) return null;

  const outAbs = srcAbs.replace(/\.(png|jpe?g)$/i, '.webp');
  const quality = studio ? 92 : 85;
  const maxEdge = studio ? 2048 : 1600;

  if (fs.existsSync(outAbs)) {
    const a = fs.statSync(srcAbs).mtimeMs;
    const b = fs.statSync(outAbs).mtimeMs;
    if (b >= a && fs.statSync(outAbs).size > 1024) {
      return `/${rel.replace(/\.(png|jpe?g)$/i, '.webp')}`;
    }
  }

  // Never upscale — only shrink oversized photos.
  const width = pixelWidth(srcAbs);
  const args = ['-quiet', '-q', String(quality), '-m', '6', '-mt'];
  if (width > maxEdge) {
    args.push('-resize', String(maxEdge), '0');
  }
  args.push(srcAbs, '-o', outAbs);

  const r = spawnSync(cwebp, args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error('fail', rel, r.stderr || r.error);
    return null;
  }

  if (!fs.existsSync(outAbs)) return null;
  const webRel = `/${rel.replace(/\.(png|jpe?g)$/i, '.webp')}`;
  const after = fs.statSync(outAbs).size;
  console.log(
    `${studio ? 'studio' : 'asset '} ${(size / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  q=${quality}${
      width > maxEdge ? ` resize≤${maxEdge}` : ''
    }  ${rel}`,
  );
  return webRel;
}

function main() {
  const check = spawnSync(cwebp, ['-version'], { encoding: 'utf8' });
  if (check.error) {
    console.error('cwebp not found. Install via brew: brew install webp');
    process.exit(1);
  }

  const files = [];
  for (const rel of ROOTS) {
    walk(path.join(publicDir, rel), files);
  }

  files.sort((a, b) => {
    const ar = publicRel(a).startsWith('img/regen/') ? 0 : 1;
    const br = publicRel(b).startsWith('img/regen/') ? 0 : 1;
    return ar - br || a.localeCompare(b);
  });

  const manifest = [];
  let done = 0;
  for (const abs of files) {
    const web = convertOne(abs);
    if (web) {
      manifest.push(web);
      done += 1;
    }
  }

  manifest.sort();
  const outJson = path.join(root, 'src/data/media-webp.json');
  fs.writeFileSync(outJson, `${JSON.stringify(manifest)}\n`);
  console.log(
    `\nWrote ${manifest.length} webp paths → ${path.relative(root, outJson)} (${done} files)`,
  );
}

main();
