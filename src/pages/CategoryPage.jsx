import { Link, useParams } from 'react-router-dom';
import { getCategory, getProduct, productCover, productGallery } from '../lib/data';

function studioCover(product) {
  const gallery = productGallery(product);
  return gallery[0] || productCover(product);
}

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
    <div className="page category-page">
      <p className="crumbs">
        <Link to="/catalog">Каталог</Link>
        <span aria-hidden="true"> / </span>
        {cat.name}
      </p>

      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Линейка</p>
        <h1>{cat.name}</h1>
        {cat.description || cat.lead ? <p className="lead">{cat.description || cat.lead}</p> : null}
        <p className="muted">{items.length} моделей</p>
      </header>

      <ul className="product-grid product-tiles">
        {items.map((p) => {
          const cover = studioCover(p);
          return (
            <li key={p.slug}>
              <Link to={`/product/${p.slug}`} className="feature-card category-product-card">
                <div className="feature-card-copy">
                  <h2 className="feature-card-title">{p.title}</h2>
                  <span className="feature-card-cta">
                    Подробнее <span aria-hidden="true">→</span>
                  </span>
                </div>
                <div className="feature-card-media" aria-hidden="true">
                  {cover ? <img src={cover} alt="" loading="lazy" /> : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
