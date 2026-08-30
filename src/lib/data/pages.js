import pages from '../../data/pages.json';
import {
  oneLine,
  firstSentences,
  cleanSeoLead,
  stripTags,
  cutPageChrome,
  htmlParagraphs,
  htmlListItems,
} from './content-utils.js';

export { pages };

export function getPage(key) {
  return pages[key] || null;
}

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
      if (/gotovye-resheniya|solutions/i.test(href)) to = '/gotovye-resheniya';
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

function tightMoney(value) {
  return oneLine(value)
    .replace(/\(\s+/g, '(')
    .replace(/(\d)\s*\*/g, '$1')
    .replace(/(\d)\s+(?=\d{3}\b)/g, '$1\u202f')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function polishRentPage(copy) {
  if (!copy) return copy;
  return {
    ...copy,
    prices: (copy.prices || []).map((row) => ({
      label: row.label === 'от' ? 'Терминал' : row.label,
      value: tightMoney(row.value),
    })),
    facts: (copy.facts || []).map((f) => ({
      ...f,
      value: tightMoney(String(f.value || '').replace(/^\*+\s*/, '')),
    })),
    sections: (copy.sections || []).map((sec) => ({
      ...sec,
      text: tightMoney(sec.text || ''),
      items: (sec.items || []).map(tightMoney),
    })),
  };
}

export function presentServicePage(pageKey, page) {
  if (page?.presented) {
    return pageKey === 'rent' ? polishRentPage(page.presented) : page.presented;
  }

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

    const story = paras
      .filter(
        (p) =>
          !/адрес самовывоза|стоимость доставки по г|100%\s*предоплат|возврат и обмен|упаковываем|рассчит/i.test(
            p,
          ),
      )
      .map((p) =>
        carriers.length
          ? p
              .replace(
                /(?:транспортными\s+)?компаниями:\s*[^.]*(?:\.|$)/giu,
                carriers.length ? 'проверенными транспортными компаниями. ' : '',
              )
              .replace(/\s{2,}/g, ' ')
              .trim()
          : p,
      )
      .filter(Boolean);

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
      // Ranges like 19"-22" — require spaces around the price dash, not the inch hyphen.
      const diagonal = p.match(/диагональю\s*(.+?)\s+[-–—]\s+(.+)$/i);
      if (diagonal) {
        prices.push({
          label: oneLine(diagonal[1]),
          value: oneLine(diagonal[2]).replace(/(\d)\s*\*/g, '$1'),
        });
        continue;
      }
      if (/стоимость аренды терминала\s+от/i.test(p) || /от\s*8\s*000/i.test(p)) {
        const from = p.match(/от\s*8[\s\u00a0]*000[^.]*\.?/i);
        prices.push({
          label: 'Терминал',
          value: oneLine(from?.[0] || 'от 8 000 рублей в сутки, в зависимости от размера экрана'),
        });
        // Keep the marketing sentences in story, not inside the tariff row.
        const marketing = p
          .replace(/Стоимость аренды терминала\s+от\s*8[\s\u00a0]*000[^.]*\.?/giu, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
        if (marketing.length > 40) story.push(marketing);
        continue;
      }
      if (/стоимость аренды терминала/i.test(p) || /диагональ/i.test(p)) {
        prices.push({ label: 'Тариф', value: p });
        continue;
      }
      if (!/не входит оплата доставки|скидку до 30/i.test(p)) {
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
      facts: note ? [{ label: 'Условия', value: oneLine(note).replace(/^\*+\s*/, '') }] : [],
      carriers: [],
      sections,
      prices: polishRentPage({ prices }).prices,
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
