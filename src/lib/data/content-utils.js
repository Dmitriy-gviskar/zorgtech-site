/** Shared text/HTML helpers for present* (no dataset imports). */

export function oneLine(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function clipSentence(text, maxChars) {
  const clean = oneLine(text);
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const at = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf(','), cut.lastIndexOf('—'));
  const base = (at > maxChars * 0.55 ? cut.slice(0, at) : cut).replace(/[.,;:\s]+$/u, '');
  return `${base}…`;
}

export function firstSentences(text, maxChars = 220, maxSentences = 2) {
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

export function cleanSeoLead(lead) {
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

export function stripTags(html) {
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

export function cutPageChrome(html) {
  const cut = String(html || '').search(
    /class="widget widget-begin"|НЕ ЗНАЕТЕ|Закажите обратный|id="form_|modal standard|Нажимая кнопку/i,
  );
  return cut > 0 ? html.slice(0, cut) : html || '';
}

export function htmlParagraphs(html) {
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

export function htmlListItems(html) {
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

export function htmlSectionsByH2(html) {
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
