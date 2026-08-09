import { Link } from 'react-router-dom';
import { categoryList, getPage, getProduct, productCover, productGallery } from '../lib/data';

const FEATURED = ['napolnye', 'stoly', 'nastennyy', 'ulichnye', 'apriori', 'kioski-samoobsluzhivaniya'];

const LINE_COVER_SLUG = {
  napolnye: 'diamant-32-fe',
  stoly: 'diamant-55-n',
  nastennyy: 'diamant-32-w',
  ulichnye: 'diamant-46-f-outdoor',
  apriori: 'apriori-22',
  'kioski-samoobsluzhivaniya': 'diamant-32-w-pay',
  'mono-napolnye': 'mono-32-n',
  avtokassy: 'diamant-32-w-pay',
  'dezinfektora-ruk': 'beskontaktnyy-dezinfektor-agat-7',
  otraslevye: 'diamant-43-f',
  'detskie-stoliki': 'diamant-22-n',
};

function studioCover(product) {
  if (!product) return null;
  const gallery = productGallery(product);
  return gallery[0] || productCover(product);
}

function modelsLabel(count) {
  const n = count || 0;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} модель`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} модели`;
  return `${n} моделей`;
}

export default function CatalogPage() {
  const page = getPage('catalog');
  const all = categoryList();
  const primary = FEATURED.map((slug) => all.find((c) => c.slug === slug)).filter(Boolean);
  const rest = all.filter((c) => !FEATURED.includes(c.slug));
  const cats = [...primary, ...rest].map((c) => {
    const coverProduct = getProduct(LINE_COVER_SLUG[c.slug]) || getProduct(c.productSlugs?.[0]);
    return {
      ...c,
      cover: studioCover(coverProduct),
    };
  });

  return (
    <div className="page catalog-page">
      <header className="catalog-head">
        <p className="chapter-kicker">Продукция</p>
        <h1>{page?.title || 'Каталог оборудования'}</h1>
        <p className="lead">
          {page?.lead || 'Линейки сенсорных терминалов, столов и киосков Zorgtech.'}
        </p>
      </header>

      <ul className="lines-tiles catalog-tiles">
        {cats.map((c) => (
          <li key={c.slug}>
            <Link to={`/catalog/${c.slug}`} className="line-tile">
              <div className="line-tile-body">
                <h3>{c.name}</h3>
                <em>{modelsLabel(c.productSlugs?.length)}</em>
                <span className="line-tile-cta">
                  Смотреть <span aria-hidden="true">→</span>
                </span>
              </div>
              <div className="line-tile-media" aria-hidden="true">
                {c.cover ? <img src={c.cover} alt="" loading="lazy" /> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
