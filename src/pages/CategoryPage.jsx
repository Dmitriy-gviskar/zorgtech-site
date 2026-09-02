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
  productFamily,
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

  // Одна карточка на линейку: варианты диагоналей схлопываются в семейство
  const cards = useMemo(() => {
    const out = [];
    const seenFamilies = new Set();
    for (const p of items) {
      const family = productFamily(p.slug);
      if (!family) {
        out.push({ key: p.slug, family: null, product: p });
        continue;
      }
      if (seenFamilies.has(family.id)) continue;
      seenFamilies.add(family.id);
      const lead = family.variants.find((v) => v.slug === family.lead) || family.variants[0];
      out.push({ key: family.id, family, product: lead.product });
    }
    return out;
  }, [items]);

  const availableDiagonals = useMemo(() => {
    const present = [...new Set(items.map(productDiagonal).filter(Boolean))];
    return present.sort((a, b) => a - b);
  }, [items]);

  const visible = useMemo(() => {
    if (!diagonal) return cards;
    return cards.filter((card) =>
      card.family
        ? card.family.variants.some((v) => v.diagonal === diagonal)
        : productDiagonal(card.product) === diagonal,
    );
  }, [cards, diagonal]);

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
            ? `${visible.length} из ${cards.length} · диагональ ${diagonal}″`
            : ruCount(cards.length, 'модель в линейке', 'модели в линейке', 'моделей в линейке')}
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
          {visible.map((card, i) => {
            const { family } = card;
            // При активном фильтре семейная карточка ведёт на выбранную диагональ
            const target = family
              ? (diagonal && family.variants.find((v) => v.diagonal === diagonal)) ||
                family.variants.find((v) => v.slug === family.lead) ||
                family.variants[0]
              : null;
            const product = target ? target.product : card.product;
            const cover = studioCover(product);

            return (
              <li key={card.key}>
                <Reveal delay={Math.min(i, 5) * 0.04}>
                  <Link
                    to={paths.product(target ? target.slug : card.product.slug)}
                    className="feature-card category-product-card"
                  >
                    <div className="feature-card-copy">
                      <h2 className="feature-card-title">{family ? family.title : card.product.title}</h2>
                      {family ? (
                        <span className="category-card-variants" aria-label="Доступные диагонали">
                          {family.variants.map((v) => (
                            <span
                              key={v.slug}
                              className={`category-card-variant${
                                diagonal === v.diagonal ? ' is-active' : ''
                              }`}
                            >
                              {v.diagonal}″
                            </span>
                          ))}
                        </span>
                      ) : null}
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
