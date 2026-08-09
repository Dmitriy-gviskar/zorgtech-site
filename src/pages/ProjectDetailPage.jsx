import { Link, useParams } from 'react-router-dom';
import { getProject } from '../lib/data';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="page">
        <h1>Проект не найден</h1>
        <Link to="/projects">← Ко всем проектам</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="crumbs"><Link to="/projects">Проекты</Link> / {project.title}</p>
      <h1>{project.title}</h1>
      <p className="lead">{project.lead}</p>
      <div className="gallery">
        {(project.images || []).map((src) => (
          <img key={src} src={src} alt={project.title} loading="lazy" />
        ))}
      </div>
      {project.text ? (
        <div className="prose">
          {project.text
            .split(/(?<=\.)\s+(?=[А-ЯA-Z])/u)
            .map((p) => p.trim())
            .filter(Boolean)
            .slice(0, 30)
            .map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
        </div>
      ) : null}
      {project.usedProducts?.length ? (
        <section className="sec">
          <h2>Использованное оборудование</h2>
          <ul>
            {project.usedProducts.map((u) => (
              <li key={u.slug}><Link to={`/product/${u.slug}`}>{u.title || u.slug}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
