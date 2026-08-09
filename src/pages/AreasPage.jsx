import { Link } from 'react-router-dom';
import { areas, assetUrl, getPage } from '../lib/data';

export default function AreasPage() {
  const page = getPage('areas');

  return (
    <div className="page">
      <p className="eyebrow">Применение</p>
      <h1>{page?.title || 'Области применения'}</h1>
      <p className="lead">{page?.lead || 'Где используется оборудование Zorgtech.'}</p>
      {areas.length ? (
        <div className="grid solutions">
          {areas.map((a) => (
            <Link key={a.slug} to={`/areas/${a.slug}`} className="card">
              {a.images?.[0] ? <img src={assetUrl(a.images[0])} alt={a.title} loading="lazy" /> : null}
              <h3>{a.title}</h3>
              <p>{a.lead}</p>
            </Link>
          ))}
        </div>
      ) : page?.text ? (
        <div className="prose"><p>{page.text}</p></div>
      ) : (
        <p className="muted">Раздел появится после завершения scrape страниц.</p>
      )}
    </div>
  );
}
