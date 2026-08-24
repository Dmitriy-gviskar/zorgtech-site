import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import { presentSolution, SOLUTION_GROUPS, solutions } from '../lib/data/solutions.js';
import { LIST_SEO } from '../lib/seo-defaults.js';

function clip(text, max = 110) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function SolutionCard({ raw, copy, delay, groupTitle }) {
  const cover = copy.images[0];
  return (
    <Reveal delay={delay}>
      <Link to={`/solutions/${raw.slug}`} className="solution-card">
        <div
          className={`solution-card-media${cover ? '' : ' solution-card-media--empty'}`}
          aria-hidden="true"
        >
          {cover ? <img src={assetUrl(cover)} alt="" loading="lazy" /> : null}
          {!cover ? <span className="solution-card-media-label">{groupTitle}</span> : null}
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
  );
}

export default function SolutionsPage() {
  const groups = SOLUTION_GROUPS.map((group, gi) => ({
    ...group,
    items: solutions
      .filter((s) => s.group === group.key)
      .map((s) => ({ raw: s, copy: presentSolution(s) })),
    index: gi,
  })).filter((g) => g.items.length);

  return (
    <div className="page solutions-page">
      <Seo {...LIST_SEO.solutions} />
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Программное обеспечение</p>
        <h1>Готовый софт</h1>
        <p className="lead">Отраслевой софт на базе оборудования Zorgtech.</p>
        <nav className="pill-row solution-toc" aria-label="Разделы софта">
          {groups.map((g) => (
            <a key={g.id} className="pill" href={`#${g.id}`}>
              {g.title}
            </a>
          ))}
        </nav>
      </header>

      {groups.map((group) => (
        <section key={group.id} id={group.id} className="solution-group">
          <header className="sec-head">
            <p className="chapter-kicker">{String(group.index + 1).padStart(2, '0')}</p>
            <h2>{group.title}</h2>
          </header>
          <ul className="solution-cards">
            {group.items.map(({ raw, copy }, i) => (
              <li key={raw.slug}>
                <SolutionCard
                  raw={raw}
                  copy={copy}
                  delay={Math.min(i, 5) * 0.04}
                  groupTitle={group.title}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
