import { Link, useParams } from 'react-router-dom';
import { getCategory, getProduct, productCover } from '../lib/data';

function clip(text, max = 120) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
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
  const lead = getProduct(items[0]?.slug);

  return (
    <div className="page category-page">
      <p className="crumbs">
        <Link to="/catalog">Каталог</Link>
        <span aria-hidden="true"> / </span>
        {cat.name}
      </p>

      <header className="category-head">
        <div className="category-head-copy">
          <p className="chapter-kicker">Линейка</p>
          <h1>{cat.name}</h1>
          <p className="lead">{cat.description || cat.lead}</p>
          <p className="muted">{items.length} моделей</p>
        </div>
        <div className="category-head-media" aria-hidden="true">
          {lead && productCover(lead) ? <img src={productCover(lead)} alt="" /> : null}
        </div>
      </header>

      <ul className="product-rows">
        {items.map((p) => (
          <li key={p.slug}>
            <Link to={`/product/${p.slug}`} className="product-row">
              <div className="product-row-media">
                {productCover(p) ? (
                  <img src={productCover(p)} alt="" loading="lazy" />
                ) : null}
              </div>
              <div className="product-row-body">
                <h2>{p.title}</h2>
                <p>{clip(p.lead, 140)}</p>
              </div>
              <div className="product-row-meta">
                <span className="price">{p.price}</span>
                <span className="product-row-more">Подробнее</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
