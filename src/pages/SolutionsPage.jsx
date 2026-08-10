import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import { presentSolution, solutions } from '../lib/data/solutions.js';
import { LIST_SEO } from '../lib/seo-defaults.js';

function clip(text, max = 110) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function SolutionsPage() {
  const list = solutions.map((s) => ({ raw: s, copy: presentSolution(s) }));

  return (
    <div className="page solutions-page">
      <Seo {...LIST_SEO.solutions} />
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Софт и сценарии</p>
        <h1>Готовые решения</h1>
        <p className="lead">Отраслевые решения на базе оборудования Zorgtech.</p>
      </header>

      <ul className="solution-cards">
        {list.map(({ raw, copy }, i) => {
          const cover = copy.images[0];
          return (
            <li key={raw.slug}>
              <Reveal delay={Math.min(i, 5) * 0.04}>
                <Link to={`/solutions/${raw.slug}`} className="solution-card">
                  <div className="solution-card-media" aria-hidden="true">
                    {cover ? <img src={assetUrl(cover)} alt="" loading="lazy" /> : null}
                    {copy.icon ? (
                      <img className="solution-card-icon" src={assetUrl(copy.icon)} alt="" />
                    ) : null}
                  </div>
                  <div className="solution-card-body">
                    <h2>{copy.title}</h2>
                    {copy.lead ? <p>{clip(copy.lead, 120)}</p> : null}
                    {copy.features.length ? (
                      <ul className="solution-card-feats">
                        {copy.features.slice(0, 3).map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="feature-card-cta">
                      Подробнее <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
