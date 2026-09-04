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
    '/img/regen/agat-5-frame-side.png',
    '/img/regen/agat-5-frame-detail.png',
  ],
  'beskontaktnyy-dezinfektor-agat-7': [
    '/img/regen/agat-7-frame-front.png',
    '/img/regen/agat-7-frame-34.png',
    '/img/regen/agat-7-frame-side.png',
    '/img/regen/agat-7-frame-detail.png',
  ],
  'beskontaktnyy-dezinfektor-agat-9': [
    '/img/regen/agat-9-frame-front.png',
    '/img/regen/agat-9-frame-34.png',
    '/img/regen/agat-9-frame-side.png',
    '/img/regen/agat-9-frame-detail.png',
  ],
  apriori: [
    '/img/regen/apriori-19-frame-front.png',
    '/img/regen/apriori-19-frame-34.png',
    '/img/regen/apriori-19-frame-side.png',
    '/img/regen/apriori-19-frame-rear.png',
  ],
  'apriori-19': [
    '/img/regen/apriori-19-frame-front.png',
    '/img/regen/apriori-19-frame-34.png',
    '/img/regen/apriori-19-frame-side.png',
    '/img/regen/apriori-19-frame-rear.png',
    '/img/regen/apriori-19-frame-detail.png',
  ],
  'apriori-19-keyboard': [
    '/img/regen/apriori-19-keyboard-frame-front.png',
    '/img/regen/apriori-19-keyboard-frame-side.png',
    '/img/regen/apriori-19-keyboard-frame-rear.png',
    '/img/regen/apriori-19-keyboard-frame-keyboard.png',
  ],
  'apriori-19-print': [
    '/img/regen/apriori-19-print-frame-front.png',
    '/img/regen/apriori-19-print-frame-34.png',
    '/img/regen/apriori-19-print-frame-side.png',
    '/img/regen/apriori-19-print-frame-rear.png',
    '/img/regen/apriori-19-print-frame-modules.png',
  ],
  'apriori-19-print-a4': [
    '/img/regen/apriori-19-print-frame-front.png',
    '/img/regen/apriori-19-print-frame-34.png',
    '/img/regen/apriori-19-print-a4-frame-side.png',
    '/img/regen/apriori-19-print-a4-frame-rear.png',
  ],
  'interaktivnyy-kiosk-apriori-19-print': [
    '/img/regen/apriori-19-print-frame-front.png',
    '/img/regen/apriori-19-print-frame-34.png',
    '/img/regen/apriori-19-print-frame-side.png',
    '/img/regen/apriori-19-print-frame-rear.png',
    '/img/regen/apriori-19-print-frame-modules.png',
  ],
  'apriori-22': [
    '/img/regen/apriori-22-frame-front.png',
  ],
  'apriori-22-key': [
    '/img/regen/apriori-22-key-frame-front.png',
    '/img/regen/apriori-22-key-frame-34-v2.png',
    '/img/regen/apriori-22-key-frame-side.png',
    '/img/regen/apriori-22-key-frame-rear.png',
    '/img/regen/apriori-22-key-frame-keyboard.png',
  ],
  'diamant-22-f': [
    '/img/regen/diamant-22-f-frame-front.png',
    '/img/regen/diamant-22-f-frame-34.png',
    '/img/regen/diamant-22-f-frame-side.png',
    '/img/regen/diamant-22-f-frame-rear.png',
    '/img/regen/diamant-22-f-frame-detail.png',
  ],
  'diamant-22-n': [
    '/img/regen/diamant-22-n-frame-34-v12.png',
    '/img/regen/diamant-22-n-frame-side-v12.png',
  ],
  'diamant-22-w': [
    '/img/regen/diamant-22-w-frame-front.png',
    '/img/regen/diamant-22-w-frame-34.png',
    '/img/regen/diamant-22-w-frame-rear.png',
    '/img/regen/diamant-22-w-frame-detail.png',
  ],
  'diamant-32-f': [
    '/img/regen/diamant-32-f-frame-front.png',
    '/img/regen/diamant-32-f-frame-34.png',
    '/img/regen/diamant-32-f-frame-side.png',
    '/img/regen/diamant-32-f-frame-rear.png',
    '/img/regen/diamant-32-f-frame-detail.png',
  ],
  'diamant-32-f-general': [
    '/img/regen/diamant-32-f-frame-front.png',
    '/img/regen/diamant-32-f-frame-34.png',
    '/img/regen/diamant-32-f-frame-side.png',
    '/img/regen/diamant-32-f-frame-rear.png',
    '/img/regen/diamant-32-f-frame-detail.png',
  ],
  'diamant-32-f-key': [
    '/img/regen/diamant-32-f-key-frame-front.png',
    '/img/regen/diamant-32-f-key-frame-34.png',
    '/img/regen/diamant-32-f-key-frame-side.png',
    '/img/regen/diamant-32-f-key-frame-rear.png',
    '/img/regen/diamant-32-f-key-frame-keyboard.png',
  ],
  'diamant-32-f-print': [
    '/img/regen/diamant-32-f-print-frame-front.png',
    '/img/regen/diamant-32-f-print-frame-34.png',
    '/img/regen/diamant-32-f-print-frame-side.png',
    '/img/regen/diamant-32-f-print-frame-rear.png',
  ],
  'diamant-32-fe': [
    '/img/regen/diamant-32-fe-frame-front.png',
    '/img/regen/diamant-32-fe-frame-34.png',
    '/img/regen/diamant-32-fe-frame-side.png',
    '/img/regen/diamant-32-fe-frame-rear-v8.png',
    '/img/regen/diamant-32-fe-frame-detail.png',
  ],
  'diamant-32-fe-pro': [
    '/img/regen/diamant-32-fe-pro-frame-front.png',
    '/img/regen/diamant-32-fe-pro-frame-34.png',
    '/img/regen/diamant-32-fe-pro-frame-side.png',
    '/img/regen/diamant-32-fe-pro-frame-detail.png',
  ],
  'diamant-32-n': [
    '/img/regen/diamant-32-n-frame-front-v2.png',
    '/img/regen/diamant-32-n-frame-34-v2.png',
    '/img/regen/diamant-32-n-frame-side-v2.png',
  ],
  'diamant-32-ne': [
    '/img/regen/diamant-32-ne-frame-front.png',
    '/img/regen/diamant-32-ne-frame-rear.png',
  ],
  'diamant-32-w': [
    '/img/regen/diamant-32-w-frame-front.png',
    '/img/regen/diamant-32-w-frame-34.png',
    '/img/regen/diamant-32-w-frame-side.png',
    '/img/regen/diamant-32-w-frame-rear.png',
    '/img/regen/diamant-32-w-frame-detail.png',
  ],
  'diamant-32-w-pay': [
    '/img/regen/diamant-32-w-pay-frame-front.png',
    '/img/regen/diamant-32-w-pay-frame-34.png',
    '/img/regen/diamant-32-w-pay-frame-side.png',
    '/img/regen/diamant-32-w-pay-frame-detail.png',
  ],
  'diamant-32-w-print': [
    '/img/regen/diamant-32-w-print-frame-front.png',
    '/img/regen/diamant-32-w-print-frame-34.png',
    '/img/regen/diamant-32-w-print-frame-side.png',
    '/img/regen/diamant-32-w-print-frame-detail.png',
  ],
  'diamant-32-wa-pay': [
    '/img/regen/diamant-32-wa-pay-frame-front.png',
    '/img/regen/diamant-32-wa-pay-frame-34.png',
    '/img/regen/diamant-32-wa-pay-frame-side.png',
    '/img/regen/diamant-32-wa-pay-frame-detail.png',
  ],
  'diamant-32-we': [
    '/img/regen/diamant-32-we-frame-front.png',
    '/img/regen/diamant-32-we-frame-34.png',
    '/img/regen/diamant-32-we-frame-side.png',
    '/img/regen/diamant-32-we-frame-detail.png',
  ],
  'diamant-32-we-pay': [
    '/img/regen/diamant-32-we-pay-frame-front.png',
    '/img/regen/diamant-32-we-pay-frame-34.png',
    '/img/regen/diamant-32-we-pay-frame-side.png',
    '/img/regen/diamant-32-we-pay-frame-detail-v2.png',
  ],
  'diamant-32-wea-pay': [
    '/img/regen/diamant-32-wea-pay-frame-front.png',
    '/img/regen/diamant-32-wea-pay-frame-34.png',
    '/img/regen/diamant-32-wea-pay-frame-side.png',
    '/img/regen/diamant-32-wea-pay-frame-detail.png',
  ],
  'diamant-43-f': [
    '/img/regen/diamant-43-f-frame-front.png',
    '/img/regen/diamant-43-f-frame-34.png',
    '/img/regen/diamant-43-f-frame-side.png',
    '/img/regen/diamant-43-f-frame-rear.png',
    '/img/regen/diamant-43-f-frame-detail.png',
  ],
  'diamant-43-f-general': [
    '/img/regen/diamant-43-f-frame-front.png',
    '/img/regen/diamant-43-f-frame-side.png',
    '/img/regen/diamant-43-f-general-frame-34.png',
    '/img/regen/diamant-43-f-general-frame-rear.png',
  ],
  'diamant-43-f-print': [
    '/img/regen/diamant-43-f-print-frame-front.png',
    '/img/regen/diamant-43-f-print-frame-34.png',
    '/img/regen/diamant-43-f-print-frame-side.png',
    '/img/regen/diamant-43-f-print-frame-rear.png',
    '/img/regen/diamant-43-f-print-frame-print.png',
  ],
  'diamant-43-fl': [
    '/img/regen/diamant-43-fl-frame-front.png',
    '/img/regen/diamant-43-fl-frame-34.png',
    '/img/regen/diamant-43-fl-frame-side.png',
    '/img/regen/diamant-43-fl-frame-rear.png',
    '/img/regen/diamant-43-fl-frame-detail.png',
  ],
  'diamant-43-n': [
    '/img/regen/diamant-43-n-frame-front.png',
    '/img/regen/diamant-43-n-frame-34.png',
    '/img/regen/diamant-43-n-frame-side.png',
    '/img/regen/diamant-43-n-frame-rear.png',
  ],
  'diamant-43-w': [
    '/img/regen/diamant-43-w-frame-front.png',
    '/img/regen/diamant-43-w-frame-34.png',
    '/img/regen/diamant-43-w-frame-side.png',
    '/img/regen/diamant-43-w-frame-rear.png',
  ],
  'diamant-46-f-outdoor': [
    '/img/regen/diamant-46-f-outdoor-frame-front.png',
    '/img/regen/diamant-46-f-outdoor-frame-34.png',
    '/img/regen/diamant-46-f-outdoor-frame-side.png',
    '/img/regen/diamant-46-f-outdoor-frame-rear.png',
    '/img/regen/diamant-46-f-outdoor-frame-detail.png',
  ],
  'diamant-49-f': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
    '/img/regen/diamant-49-f-frame-side.png',
    '/img/regen/diamant-49-f-frame-rear.png',
    '/img/regen/diamant-49-f-frame-detail.png',
  ],
  'diamant-49-f-general': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
    '/img/regen/diamant-49-f-frame-side.png',
    '/img/regen/diamant-49-f-frame-rear.png',
    '/img/regen/diamant-49-f-frame-detail.png',
  ],
  'diamant-49-f-print': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
    '/img/regen/diamant-49-f-frame-side.png',
    '/img/regen/diamant-49-f-frame-rear.png',
    '/img/regen/diamant-49-f-frame-detail.png',
  ],
  'diamant-49-f-retail': [
    '/img/regen/diamant-49-f-frame-front.png',
    '/img/regen/diamant-49-f-frame-34.png',
    '/img/regen/diamant-49-f-frame-side.png',
    '/img/regen/diamant-49-f-frame-rear.png',
    '/img/regen/diamant-49-f-frame-detail.png',
  ],
  'diamant-49-n': [
    '/img/regen/diamant-49-n-frame-front.png',
    '/img/regen/diamant-49-n-frame-34.png',
    '/img/regen/diamant-49-n-frame-side.png',
    '/img/regen/diamant-49-n-frame-rear.png',
  ],
  'diamant-49-w': [
    '/img/regen/diamant-49-w-frame-front.png',
    '/img/regen/diamant-49-w-frame-34.png',
    '/img/regen/diamant-49-w-frame-side.png',
    '/img/regen/diamant-49-w-frame-rear.png',
  ],
  'diamant-55-f': [
    '/img/regen/diamant-55-f-frame-front.png',
    '/img/regen/diamant-55-f-frame-34.png',
    '/img/regen/diamant-55-f-frame-side.png',
    '/img/regen/diamant-55-f-frame-rear.png',
    '/img/regen/diamant-55-f-frame-detail.png',
  ],
  'diamant-55-f-outdoor': [
    '/img/regen/diamant-55-f-outdoor-frame-front.png',
    '/img/regen/diamant-55-f-outdoor-frame-34.png',
    '/img/regen/diamant-55-f-outdoor-frame-side.png',
    '/img/regen/diamant-55-f-outdoor-frame-rear.png',
    '/img/regen/diamant-55-f-outdoor-frame-detail.png',
  ],
  'diamant-55-f-outdoor-dual': [
    '/img/regen/diamant-55-f-outdoor-dual-frame-front.png',
    '/img/regen/diamant-55-f-outdoor-dual-frame-34.png',
    '/img/regen/diamant-55-f-outdoor-dual-frame-side.png',
    '/img/regen/diamant-55-f-outdoor-dual-frame-detail.png',
  ],
  'diamant-55-n': [
    '/img/regen/diamant-55-n-frame-front-v3.png',
    '/img/regen/diamant-55-n-frame-34-v2.png',
    '/img/regen/diamant-55-n-frame-side-v2.png',
    '/img/regen/diamant-55-n-frame-rear-v2.png',
  ],
  'diamant-55-ne': [
    '/img/regen/diamant-55-ne-frame-front-v2.png',
    '/img/regen/diamant-55-ne-frame-34-v2.png',
  ],
  'diamant-55-w': [
    '/img/regen/diamant-55-w-frame-front.png',
    '/img/regen/diamant-55-w-frame-34.png',
    '/img/regen/diamant-55-w-frame-side.png',
    '/img/regen/diamant-55-w-frame-rear.png',
  ],
  'diamant-65-f': [
    '/img/regen/diamant-65-f-frame-front-v3.png',
    '/img/regen/diamant-65-f-frame-side-v3.png',
  ],
  'diamant-75-f': [
    '/img/regen/diamant-75-f-frame-front.png',
    '/img/regen/diamant-75-f-frame-34.png',
    '/img/regen/diamant-75-f-frame-side.png',
    '/img/regen/diamant-75-f-frame-rear.png',
    '/img/regen/diamant-75-f-frame-detail.png',
  ],
  'diamant-86-f-grand': [
    '/img/regen/diamant-86-f-grand-frame-front.png',
    '/img/regen/diamant-86-f-grand-frame-34.png',
    '/img/regen/diamant-86-f-grand-frame-rear.png',
  ],
  'diamant-intercon': [
    '/img/regen/diamant-intercon-frame-front.png',
    '/img/regen/diamant-intercon-frame-34.png',
    '/img/regen/diamant-intercon-frame-rear.png',
  ],
  'diamant-tmedical': [
    '/img/regen/diamant-tmedical-frame-34.png',
    '/img/regen/diamant-tmedical-frame-front.png',
  ],
  'eco-kid-22': [
    '/img/regen/eco-kid-22-frame-front.png',
    '/img/regen/eco-kid-22-frame-rear.png',
    '/img/regen/eco-kid-22-frame-detail.png',
  ],
  'eco-kid-32': [
    '/img/regen/eco-kid-32-frame-front.png',
    '/img/regen/eco-kid-32-frame-34.png',
    '/img/regen/eco-kid-32-frame-rear.png',
    '/img/regen/eco-kid-32-frame-detail.png',
  ],
  'mono-19-f': [
    '/img/regen/mono-19-f-frame-front.png',
    '/img/regen/mono-19-f-frame-34.png',
    '/img/regen/mono-19-f-frame-side.png',
    '/img/regen/mono-19-f-frame-rear.png',
    '/img/regen/mono-19-f-frame-detail.png',
  ],
  'mono-32-f': [
    '/img/regen/mono-32-f-frame-front.png',
    '/img/regen/mono-32-f-frame-34.png',
    '/img/regen/mono-32-f-frame-side.png',
    '/img/regen/mono-32-f-frame-detail.png',
  ],
  'mono-32-f-pin': [
    '/img/regen/mono-32-f-pin-frame-front.png',
    '/img/regen/mono-32-f-pin-frame-34.png',
    '/img/regen/mono-32-f-pin-frame-side.png',
    '/img/regen/mono-32-f-pin-frame-detail.png',
  ],
  'mono-32-fa-pin': [
    '/img/regen/mono-32-fa-pin-frame-front.png',
    '/img/regen/mono-32-fa-pin-frame-34.png',
    '/img/regen/mono-32-fa-pin-frame-side.png',
    '/img/regen/mono-32-fa-pin-frame-detail.png',
  ],
  'mono-32-f-scan': [
    '/img/regen/mono-32-f-scan-frame-front.png',
    '/img/regen/mono-32-f-scan-frame-34.png',
    '/img/regen/mono-32-f-scan-frame-side.png',
    '/img/regen/mono-32-f-scan-frame-modules.png',
  ],
  'mono-32-n': [
    '/img/regen/mono-32-n-frame-front-v2.png',
    '/img/regen/mono-32-n-frame-34-v2.png',
  ],
  'mono-43-f': [
    '/img/regen/mono-43-f-frame-front.png',
    '/img/regen/mono-43-f-frame-34.png',
    '/img/regen/mono-43-f-frame-side.png',
    '/img/regen/mono-43-f-frame-rear.png',
    '/img/regen/mono-43-f-frame-detail.png',
  ],
  'mono-55-t': [
    '/img/regen/mono-55-t-frame-34-v2.png',
    '/img/regen/mono-55-t-frame-detail-v2.png',
  ],
};

