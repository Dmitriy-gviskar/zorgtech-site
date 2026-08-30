import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import {
  categoryList,
  getProduct,
  productCover,
} from '../lib/data/catalog.js';
import { presentSolution, solutions } from '../lib/data/solutions.js';
import {
  clearDealerSession,
  dealerMailto,
  readDealerSession,
  writeDealerSession,
} from '../lib/dealer-session.js';
import copy from '../data/dealers.json';
import { paths } from '../lib/paths.js';

const LINE_ORDER = [
  'novinki',
  'napolnye',
  'stoly',
  'nastennyy',
  'ulichnye',
  'apriori',
  'kioski-samoobsluzhivaniya',
  'dezinfektora-ruk',
  'otraslevye',
  'detskie-stoliki',
  'unique',
];

const TABS = [
  { id: 'catalog', label: 'Каталог' },
  { id: 'price', label: 'Прайс' },
  { id: 'materials', label: 'Материалы' },
  { id: 'orders', label: 'Заказы' },
];

function catalogRows() {
  const cats = [...categoryList()].sort((a, b) => {
    const ai = LINE_ORDER.indexOf(a.slug);
    const bi = LINE_ORDER.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return cats
    .map((cat) => ({
      cat,
      products: (cat.productSlugs || []).map(getProduct).filter(Boolean),
    }))
    .filter((row) => row.products.length);
}

function materialItems() {
  const fromProducts = catalogRows()
    .flatMap((row) => row.products)
    .slice(0, 16)
    .map((p) => ({
      key: p.slug,
      title: p.title,
      href: productCover(p),
      file: `${p.slug}.png`,
    }))
    .filter((item) => item.href);

  const fromSoft = solutions
    .map((s) => {
      const view = presentSolution(s);
      const src = view.images[0];
      if (!src) return null;
      return {
        key: `soft-${s.slug}`,
        title: view.title,
        href: assetUrl(src),
        file: `${s.slug}.png`,
      };
    })
    .filter(Boolean)
    .slice(0, 12);

  return [...fromProducts, ...fromSoft];
}

function LoginForm({ onEnter }) {
  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const session = {
      name: String(data.get('name') || '').trim(),
      company: String(data.get('company') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
    };
    if (!session.company || !session.email) return;
    writeDealerSession(session);
    onEnter(session);
  }

  return (
    <div className="page dealer-portal-page">
      <Seo
        title={copy.cabinet.seoTitle}
        description={copy.cabinet.seoDescription}
        path="/dealers/portal"
        noIndex
      />
      <header className="dealer-portal-head">
        <p className="chapter-kicker">{copy.cabinet.kicker}</p>
        <h1>{copy.cabinet.title}</h1>
        <p className="lead">{copy.cabinet.loginLead}</p>
      </header>
      <form className="dealers-form dealer-portal-login" onSubmit={onSubmit}>
        <label className="dealers-field">
          <span>Компания</span>
          <input name="company" type="text" autoComplete="organization" required placeholder="Как в договоре" />
        </label>
        <label className="dealers-field">
          <span>Имя</span>
          <input name="name" type="text" autoComplete="name" placeholder="Как к вам обращаться" />
        </label>
        <label className="dealers-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="work@company.ru" />
        </label>
        <label className="dealers-field">
          <span>Телефон</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+7 …" />
        </label>
        <button className="btn primary btn--lg" type="submit">
          Войти в кабинет
        </button>
        <p className="dealers-consent">
          {copy.cabinet.loginNote}{' '}
          <Link to="/dealers">Стать дилером</Link>
        </p>
      </form>
    </div>
  );
}

export default function DealerPortalPage() {
  const [session, setSession] = useState(() =>
    typeof sessionStorage === 'undefined' ? null : readDealerSession(),
  );
  const [tab, setTab] = useState('catalog');
  const [picked, setPicked] = useState(() => new Set());
  const [orderId, setOrderId] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const groups = useMemo(catalogRows, []);
  const materials = useMemo(materialItems, []);

  if (!session) return <LoginForm onEnter={setSession} />;

  function toggle(slug) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function orderSelected() {
    const items = groups
      .flatMap((g) => g.products)
      .filter((p) => picked.has(p.slug))
      .map((p) => `• ${p.title} (${p.slug})`);
    if (!items.length) return;
    window.location.href = dealerMailto(session, 'Дилерский заказ Zorgtech', [
      'Прошу счёт со скидкой дилера до 25%:',
      ...items,
    ]);
  }

  function requestPrice() {
    window.location.href = dealerMailto(session, 'Запрос дилерского прайса Zorgtech', [
      'Прошу актуальный прайс-лист для дилера (скидка до 25%).',
    ]);
  }

  function downloadCsv() {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const rows = [['Название', 'Категория', 'Страница', 'Цена']];
    groups.forEach((g) => {
      g.products.forEach((p) => {
        rows.push([
          p.title,
          g.cat.name,
          `${origin}${base}${paths.product(p.slug)}`,
          'по запросу, скидка дилера до 25%',
        ]);
      });
    });
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zorgtech-dealer-catalog.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function askOrderStatus(event) {
    event.preventDefault();
    const id = orderId.trim();
    if (!id) return;
    window.location.href = dealerMailto(session, `Статус заказа ${id}`, [
      `Номер заказа: ${id}`,
      orderNote.trim() ? `Комментарий: ${orderNote.trim()}` : '',
    ].filter(Boolean));
  }

  function logout() {
    clearDealerSession();
    setSession(null);
  }

  return (
    <div className="page dealer-portal-page">
      <Seo
        title={copy.cabinet.seoTitle}
        description={copy.cabinet.seoDescription}
        path="/dealers/portal"
        noIndex
      />
      <header className="dealer-portal-head dealer-portal-head--row">
        <div>
          <p className="chapter-kicker">{copy.cabinet.kicker}</p>
          <h1>{copy.cabinet.title}</h1>
          <p className="lead">
            {session.company}
            {session.name ? ` · ${session.name}` : ''}
          </p>
        </div>
        <div className="dealer-portal-head-actions">
          <Link className="btn secondary" to="/dealers">
            Страница дилерам
          </Link>
          <button className="btn secondary" type="button" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <nav className="dealer-portal-tabs" aria-label="Разделы кабинета">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'is-on' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === 'catalog' ? (
        <section>
          <p className="dealer-portal-note">{copy.cabinet.catalogNote}</p>
          {picked.size ? (
            <p className="dealer-portal-toolbar">
              <button className="btn primary" type="button" onClick={orderSelected}>
                Запросить счёт ({picked.size})
              </button>
            </p>
          ) : null}
          {groups.map((group) => (
            <div key={group.cat.slug} className="dealer-portal-group">
              <h2>{group.cat.name}</h2>
              <ul className="dealer-portal-list">
                {group.products.map((p) => (
                  <li key={p.slug}>
                    <label className="dealer-portal-item">
                      <input
                        type="checkbox"
                        checked={picked.has(p.slug)}
                        onChange={() => toggle(p.slug)}
                      />
                      <span>
                        <strong>{p.title}</strong>
                        <em>скидка до 25% · цена в счёте</em>
                      </span>
                      <Link to={paths.product(p.slug)}>Карточка</Link>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {tab === 'price' ? (
        <section className="dealer-portal-panel">
          <p>{copy.cabinet.priceNote}</p>
          <div className="actions">
            <button className="btn primary" type="button" onClick={requestPrice}>
              Запросить прайс письмом
            </button>
            <button className="btn secondary" type="button" onClick={downloadCsv}>
              Скачать каталог CSV
            </button>
          </div>
        </section>
      ) : null}

      {tab === 'materials' ? (
        <section>
          <p className="dealer-portal-note">{copy.cabinet.materialsNote}</p>
          <ul className="dealer-portal-materials">
            {materials.map((item) => (
              <li key={item.key}>
                <a href={item.href} download={item.file}>
                  <img src={item.href} alt="" />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 'orders' ? (
        <section className="dealer-portal-panel">
          <p>{copy.cabinet.ordersNote}</p>
          <form className="dealers-form" onSubmit={askOrderStatus}>
            <label className="dealers-field">
              <span>Номер заказа</span>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="Как в договоре или счёте"
              />
            </label>
            <label className="dealers-field">
              <span>Комментарий</span>
              <input
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Необязательно"
              />
            </label>
            <button className="btn primary" type="submit">
              Узнать статус
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
