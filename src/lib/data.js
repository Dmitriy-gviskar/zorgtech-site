import categories from '../data/categories.json';
import products from '../data/products.json';
import projects from '../data/projects.json';
import solutions from '../data/solutions.json';
import pages from '../data/pages.json';
import areas from '../data/areas.json';
import mediaWebp from '../data/media-webp.json';

export { categories, products, projects, solutions, pages, areas };

const WEBP_PATHS = new Set(
  (Array.isArray(mediaWebp) ? mediaWebp : []).map((p) => String(p).replace(/^\/+/, '')),
);

/** Prefer sibling .webp when optimize:images produced one. Original PNG/JPG stays on disk. */
function preferWebp(cleanPath) {
  if (!/\.(png|jpe?g)$/i.test(cleanPath)) return cleanPath;
  const webp = cleanPath.replace(/\.(png|jpe?g)$/i, '.webp');
  return WEBP_PATHS.has(webp) ? webp : cleanPath;
}

/** Prefix public asset paths for GitHub Pages base (`/zorgtech-site/`). Idempotent. */
export function assetUrl(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const value = String(path);
  if (base !== '/' && (value.startsWith(base) || value.startsWith(base.replace(/\/$/, '')))) {
    return value.startsWith('/') ? value : `/${value}`;
  }
  const clean = preferWebp(value.replace(/^\/+/, ''));
  return `${base}${clean}`;
}

/** Alias — same as assetUrl (webp preference is built-in). */
export function mediaUrl(path) {
  return assetUrl(path);
}

/**
 * Studio regen frames only (same light-grey backdrop).
 * Ordered: front → 3/4 → side/rear.
 * When present, scraped photos are NOT mixed in — they have mismatched backgrounds.
 */
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

export function productCover(productOrSlug) {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
  const product = typeof productOrSlug === 'string' ? getProduct(slug) : productOrSlug;
  const studio = REGEN_FRAMES[slug];
  if (studio?.length) return assetUrl(studio[0]);
  return assetUrl(product?.images?.[0] || null);
}

/** Studio-only gallery when regen exists; otherwise a single scraped cover (no mixed backdrops). */
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

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function getSolution(slug) {
  return solutions.find((s) => s.slug === slug) || null;
}

/** Presentation helper for scraped solution pages. */
export function presentSolution(solutionOrSlug) {
  const solution =
    typeof solutionOrSlug === 'string' ? getSolution(solutionOrSlug) : solutionOrSlug;
  if (!solution) {
    return {
      title: '',
      lead: '',
      story: [],
      features: [],
      blocks: [],
      images: [],
      icon: null,
    };
  }

  let lead = oneLine(solution.lead || '');
  lead = lead
    .replace(/\s*[-–—]\s*большой выбор.*$/iu, '')
    .replace(/\s*с доставкой по России.*$/iu, '')
    .replace(/\s*от производителя.*$/iu, '')
    .trim();

  const story = String(solution.text || '')
    .split(/\n+/)
    .map((p) => oneLine(p))
    .filter((p) => p.length > 40);

  const features = (solution.features || []).map(oneLine).filter(Boolean).slice(0, 6);

  const usedTitles = new Set();
  const blocks = [];
  const pushBlock = (title, items) => {
    const list = (items || []).map(oneLine).filter((i) => i.length >= 8);
    if (!title || !list.length) return;
    const key = title.toLowerCase();
    if (usedTitles.has(key)) return;
    usedTitles.add(key);
    blocks.push({ title, items: list.slice(0, 10) });
  };

  pushBlock('Решаемые задачи', solution.tasks);
  pushBlock('Преимущества', solution.advantages);
  pushBlock('Возможности', solution.capabilities);
  pushBlock('Применение', solution.applications);

  // leftover named sections from scrape (hotel/med pages etc.)
  for (const [title, items] of Object.entries(solution.sections || {})) {
    const t = oneLine(title).replace(/:$/, '');
    if (/техническ/i.test(t)) {
      pushBlock('Технические характеристики', items);
      continue;
    }
    if (/что вы получите|преимуществ/i.test(t)) {
      pushBlock('Преимущества', items);
      continue;
    }
    if (/функционал|возможност/i.test(t)) {
      pushBlock('Возможности', items);
      continue;
    }
    if (/решаемые|задач/i.test(t)) {
      pushBlock('Решаемые задачи', items);
      continue;
    }
    if (/применен/i.test(t)) {
      pushBlock('Применение', items);
      continue;
    }
    pushBlock(t, items);
  }

  return {
    title: oneLine(solution.title),
    lead,
    story,
    features,
    blocks,
    images: solution.images || [],
    icon: solution.icon || null,
  };
}

