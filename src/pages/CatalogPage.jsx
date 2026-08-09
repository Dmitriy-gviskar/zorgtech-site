import { Link } from 'react-router-dom';
import { categoryList, getPage, getProduct, productCover } from '../lib/data';

const FEATURED = ['napolnye', 'stoly', 'nastennyy', 'ulichnye', 'apriori', 'kioski-samoobsluzhivaniya'];

export default function CatalogPage() {
  const page = getPage('catalog');
  const all = categoryList();
  const primary = FEATURED.map((slug) => all.find((c) => c.slug === slug)).filter(Boolean);
  const rest = all.filter((c) => !FEATURED.includes(c.slug));
  const cats = [...primary, ...rest];
  const heroProduct =
    getProduct(cats[0]?.productSlugs?.[0]) || getProduct('diamant-32-fe') || null;

  return (
    <div className="page catalog-page">
      <header className="catalog-head">
        <p className="chapter-kicker">Продукция</p>
        <h1>{page?.title || 'Каталог оборудования'}</h1>
        <p className="lead">
          {page?.lead || 'Линейки сенсорных терминалов, столов и киосков Zorgtech.'}
        </p>
      </header>

      <div className="catalog-stage">
        <div className="catalog-stage-media" aria-hidden="true">
          {heroProduct && productCover(heroProduct) ? (
            <img src={productCover(heroProduct)} alt="" />
          ) : null}
        </div>
        <div className="catalog-stage-list">
          <ul className="lines-list">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link to={`/catalog/${c.slug}`}>
                  <span>{c.name}</span>
                  <em>{c.productSlugs?.length || 0}</em>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
