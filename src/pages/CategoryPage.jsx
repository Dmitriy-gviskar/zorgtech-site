import { Link, useParams } from 'react-router-dom';
import {
  getCategory,
  getProduct,
  presentCategoryBlurb,
  presentProduct,
  productCover,
  productGallery,
} from '../lib/data';

function studioCover(product) {
  const gallery = productGallery(product);
  return gallery[0] || productCover(product);
}

function clip(text, max = 72) {
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
  const blurb = presentCategoryBlurb(cat);

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
        {blurb ? <p className="lead">{blurb}</p> : null}
        <p className="muted">{items.length} моделей</p>
      </header>

      <ul className="product-grid product-tiles">
        {items.map((p) => {
          const cover = studioCover(p);
          const copy = presentProduct(p);
          const tag = copy.slogan || clip(copy.hook, 78);

          return (
            <li key={p.slug}>
              <Link to={`/product/${p.slug}`} className="feature-card category-product-card">
                <div className="feature-card-copy">
                  <h2 className="feature-card-title">{p.title}</h2>
                  {tag ? <p className="feature-card-tag">{tag}</p> : null}
                  <div className="category-product-meta">
                    <span className="category-product-price">{copy.price}</span>
                    {copy.gift ? <span className="product-gift">ПО в подарок</span> : null}
                  </div>
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
