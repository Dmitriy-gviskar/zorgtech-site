import { Link } from 'react-router-dom';
import { assetUrl, getPage } from '../lib/data';

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
    .slice(0, 40);
}

export default function StaticPage({ pageKey }) {
  const page = getPage(pageKey);
  const meta = META[pageKey] || { kicker: 'Zorgtech', fallback: pageKey };
  // Scraped Bitrix titles are often SEO dumps — prefer short label for UI.
  const scrapedTitle = page?.title || '';
  const title =
    scrapedTitle && scrapedTitle.length <= 48 && !scrapedTitle.includes(' - ')
      ? scrapedTitle
      : meta.fallback;
  const chunks = paragraphs(page?.text);
  const isContacts = pageKey === 'contacts';

  return (
    <div className={`page static-page${isContacts ? ' static-page--contacts' : ''}`}>
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">{meta.kicker}</p>
        <h1>{title}</h1>
        {page?.lead ? <p className="lead">{page.lead}</p> : null}
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

      {!isContacts && page?.images?.length ? (
        <div className="content-gallery">
          {page.images.slice(0, 8).map((src) => (
            <img key={src} src={assetUrl(src)} alt="" loading="lazy" />
          ))}
        </div>
      ) : null}

      {!isContacts && chunks.length ? (
        <div className="prose">
          {chunks.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      ) : null}

      {!isContacts && !chunks.length && page?.text ? (
        <div className="prose">
          <p>{page.text}</p>
        </div>
      ) : null}

      {!isContacts && !chunks.length && !page?.text ? (
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
