import canonSolutions from '../../data/solutions.json';
import ourBoxes from '../../data/our-boxes.json';
import { oneLine } from './content-utils.js';

export const SOLUTION_GROUPS = [
  { key: 'Коробки для интерактива', id: 'interactive', kicker: 'Интерактив', title: 'Коробки для интерактива' },
  { key: 'Презентации в Импульсе', id: 'presentations', kicker: 'Презентации', title: 'Презентации' },
  { key: 'Игры', id: 'games', kicker: 'Образование', title: 'Игры' },
  { key: '3д пособия', id: 'lessons-3d', kicker: 'Образование', title: '3D-пособия' },
  { key: 'VR-тренажёры', id: 'vr', kicker: 'VR', title: 'VR-тренажёры' },
  { key: 'Отраслевые системы', id: 'industry', kicker: 'Киоски', title: 'Отраслевые системы' },
];

export const solutions = [
  ...ourBoxes,
  ...canonSolutions.map((s) => ({ ...s, group: 'Отраслевые системы' })),
];

export function solutionGroupMeta(groupKey) {
  return SOLUTION_GROUPS.find((g) => g.key === groupKey) || SOLUTION_GROUPS[0];
}

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
