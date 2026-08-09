import { Link } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../components/Reveal';
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
  const productionHero = about.production[0] || null;
  const productionRest = about.production.slice(1);

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

      <section className="about-section about-section--who" id="about-who">
        <Reveal>
          <div className="about-who">
            <div className="about-who-copy">
              <p className="chapter-kicker">Кто мы и что делаем</p>
              {story.length ? (
                <div className="about-prose">
                  {story.map((p, i) => (
                    <p key={p.slice(0, 48)} className={i === 0 ? 'is-lead' : undefined}>
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
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
          </div>
        </Reveal>

        {about.services.length ? (
          <Reveal delay={0.06}>
            <div className="about-services">
              <header className="sec-head">
                <p className="chapter-kicker">Услуги</p>
                <h2>Спектр услуг</h2>
              </header>
              <ol className="about-service-list">
                {about.services.map((item, i) => (
                  <li key={item}>
                    <span className="about-service-num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        ) : null}
      </section>

      {about.production.length ? (
        <section className="about-section about-section--production" id="about-production">
          <Reveal>
            <header className="sec-head">
              <p className="chapter-kicker">Производство</p>
              <h2>Наше производство</h2>
            </header>
          </Reveal>

          {productionHero ? (
            <Reveal delay={0.05}>
              <figure className="about-production-hero">
                <img src={assetUrl(productionHero.image)} alt={productionHero.title} />
              </figure>
            </Reveal>
          ) : null}

          {productionRest.length ? (
            <div className="about-production-grid">
              {productionRest.map((slide, i) => (
                <Reveal key={slide.image} delay={Math.min(i, 5) * 0.04}>
                  <figure className="about-production-card">
                    <img src={assetUrl(slide.image)} alt={slide.title} loading="lazy" />
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {about.clients.groups.length ? (
        <section className="about-section about-section--clients" id="about-clients">
          <Reveal>
            <header className="sec-head">
              <p className="chapter-kicker">Наши клиенты</p>
              <h2>{about.clients.heading}</h2>
            </header>
          </Reveal>

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
            <ul className="about-client-grid" key={activeClients.title}>
              {activeClients.items.map((item, i) => (
                <li key={`${activeClients.title}-${item.name}`} style={{ '--i': i }}>
                  <div className="about-client-card">
                    <div className="about-client-logo">
                      {item.image ? <img src={assetUrl(item.image)} alt="" loading="lazy" /> : null}
                    </div>
                    <span>{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {about.next.length ? (
        <section className="about-section about-section--next" id="about-next">
          <Reveal>
            <header className="sec-head">
              <p className="chapter-kicker">С чего начать</p>
              <h2>Не знаете, с чего начать?</h2>
            </header>
          </Reveal>
          <ul className="about-next-grid">
            {about.next.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={i * 0.05}>
                  <Link to={item.to} className="about-next-card">
                    <span className="about-next-num">{String(i + 1).padStart(2, '0')}</span>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </Link>
                </Reveal>
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
