import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Reveal from '../components/Reveal';
import DesignCompare from '../components/DesignCompare';
import { assetUrl } from '../lib/data/asset.js';
import homeCatalog from '../data/home-catalog.json';
import homeBlocks from '../data/home-blocks.json';
import projectTeasers from '../data/project-teasers.json';

const TOP_PRODUCTS = homeCatalog.topProducts || [];
const LINE_LINKS = homeCatalog.lines || [];
const POPULAR = homeCatalog.popular || [];
const BLOG = homeCatalog.blog || [];
const MUSEUM = homeCatalog.museum || null;

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

function scrollToHomeSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (typeof history !== 'undefined' && history.replaceState) {
    history.replaceState(null, '', `#${id}`);
  }
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.035]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div className="home">
      <section className="hero hero--studio hero--brand" ref={heroRef}>
        <motion.div className="hero-stage" style={{ y: mediaY, scale: mediaScale }} aria-hidden="true">
          <div className="hero-stage-bg" />
          <div className="hero-stage-veil" />
        </motion.div>

        <motion.div className="hero-copy" style={{ opacity: copyOpacity }}>
          <motion.div
            className="hero-brand-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            aria-hidden="true"
          />
          <h1 className="hero-brand" aria-label="Zorgtech">
            {'ZORGTECH'.split('').map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                className="hero-brand-letter"
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 1.25,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.45 + i * 0.12,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="hero-company"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.7 }}
          >
            Российский производитель
          </motion.p>
          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 2.0 }}
          >
            Интерактивное оборудование полного цикла
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 2.35 }}
          >
            <Link className="btn primary btn--lg" to="/catalog">
              В каталог →
            </Link>
            <Link className="btn secondary btn--lg" to="/contacts">
              Обсудить задачу
            </Link>
          </motion.div>
        </motion.div>

        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <section className="home-props" aria-label="Ключевые направления">
        <div className="wrap">
          <ul className="home-props-list">
            {homeBlocks.props.map((item, i) => (
              <li key={item.target}>
                <a
                  className="home-prop"
                  href={`#${item.target}`}
                  style={{ '--prop-delay': `${i * 0.12}s` }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHomeSection(item.target);
                  }}
                >
                  <span className="home-prop-dot" aria-hidden="true" />
                  <span className="home-prop-label">{item.label}</span>
                  <span className="home-prop-go" aria-hidden="true">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="feature-strip">
        <div className="wrap feature-strip-inner">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Топ модели</p>
              <h2 className="home-sec-title">Выбор для сильных проектов</h2>
            </header>
          </Reveal>
          <div className="feature-grid">
            {TOP_PRODUCTS.map((item, i) => (
              <Reveal key={item.slug} delay={Math.min(i, 3) * 0.05}>
                <Link to={`/product/${item.slug}`} className="feature-card">
                  <div className="feature-card-copy">
                    <p className="feature-card-kicker">{item.kicker}</p>
                    <h3 className="feature-card-title">{item.title}</h3>
                    {item.tag ? <p className="feature-card-tag">{item.tag}</p> : null}
                    <div className="category-product-meta">
                      <span className="category-product-price">{item.price}</span>
                      {item.gift ? <span className="product-gift">ПО в подарок</span> : null}
                    </div>
                    <span className="feature-card-cta">
                      Подробнее <span aria-hidden="true">→</span>
                    </span>
                  </div>
                  <div className="feature-card-media" aria-hidden="true">
                    {item.cover ? <img src={assetUrl(item.cover)} alt="" loading="lazy" /> : null}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="lines">
        <div className="wrap lines-inner">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Линейки</p>
              <h2 className="home-sec-title">Оборудование по назначению</h2>
            </header>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="lines-tiles">
              {LINE_LINKS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/catalog/${c.slug}`} className="line-tile">
                    <div className="line-tile-body">
                      <h3>{c.name}</h3>
                      <em>{modelsLabel(c.modelCount)}</em>
                      <span className="line-tile-cta">
                        Смотреть <span aria-hidden="true">→</span>
                      </span>
                    </div>
                    <div className="line-tile-media" aria-hidden="true">
                      {c.cover ? <img src={assetUrl(c.cover)} alt="" loading="lazy" /> : null}
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

      <section className="home-stats">
        <div className="wrap home-stats-inner">
          {homeBlocks.stats.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <div className="home-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-about">
        <div className="wrap">
          <Reveal>
            <div className="home-copy">
              <header className="home-sec-head">
                <p className="chapter-kicker">{homeBlocks.about.kicker}</p>
                <h2 className="home-sec-title">{homeBlocks.about.title}</h2>
              </header>
              <ul className="home-about-list">
                {homeBlocks.about.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="btn secondary" to={homeBlocks.about.cta.to}>
                {homeBlocks.about.cta.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="home-cycle" id="home-cycle">
        <div className="wrap">
          <Reveal>
            <header className="home-sec-head home-copy">
              <p className="chapter-kicker">{homeBlocks.cycle.kicker}</p>
              <h2 className="home-sec-title">{homeBlocks.cycle.title}</h2>
              <p className="home-block-lead">{homeBlocks.cycle.lead}</p>
            </header>
          </Reveal>
          <div className="home-cycle-grid">
            {homeBlocks.cycle.pillars.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <article className="home-cycle-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link className="chapter-link" to={homeBlocks.cycle.cta.to}>
              {homeBlocks.cycle.cta.label} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="home-ui" id="home-ui">
        <div className="wrap">
          <Reveal>
            <div className="home-copy">
              <header className="home-sec-head">
                <p className="chapter-kicker">{homeBlocks.ui.kicker}</p>
                <h2 className="home-sec-title">{homeBlocks.ui.title}</h2>
              </header>
              <p className="home-block-lead">{homeBlocks.ui.lead}</p>
              <ul className="home-ui-points">
                {homeBlocks.ui.points.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="chapter-link" to={homeBlocks.ui.cta.to}>
                {homeBlocks.ui.cta.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="design-lab" id="design-lab">
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

      <section className="home-sensor" id="home-sensor">
        <div className="wrap">
          <Reveal>
            <div className="home-copy">
              <header className="home-sec-head">
                <p className="chapter-kicker">{homeBlocks.sensor.kicker}</p>
                <h2 className="home-sec-title">{homeBlocks.sensor.title}</h2>
              </header>
              <p className="home-block-lead">{homeBlocks.sensor.text}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {POPULAR.length ? (
        <section className="home-popular">
          <div className="wrap">
            <Reveal>
              <header className="home-sec-head home-sec-head--row">
                <div>
                  <p className="chapter-kicker">{homeBlocks.popular.kicker}</p>
                  <h2 className="home-sec-title">{homeBlocks.popular.title}</h2>
                </div>
                <Link className="btn primary" to="/catalog">
                  Каталог товаров
                </Link>
              </header>
            </Reveal>
            <div className="home-popular-grid">
              {POPULAR.map((item, i) => (
                <Reveal key={item.slug} delay={Math.min(i, 3) * 0.05}>
                  <Link to={`/product/${item.slug}`} className="home-popular-card">
                    <div className="home-popular-media" aria-hidden="true">
                      {item.cover ? <img src={assetUrl(item.cover)} alt="" loading="lazy" /> : null}
                    </div>
                    <div className="home-popular-copy">
                      <h3>{item.title}</h3>
                      {item.desc ? <p>{clip(item.desc, 90)}</p> : null}
                      <span className="category-product-price">{item.price}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {MUSEUM ? (
        <section className="home-museum">
          <div className="wrap home-museum-inner">
            <Reveal>
              <div className="home-museum-copy">
                <Link className="chapter-link home-museum-all" to={homeBlocks.museum.all.to}>
                  {homeBlocks.museum.all.label} <span aria-hidden="true">→</span>
                </Link>
                <p className="chapter-kicker">{homeBlocks.museum.kicker}</p>
                <h2 className="home-sec-title">{homeBlocks.museum.title}</h2>
                <p className="home-block-lead">{homeBlocks.museum.text}</p>
                <p className="home-museum-uses-label">{homeBlocks.museum.usesLabel}</p>
                <ul className="home-museum-uses">
                  {homeBlocks.museum.uses.map((item) => (
                    <li key={item.to}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
                <Link className="btn primary" to={homeBlocks.museum.cta.to}>
                  {homeBlocks.museum.cta.label}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="home-museum-media" aria-hidden="true">
                {MUSEUM.cover || MUSEUM.productCover ? (
                  <img src={assetUrl(MUSEUM.cover || MUSEUM.productCover)} alt="" loading="lazy" />
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="shot-on">
        <div className="wrap">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Проекты</p>
              <h2 className="home-sec-title">Оборудование в деле</h2>
            </header>
          </Reveal>
          <div className="shot-on-grid">
            {projectTeasers.map((p, i) => (
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

      {BLOG.length ? (
        <section className="home-blog">
          <div className="wrap">
            <Reveal>
              <header className="home-sec-head">
                <p className="chapter-kicker">{homeBlocks.blog.kicker}</p>
                <h2 className="home-sec-title">{homeBlocks.blog.title}</h2>
              </header>
            </Reveal>
            <div className="home-blog-grid">
              {BLOG.map((post, i) => (
                <Reveal key={post.slug} delay={Math.min(i, 2) * 0.05}>
                  <a
                    className="home-blog-card"
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {post.image ? (
                      <div className="home-blog-media" aria-hidden="true">
                        <img src={assetUrl(post.image)} alt="" loading="lazy" />
                      </div>
                    ) : null}
                    <div className="home-blog-copy">
                      {post.date ? <time>{post.date}</time> : null}
                      <h3>{post.title}</h3>
                      {post.excerpt ? <p>{clip(post.excerpt, 140)}</p> : null}
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-begin">
        <div className="wrap">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">{homeBlocks.begin.kicker}</p>
              <h2 className="home-sec-title">{homeBlocks.begin.title}</h2>
            </header>
          </Reveal>
          <div className="home-begin-grid">
            {homeBlocks.begin.paths.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <article className="home-begin-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.external ? (
                    <a className="btn secondary" href={item.href}>
                      {item.label}
                    </a>
                  ) : (
                    <Link className="btn secondary" to={item.to}>
                      {item.label}
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="wrap home-cta-inner">
          <Reveal>
            <p className="chapter-kicker">Компания</p>
            <h2 className="home-cta-brand">ZORGTECH</h2>
            <p className="home-sec-title home-cta-title">
              Производство в России.
              <br />
              Полный цикл.
            </p>
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
