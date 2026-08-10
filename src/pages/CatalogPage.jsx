import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { categoryList, getProduct, productCover, productGallery } from '../lib/data/catalog.js';

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

function withCover(c) {
  const coverProduct = getProduct(LINE_COVER_SLUG[c.slug]) || getProduct(c.productSlugs?.[0]);
  return { ...c, cover: studioCover(coverProduct) };
}

export default function CatalogPage() {
  const all = categoryList();
  const primary = FEATURED.map((slug) => all.find((c) => c.slug === slug)).filter(Boolean).map(withCover);
  const rest = all.filter((c) => !FEATURED.includes(c.slug)).map(withCover);
  const hero = primary[0] || null;
  const featuredRest = primary.slice(1);
  const totalModels = all.reduce((sum, c) => sum + (c.productSlugs?.length || 0), 0);

  return (
    <div className="page catalog-page">
      <header className="catalog-head catalog-head--rich">
        <p className="chapter-kicker">Продукция</p>
        <h1>Каталог оборудования</h1>
        <p className="lead">
          Линейки сенсорных терминалов, столов и киосков Zorgtech.
        </p>
        <p className="catalog-head-meta">
          <strong>{all.length}</strong> линеек · <strong>{totalModels}</strong> моделей
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

      {featuredRest.length ? (
        <section className="catalog-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Основные линейки</p>
            <h2>По назначению</h2>
          </header>
          <ul className="lines-tiles catalog-tiles">
            {featuredRest.map((c, i) => (
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

      {rest.length ? (
        <section className="catalog-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Ещё</p>
            <h2>Дополнительные линейки</h2>
          </header>
          <ul className="catalog-more-list">
            {rest.map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={Math.min(i, 4) * 0.03}>
                  <Link to={`/catalog/${c.slug}`} className="catalog-more-item">
                    <div className="catalog-more-media" aria-hidden="true">
                      {c.cover ? <img src={c.cover} alt="" loading="lazy" /> : null}
                    </div>
                    <div>
                      <strong>{c.name}</strong>
                      <span>{modelsLabel(c.productSlugs?.length)}</span>
                    </div>
                    <em aria-hidden="true">→</em>
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
