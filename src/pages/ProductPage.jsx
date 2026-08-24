import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getProduct,
  getCategory,
  productGallery,
  productLiveGallery,
  presentProduct,
  groupProductSpecs,
  presentSpecGlance,
} from '../lib/data/catalog.js';
import Seo from '../components/Seo';
import SpecIcon from '../components/SpecIcon';
import ProductPriceForm from '../components/ProductPriceForm';
import { rewriteSourceUrls } from '../lib/data/content-utils.js';

function SpecValue({ value }) {
  const v = String(value || '').trim();
  if (/^опция$/i.test(v)) return <span className="spec-flag spec-flag--opt">Опция</span>;
  if (/^наличие$/i.test(v)) return <span className="spec-flag spec-flag--yes">Есть</span>;
  if (/^отсутствует$/i.test(v)) return <span className="spec-flag">Нет</span>;
  return v;
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const [active, setActive] = useState(0);
  const [openSpec, setOpenSpec] = useState('display');

  useEffect(() => {
    setActive(0);
    setOpenSpec('display'); // falls back to first available group when missing
  }, [slug]);

  if (!product) {
    return (
      <div className="page">
        <h1>Товар не найден</h1>
        <Link to="/catalog">← В каталог</Link>
      </div>
    );
  }

  const cat = getCategory(product.categorySlug);
  const gallery = productGallery(product);
  const liveGallery = productLiveGallery(product);
  const hero = gallery[Math.min(active, Math.max(gallery.length - 1, 0))] || gallery[0];
  const copy = presentProduct(product);
  const showStory = copy.story.length > 0;
  const showLive = liveGallery.length >= 2;
  const covered = [copy.slogan, copy.hook, ...copy.story].filter(Boolean).join(' ');
  const seoTitle = product.meta?.title || product.title;
  const seoDescription =
    product.meta?.description || copy.hook || copy.slogan || product.description || '';
  const seoImage = product.meta?.image || gallery[0] || undefined;
  const extraHtml = rewriteSourceUrls(product.descriptionHtml || '');
  const htmlPlain = extraHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const coverNorm = covered.replace(/\s+/g, ' ').trim().toLowerCase();
  const extraSample = htmlPlain.slice(0, 80).toLowerCase();
  const extraIsDuplicate =
    !htmlPlain ||
    htmlPlain.length <= covered.length + 48 ||
    (extraSample.length >= 24 && coverNorm.includes(extraSample.slice(0, 72)));
  const showExtraHtml = Boolean(htmlPlain) && !extraIsDuplicate;
  const specGroups = groupProductSpecs(product.specs);
  const glance = presentSpecGlance(product.specs);
  // '' means all collapsed; only fall back to first group when id is unknown (e.g. after slug change)
  const currentOpen =
    openSpec === '' || specGroups.some((g) => g.id === openSpec)
      ? openSpec
      : specGroups[0]?.id || '';

  return (
    <div className="page product product-page">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={`/product/${product.slug}`}
        image={seoImage}
      />
      <p className="crumbs">
        <Link to="/catalog">Каталог</Link>
        {cat ? (
          <>
            <span aria-hidden="true"> / </span>
            <Link to={`/catalog/${cat.slug}`}>{cat.name}</Link>
          </>
        ) : null}
        <span aria-hidden="true"> / </span>
        {product.title}
      </p>

      <section className="product-hero">
        <div className="product-hero-media">
          {hero ? <img src={hero} alt={product.title} /> : null}
          {gallery.length > 1 ? (
            <div className="product-gallery-thumbs" role="list">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="listitem"
                  className={`product-gallery-thumb${i === active ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Ракурс ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-hero-copy">
          <p className="chapter-kicker">{cat?.name || 'Zorgtech'}</p>
          <h1>{product.title}</h1>

          {copy.slogan ? <p className="product-slogan">{copy.slogan}</p> : null}
          {copy.hook ? <p className="product-hook">{copy.hook}</p> : null}

          <div className="product-buy">
            <div className="product-buy-meta">
              <p className="price">{copy.price}</p>
              {copy.gift ? <span className="product-gift">ПО в подарок</span> : null}
            </div>
            <ProductPriceForm title={product.title} slug={product.slug} price={copy.price} />
          </div>

          {copy.features.length ? (
            <ul className="feature-anchors">
              {copy.features.map((f) => (
                <li key={f.full}>
                  <strong>{f.label}</strong>
                  {f.detail ? <span>{f.detail}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}

          {showStory || showLive || specGroups.length ? (
            <a
              className="product-readmore"
              href={showStory ? '#product-story' : showLive ? '#product-live' : '#product-specs'}
            >
              {showStory ? 'Читать описание' : showLive ? 'Живые фото' : 'К характеристикам'}{' '}
              <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>
      </section>

      {showStory ? (
        <section className="sec product-story" id="product-story">
          <header className="sec-head">
            <p className="chapter-kicker">О модели</p>
            <h2>Описание</h2>
          </header>
          <div className="product-story-body">
            {copy.story.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {showLive ? (
        <section className="sec product-live" id="product-live">
          <header className="sec-head">
            <p className="chapter-kicker">Галерея</p>
            <h2>Живые фото</h2>
          </header>
          <div className="product-live-grid">
            {liveGallery.map((src, i) => (
              <figure
                key={src}
                className={`product-live-shot${i === 0 ? ' product-live-shot--lead' : ''}`}
              >
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {specGroups.length ? (
        <section className="sec product-specs" id="product-specs">
          <header className="sec-head">
            <p className="chapter-kicker">Спецификация</p>
            <h2>Характеристики</h2>
          </header>

          {glance.length ? (
            <ul className="spec-glance">
              {glance.map((chip) => (
                <li key={chip.label}>
                  <SpecIcon name={chip.icon || chip.label} />
                  <strong>{chip.value}</strong>
                  <span>{chip.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="spec-accordion">
            {specGroups.map((group) => {
              const open = currentOpen === group.id;

              return (
                <div key={group.id} className={`spec-acc${open ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="spec-acc-head"
                    aria-expanded={open}
                    onClick={() => setOpenSpec(open ? '' : group.id)}
                  >
                    <span className="spec-acc-count">{group.rows.length}</span>
                    <span className="spec-acc-title">{group.title}</span>
                    <span className="spec-acc-chevron" aria-hidden="true" />
                  </button>
                  {open ? (
                    <div className="spec-acc-body">
                      <dl className="spec-dl">
                        {group.rows.map((row) => {
                          const empty = /^(?:-|—)$/.test(String(row.value || '').trim());
                          return (
                            <div key={row.key} className="spec-dl-row">
                              <dt>{row.key}</dt>
                              <dd className={empty ? 'is-empty' : undefined}>
                                {empty ? '—' : <SpecValue value={row.value} />}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {showExtraHtml ? (
        <section className="sec prose product-extra" dangerouslySetInnerHTML={{ __html: extraHtml }} />
      ) : null}
    </div>
  );
}
