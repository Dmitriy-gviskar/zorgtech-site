import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import DesignCompare from '../components/DesignCompare';
import HomeHero from '../components/HomeHero';
import {
  assetUrl,
  categoryList,
  getProduct,
  productCover,
  productGallery,
  projects,
} from '../lib/data';

/** Studio frame: 0 = front (straight), 1 = 3/4. Prefer front for clean card fit. */
function studioShot(product, preferIndex = 0) {
  const gallery = productGallery(product);
  return gallery[preferIndex] || gallery[0] || productCover(product);
}

/** From zorgtech.com home — company pillars, not more product cards. */
const HOME_PILLARS = [
  {
    href: '#company',
    title: 'Полный цикл производства интерактивного оборудования',
    icon: 'cycle',
  },
  {
    href: '#design',
    title: 'Дизайн интерактивных интерфейсов',
    icon: 'touch',
  },
  {
    href: '#design',
    title: 'Дизайн и проектирование оборудования под заказ',
    icon: 'gear',
  },
  {
    href: '#projects',
    title: 'Интеграция и реализация проектов под ключ',
    icon: 'key',
  },
];

/** Representative cover product per line (not always first slug in category). */
const LINE_COVER_SLUG = {
  napolnye: 'diamant-32-fe',
  stoly: 'diamant-55-n',
  nastennyy: 'diamant-32-w',
  ulichnye: 'diamant-46-f-outdoor',
  apriori: 'apriori-22',
  'kioski-samoobsluzhivaniya': 'diamant-32-w-pay',
};

const LINE_LINKS = ['napolnye', 'stoly', 'nastennyy', 'ulichnye', 'apriori', 'kioski-samoobsluzhivaniya']
  .map((slug) => categoryList().find((c) => c.slug === slug))
  .filter(Boolean)
  .map((c) => {
    const coverProduct = getProduct(LINE_COVER_SLUG[c.slug]) || getProduct(c.productSlugs?.[0]);
    return {
      ...c,
      cover: coverProduct ? studioShot(coverProduct, 0) : null,
    };
  });

function clip(text, max = 110) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function modelsLabel(count) {
  const n = count || 0;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} модель`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} модели`;
  return `${n} моделей`;
}

export default function HomePage() {
  const projectTeaser = [...projects]
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0))
    .slice(0, 3);

  return (
    <div className="home">
      <HomeHero />

      <nav className="home-pillars" aria-label="Возможности компании">
        <div className="wrap home-pillars-inner">
          {HOME_PILLARS.map((item) => (
            <a key={item.title} className="home-pillar" href={item.href}>
              <span className={`home-pillar-icon home-pillar-icon--${item.icon}`} aria-hidden="true" />
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </nav>

      <section className="design-lab" id="design">
        <div className="wrap design-lab-inner">
          <Reveal>
            <div className="design-lab-copy">
              <p className="chapter-kicker">Конструкторское бюро</p>
              <h2 className="home-sec-title">Промышленный дизайн и проектирование</h2>
              <p className="design-lab-mini">сенсорных терминалов</p>
              <p className="design-lab-text">
                Наше конструкторское бюро выполняет инженерные разработки и предоставляет весь комплекс услуг
                по проектированию, подготовке к производству и изготовлению интерактивного оборудования.
              </p>
              <p className="design-lab-text">
                Промышленный дизайн и 3D моделирование; инженерное 3D конструирование; выпуск конструкторской
                документации.
              </p>
              <p className="design-lab-hint">Тяните линию: влево — стол, вправо — чертёж</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <DesignCompare />
          </Reveal>
        </div>
      </section>

      <section className="lines" id="catalog">
        <div className="wrap lines-inner">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Каталог</p>
              <h2 className="home-sec-title">Линейки по назначению</h2>
            </header>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="lines-tiles">
              {LINE_LINKS.map((c) => (
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
          </Reveal>
          <Reveal delay={0.1}>
            <Link className="chapter-link" to="/catalog">
              Весь каталог <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="shot-on" id="projects">
        <div className="wrap">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Проекты</p>
              <h2 className="home-sec-title">Оборудование в деле</h2>
            </header>
          </Reveal>
          <div className="shot-on-grid">
            {projectTeaser.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 2) * 0.06} className={i === 0 ? 'span-2' : ''}>
                <Link to={`/projects/${p.slug}`} className={`shot-card${i === 0 ? ' shot-card--xl' : ''}`}>
                  <div className="shot-card-media">
                    {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="shot-card-body">
                    <span>Проект</span>
                    <h3>{clip(p.title, 64)}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link className="chapter-link chapter-link--light" to="/projects">
              Все проекты <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="home-cta" id="company">
        <div className="wrap home-cta-inner">
          <Reveal>
            <p className="chapter-kicker">Компания</p>
            <h2 className="home-cta-brand">ZORGTECH</h2>
            <p className="home-sec-title home-cta-title">Производство в России. Полный цикл.</p>
            <p className="home-cta-lead">
              Проектируем, производим и обслуживаем сенсорные системы для бизнеса, государства и образования.
            </p>
            <div className="hero-actions">
              <Link className="btn primary btn--lg" to="/contacts">
                Обсудить задачу
              </Link>
              <Link className="btn secondary btn--lg" to="/about">
                О компании
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
