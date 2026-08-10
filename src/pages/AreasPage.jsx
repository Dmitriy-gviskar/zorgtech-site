import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { assetUrl } from '../lib/data/asset.js';
import { areas, presentArea } from '../lib/data/areas.js';

function clip(text, max = 110) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function AreasPage() {
  const list = areas.map((a) => ({ raw: a, copy: presentArea(a) }));
  const featured = list[0] || null;
  const rest = list.slice(1);

  return (
    <div className="page areas-page">
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Применение</p>
        <h1>Области применения</h1>
        <p className="lead">Где используется оборудование Zorgtech.</p>
      </header>

      {featured ? (
        <Reveal>
          <Link to={`/areas/${featured.raw.slug}`} className="areas-feature">
            <div className="areas-feature-media" aria-hidden="true">
              {featured.copy.images[0] ? (
                <img src={assetUrl(featured.copy.images[0])} alt="" />
              ) : null}
            </div>
            <div className="areas-feature-copy">
              <p className="chapter-kicker">Сценарий</p>
              <h2>{featured.copy.title}</h2>
              {featured.copy.lead ? <p>{clip(featured.copy.lead, 150)}</p> : null}
              <span className="feature-card-cta">
                Подробнее <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      ) : null}

      {rest.length ? (
        <ul className="area-cards">
          {rest.map(({ raw, copy }, i) => (
            <li key={raw.slug}>
              <Reveal delay={Math.min(i, 5) * 0.04}>
                <Link to={`/areas/${raw.slug}`} className="area-card">
                  <div className="area-card-media" aria-hidden="true">
                    {copy.images[0] ? (
                      <img src={assetUrl(copy.images[0])} alt="" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="area-card-body">
                    <h2>{copy.title}</h2>
                    {copy.lead ? <p>{clip(copy.lead, 110)}</p> : null}
                    <span className="feature-card-cta">
                      Подробнее <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
