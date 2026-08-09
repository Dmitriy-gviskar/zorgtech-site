import { Link, useParams } from 'react-router-dom';
import { getSolution } from '../lib/data';

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = getSolution(slug);

  if (!solution) {
    return (
      <div className="page">
        <h1>Решение не найдено</h1>
        <Link to="/solutions">← Ко всем решениям</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="crumbs"><Link to="/solutions">Решения</Link> / {solution.title}</p>
      <h1>{solution.title}</h1>
      <p className="lead">{solution.lead}</p>
      <div className="gallery">
        {(solution.images || []).map((src) => (
          <img key={src} src={src} alt={solution.title} loading="lazy" />
        ))}
      </div>
      {solution.text ? <div className="prose"><p>{solution.text}</p></div> : null}
    </div>
  );
}
