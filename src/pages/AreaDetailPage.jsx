import { Link, useParams } from 'react-router-dom';
import { assetUrl, getArea } from '../lib/data';

function paragraphs(text) {
  if (!text) return [];
  return text
    .split(/\n+|(?<=\.)\s+(?=[А-ЯA-Z])/u)
    .map((p) => p.trim())
    .filter((p) => p.length > 20)
    .slice(0, 40);
}

export default function AreaDetailPage() {
  const { slug } = useParams();
  const area = getArea(slug);

  if (!area) {
    return (
      <div className="page">
        <h1>Раздел не найден</h1>
        <Link className="text-link" to="/areas">
          ← К областям применения
        </Link>
      </div>
    );
  }

  const hero = area.images?.[0];
  const rest = (area.images || []).slice(1);

  return (
    <div className="page detail-page">
      <p className="crumbs">
        <Link to="/areas">Области применения</Link>
        <span aria-hidden="true"> / </span>
        {area.title}
      </p>

      <header className="detail-hero">
        <div className="detail-hero-copy">
          <p className="chapter-kicker">Область применения</p>
          <h1>{area.title}</h1>
          {area.lead ? <p className="lead">{area.lead}</p> : null}
          <div className="actions">
            <Link className="btn primary" to="/contacts">
              Обсудить задачу
            </Link>
            <Link className="btn secondary" to="/solutions">
              Готовые решения
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

      {area.text ? (
        <div className="prose">
          {paragraphs(area.text).map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
