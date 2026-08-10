import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { assetUrl } from '../lib/data/asset.js';
import { presentProject, projects } from '../lib/data/projects.js';

function clip(text, max = 72) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function ProjectsPage() {
  const list = [...projects]
    .map((p) => ({ raw: p, copy: presentProject(p) }))
    .sort((a, b) => (b.copy.images.length || 0) - (a.copy.images.length || 0));

  const featured = list[0] || null;
  const rest = list.slice(1);

  return (
    <div className="page projects-page">
      <header className="category-head category-head--simple projects-head">
        <p className="chapter-kicker">Кейсы</p>
        <h1>Реализованные проекты</h1>
        <p className="lead">
          {projects.length} проектов на оборудовании Zorgtech — от навигации до отраслевых систем.
        </p>
      </header>

      {featured ? (
        <Reveal>
          <Link to={`/projects/${featured.raw.slug}`} className="projects-feature">
            <div className="projects-feature-media" aria-hidden="true">
              {featured.copy.images[0] ? (
                <img src={assetUrl(featured.copy.images[0])} alt="" />
              ) : null}
            </div>
            <div className="projects-feature-copy">
              <p className="chapter-kicker">Избранный кейс</p>
              <h2>{featured.copy.title}</h2>
              {featured.copy.task ? <p>{clip(featured.copy.task, 160)}</p> : null}
              <span className="feature-card-cta">
                Смотреть кейс <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      ) : null}

      <div className="shot-on-grid content-shot-grid projects-grid">
        {rest.map(({ raw, copy }, i) => {
          const wide = i % 7 === 0;
          return (
            <Reveal
              key={raw.slug}
              className={wide ? 'span-2' : ''}
              delay={Math.min(i, 6) * 0.03}
            >
              <Link
                to={`/projects/${raw.slug}`}
                className={`shot-card${wide ? ' shot-card--xl' : ''}`}
              >
                <div className="shot-card-media">
                  {copy.images[0] ? (
                    <img src={assetUrl(copy.images[0])} alt="" loading="lazy" />
                  ) : null}
                </div>
                <div className="shot-card-body">
                  <span>Проект</span>
                  <h3>{clip(copy.title, 70)}</h3>
                  {copy.task ? <p className="shot-card-task">{clip(copy.task, 90)}</p> : null}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
