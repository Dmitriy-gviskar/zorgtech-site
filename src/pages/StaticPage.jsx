import { Link } from 'react-router-dom';
import { useState } from 'react';
import { assetUrl, getPage, presentAboutPage } from '../lib/data';

const META = {
  about: { kicker: 'Компания', fallback: 'О компании' },
  contacts: { kicker: 'Связь', fallback: 'Контакты' },
  delivery: { kicker: 'Сервис', fallback: 'Доставка и сервис' },
  support: { kicker: 'Сервис', fallback: 'Поддержка' },
  rent: { kicker: 'Сервис', fallback: 'Аренда' },
  policy: { kicker: 'Документы', fallback: 'Политика конфиденциальности' },
};

function paragraphs(text) {
  if (!text) return [];
  return text
    .split(/\n+|(?<=\.)\s+(?=[А-ЯA-Z])/u)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)
    .filter((p) => !/нажимая кнопку|как вас зовут|<\/?div/i.test(p))
    .slice(0, 40);
}

function AboutBody({ page }) {
  const about = presentAboutPage(page);
  const story =
    about.paragraphs.length > 0
      ? about.paragraphs
      : paragraphs(page?.text).slice(0, 8);
  const [clientGroup, setClientGroup] = useState(about.clients.groups[0]?.title || '');
  const activeClients =
    about.clients.groups.find((g) => g.title === clientGroup) || about.clients.groups[0] || null;

  return (
    <>
      {about.tabs.length > 1 ? (
        <nav className="about-tabs" aria-label="Разделы о компании">
          {about.tabs.map((tab) => (
            <a key={tab.id} href={`#about-${tab.id}`} className="about-tab">
              {tab.title}
            </a>
          ))}
        </nav>
      ) : null}

      <section className="about-section" id="about-who">
        {about.stats.length ? (
          <ul className="about-stats">
            {about.stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {story.length ? (
          <div className="prose about-prose">
            {story.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        ) : null}

        {about.services.length ? (
          <div className="about-services">
            <header className="sec-head">
              <p className="chapter-kicker">Услуги</p>
              <h2>Спектр услуг</h2>
            </header>
            <ul className="about-service-list">
              {about.services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {about.production.length ? (
        <section className="about-section" id="about-production">
          <header className="sec-head">
            <p className="chapter-kicker">Производство</p>
            <h2>Наше производство</h2>
          </header>
          <div className="about-production-grid">
            {about.production.map((slide) => (
              <figure key={slide.image} className="about-production-card">
                <img src={assetUrl(slide.image)} alt={slide.title} loading="lazy" />
                {slide.text ? <figcaption>{slide.text}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {about.clients.groups.length ? (
        <section className="about-section" id="about-clients">
          <header className="sec-head">
            <p className="chapter-kicker">Наши клиенты</p>
            <h2>{about.clients.heading}</h2>
          </header>
          <div className="about-client-filters" role="tablist" aria-label="Отрасли клиентов">
            {about.clients.groups.map((g) => (
              <button
                key={g.title}
                type="button"
                role="tab"
                aria-selected={activeClients?.title === g.title}
                className={`about-client-filter${activeClients?.title === g.title ? ' is-active' : ''}`}
                onClick={() => setClientGroup(g.title)}
              >
                {g.title}
                <span>{g.items.length}</span>
              </button>
            ))}
          </div>
          {activeClients ? (
            <ul className="about-client-grid">
              {activeClients.items.map((item) => (
                <li key={`${activeClients.title}-${item.name}`}>
                  <div className="about-client-card">
                    {item.image ? (
                      <img src={assetUrl(item.image)} alt="" loading="lazy" />
                    ) : null}
                    <span>{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {about.next.length ? (
        <section className="sec about-next">
          <header className="sec-head">
            <p className="chapter-kicker">С чего начать</p>
            <h2>Не знаете, с чего начать?</h2>
          </header>
          <ul className="about-next-grid">
            {about.next.map((item) => (
              <li key={item.title}>
                <Link to={item.to} className="about-next-card">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="actions about-actions">
        <Link className="btn primary btn--lg" to="/contacts">
          Связаться
        </Link>
        <Link className="btn secondary btn--lg" to="/catalog">
          В каталог
        </Link>
      </div>
    </>
  );
}

export default function StaticPage({ pageKey }) {
  const page = getPage(pageKey);
  const meta = META[pageKey] || { kicker: 'Zorgtech', fallback: pageKey };
  const scrapedTitle = page?.title || '';
  const title =
    scrapedTitle && scrapedTitle.length <= 48 && !scrapedTitle.includes(' - ')
      ? scrapedTitle
      : meta.fallback;
  const isContacts = pageKey === 'contacts';
  const isAbout = pageKey === 'about';
  const about = isAbout ? presentAboutPage(page) : null;
  const chunks = !isAbout && !isContacts ? paragraphs(page?.text) : [];
  const lead = isAbout
    ? about?.lead
    : page?.lead && !/полезная информация для партнеров/i.test(page.lead)
      ? page.lead
      : null;

  return (
    <div className={`page static-page${isContacts ? ' static-page--contacts' : ''}${isAbout ? ' static-page--about' : ''}`}>
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">{meta.kicker}</p>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </header>

      {isContacts ? (
        <div className="contacts-panel">
          <a className="contacts-item" href="tel:88005502645">
            <span className="chapter-kicker">Телефон</span>
            <strong>8 800 550 26 45</strong>
          </a>
          <a className="contacts-item" href="mailto:sale@zorgtech.ru">
            <span className="chapter-kicker">Отдел продаж</span>
            <strong>sale@zorgtech.ru</strong>
          </a>
          <a className="contacts-item" href="mailto:support@zorgtech.ru">
            <span className="chapter-kicker">Поддержка</span>
            <strong>support@zorgtech.ru</strong>
          </a>
          <div className="actions">
            <Link className="btn primary btn--lg" to="/catalog">
              В каталог →
            </Link>
            <a className="btn secondary btn--lg" href="tel:88005502645">
              Позвонить
            </a>
          </div>
        </div>
      ) : null}

      {isAbout ? <AboutBody page={page} /> : null}

      {!isContacts && !isAbout && page?.images?.length ? (
        <div className="content-gallery">
          {page.images.slice(0, 8).map((src) => (
            <img key={src} src={assetUrl(src)} alt="" loading="lazy" />
          ))}
        </div>
      ) : null}

      {!isContacts && !isAbout && chunks.length ? (
        <div className="prose">
          {chunks.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      ) : null}

      {!isContacts && !isAbout && !chunks.length && page?.text ? (
        <div className="prose">
          <p>{page.text}</p>
        </div>
      ) : null}

      {!isContacts && !isAbout && !chunks.length && !page?.text ? (
        <p className="muted">
          Контент страницы ещё подтягивается. <Link className="text-link" to="/">На главную</Link>
        </p>
      ) : null}

      {isContacts ? (
        <div className="contacts-address prose">
          <p>Адрес производства: 141980, Московская область, г. Дубна, ул. Университетская, д.11, стр. 29А.</p>
          <p>Офис продаж и шоурум: 119530, г. Москва, Очаковское ш., 28стр2, БЦ Дорохофф.</p>
        </div>
      ) : null}
    </div>
  );
}