export function getPage(key) {
  return pages[key] || null;
}

export function getArea(slug) {
  return areas.find((a) => a.slug === slug) || null;
}

function cleanSeoLead(lead) {
  let text = oneLine(lead || '')
    .replace(/\u00ad/g, '')
    .replace(/\s*[-–—]\s*большой выбор.*$/iu, '')
    .replace(/\s*с доставкой по России.*$/iu, '')
    .replace(/\s*от производителя[^.]*\.?/iu, '')
    .replace(/\s*купить сенсорн.*$/iu, '')
    .replace(/\s*готовое решение для вашего бизнеса.*$/iu, '')
    .replace(/\s*Интеграция программн.*$/iu, '')
    .trim();
  text = text.replace(/[.\s]+$/u, '').trim();
  return text;
}

function htmlSectionsByH2(html) {
  const cut = cutPageChrome(html);
  const sections = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  for (const raw of cut.matchAll(re)) {
    const title = stripTags(raw[1])
      .replace(/^Назад к.*/i, '')
      .trim();
    if (!title || title.length > 120) continue;
    const body = raw[2] || '';
    const textParts = htmlParagraphs(body);
    const items = htmlListItems(body);
    if (!textParts.length && !items.length) continue;
    sections.push({
      title,
      text: textParts.join('\n\n'),
      paragraphs: textParts,
      items,
    });
  }
  return sections;
}

/** Application area presentation from scraped HTML (or baked `presented`). */
export function presentArea(areaOrSlug) {
  const area = typeof areaOrSlug === 'string' ? getArea(areaOrSlug) : areaOrSlug;
  if (!area) {
    return { title: '', lead: '', story: [], sections: [], images: [] };
  }

  if (area.presented) {
    return {
      ...area.presented,
      images: area.images || area.presented.images || [],
    };
  }

  const title = oneLine(area.title).replace(/&quot;/g, '"').replace(/\u00a0/g, ' ');
  const lead = cleanSeoLead(area.lead);
  const main = cutPageChrome(area.html || '');
  const sections = htmlSectionsByH2(main);
  const beforeH2 = main.split(/<h2/i)[0] || main;
  const intro = htmlParagraphs(beforeH2)
    .filter((p) => p.length > 40)
    .filter((p) => !/скачать презентацию/i.test(p))
    .slice(0, 4);

  const named = sections.filter((s) => {
    if (/скачать презентацию/i.test(s.title)) return false;
    if (title && s.title.toLowerCase().startsWith(title.toLowerCase().slice(0, 20))) return false;
    return true;
  });

  return {
    title,
    lead: lead || firstSentences(intro[0] || named[0]?.paragraphs?.[0] || '', 170, 1),
    story: intro,
    sections: named.slice(0, 8),
    images: area.images || [],
  };
}

