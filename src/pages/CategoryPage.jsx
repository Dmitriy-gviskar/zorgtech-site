import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { ruCount } from '../lib/data/content-utils.js';
import {
  getCategory,
  getProduct,
  presentCategoryBlurb,
  presentCategoryIntro,
  productCover,
  productDiagonal,
  productGallery,
} from '../lib/data/catalog.js';
import { paths } from '../lib/paths.js';
import NotFoundPage from './NotFoundPage';

function studioCover(product) {
  if (!product) return null;
  const gallery = productGallery(product);
  return gallery[0] || productCover(product);
}

const CATEGORY_REDIRECTS = {
  'mono-napolnye': 'apriori',
};

export default function CategoryPage() {
  const { slug } = useParams();
  const redirectTo = CATEGORY_REDIRECTS[slug];
  const cat = getCategory(slug);
  const [diagonal, setDiagonal] = useState(null);

  useEffect(() => {
    setDiagonal(null);
  }, [slug]);

  const items = useMemo(
    () => (cat?.productSlugs || []).map(getProduct).filter(Boolean),
    [cat],
  );

  const availableDiagonals = useMemo(() => {
    const present = [...new Set(items.map(productDiagonal).filter(Boolean))];
    return present.sort((a, b) => a - b);
  }, [items]);

  const visible = useMemo(() => {
    if (!diagonal) return items;
    return items.filter((p) => productDiagonal(p) === diagonal);
  }, [items, diagonal]);

  if (redirectTo) return <Navigate to={paths.category(redirectTo)} replace />;

  if (!cat || cat.missing) {
    const product = getProduct(slug);
    if (product) return <Navigate to={paths.product(slug)} replace />;
    return <NotFoundPage />;
  }

  const intro = presentCategoryIntro(cat);
  const blurb = !intro ? presentCategoryBlurb(cat) : '';

  return (
    <div className="page category-page">
      <Seo
        title={cat.title || cat.name}
        description={blurb || cat.description || `Линейка ${cat.name} — оборудование Zorgtech`}
        path={`/catalog/${cat.slug}`}
        image={cat.image || undefined}
      />
      <p className="crumbs">
        <Link to="/catalog">Каталог</Link>
        <span aria-hidden="true"> / </span>
        {cat.name}
      </p>

      <header className="category-head category-head--simple">
        <p className="chapter-kicker">Линейка</p>
        <h1>{cat.name}</h1>
        {intro?.html ? (
          <div className="category-intro" dangerouslySetInnerHTML={{ __html: intro.html }} />
        ) : intro?.text ? (
          <div className="category-intro">
            {intro.text.split(/\n\n+/).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        ) : blurb ? (
          <p className="lead">{blurb}</p>
        ) : null}
        <p className="category-head-count">
          {diagonal
            ? `${visible.length} из ${items.length} · диагональ ${diagonal}″`
            : ruCount(items.length, 'модель в линейке', 'модели в линейке', 'моделей в линейке')}
        </p>
        <div className="category-head-toolbar">
          <div className="actions">
            <Link className="btn primary btn--lg" to="/contacts">
              Запросить подбор
            </Link>
          </div>
          {availableDiagonals.length > 1 ? (
            <div className="category-diagonal" role="group" aria-label="Фильтр по диагонали">
              <span className="category-diagonal-label">Диагональ:</span>
              <div className="category-diagonal-options">
                {availableDiagonals.map((size) => {
                  const active = diagonal === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`category-diagonal-btn${active ? ' is-active' : ''}`}
                      aria-pressed={active}
                      onClick={() => setDiagonal((current) => (current === size ? null : size))}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {visible.length ? (
        <ul className="product-grid product-tiles">
          {visible.map((p, i) => {
            const cover = studioCover(p);

            return (
              <li key={p.slug}>
                <Reveal delay={Math.min(i, 5) * 0.04}>
                  <Link to={paths.product(p.slug)} className="feature-card category-product-card">
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
      ) : (
        <p className="category-filter-empty">
          Нет моделей с диагональю {diagonal}″.{' '}
          <button type="button" className="linkish" onClick={() => setDiagonal(null)}>
            Показать все
          </button>
        </p>
      )}
    </div>
  );
}
