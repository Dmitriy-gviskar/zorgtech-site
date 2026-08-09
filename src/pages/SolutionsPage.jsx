import { Link } from 'react-router-dom';
import { assetUrl, solutions } from '../lib/data';

export default function SolutionsPage() {
  return (
    <div className="page">
      <p className="eyebrow">Софт и сценарии</p>
      <h1>Готовые решения</h1>
      <p className="lead">Отраслевые решения на базе оборудования Zorgtech.</p>
      <div className="grid solutions">
        {solutions.map((s) => (
          <Link key={s.slug} to={`/solutions/${s.slug}`} className="card">
            {s.images?.[0] ? <img src={assetUrl(s.images[0])} alt={s.title} loading="lazy" /> : null}
            <h3>{s.title}</h3>
            <p>{s.lead}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
