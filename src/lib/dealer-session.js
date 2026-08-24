const KEY = 'zorgtech-dealer-cabinet';

export function readDealerSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.company || !data?.email) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeDealerSession(payload) {
  sessionStorage.setItem(
    KEY,
    JSON.stringify({
      name: String(payload.name || '').trim(),
      company: String(payload.company || '').trim(),
      email: String(payload.email || '').trim(),
      phone: String(payload.phone || '').trim(),
    }),
  );
}

export function clearDealerSession() {
  sessionStorage.removeItem(KEY);
}

export function dealerMailto(session, subject, lines) {
  const body = [
    `Компания: ${session.company}`,
    `Имя: ${session.name || '—'}`,
    `Email: ${session.email}`,
    `Телефон: ${session.phone || '—'}`,
    '',
    ...lines,
  ].join('\n');
  return `mailto:dealers@zorgtech.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
