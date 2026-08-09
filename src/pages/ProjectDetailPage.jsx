import { Link, useParams } from 'react-router-dom';
import { assetUrl, getProduct, getProject } from '../lib/data';

function paragraphs(text) {
  if (!text) return [];
  return text
    .split(/(?<=\.)\s+(?=[А-ЯA-Z])/u)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="page">
        <h1>Проект не найден</h1>
        <Link className="text-link" to="/projects">
          ← Ко всем проектам
        </Link>
      </div>
    );
  }

  const hero = project.images?.[0];
  const rest = (project.images || []).slice(1);
  const used = (project.usedProducts || [])
    .map((u) => getProduct(u.slug) || u)
    .filter(Boolean);

  return (
    <div className="page detail-page">
      <p className="crumbs">
        <Link to="/projects">Проекты</Link>
        <span aria-hidden="true"> / </span>
        {project.title}
      </p>

      <header className="detail-hero">
        <div className="detail-hero-copy">
          <p className="chapter-kicker">Проект</p>
          <h1>{project.title}</h1>
          {project.lead ? <p className="lead">{project.lead}</p> : null}
          <div className="actions">
            <Link className="btn primary" to="/contacts">
              Обсудить похожий проект
            </Link>
            <Link className="btn secondary" to="/projects">
              Все проекты
            </Link>
          </div>
        </div>
        {hero ? (
          <div className="detail-hero-media" aria-hidden="true">
            <img src={assetUrl(hero)} alt="" />
          </div>
        ) : null}
      </header>

      {rest.length ? (
        <div className="content-gallery">
          {rest.map((src) => (
            <img key={src} src={assetUrl(src)} alt="" loading="lazy" />
          ))}
        </div>
      ) : null}

      {project.text ? (
        <div className="prose">
          {paragraphs(project.text).map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      ) : null}

      {used.length ? (
        <section className="sec">
          <header className="sec-head">
            <p className="chapter-kicker">Оборудование</p>
            <h2>Использованные модели</h2>
          </header>
          <ul className="pill-row">
            {used.map((u) => (
              <li key={u.slug}>
                <Link className="pill" to={`/product/${u.slug}`}>
                  {u.title || u.slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
