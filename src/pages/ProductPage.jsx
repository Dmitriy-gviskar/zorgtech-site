import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProduct, getCategory, productGallery } from '../lib/data';

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
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
  const specs = Object.entries(product.specs || {});
  const gallery = productGallery(product);
  const hero = gallery[Math.min(active, Math.max(gallery.length - 1, 0))] || gallery[0];

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
          <p className="lead">{product.lead || product.description}</p>
          <p className="price">{product.price}</p>
          {product.features?.length ? (
            <ul className="features">
              {product.features.slice(0, 5).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : null}
          <div className="actions">
            <Link className="btn primary" to="/contacts">
              Запросить цену
            </Link>
            {cat ? (
              <Link className="btn" to={`/catalog/${cat.slug}`}>
                Вся линейка
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {specs.length ? (
        <section className="sec product-specs">
          <h2>Характеристики</h2>
          <table className="specs">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {product.descriptionHtml ? (
        <section className="sec prose" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      ) : null}
    </div>
  );
}