export function getProduct(slug) {
  return products[slug] || null;
}

/**
 * Модельные линейки: диагонали одной модели — варианты одной карточки.
 * URL каждой диагонали остаётся живым (SEO), переключатель ведёт между ними.
 * Объединяем только одинаковые модификации одной серии; Print/Key/General/NE
 * и прочие модификации — свои семейства или одиночные карточки.
 */
const PRODUCT_FAMILIES = [
  {
    id: 'diamant-n',
    title: 'Diamant N',
    lead: 'diamant-32-n', // самая продаваемая — её показываем в категории
    variants: ['diamant-22-n', 'diamant-32-n', 'diamant-43-n', 'diamant-49-n', 'diamant-55-n'],
  },
  {
    id: 'diamant-ne',
    title: 'Diamant NE',
    lead: 'diamant-32-ne',
    variants: ['diamant-32-ne', 'diamant-55-ne'],
  },
  {
    id: 'diamant-f',
    title: 'Diamant F',
    lead: 'diamant-32-f',
    variants: [
      'diamant-32-f',
      'diamant-43-f',
      'diamant-49-f',
      'diamant-55-f',
      'diamant-65-f',
      'diamant-75-f',
    ],
  },
  {
    id: 'diamant-f-general',
    title: 'Diamant F General',
    lead: 'diamant-32-f-general',
    variants: ['diamant-32-f-general', 'diamant-43-f-general', 'diamant-49-f-general'],
  },
  {
    id: 'diamant-f-print',
    title: 'Diamant F Print',
    lead: 'diamant-32-f-print',
    variants: ['diamant-32-f-print', 'diamant-43-f-print', 'diamant-49-f-print'],
  },
  {
    id: 'diamant-fe',
    title: 'Diamant FE',
    lead: 'diamant-32-fe',
    variants: ['diamant-32-fe', 'diamant-43-fl'],
  },
  {
    id: 'diamant-w',
    title: 'Diamant W',
    lead: 'diamant-32-w',
    variants: ['diamant-22-w', 'diamant-32-w', 'diamant-43-w', 'diamant-49-w', 'diamant-55-w'],
  },
  {
    id: 'diamant-f-outdoor',
    title: 'Diamant F Outdoor',
    lead: 'diamant-46-f-outdoor',
    variants: ['diamant-46-f-outdoor', 'diamant-55-f-outdoor'],
  },
  {
    id: 'mono-f',
    title: 'Mono F',
    lead: 'mono-32-f',
    variants: ['mono-32-f', 'mono-43-f'],
  },
  {
    id: 'apriori',
    title: 'Apriori',
    lead: 'apriori',
    variants: ['apriori', 'apriori-22'],
  },
  {
    id: 'apriori-key',
    title: 'Apriori Key',
    lead: 'apriori-19-keyboard',
    variants: ['apriori-19-keyboard', 'apriori-22-key'],
  },
  {
    id: 'eco-kid',
    title: 'Eco Kid',
    lead: 'eco-kid-22',
    variants: ['eco-kid-22', 'eco-kid-32'],
  },
];

