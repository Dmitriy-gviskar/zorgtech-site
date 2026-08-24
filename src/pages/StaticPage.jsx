import { Link } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import { getPage, presentAboutPage, presentServicePage } from '../lib/data/pages.js';

const META = {
  about: { kicker: 'Компания', fallback: 'О компании' },
  contacts: { kicker: 'Связь', fallback: 'Контакты' },
  delivery: { kicker: 'Сервис', fallback: 'Доставка и сервис' },
  support: { kicker: 'Сервис', fallback: 'Поддержка' },
  rent: { kicker: 'Сервис', fallback: 'Аренда' },
  policy: { kicker: 'Документы', fallback: 'Политика конфиденциальности' },
};

const SERVICE_KEYS = new Set(['delivery', 'support', 'rent', 'policy']);

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

          <div className="about-clients-panel">
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
          </div>
        </section>
      ) : null}

      {about.next.length ? (
        <section className="about-section about-section--next" id="about-next">
          <Reveal>
            <header className="sec-head sec-head--row">
              <div>
                <p className="chapter-kicker">Дилерам</p>
                <h2>Присоединяйтесь к нашей дилерской программе, приобретайте оборудование со скидкой 20%</h2>
              </div>
              <Link className="btn primary" to="/dealers">
                Станьте дилером
              </Link>
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

function ContactsBody() {
  return (
    <div className="contacts-showcase">
      <Reveal>
        <section className="contacts-hotline">
          <p className="chapter-kicker">Единый контактный центр</p>
          <a className="contacts-hotline-phone" href="tel:88005502645">
            8 800 550 26 45
          </a>
          <p className="contacts-hotline-note">Звонок по России бесплатный</p>
          <div className="actions">
            <a className="btn primary btn--lg" href="tel:88005502645">
              Позвонить
            </a>
            <a className="btn secondary btn--lg" href="mailto:sale@zorgtech.ru">
              Написать в продажи
            </a>
          </div>
        </section>
      </Reveal>

      <div className="contacts-channels">
        <Reveal delay={0.04}>
          <a className="contacts-channel" href="mailto:sale@zorgtech.ru">
            <span className="chapter-kicker">Отдел продаж</span>
            <strong>sale@zorgtech.ru</strong>
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <a className="contacts-channel" href="mailto:support@zorgtech.ru">
            <span className="chapter-kicker">Техническая поддержка</span>
            <strong>support@zorgtech.ru</strong>
          </a>
        </Reveal>
      </div>

      <section className="contacts-places">
        <header className="sec-head">
          <p className="chapter-kicker">Адреса</p>
          <h2>Где мы находимся</h2>
        </header>
        <ul className="contacts-place-grid">
          <li>
            <Reveal>
              <article className="contacts-place">
                <span className="chapter-kicker">Производство</span>
                <h3>Дубна</h3>
                <p>141980, Московская область, г. Дубна, ул. Университетская, д.11, стр. 29А.</p>
              </article>
            </Reveal>
          </li>
          <li>
            <Reveal delay={0.05}>
              <article className="contacts-place contacts-place--accent">
                <span className="chapter-kicker">Офис и шоурум</span>
                <h3>Москва</h3>
                <p>119530, г. Москва, Очаковское ш., 28стр2, БЦ Дорохофф.</p>
              </article>
            </Reveal>
          </li>
        </ul>
      </section>

      <section className="contacts-next">
        <header className="sec-head sec-head--row">
          <div>
            <p className="chapter-kicker">Дилерам</p>
            <h2>Присоединяйтесь к нашей дилерской программе, приобретайте оборудование со скидкой 20%</h2>
          </div>
          <Link className="btn primary" to="/dealers">
            Станьте дилером
          </Link>
        </header>
        <ul className="contacts-next-grid">
          <li>
            <Reveal>
              <Link to="/solutions" className="contacts-next-card">
                <span className="contacts-next-num">01</span>
                <strong>Изучите готовый софт</strong>
                <span>Мы подготовили типовой софт для самых популярных задач разных типов бизнеса</span>
              </Link>
            </Reveal>
          </li>
          <li>
            <Reveal delay={0.05}>
              <Link to="/catalog" className="contacts-next-card">
                <span className="contacts-next-num">02</span>
                <strong>Посетите каталог</strong>
                <span>И выберите отдельную сенсорную панель, подходящую вашим требованиям</span>
              </Link>
            </Reveal>
          </li>
          <li>
            <Reveal delay={0.08}>
              <a href="tel:88005502645" className="contacts-next-card">
                <span className="contacts-next-num">03</span>
                <strong>Позвоните нам</strong>
                <span>Единый контактный центр 8 800 550 26 45 — специалист поможет выбрать решение</span>
              </a>
            </Reveal>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ServiceBody({ pageKey, page }) {
  const copy = presentServicePage(pageKey, page);
  const [openPolicy, setOpenPolicy] = useState(copy.sections[0]?.title || '');

  return (
    <div className="service-body">
      {copy.story.length ? (
        <Reveal>
          <section className="service-story">
            {copy.story.map((p, i) => (
              <p key={p.slice(0, 48)} className={i === 0 ? 'is-lead' : undefined}>
                {p}
              </p>
            ))}
          </section>
        </Reveal>
      ) : null}

      {copy.carriers.length ? (
        <Reveal delay={0.04}>
          <section className="service-carriers">
            <header className="sec-head">
              <p className="chapter-kicker">Партнёры</p>
              <h2>Транспортные компании</h2>
            </header>
            <ul className="service-chip-row">
              {copy.carriers.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        </Reveal>
      ) : null}

      {copy.facts.length ? (
        <Reveal delay={0.05}>
          <ul className="service-facts">
            {copy.facts.map((f) => (
              <li key={f.label}>
                <span className="chapter-kicker">{f.label}</span>
                <p>{f.value}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {copy.prices.length ? (
        <Reveal delay={0.05}>
          <section className="service-prices">
            <header className="sec-head">
              <p className="chapter-kicker">Тарифы</p>
              <h2>Стоимость аренды</h2>
            </header>
            <ul className="service-price-list">
              {copy.prices.map((row) => (
                <li key={`${row.label}-${row.value}`}>
                  <strong>{row.label}</strong>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      ) : null}

      {copy.images?.length ? (
        <div className="content-gallery service-gallery">
          {copy.images.slice(0, 6).map((src) => (
            <img key={src} src={assetUrl(src)} alt="" loading="lazy" />
          ))}
        </div>
      ) : null}

      {copy.sections.length && pageKey === 'policy' ? (
        <div className="service-policy">
          {copy.sections.map((sec) => {
            const open = openPolicy === sec.title;
            return (
              <details
                key={sec.title}
                className="service-policy-item"
                open={open}
                onToggle={(e) => {
                  if (e.target.open) setOpenPolicy(sec.title);
                  else if (openPolicy === sec.title) setOpenPolicy('');
                }}
              >
                <summary>{sec.title}</summary>
                <p>{sec.text}</p>
              </details>
            );
          })}
        </div>
      ) : null}

      {copy.sections.length && pageKey !== 'policy' ? (
        <div className="service-sections">
          {copy.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={Math.min(i, 4) * 0.04}>
              <section className="service-section">
                <header className="sec-head">
                  <p className="chapter-kicker">{String(i + 1).padStart(2, '0')}</p>
                  <h2>{sec.title}</h2>
                </header>
                {sec.text ? <p className="service-section-text">{sec.text}</p> : null}
                {sec.items?.length ? (
                  <ul className="service-section-list">
                    {sec.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}
        </div>
      ) : null}

      {copy.hotline ? (
        <div className="service-hotline">
          <span className="chapter-kicker">Горячая линия</span>
          <a href={`tel:${copy.hotline.replace(/\s+/g, '')}`}>{copy.hotline}</a>
        </div>
      ) : null}

      <div className="actions about-actions">
        <Link className="btn primary btn--lg" to="/contacts">
          Связаться с нами
        </Link>
        <Link className="btn secondary btn--lg" to="/catalog">
          В каталог
        </Link>
      </div>
    </div>
  );
}

export default function StaticPage({ pageKey }) {
  const page = getPage(pageKey);
  const meta = META[pageKey] || { kicker: 'Zorgtech', fallback: pageKey };
  const isContacts = pageKey === 'contacts';
  const isAbout = pageKey === 'about';
  const isService = SERVICE_KEYS.has(pageKey);
  const about = isAbout ? presentAboutPage(page) : null;
  const service = isService ? presentServicePage(pageKey, page) : null;

  const scrapedTitle = page?.title || '';
  const title = isService
    ? service.title || meta.fallback
    : scrapedTitle && scrapedTitle.length <= 48 && !scrapedTitle.includes(' - ')
      ? scrapedTitle
      : meta.fallback;

  const lead = isAbout
    ? about?.lead
    : isService
      ? service.lead
      : isContacts
        ? page?.presented?.lead ||
          'Единый контактный центр, офис продаж и шоурум, производство в Дубне.'
        : page?.lead && !/полезная информация для партнеров|телефон горячей линии/i.test(page.lead)
          ? page.lead
          : null;

  return (
    <div
      className={`page static-page${isContacts ? ' static-page--contacts' : ''}${
        isAbout ? ' static-page--about' : ''
      }${isService ? ` static-page--service static-page--${pageKey}` : ''}`}
    >
      <Seo
        title={page?.meta?.title || title}
        description={page?.meta?.description || lead || ''}
        path={`/${pageKey}`}
        image={page?.meta?.image || undefined}
      />
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">{meta.kicker}</p>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </header>

      {isContacts ? <ContactsBody /> : null}
      {isAbout ? <AboutBody page={page} /> : null}
      {isService ? <ServiceBody pageKey={pageKey} page={page} /> : null}
    </div>
  );
}
