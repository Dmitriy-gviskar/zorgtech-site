import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import {
  getCategory,
  getProduct,
  presentCategoryBlurb,
  productCover,
  productGallery,
} from '../lib/data';

function studioCover(product) {
  if (!product) return null;
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
        <p className="category-head-count">{items.length} моделей в линейке</p>
        <div className="actions">
          <Link className="btn primary btn--lg" to="/contacts">
            Запросить подбор
          </Link>
          <Link className="btn secondary btn--lg" to="/catalog">
            Все линейки
          </Link>
        </div>
      </header>

      <ul className="product-grid product-tiles">
        {items.map((p, i) => {
          const cover = studioCover(p);

          return (
            <li key={p.slug}>
              <Reveal delay={Math.min(i, 5) * 0.04}>
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
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
