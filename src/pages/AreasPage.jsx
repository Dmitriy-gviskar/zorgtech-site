import { Link } from 'react-router-dom';
import { areas, assetUrl, getPage } from '../lib/data';

function clip(text, max = 90) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function AreasPage() {
  const page = getPage('areas');

  return (
    <div className="page areas-page">
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Применение</p>
        <h1>{page?.title || 'Области применения'}</h1>
        <p className="lead">{page?.lead || 'Где используется оборудование Zorgtech.'}</p>
      </header>

      {areas.length ? (
        <ul className="content-tiles">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link to={`/areas/${a.slug}`} className="content-tile">
                <div className="content-tile-media" aria-hidden="true">
                  {a.images?.[0] ? <img src={assetUrl(a.images[0])} alt="" loading="lazy" /> : null}
                </div>
                <div className="content-tile-body">
                  <h2>{a.title}</h2>
                  {a.lead ? <p>{clip(a.lead, 110)}</p> : null}
                  <span className="feature-card-cta">
                    Подробнее <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : page?.text ? (
        <div className="prose">
          <p>{page.text}</p>
        </div>
      ) : (
        <p className="muted">Раздел появится после завершения scrape страниц.</p>
      )}
    </div>
  );
}