const FAMILY_BY_SLUG = new Map();
for (const family of PRODUCT_FAMILIES) {
  for (const slug of family.variants) FAMILY_BY_SLUG.set(slug, family);
}

/** Сколько карточек в категории после схлопывания семейств. */
export function categoryCardCount(category) {
  const seen = new Set();
  let count = 0;
  for (const slug of category?.productSlugs || []) {
    const family = FAMILY_BY_SLUG.get(slug);
    if (family) {
      if (seen.has(family.id)) continue;
      seen.add(family.id);
    }
    count += 1;
  }
  return count;
}

/** Семейство модели для slug: { id, title, lead, variants: [{slug, title, diagonal, product}] }. */
export function productFamily(slug) {
  const family = FAMILY_BY_SLUG.get(slug);
  if (!family) return null;
  const variants = family.variants
    .map((s) => {
      const product = getProduct(s);
      return product ? { slug: s, title: product.title, diagonal: productDiagonal(product), product } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.diagonal || 0) - (b.diagonal || 0));
  if (variants.length < 2) return null;
  return { id: family.id, title: family.title, lead: family.lead, variants };
}

/** Screen diagonal in inches from specs or model title, or null. */
export function productDiagonal(productOrSlug) {
  const product = typeof productOrSlug === 'string' ? getProduct(productOrSlug) : productOrSlug;
  if (!product) return null;

  if (product.specs && typeof product.specs === 'object') {
    for (const [key, value] of Object.entries(product.specs)) {
      if (!/диагонал/i.test(key)) continue;
      const match = String(value).match(/\d+/);
      if (match) return Number(match[0]);
    }
  }

  const fromTitle = String(product.title || '').match(/\b(19|22|32|43|46|50|55|65|75|86)\b/);
  return fromTitle ? Number(fromTitle[1]) : null;
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

/**
 * Scraped “live” photos for a product page section.
 * When studio regen frames own the hero, return all scrape images;
 * otherwise skip the first (already used as cover).
 */
const HIDE_LIVE_GALLERY = new Set(['apriori-19-print-a4']);

export function productLiveGallery(productOrSlug, { limit = 12 } = {}) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  if (HIDE_LIVE_GALLERY.has(slug)) return [];
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  const images = product?.images || [];
  if (!images.length) return [];

  const hasStudio = Boolean(REGEN_FRAMES[slug]?.length);
  const pool = hasStudio ? images : images.slice(1);
  const out = [];
  const seen = new Set();

  for (const src of pool) {
    if (!src || /\/regen\//.test(src)) continue;
    const url = assetUrl(src);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= limit) break;
  }

  return out;
}

