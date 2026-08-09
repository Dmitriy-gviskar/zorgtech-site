import { Link } from 'react-router-dom';
import { projects } from '../lib/data';

export default function ProjectsPage() {
  return (
    <div className="page">
      <p className="eyebrow">Кейсы</p>
      <h1>Реализованные проекты</h1>
      <p className="lead">{projects.length} проектов с оборудования Zorgtech.</p>
      <div className="grid projects">
        {projects.map((p) => (
          <Link key={p.slug} to={`/projects/${p.slug}`} className="card">
            {p.images?.[0] ? <img src={p.images[0]} alt={p.title} loading="lazy" /> : null}
            <h3>{p.title}</h3>
            <p>{p.lead}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
