import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import {
  categoryList,
  getProduct,
  productCover,
  productGallery,
} from '../lib/data/catalog.js';
import { ruCount, ruPlural } from '../lib/data/content-utils.js';
import { LIST_SEO } from '../lib/seo-defaults.js';

/** Display order for the single catalog list (hero = first). */
const LINE_ORDER = [
  'novinki',
  'napolnye',
  'stoly',
  'nastennyy',
  'ulichnye',
  'apriori',
  'kioski-samoobsluzhivaniya',
  'dezinfektora-ruk',
  'otraslevye',
  'detskie-stoliki',
];

const LINE_COVER_SLUG = {
  novinki: 'novinka-1',
  napolnye: 'diamant-32-fe',
  stoly: 'diamant-55-n',
  nastennyy: 'diamant-32-w',
  ulichnye: 'diamant-46-f-outdoor',
  apriori: 'apriori-22',
  'kioski-samoobsluzhivaniya': 'diamant-32-w-pay',
  'dezinfektora-ruk': 'beskontaktnyy-dezinfektor-agat-7',
  otraslevye: 'diamant-tmedical',
  'detskie-stoliki': 'eco-kid-22',
};

function studioCover(product) {
  if (!product) return null;
  const gallery = productGallery(product);
  return gallery[0] || productCover(product);
}

function modelsLabel(count) {
  return ruCount(count, 'модель', 'модели', 'моделей');
}

function withCover(c) {
  const coverProduct = getProduct(LINE_COVER_SLUG[c.slug]) || getProduct(c.productSlugs?.[0]);
  return {
    ...c,
    cover: studioCover(coverProduct),
  };
}

export default function CatalogPage() {
  const bySlug = new Map(categoryList().map((c) => [c.slug, c]));
  const ordered = [
    ...LINE_ORDER.map((slug) => bySlug.get(slug)).filter(Boolean),
    ...categoryList().filter((c) => !LINE_ORDER.includes(c.slug)),
  ].map(withCover);
  const hero = ordered[0] || null;
  const lines = ordered.slice(1);
  const totalModels = ordered.reduce((sum, c) => sum + (c.productSlugs?.length || 0), 0);

  return (
    <div className="page catalog-page">
      <Seo {...LIST_SEO.catalog} />
      <header className="catalog-head catalog-head--rich">
        <p className="chapter-kicker">Продукция</p>
        <h1>Каталог оборудования</h1>
        <p className="lead">
          Линейки сенсорных терминалов, столов и киосков Zorgtech.
        </p>
        <p className="catalog-head-meta">
          <strong>{ordered.length}</strong> {ruPlural(ordered.length, 'линейка', 'линейки', 'линеек')} ·{' '}
          <strong>{totalModels}</strong> {ruPlural(totalModels, 'модель', 'модели', 'моделей')}
        </p>
      </header>

      {hero ? (
        <Reveal>
          <Link to={`/catalog/${hero.slug}`} className="catalog-hero-line">
            <div className="catalog-hero-line-copy">
              <p className="chapter-kicker">Флагманская линейка</p>
              <h2>{hero.name}</h2>
              <em>{modelsLabel(hero.productSlugs?.length)}</em>
              <span className="feature-card-cta">
                Смотреть линейку <span aria-hidden="true">→</span>
              </span>
            </div>
            <div className="catalog-hero-line-media" aria-hidden="true">
              {hero.cover ? <img src={hero.cover} alt="" /> : null}
            </div>
          </Link>
        </Reveal>
      ) : null}

      {lines.length ? (
        <section className="catalog-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Каталог</p>
            <h2>Все линейки</h2>
          </header>
          <ul className="lines-tiles catalog-tiles">
            {lines.map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={Math.min(i, 4) * 0.04}>
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
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
