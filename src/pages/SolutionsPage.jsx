import { Link } from 'react-router-dom';
import { assetUrl, solutions } from '../lib/data';

function clip(text, max = 90) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function SolutionsPage() {
  return (
    <div className="page solutions-page">
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Софт и сценарии</p>
        <h1>Готовые решения</h1>
        <p className="lead">Отраслевые решения на базе оборудования Zorgtech.</p>
      </header>

      <ul className="content-tiles">
        {solutions.map((s) => (
          <li key={s.slug}>
            <Link to={`/solutions/${s.slug}`} className="content-tile">
              <div className="content-tile-media" aria-hidden="true">
                {s.images?.[0] ? <img src={assetUrl(s.images[0])} alt="" loading="lazy" /> : null}
              </div>
              <div className="content-tile-body">
                <h2>{s.title}</h2>
                {s.lead ? <p>{clip(s.lead, 110)}</p> : null}
                <span className="feature-card-cta">
                  Подробнее <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
