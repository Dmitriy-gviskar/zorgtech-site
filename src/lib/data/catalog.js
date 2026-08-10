import categories from '../../data/categories.json';
import products from '../../data/products.json';
import { assetUrl } from './asset.js';
import {
  oneLine,
  firstSentences,
  clipSentence,
} from './content-utils.js';

export { categories, products };

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

/** Raw cover path (regen front or first scrape image). No BASE_URL — use with assetUrl(). */
export function productCoverPath(productOrSlug) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  const studio = REGEN_FRAMES[slug];
  if (studio?.length) return studio[0];
  return product?.images?.[0] || null;
}

export function productCover(productOrSlug) {
  return assetUrl(productCoverPath(productOrSlug));
}

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

export function categoryList() {
  return Object.values(categories).filter(
    (c) => !c.missing && c.productSlugs && c.productSlugs.length > 0,
  );
}

export function popularProducts(limit = 8) {
  return Object.values(products).slice(0, limit);
}

export function splitProductCopy(raw) {
  const text = oneLine(raw);
  if (!text) return { slogan: '', body: '' };

  // "Премиальная модель, красивый дизайн. Наша новая модель…"
  const dotted = text.match(/^(.{8,90}?[.!?])\s+([«"А-ЯA-ZЁ].+)$/u);
  if (dotted) {
    const slogan = dotted[1].replace(/[.!?]+$/u, '').trim();
    const body = dotted[2].trim();
    // Prefer a real product sentence over a tiny marketing exclamation alone
    if (slogan.length >= 8 && body.length >= 20) {
      return { slogan, body };
    }
  }

  // "Напольное исполнение – премиальный дизайн Сенсорный киоск…"
  // "Простота и удобство Сенсорный киоск…"
  // Note: JS \b is ASCII-only — use lookaround for Cyrillic.
  const glued = text.match(
    /^(.{6,90}?)\s+(?=(?:Сенсорн|Интерактивн|Бесконтактн|Детск|Напольн|Настенн|Уличн|Diamant|Apriori|Eco|Агат|Телемедицина))/u,
  );
  if (glued) {
    const slogan = glued[1].replace(/[–—-]\s*$/u, '').trim();
    const body = text.slice(glued[0].length).trim();
    if (slogan.length >= 6 && body.length >= 20 && !/[.!?]$/u.test(slogan)) {
      return { slogan, body };
    }
  }

  return { slogan: '', body: text };
}

export function presentPrice(price) {
  const value = oneLine(price);
  if (!value) return 'Цена по запросу';
  if (/^цена\s+по\s+запросу$/iu.test(value)) return 'Цена по запросу';
  // Broken scrape leftovers: "от", "от 2", "от 10"
  if (/^от(?:\s+\d{1,3})?$/iu.test(value)) return 'Цена по запросу';
  return value;
}

const FEATURE_SKIP = /^(по\s+в\s+подарок|надежные\s+компоненты)$/iu;

export function presentFeatures(features, limit = 4) {
  const list = Array.isArray(features) ? features : [];
  const cleaned = [];
  let gift = false;
  for (const item of list) {
    const f = oneLine(item);
    if (!f) continue;
    if (/^по\s+в\s+подарок$/iu.test(f)) {
      gift = true;
      continue;
    }
    if (FEATURE_SKIP.test(f)) continue;
    if (cleaned.includes(f)) continue;
    cleaned.push(f);
    if (cleaned.length >= limit) break;
  }
  return { gift, items: cleaned };
}

function splitSentences(text) {
  return oneLine(text)
    .split(/(?<=[.!?…])\s+/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function presentFeatureAnchor(feature) {
  const full = oneLine(feature);
  if (!full) return null;
  const comma = full.match(/^(.{6,72}?),\s+(.+)$/u);
  if (comma) return { label: comma[1].trim(), detail: comma[2].trim(), full };
  const head = full.match(
    /^((?:[«"]?[A-Za-zА-Яа-яЁё0-9-][A-Za-zА-Яа-яЁё0-9»"]*(?:\s+[A-Za-zА-Яа-яЁё0-9-][A-Za-zА-Яа-яЁё0-9»"]*){0,3}))(\s+(?:с|на|из|для|и|от)\s+.+)$/u,
  );
  if (head && head[1].length >= 8 && head[1].length <= 42) {
    return { label: head[1].trim(), detail: head[2].trim(), full };
  }
  return { label: full, detail: '', full };
}

export function presentProduct(productOrSlug) {
  const product = typeof productOrSlug === 'string' ? getProduct(productOrSlug) : productOrSlug;
  if (!product) {
    return {
      slogan: '',
      hook: '',
      lead: '',
      story: [],
      price: 'Цена по запросу',
      gift: false,
      features: [],
    };
  }
  const raw = product.lead || product.description || '';
  const { slogan, body } = splitProductCopy(raw);
  const source = body || raw;
  const sentences = splitSentences(source);
  const hook = sentences[0] ? clipSentence(sentences[0], 160) : firstSentences(source, 160, 1);
  const story = sentences.slice(1).filter((s) => s.length > 28);
  // Longer lead kept for places that still want 1–2 sentences
  const lead = firstSentences(source, 210, 2);
  const { gift, items } = presentFeatures(product.features, 3);
  return {
    slogan,
    hook,
    lead,
    story,
    price: presentPrice(product.price),
    gift,
    features: items.map(presentFeatureAnchor).filter(Boolean),
  };
}

function normalizeSpecKey(key) {
  return oneLine(key)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[,./]/g, ' ')
    .replace(/\b(мм|кг|гц|вт|кд|м\s*2|дюйм|шт|серия|модель)\b/giu, ' ')
    .replace(/\s+/g, '');
}

export function groupProductSpecs(specs) {
  const entries = Object.entries(specs || {})
    .map(([key, value]) => [oneLine(key), oneLine(value)])
    .filter(([k, v]) => k && v);

  const seen = new Set();
  const unique = [];
  for (const [key, value] of entries) {
    const nk = normalizeSpecKey(key);
    if (!nk || seen.has(nk)) continue;
    seen.add(nk);
    unique.push([key, value]);
  }

  const buckets = new Map(SPEC_GROUPS.map((g) => [g.id, { id: g.id, title: g.title, rows: [] }]));
  const other = { id: 'other', title: 'Прочее', rows: [] };

  for (const [key, value] of unique) {
    const group = SPEC_GROUPS.find((g) => g.test.test(key)) || null;
    (group ? buckets.get(group.id) : other).rows.push({ key, value });
  }

  return [...buckets.values(), other].filter((g) => g.rows.length > 0);
}

export function presentSpecGlance(specs) {
  const map = new Map(
    Object.entries(specs || {}).map(([k, v]) => [normalizeSpecKey(k), { key: oneLine(k), value: oneLine(v) }]),
  );
  const pick = (...keys) => {
    for (const k of keys) {
      const hit = map.get(normalizeSpecKey(k));
      if (hit?.value) return hit;
    }
    return null;
  };

  const chips = [];
  const diagonal = pick('Диагональ', 'Диагональ, дюйм', 'Монитор');
  if (diagonal) {
    const n = diagonal.value.match(/\d+(?:[.,]\d+)?/);
    chips.push({
      label: 'Диагональ',
      value: n ? `${n[0]}″` : diagonal.value,
    });
  }
  const install = pick('Тип установки');
  if (install) chips.push({ label: 'Установка', value: install.value });
  const weight = pick('Вес, кг', 'Вес нетто, кг');
  if (weight) chips.push({ label: 'Вес', value: /кг/i.test(weight.value) ? weight.value : `${weight.value} кг` });
  const touch = pick('Количество одновременных касаний');
  if (touch) chips.push({ label: 'Касания', value: touch.value });
  return chips.slice(0, 4);
}

const CATEGORY_SEO_CUT =
  /\s*(?:[-–—:.]\s*)?(?:купить|производство и продажа|у производителя|от производителя|от российского производителя|с доставкой|большой (?:ассортимент|выбор)|гарантия|проектирование).*$/iu;

/** Short category blurb without marketplace SEO tails. */
export function presentCategoryBlurb(category) {
  if (!category) return '';
  let text = oneLine(category.description || category.lead || '');
  if (!text) return '';
  // Drop leading marketplace "Купить …"
  text = text.replace(/^купить\s+/iu, '');
  text = text.replace(CATEGORY_SEO_CUT, '').trim();
  text = text.replace(/[-–—:,;.]\s*$/u, '').trim();
  text = text.replace(/\s+от компании\s+ZORGTECH\.?$/iu, '').trim();
  text = text.replace(/\s*[«"]Zorgtech[»"]\.?$/iu, '').trim();
  text = text.replace(/\s+от российского производителя\.?$/iu, '').trim();
  if (text.length < 12) return '';
  // Same as / nearly same as title → nothing useful left
  const name = oneLine(category.name);
  if (name) {
    const norm = (s) =>
      s
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/(?:^|[^a-zа-я0-9])(киоски|терминалы|столы|столики)(?=$|[^a-zа-я0-9])/gu, ' x ')
        .replace(/[^a-zа-я0-9]+/gu, '');
    const a = norm(text);
    const b = norm(name);
    if (!a || a === b || a.includes(b) || b.includes(a)) return '';
  }
  if (text.length > 160) text = firstSentences(text, 160, 1);
  return text;
}
