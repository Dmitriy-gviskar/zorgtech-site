import { Link, useParams } from 'react-router-dom';
import { getCategory, getProduct } from '../lib/data';

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = getCategory(slug);

  if (!cat || cat.missing) {
    return (
      <div className="page">
        <h1>Категория не найдена</h1>
        <Link to="/catalog">← В каталог</Link>
      </div>
    );
  }

  const items = (cat.productSlugs || []).map(getProduct).filter(Boolean);

  return (
    <div className="page">
      <p className="crumbs"><Link to="/catalog">Каталог</Link> / {cat.name}</p>
      <h1>{cat.name}</h1>
      <p className="lead">{cat.description || cat.lead}</p>
      <p className="muted">{items.length} моделей</p>
      <div className="grid products">
        {items.map((p) => (
          <Link key={p.slug} to={`/product/${p.slug}`} className="card">
            {p.images?.[0] ? <img src={p.images[0]} alt={p.title} loading="lazy" /> : null}
            <h3>{p.title}</h3>
            <p>{p.lead}</p>
            <span className="price">{p.price}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
