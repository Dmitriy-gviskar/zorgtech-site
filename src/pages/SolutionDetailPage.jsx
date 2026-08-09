import { Link, useParams } from 'react-router-dom';
import { assetUrl, getSolution } from '../lib/data';

function paragraphs(text) {
  if (!text) return [];
  return text
    .split(/\n+|(?<=\.)\s+(?=[А-ЯA-Z])/u)
    .map((p) => p.trim())
    .filter((p) => p.length > 20)
    .slice(0, 40);
}

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = getSolution(slug);

  if (!solution) {
    return (
      <div className="page">
        <h1>Решение не найдено</h1>
        <Link className="text-link" to="/solutions">
          ← Ко всем решениям
        </Link>
      </div>
    );
  }

  const hero = solution.images?.[0];
  const rest = (solution.images || []).slice(1);

  return (
    <div className="page detail-page">
      <p className="crumbs">
        <Link to="/solutions">Решения</Link>
        <span aria-hidden="true"> / </span>
        {solution.title}
      </p>

      <header className="detail-hero">
        <div className="detail-hero-copy">
          <p className="chapter-kicker">Решение</p>
          <h1>{solution.title}</h1>
          {solution.lead ? <p className="lead">{solution.lead}</p> : null}
          <div className="actions">
            <Link className="btn primary" to="/contacts">
              Запросить внедрение
            </Link>
            <Link className="btn secondary" to="/catalog">
              К каталогу
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

      {solution.text ? (
        <div className="prose">
          {paragraphs(solution.text).map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
