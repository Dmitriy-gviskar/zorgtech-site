import { Link } from 'react-router-dom';
import { getPage } from '../lib/data';

const LABELS = {
  about: 'О компании',
  contacts: 'Контакты',
  delivery: 'Доставка и сервис',
  support: 'Поддержка',
  rent: 'Аренда',
  policy: 'Политика конфиденциальности',
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
  const title = page?.title || LABELS[pageKey] || pageKey;
  const chunks = paragraphs(page?.text);

  return (
    <div className="page">
      <h1>{title}</h1>
      {page?.lead ? <p className="lead">{page.lead}</p> : null}
      {page?.images?.length ? (
        <div className="gallery">
          {page.images.slice(0, 8).map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      ) : null}
      {chunks.length ? (
        <div className="prose">
          {chunks.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      ) : page?.text ? (
        <div className="prose"><p>{page.text}</p></div>
      ) : (
        <p className="muted">
          Контент страницы ещё подтягивается.
          {' '}<Link to="/">На главную</Link>
        </p>
      )}
    </div>
  );
}
