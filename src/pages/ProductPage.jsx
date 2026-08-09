import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getProduct,
  getCategory,
  productGallery,
  presentProduct,
  groupProductSpecs,
  presentSpecGlance,
} from '../lib/data';

function SpecValue({ value }) {
  const v = String(value || '').trim();
  if (/^опция$/i.test(v)) return <span className="spec-flag spec-flag--opt">Опция</span>;
  if (/^наличие$/i.test(v)) return <span className="spec-flag spec-flag--yes">Есть</span>;
  if (/^отсутствует$/i.test(v)) return <span className="spec-flag">Нет</span>;
  return v;
}

function isOptionRow(row) {
  return /^(опция|наличие|отсутствует)$/i.test(String(row.value || '').trim());
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const [active, setActive] = useState(0);
  const [openSpec, setOpenSpec] = useState('display');

  useEffect(() => {
    setActive(0);
    setOpenSpec('display');
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
  const hero = gallery[Math.min(active, Math.max(gallery.length - 1, 0))] || gallery[0];
  const copy = presentProduct(product);
  const showStory = copy.story.length > 0;
  const covered = [copy.slogan, copy.hook, ...copy.story].filter(Boolean).join(' ');
  const htmlPlain = String(product.descriptionHtml || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const showExtraHtml =
    Boolean(htmlPlain) &&
    htmlPlain.length > covered.length + 48 &&
    !covered.includes(htmlPlain.slice(24, 96));
  const specGroups = groupProductSpecs(product.specs);
  const glance = presentSpecGlance(product.specs);
  // '' means all collapsed; only fall back to first group when id is unknown (e.g. after slug change)
  const currentOpen =
    openSpec === '' || specGroups.some((g) => g.id === openSpec)
      ? openSpec
      : specGroups[0]?.id || '';

  return (
    <div className="page product product-page">
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
            <div className="actions">
              <Link className="btn primary btn--lg" to="/contacts">
                Запросить цену
              </Link>
              {cat ? (
                <Link className="btn secondary btn--lg" to={`/catalog/${cat.slug}`}>
                  Вся линейка
                </Link>
              ) : null}
            </div>
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

          {showStory || specGroups.length ? (
            <a className="product-readmore" href={showStory ? '#product-story' : '#product-specs'}>
              {showStory ? 'Читать описание' : 'К характеристикам'} <span aria-hidden="true">↓</span>
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
                  <span>{chip.label}</span>
                  <strong>{chip.value}</strong>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="spec-accordion">
            {specGroups.map((group) => {
              const open = currentOpen === group.id;
              const optionRows = group.rows.filter(isOptionRow);
              const plainRows = group.rows.filter((row) => !isOptionRow(row));
              const useChips = group.id === 'options' && optionRows.length >= 3;
              const rows = plainRows.length ? plainRows : group.rows;

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
                      {useChips ? (
                        <ul className="spec-option-chips">
                          {group.rows.map((row) => (
                            <li key={row.key}>
                              <span>{row.key}</span>
                              <SpecValue value={row.value} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <dl className="spec-dl">
                            {rows.map((row) => (
                              <div key={row.key} className="spec-dl-row">
                                <dt>{row.key}</dt>
                                <dd>
                                  <SpecValue value={row.value} />
                                </dd>
                              </div>
                            ))}
                          </dl>
                          {optionRows.length && plainRows.length ? (
                            <ul className="spec-option-chips spec-option-chips--nested">
                              {optionRows.map((row) => (
                                <li key={row.key}>
                                  <span>{row.key}</span>
                                  <SpecValue value={row.value} />
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {showExtraHtml ? (
        <section className="sec prose product-extra" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      ) : null}
    </div>
  );
}
