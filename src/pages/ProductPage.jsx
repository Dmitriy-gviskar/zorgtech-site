import { Link, useParams } from 'react-router-dom';
import { getProduct, getCategory, productCover } from '../lib/data';

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);

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
  const cover = productCover(product);
  const gallery = [cover, ...(product.images || [])].filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i);

  return (
    <div className="page product">
      <p className="crumbs">
        <Link to="/catalog">Каталог</Link>
        {cat ? <> / <Link to={`/catalog/${cat.slug}`}>{cat.name}</Link></> : null}
        {' / '}{product.title}
      </p>
      <div className="product-layout">
        <div className="product-gallery">
          {gallery.map((src) => (
            <img key={src} src={src} alt={product.title} loading="lazy" />
          ))}
        </div>
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="lead">{product.lead || product.description}</p>
          <p className="price">{product.price}</p>
          {product.features?.length ? (
            <ul className="features">
              {product.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          ) : null}
          <div className="actions">
            <Link className="btn primary" to="/contacts">Запросить цену</Link>
            {cat ? <Link className="btn" to={`/catalog/${cat.slug}`}>В категорию</Link> : null}
          </div>
        </div>
      </div>
      {specs.length ? (
        <section className="sec">
          <h2>Характеристики</h2>
          <table className="specs">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k}><th>{k}</th><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
      {product.description && product.description !== product.lead ? (
        <section className="sec">
          <h2>Описание</h2>
          <p>{product.description}</p>
        </section>
      ) : null}
    </div>
  );
}
