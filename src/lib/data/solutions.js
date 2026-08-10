import solutions from '../../data/solutions.json';
import { oneLine } from './content-utils.js';

export { solutions };

export function getSolution(slug) {
  return solutions.find((s) => s.slug === slug) || null;
}

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

  if (solution.presented) {
    return {
      ...solution.presented,
      images: solution.images || solution.presented.images || [],
      icon: solution.icon || solution.presented.icon || null,
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
