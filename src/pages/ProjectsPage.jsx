import { Link } from 'react-router-dom';
import { assetUrl, projects } from '../lib/data';

function clip(text, max = 72) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function ProjectsPage() {
  const list = [...projects].sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));

  return (
    <div className="page projects-page">
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Кейсы</p>
        <h1>Реализованные проекты</h1>
        <p className="lead">{projects.length} проектов на оборудовании Zorgtech.</p>
      </header>

      <div className="shot-on-grid content-shot-grid">
        {list.map((p, i) => (
          <Link
            key={p.slug}
            to={`/projects/${p.slug}`}
            className={`shot-card${i % 5 === 0 ? ' shot-card--xl span-2' : ''}`}
          >
            <div className="shot-card-media">
              {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt="" loading="lazy" /> : null}
            </div>
            <div className="shot-card-body">
              <span>Проект</span>
              <h3>{clip(p.title, 70)}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
