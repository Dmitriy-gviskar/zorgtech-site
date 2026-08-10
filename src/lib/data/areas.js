import areas from '../../data/areas.json';
import {
  oneLine,
  cleanSeoLead,
  cutPageChrome,
  htmlSectionsByH2,
  htmlParagraphs,
  firstSentences,
} from './content-utils.js';

export { areas };

export function getArea(slug) {
  return areas.find((a) => a.slug === slug) || null;
}

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

  let title = oneLine(area.title)
    .replace(/&quot;/g, '"')
    .replace(/\u00a0/g, ' ')
    .replace(/\s*[-–—]\s*купить сенсорн.*$/iu, '')
    .replace(/\s*купить сенсорн.*$/iu, '')
    .replace(/\s*[-–—]\s*$/u, '')
    .trim();
  let lead = cleanSeoLead(area.lead)
    .replace(/кисок/giu, 'киоск')
    .replace(/\s*[-–—]\s*$/u, '')
    .trim();
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
