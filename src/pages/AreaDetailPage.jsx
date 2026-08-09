import { Link, useParams } from 'react-router-dom';
import { getArea } from '../lib/data';

export default function AreaDetailPage() {
  const { slug } = useParams();
  const area = getArea(slug);

  if (!area) {
    return (
      <div className="page">
        <h1>Раздел не найден</h1>
        <Link to="/areas">← К областям применения</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="crumbs"><Link to="/areas">Области применения</Link> / {area.title}</p>
      <h1>{area.title}</h1>
      <p className="lead">{area.lead}</p>
      <div className="gallery">
        {(area.images || []).map((src) => (
          <img key={src} src={src} alt={area.title} loading="lazy" />
        ))}
      </div>
      {area.text ? <div className="prose"><p>{area.text}</p></div> : null}
    </div>
  );
}
