import projects from '../../data/projects.json';
import {
  oneLine,
  cleanSeoLead,
  cutPageChrome,
  htmlSectionsByH2,
  htmlParagraphs,
  firstSentences,
} from './content-utils.js';

export { projects };

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

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