/** Customer display names — scraped `name` stays in JSON. */
const CATEGORY_NAME_OVERRIDE = {
  napolnye: 'Интерактивные киоски',
  nastennyy: 'Интерактивные панели',
  ulichnye: 'Уличные интерактивные киоски',
  apriori: 'Интерактивные терминалы',
  otraslevye: 'Уникальное оборудование',
};

const HIDDEN_CATEGORY_SLUGS = new Set(['avtokassy', 'mono-napolnye']);

function withCategoryName(category) {
  if (!category) return category;
  const name = CATEGORY_NAME_OVERRIDE[category.slug];
  return name ? { ...category, name } : category;
}

export function getCategory(slug) {
  if (!slug || HIDDEN_CATEGORY_SLUGS.has(slug)) return null;
  return withCategoryName(categories[slug] || null);
}

export function categoryList() {
  return Object.values(categories)
    .filter((c) => !c.missing && c.productSlugs && c.productSlugs.length > 0)
    .filter((c) => !HIDDEN_CATEGORY_SLUGS.has(c.slug))
    .map(withCategoryName);
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

/** Prefer full description when scrape cut `lead` mid-sentence (~400 chars). */
function productCopySource(product) {
  const lead = oneLine(product?.lead || '');
  const description = oneLine(product?.description || '');
  if (!lead) return description;
  if (!description) return lead;
  if (description.startsWith(lead) && description.length > lead.length) return description;
  if (!/[.!?…]"?$/u.test(lead) && description.length > lead.length + 10) return description;
  return lead;
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
  const raw = productCopySource(product);
  const { slogan, body } = splitProductCopy(raw);
  const source = body || raw;
  const sentences = splitSentences(source);
  const tease = sentences[0] && /отличительн|уникальн\w*\s+черт/iu.test(sentences[0]);
  const hook = tease && sentences[1]
    ? `${sentences[0]} ${sentences[1]}`
    : sentences[0]
      ? clipSentence(sentences[0], 160)
      : firstSentences(source, 160, 1);
  const story = sentences.slice(tease && sentences[1] ? 2 : 1).filter((s) => s.length > 28);
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

const SPEC_GROUPS = [
  {
    id: 'display',
    title: 'Экран',
    test: /(диагонал|монитор|разрешен|яркость|контраст|отклик|сенсорн|касани|соотношен|глубина цвета|частота разверт)/i,
  },
  {
    id: 'body',
    title: 'Корпус',
    test: /(материал|корпус|габарит|толщин|высот|ширин|глубин|вес|угол|установк|цвет|ral|панел)/i,
  },
  {
    id: 'pc',
    title: 'Компьютер',
    test: /(процессор|память|диск|видеокарт|материнск|ядер|частота процес)/i,
  },
  {
    id: 'audio',
    title: 'Аудио',
    test: /(аудио|динамик)/i,
  },
  {
    id: 'power',
    title: 'Питание и связь',
    test: /(кабель|энерго|электри|автомат|порт|разъем|wi-?fi|условия работы)/i,
  },
  {
    id: 'options',
    title: 'Опции',
    test: /(опци|датчик|принтер|сканер|nfc|камер|клавиатур|дополнительн)/i,
  },
];

function normalizeSpecKey(key) {
  return oneLine(key)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[,./]/g, ' ')
    .replace(/\b(мм|кг|гц|вт|кд|м\s*2|дюйм|шт|серия|модель)\b/giu, ' ')
    .replace(/\s+/g, '');
}

/** Collapse scraped synonyms: Вес / Вес нетто, Диагональ / Диагональ дюйм, etc. */
function canonicalSpecKey(key) {
  const nk = normalizeSpecKey(key);
  if (!nk) return '';
  if (/^весбрутто/.test(nk)) return 'весбрутто';
  if (/^вес/.test(nk)) return 'вес';
  if (/^диагональ/.test(nk)) return 'диагональ';
  if (nk === 'материал' || nk === 'материалкорпуса') return 'материал';
  if (/^типустанов/.test(nk) || nk === 'установка') return 'типустановки';
  if (/^количествоодновременныхкасаний|^касани/.test(nk)) return 'касания';
  if (/^яркост/.test(nk)) return 'яркость';
  if (/^разрешен/.test(nk)) return 'разрешение';
  if (/^соотношен/.test(nk)) return 'соотношениесторон';
  return nk;
}

function preferSpecLabel(a, b) {
  const score = (k) => {
    let s = 0;
    if (/нетто/i.test(k)) s += 3;
    if (/брутто/i.test(k)) s -= 2;
    if (/диагональ,\s*дюйм/i.test(k)) s -= 1;
    if (k.length <= 22) s += 1;
    return s;
  };
  return score(a) >= score(b) ? a : b;
}

/** Dedupe + group scraped specs into readable cards. No invented values. */
export function groupProductSpecs(specs) {
  const entries = Object.entries(specs || {})
    .map(([key, value]) => [oneLine(key), oneLine(value)])
    .filter(([k, v]) => k && v);

  const byCanon = new Map();
  for (const [key, value] of entries) {
    const ck = canonicalSpecKey(key);
    if (!ck) continue;
    const prev = byCanon.get(ck);
    if (!prev) {
      byCanon.set(ck, { key, value });
      continue;
    }
    // Same value → keep nicer label; different value → keep first unless prev empty
    if (prev.value === value || prev.value === '-' || prev.value === '—') {
      byCanon.set(ck, {
        key: preferSpecLabel(prev.key, key),
        value: value !== '-' && value !== '—' ? value : prev.value,
      });
    }
  }

  const buckets = new Map(SPEC_GROUPS.map((g) => [g.id, { id: g.id, title: g.title, rows: [] }]));
  const other = { id: 'other', title: 'Прочее', rows: [] };

  for (const { key, value } of byCanon.values()) {
    const group = SPEC_GROUPS.find((g) => g.test.test(key)) || null;
    (group ? buckets.get(group.id) : other).rows.push({ key, value });
  }

  return [...buckets.values(), other].filter((g) => g.rows.length > 0);
}

export function presentSpecGlance(specs) {
  const map = new Map();
  for (const [k, v] of Object.entries(specs || {})) {
    const ck = canonicalSpecKey(k);
    const value = oneLine(v);
    if (!ck || !value || value === '-' || value === '—') continue;
    const prev = map.get(ck);
    if (!prev) map.set(ck, { key: oneLine(k), value });
    else map.set(ck, { key: preferSpecLabel(prev.key, oneLine(k)), value: prev.value });
  }
  const pick = (...keys) => {
    for (const k of keys) {
      const hit = map.get(canonicalSpecKey(k));
      if (hit?.value) return hit;
    }
    return null;
  };

  // Compact glance: max 4 real fields
  const chips = [];
  const push = (label, value, icon) => {
    if (!value || chips.length >= 4) return;
    chips.push({ label, value, icon });
  };
  const diagonal = pick('Диагональ', 'Диагональ, дюйм');
  if (diagonal) {
    const n = diagonal.value.match(/\d+(?:[.,]\d+)?/);
    push('Диагональ', n ? `${n[0]}″` : diagonal.value, 'display');
  }
  const weight = pick('Вес нетто, кг', 'Вес, кг');
  if (weight) {
    const n = weight.value.match(/\d+(?:[.,]\d+)?/);
    push('Вес', n ? `${n[0]} кг` : weight.value, 'weight');
  }
  const install = pick('Тип установки');
  if (install) push('Установка', install.value, 'install');
  const touch = pick('Количество одновременных касаний');
  if (touch) {
    const n = touch.value.match(/\d+\+?/);
    push(
      'Касания',
      n ? (/\+/.test(touch.value) || /от/i.test(touch.value) ? `от ${n[0]}` : n[0]) : touch.value,
      'touch',
    );
  }
  if (chips.length < 4) {
    const bright = pick('Яркость, кд/м 2', 'Яркость, кд/м²', 'Яркость');
    if (bright) {
      const n = bright.value.match(/\d+/);
      push('Яркость', n ? `${n[0]} кд/м²` : bright.value, 'brightness');
    }
  }
  if (chips.length < 4) {
    const ram = pick('Оперативная память');
    if (ram) push('Память', ram.value, 'memory');
  }
  return chips;
}

const CATEGORY_SEO_SENTENCE =
  /^(?:купить|большой (?:ассортимент|выбор)|гарантия|выгодн|низк(?:ие|ая) цен|с доставкой|производство и продажа)/iu;

function normCatText(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gu, '');
}

/** Full category intro from zorgtech.com `.section-text` (HTML preferred). */
export function presentCategoryIntro(category) {
  if (!category) return null;
  const html = String(category.leadHtml || '').trim();
  const text = String(category.lead || '').trim();
  if (html) return { html, text };
  if (text.length >= 40) return { html: '', text };
  return null;
}

/** Short category blurb for cards — prefer real intro, else cleaned meta. */
export function presentCategoryBlurb(category, { maxChars = 180 } = {}) {
  if (!category) return '';
  // Real section-text intro → first 1–2 sentences
  const intro = oneLine(category.lead || '');
  if (intro.length >= 40) {
    return firstSentences(intro, maxChars, 2);
  }
  const raw = oneLine(category.description || '');
  if (!raw) return '';

  // Clean marketplace SEO in-place — do NOT cut from first hit to end of string
  let text = raw
    .replace(/^купить\s+/iu, '')
    .replace(/\s*от (?:российского )?производителя\b[^.!?]*/giu, '')
    .replace(/\s*у производителя\b[^.!?]*/giu, '')
    .replace(/\s*от компании\s+ZORGTECH\.?/giu, '')
    .replace(/\s*с доставкой по России\.?/giu, '')
    .replace(/\s*Большой (?:ассортимент|выбор)[^.!?]*/giu, '')
    .replace(/\s*гарантия качества[^.!?]*/giu, '')
    .replace(/\s*выгодные цен\w*[^.!?]*/giu, '')
    .replace(/\s*низкие цен\w*[^.!?]*/giu, '')
    .replace(/\s*производство и продажа сенсорного оборудования\.?/giu, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*\.\s*\./g, '.')
    .replace(/^\s*[.,;:—–-]+\s*/u, '')
    .replace(/\s*[.,;:—–-]+\s*$/u, '')
    .trim();

  if (!text) return '';

  const name = oneLine(category.name);
  const nameNorm = normCatText(name);
  const sentences = text
    .split(/(?<=[.!?…])\s+/u)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !CATEGORY_SEO_SENTENCE.test(s))
    .filter((s) => {
      const n = normCatText(s);
      if (!n || n.length < 18) return false;
      if (!nameNorm) return true;
      // Drop title echoes ("Name", "Name и киоски")
      if (n === nameNorm || nameNorm.includes(n)) return false;
      if (n.startsWith(nameNorm) && n.length <= nameNorm.length + 18) return false;
      return true;
    });

  if (sentences.length) {
    text = firstSentences(sentences.join(' '), maxChars, 2);
  } else {
    // Fallback: cleaned meta without title-only echo
    const n = normCatText(text);
    if (!n || (nameNorm && (n === nameNorm || nameNorm.includes(n)))) return '';
    text = firstSentences(text, maxChars, 2);
  }

  return text.length >= 18 ? text : '';
}