/** Project presentation: задача / решение + gallery (or baked `presented`). */
export function presentProject(projectOrSlug) {
  const project =
    typeof projectOrSlug === 'string' ? getProject(projectOrSlug) : projectOrSlug;
  if (!project) {
    return { title: '', lead: '', task: '', solution: [], story: [], sections: [], images: [] };
  }

  if (project.presented) {
    return {
      ...project.presented,
      images: project.images || project.presented.images || [],
    };
  }

  const title = oneLine(project.title).replace(/&quot;/g, '"').replace(/\u00a0/g, ' ');
  let lead = cleanSeoLead(project.lead);
  if (lead && title && lead.toLowerCase().startsWith(title.toLowerCase().slice(0, 24))) {
    // lead often repeats title + SEO — prefer first story sentence later
    lead = '';
  }

  const sections = htmlSectionsByH2(project.html || '');
  let task = '';
  let solution = [];
  const other = [];

  for (const sec of sections) {
    if (/^задача$/i.test(sec.title)) {
      task = sec.paragraphs[0] || sec.text;
      continue;
    }
    if (/^решение$/i.test(sec.title)) {
      solution = sec.paragraphs;
      continue;
    }
    if (/назад к/i.test(sec.title)) continue;
    if (sec.title === title) continue;
    other.push(sec);
  }

  if (!solution.length && !task) {
    const story = htmlParagraphs(cutPageChrome(project.html || ''))
      .filter((p) => p.length > 40)
      .filter((p) => !/назад к реализованным/i.test(p))
      .slice(0, 6);
    return {
      title,
      lead: lead || firstSentences(story[0] || '', 170, 1),
      task: '',
      solution: story,
      story,
      sections: other.slice(0, 6),
      images: project.images || [],
    };
  }

  return {
    title,
    lead: lead || firstSentences(task || solution[0] || '', 170, 1),
    task,
    solution,
    story: [],
    sections: other.slice(0, 6),
    images: project.images || [],
  };
}

export function categoryList() {
  return Object.values(categories).filter(
    (c) => !c.missing && c.productSlugs && c.productSlugs.length > 0,
  );
}

export function popularProducts(limit = 8) {
  return Object.values(products).slice(0, limit);
}

function oneLine(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clipSentence(text, maxChars) {
  const clean = oneLine(text);
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const at = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf(','), cut.lastIndexOf('—'));
  const base = (at > maxChars * 0.55 ? cut.slice(0, at) : cut).replace(/[.,;:\s]+$/u, '');
  return `${base}…`;
}

function firstSentences(text, maxChars = 220, maxSentences = 2) {
  const clean = oneLine(text);
  if (!clean) return '';
  const parts = clean.split(/(?<=[.!?…])\s+/u).filter(Boolean);
  let out = '';
  for (let i = 0; i < parts.length && i < maxSentences; i += 1) {
    const next = out ? `${out} ${parts[i]}` : parts[i];
    if (next.length > maxChars) {
      // Skip tiny punch lines ("Широкие возможности!") if the next sentence is the real lead
      if (out && out.length < 48 && parts[i].length > 40) {
        out = clipSentence(parts[i], maxChars);
      } else if (!out) {
        out = clipSentence(parts[i], maxChars);
      }
      break;
    }
    out = next;
  }
  if (!out) out = clipSentence(clean, maxChars);
  return out;
}

/** Split Bitrix lead: short slogan + body (no invented wording). */
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

/** Split a feature into short label + detail for scanability. */
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

/** Presentation-ready product copy from scraped fields only. */
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

/** Dedupe + group scraped specs into readable cards. No invented values. */
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

/** Compact “at a glance” chips from known spec keys. */
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

