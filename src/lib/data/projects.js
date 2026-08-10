import projects from '../../data/projects.json';
import {
  oneLine,
  cleanSeoLead,
  cutPageChrome,
  htmlSectionsByHeading,
  htmlParagraphs,
  firstSentences,
  stripTags,
} from './content-utils.js';

export { projects };

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

/** Product cards under «Что мы использовали в проекте». */
export function extractUsedProducts(html) {
  const block =
    (String(html || '').match(
      /project-used[\s\S]*?(?=detail-right|Другие проекты|widget-begin|Закажите обратный|$)/i,
    ) || [])[0] || '';
  if (!block) return [];

  const out = [];
  const seen = new Set();

  for (const raw of block.matchAll(/<div class="item">([\s\S]*?)(?=<div class="item">|$)/gi)) {
    const chunk = raw[1] || '';
    const slug = (chunk.match(/\/catalog\/product\/([a-z0-9-]+)/i) || [])[1];
    if (!slug || seen.has(slug)) continue;
    const title = stripTags((chunk.match(/class="title"[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || '');
    seen.add(slug);
    out.push({ slug, title });
  }

  if (!out.length) {
    for (const m of block.matchAll(/\/catalog\/product\/([a-z0-9-]+)/gi)) {
      if (seen.has(m[1])) continue;
      seen.add(m[1]);
      out.push({ slug: m[1], title: '' });
    }
  }

  return out;
}

function parseTaskSolution(html) {
  // Source markup uses <h4>Задача</h4> / <h4>Решение</h4>, not h2.
  const sections = htmlSectionsByHeading(html || '', 4);
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
    if (/что мы использовали/i.test(sec.title)) continue;
    if (/назад к/i.test(sec.title)) continue;
    other.push(sec);
  }

  return { task, solution, other };
}

export function presentProject(projectOrSlug) {
  const project =
    typeof projectOrSlug === 'string' ? getProject(projectOrSlug) : projectOrSlug;
  if (!project) {
    return {
      title: '',
      lead: '',
      task: '',
      solution: [],
      story: [],
      sections: [],
      images: [],
      usedProducts: [],
    };
  }

  // Recompute when source html is present (bake) or when baked task/solution is broken.
  const canParse = Boolean(project.html);
  const bakedBroken =
    project.presented &&
    !project.presented.task &&
    Array.isArray(project.presented.solution) &&
    project.presented.solution.length > 0;

  if (project.presented && !canParse && !bakedBroken) {
    return {
      ...project.presented,
      images: project.images || project.presented.images || [],
      usedProducts: project.usedProducts || project.presented.usedProducts || [],
    };
  }

  const title = oneLine(project.title).replace(/&quot;/g, '"').replace(/\u00a0/g, ' ');
  let lead = cleanSeoLead(project.lead);
  if (lead && title && lead.toLowerCase().startsWith(title.toLowerCase().slice(0, 24))) {
    lead = '';
  }

  const { task, solution, other } = parseTaskSolution(project.html || '');
  const extracted = extractUsedProducts(project.html || '');
  const usedProducts = extracted.length ? extracted : project.usedProducts || [];

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
      usedProducts,
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
    usedProducts,
  };
}