function stripTags(html) {
  return oneLine(
    String(html || '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&gt;/gi, '>')
      .replace(/&lt;/gi, '<')
      .replace(/&amp;/gi, '&'),
  );
}

/** Structured About page from scraped HTML — drops forms, nav tabs, broken tails. */
export function presentAboutPage(page) {
  if (page?.presented) return page.presented;

  const html = page?.html || '';
  const cut = html.search(/class="widget widget-begin"|Закажите обратный|id="form_4"|modal standard/i);
  const main = cut > 0 ? html.slice(0, cut) : html;

  const paragraphs = [];
  for (const raw of main.matchAll(/<p(?![^>]*achievement)[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = stripTags(raw[1]);
    if (t.length < 40) continue;
    if (/о zorgtech/i.test(t) && /партнер/i.test(t)) continue;
    if (/нажимая кнопку|как вас зовут|не знаете/i.test(t)) continue;
    if (paragraphs.includes(t)) continue;
    paragraphs.push(t);
  }

  const services = [];
  const svc = main.match(/спектр услуг:([\s\S]*?)<\/ul>/i);
  if (svc) {
    for (const raw of svc[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
      const t = stripTags(raw[1]).replace(/[;.\s]+$/u, '');
      if (t.length >= 12) services.push(t);
    }
  }

  const stats = [];
  for (const raw of html.matchAll(
    /achievement-number[^>]*>([\s\S]*?)<\/p>\s*<p[^>]*achievement-title[^>]*>([\s\S]*?)<\/p>/gi,
  )) {
    const value = stripTags(raw[1]);
    const label = stripTags(raw[2]);
    if (value && label) stats.push({ value, label });
  }

  const next = [];
  const begin = html.match(/begin-links[\s\S]*?<\/ul>/i);
  if (begin) {
    for (const raw of begin[0].matchAll(/<li[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)) {
      const href = raw[1];
      const title = stripTags(raw[2]);
      const text = stripTags(raw[3]);
      if (!title || !text) continue;
      let to = null;
      if (/gotovye-resheniya|solutions/i.test(href)) to = '/solutions';
      else if (/catalog/i.test(href)) to = '/catalog';
      else to = '/contacts';
      next.push({ title, text, to });
    }
  }

  const production = Array.isArray(page?.production)
    ? page.production
        .map((s) => ({
          title: oneLine(s.title) || 'Наше производство',
          text: oneLine(s.text),
          image: s.image || null,
        }))
        .filter((s) => s.image)
    : [];

  const clientGroups = Array.isArray(page?.clients?.groups) ? page.clients.groups : [];
  const clients = {
    heading: oneLine(page?.clients?.heading) || 'Наши клиенты',
    groups: clientGroups
      .map((g) => ({
        title: oneLine(g.title),
        items: (g.items || [])
          .map((it) => ({ name: oneLine(it.name), image: it.image || null }))
          .filter((it) => it.name),
      }))
      .filter((g) => g.title && g.items.length),
  };

  // Tab labels from zorgtech.com; "Партнерам" has no content in source AJAX.
  const tabs = [
    { id: 'who', title: 'Кто мы и что делаем' },
    production.length ? { id: 'production', title: 'Производство' } : null,
    clients.groups.length ? { id: 'clients', title: 'Наши клиенты' } : null,
  ].filter(Boolean);

  return {
    lead: firstSentences(paragraphs[0] || '', 170, 1),
    paragraphs,
    services,
    stats,
    next,
    production,
    clients,
    tabs,
  };
}

function cutPageChrome(html) {
  const cut = String(html || '').search(
    /class="widget widget-begin"|НЕ ЗНАЕТЕ|Закажите обратный|id="form_|modal standard|Нажимая кнопку/i,
  );
  return cut > 0 ? html.slice(0, cut) : html || '';
}

function htmlParagraphs(html) {
  const out = [];
  for (const raw of String(html || '').matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = stripTags(raw[1]);
    if (t.length < 35) continue;
    if (/нажимая кнопку|как вас зовут|не знаете|заказать звонок/i.test(t)) continue;
    if (out.includes(t)) continue;
    out.push(t);
  }
  return out;
}

function htmlListItems(html) {
  const out = [];
  for (const raw of String(html || '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const t = stripTags(raw[1]).replace(/[;.\s]+$/u, '');
    if (t.length < 8) continue;
    if (/закажите обратный|изучите готовые|посетите каталог|нажимая кнопку/i.test(t)) continue;
    if (out.includes(t)) continue;
    out.push(t);
  }
  return out;
}

/** Delivery / support / rent / policy — structured from scraped HTML. */
export function presentServicePage(pageKey, page) {
  if (page?.presented) return page.presented;

  const html = cutPageChrome(page?.html || '');
  const title = oneLine(page?.title || '');
  const metaLead = cleanSeoLead(page?.lead || '');

  if (pageKey === 'delivery') {
    const paras = htmlParagraphs(html).filter((p) => !/^доставка сенсорных/i.test(p));
    const carriersMatch = (paras[0] || '').match(/компаниями:\s*(.+?)(?:\.|$)/i);
    const carriers = carriersMatch
      ? carriersMatch[1]
          .replace(/\s*а также любыми другими компаниями.*$/i, '')
          .split(/,\s*/)
          .map(oneLine)
          .filter((c) => c && !/^а также/i.test(c))
      : [];

    const facts = [];
    const pushFact = (label, value) => {
      const v = oneLine(value);
      if (!v || facts.some((f) => f.label === label)) return;
      facts.push({ label, value: v });
    };
    for (const p of paras) {
      if (/упаковываем|деревянн/i.test(p)) pushFact('Упаковка', p);
      if (/возврат и обмен/i.test(p)) {
        pushFact('Возврат', p.replace(/\s*Адрес самовывоза:.*$/i, '').trim());
      }
      if (/адрес самовывоза/i.test(p)) {
        const addr = (p.match(/Адрес самовывоза:\s*(.+)$/i) || [])[1] || p;
        pushFact('Самовывоз', addr);
      }
      if (/стоимость доставки по г\.?\s*москва/i.test(p)) pushFact('Москва', p);
      if (/100%\s*предоплат/i.test(p)) pushFact('Оплата', p);
    }

    const story = paras.filter(
      (p) =>
        !/адрес самовывоза|стоимость доставки по г|100%\s*предоплат|возврат и обмен|упаковываем|рассчит/i.test(
          p,
        ),
    );

    return {
      title: 'Доставка и сервис',
      lead: firstSentences(metaLead || story[0] || '', 180, 2),
      story,
      facts,
      carriers,
      sections: [],
      prices: [],
      lists: [],
      images: page?.images || [],
      hotline: null,
    };
  }

  if (pageKey === 'support') {
    const sections = [];
    for (const raw of html.matchAll(/<p[^>]*>\s*<strong>([\s\S]*?)<\/strong>([\s\S]*?)<\/p>/gi)) {
      const heading = stripTags(raw[1]).replace(/:$/, '');
      const text = stripTags(raw[2]);
      if (!heading || heading.length > 80) continue;
      sections.push({ title: heading, text, items: [] });
    }

    // attach software support list to matching section
    const softItems = htmlListItems(
      (html.match(/Поддержка программного обеспечения[\s\S]*?<\/ul>/i) || [])[0] || '',
    );
    const soft = sections.find((s) => /поддержка программного/i.test(s.title));
    if (soft) soft.items = softItems;

    const corpItems = htmlListItems(
      (html.match(/Сервис для корпоративных клиентов[\s\S]*?<\/ul>/i) ||
        html.match(/widget-service[\s\S]*?<\/ul>/i) ||
        [])[0] || '',
    );
    const corpTextMatch = html.match(
      /Сервис для корпоративных клиентов[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
    );
    const corpText = corpTextMatch ? stripTags(corpTextMatch[1]) : '';
    if (corpItems.length || corpText) {
      sections.push({
        title: 'Сервис для корпоративных клиентов',
        text: corpText,
        items: corpItems,
      });
    }

    const phoneMatch = html.match(/8[\s\u00a0]*800[\s\u00a0]*550[\s\u00a0]*26[\s\u00a0]*45/);
    const hotline = phoneMatch ? '8 800 550 26 45' : null;

    return {
      title: 'Поддержка',
      lead: firstSentences(metaLead || sections[0]?.text || '', 180, 2),
      story: [],
      facts: [],
      carriers: [],
      sections,
      prices: [],
      lists: [],
      images: page?.images || [],
      hotline,
    };
  }

  if (pageKey === 'rent') {
    const paras = htmlParagraphs(html).filter((p) => !/^аренда интерактивных/i.test(p));
    const prices = [];
    const story = [];
    for (const p of paras) {
      if (/стоимость аренды терминала/i.test(p) || /диагональ/i.test(p)) {
        const m = p.match(/диагональю\s*([^—\-]+)\s*[-–—]\s*(.+)$/i);
        if (m) {
          prices.push({ label: oneLine(m[1]), value: oneLine(m[2]) });
        } else if (/от\s*8\s*000/i.test(p)) {
          prices.push({ label: 'от', value: p.replace(/^Стоимость аренды терминала\s*/i, '') });
        } else {
          prices.push({ label: 'Тариф', value: p });
        }
      } else if (!/не входит оплата доставки|скидку до 30/i.test(p)) {
        story.push(p);
      }
    }

    const note =
      paras.find((p) => /не входит оплата доставки/i.test(p)) ||
      paras.find((p) => /скидку до 30/i.test(p)) ||
      '';

    const softList = htmlListItems(
      (html.match(/Список готовых программных решений[\s\S]*?<\/ul>/i) || [])[0] || '',
    );
    const serviceList = htmlListItems(
      (html.match(/Стоимость на отдельные услуги[\s\S]*?<\/ul>/i) ||
        html.match(/Доставка и техническое сопровождение[\s\S]*?<\/ul>/i) ||
        [])[0] || '',
    );

    const sections = [];
    const softIntro = paras.find((p) => /программн/i.test(p) && /информационную систему/i.test(p));
    if (softIntro || softList.length) {
      sections.push({
        title: 'Программное обеспечение',
        text: softIntro || '',
        items: softList,
      });
    }
    const deliveryIntro = paras.find((p) => /доставку и разгрузку/i.test(p));
    if (deliveryIntro || serviceList.length) {
      sections.push({
        title: 'Доставка и техническое сопровождение',
        text: deliveryIntro || '',
        items: serviceList,
      });
    }

    return {
      title: 'Аренда',
      lead: firstSentences(metaLead || story[0] || '', 180, 2),
      story: story.filter(
        (p) =>
          !/программн|информационную систему|доставку и разгрузку|готовые программные|или любая другая/i.test(
            p,
          ),
      ),
      facts: note ? [{ label: 'Условия', value: note }] : [],
      carriers: [],
      sections,
      prices,
      lists: [],
      images: page?.images || [],
      hotline: '8 800 550 26 45',
    };
  }

  if (pageKey === 'policy') {
    const marked = String(page?.html || '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    const sections = [];
    const parts = marked.split(/(?=^\d+\.\s+[А-ЯA-Z])/m).filter(Boolean);
    for (const part of parts) {
      const m = part.match(/^(\d+)\.\s+([^\n]+)\n?([\s\S]*)$/);
      if (!m) continue;
      const heading = oneLine(m[2]);
      const body = oneLine(m[3]);
      if (!heading || heading.length < 3 || !body) continue;
      sections.push({
        title: `${m[1]}. ${heading}`,
        text: body,
        items: [],
      });
    }

    return {
      title: 'Политика конфиденциальности',
      lead: firstSentences(sections[0]?.text || metaLead || '', 200, 2),
      story: [],
      facts: [],
      carriers: [],
      sections: sections.slice(0, 16),
      prices: [],
      lists: [],
      images: [],
      hotline: null,
    };
  }

  return {
    title,
    lead: metaLead,
    story: htmlParagraphs(html),
    facts: [],
    carriers: [],
    sections: [],
    prices: [],
    lists: [],
    images: page?.images || [],
    hotline: null,
  };
}
