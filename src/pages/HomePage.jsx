import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Reveal from '../components/Reveal';
import { assetUrl, categoryList, getProduct, productCover, products, projects, solutions, areas } from '../lib/data';

const HERO_PRODUCT = getProduct('diamant-32-fe') || getProduct('diamant-43-f') || Object.values(products)[0];
const FLOAT_PRODUCTS = ['diamant-32-fe', 'diamant-55-n', 'diamant-32-w', 'diamant-46-f-outdoor']
  .map(getProduct)
  .filter(Boolean);

const FEATURED_CATS = ['napolnye', 'stoly', 'nastennyy', 'ulichnye', 'apriori', 'kioski-samoobsluzhivaniya'];
const MARQUEE = [
  'Diamant F',
  'Diamant N',
  'Diamant W',
  'Apriori',
  'Mono',
  'Outdoor IP65',
  'Logicmap',
  'Музейный гид',
  'Медкиоск',
  'Самообслуживание',
];

function clip(text, max = 110) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const cats = categoryList()
    .filter((c) => FEATURED_CATS.includes(c.slug))
    .sort((a, b) => FEATURED_CATS.indexOf(a.slug) - FEATURED_CATS.indexOf(b.slug));
  const restCats = categoryList().filter((c) => !FEATURED_CATS.includes(c.slug));
  const popular = ['diamant-32-fe', 'diamant-55-n', 'diamant-32-w', 'diamant-46-f-outdoor', 'apriori-22', 'mono-32-f']
    .map(getProduct)
    .filter(Boolean);
  const projectTeaser = [...projects]
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0))
    .slice(0, 4);
  const solutionTeaser = solutions.slice(0, 6);

  return (
    <div className="home">
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-media" style={{ y: mediaY, scale: mediaScale }} aria-hidden="true">
          <div className="hero-bg" />
          <div className="hero-shade" />
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className="hero-noise" />
        </motion.div>

        <div className="hero-layout">
          <motion.div className="hero-copy" style={{ opacity: copyOpacity }}>
            <motion.p
              className="hero-brand"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Zorgtech
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              Интерактивное оборудование
              <span> полного цикла</span>
            </motion.h1>
            <motion.p
              className="hero-lead"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
            >
              Сенсорные киоски, столы и терминалы для бизнеса, государства и образования.
              Проектируем, производим, программируем и обслуживаем.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
            >
              <Link className="btn primary btn-glow" to="/catalog">Смотреть продукцию</Link>
              <Link className="btn ghost" to="/projects">Смотреть проекты</Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-product"
            aria-hidden="true"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <img src={productCover(HERO_PRODUCT)} alt="" />
          </motion.div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="band band-soft">
        <div className="wrap proof">
          <Reveal><div><strong>{Object.keys(products).length}</strong><span>моделей в каталоге</span></div></Reveal>
          <Reveal delay={0.05}><div><strong>{projects.length}</strong><span>реализованных проектов</span></div></Reveal>
          <Reveal delay={0.1}><div><strong>{solutions.length}</strong><span>готовых решений</span></div></Reveal>
          <Reveal delay={0.15}><div><strong>{areas.length}</strong><span>областей применения</span></div></Reveal>
        </div>
      </section>

      <section className="wrap sec showcase">
        <Reveal>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Флагман</p>
              <h2>Железо, которое выглядит как продукт будущего</h2>
            </div>
          </div>
        </Reveal>
        <div className="showcase-stage">
          {FLOAT_PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link to={`/product/${p.slug}`} className="showcase-card">
                <div className="showcase-card-media">
                  <img src={productCover(p)} alt={p.title} loading="lazy" />
                </div>
                <span>{p.title}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <Reveal>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Продукция</p>
              <h2>Линейки оборудования</h2>
            </div>
            <Link className="text-link" to="/catalog">Весь каталог</Link>
          </div>
        </Reveal>
        <div className="cat-grid">
          {cats.map((c, i) => {
            const cover = productCover(c.productSlugs?.[0]) || assetUrl(c.image);
            return (
              <Reveal key={c.slug} delay={Math.min(i, 3) * 0.04} className={i === 0 ? 'span-2' : undefined}>
                <Link to={`/catalog/${c.slug}`} className={`cat-tile${i === 0 ? ' cat-tile--wide' : ''}`}>
                  <div className="cat-tile-media">
                    {cover ? <img src={cover} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="cat-tile-body">
                    <h3>{c.name}</h3>
                    <p>{c.productSlugs?.length || 0} моделей</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
        {restCats.length ? (
          <Reveal>
            <div className="pill-row">
              {restCats.map((c) => (
                <Link key={c.slug} to={`/catalog/${c.slug}`} className="pill">{c.name}</Link>
              ))}
            </div>
          </Reveal>
        ) : null}
      </section>

      <section className="wrap sec">
        <Reveal>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Каталог</p>
              <h2>Проверенные модели</h2>
            </div>
          </div>
        </Reveal>
        <div className="product-grid">
          {popular.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 3) * 0.04}>
              <Link to={`/product/${p.slug}`} className="product-card">
                <div className="product-card-media">
                  {productCover(p) ? <img src={productCover(p)} alt={p.title} loading="lazy" /> : null}
                </div>
                <div className="product-card-body">
                  <h3>{p.title}</h3>
                  <p>{clip(p.lead, 90)}</p>
                  <span className="meta">{p.price}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band band-dark sec">
        <div className="wrap">
          <Reveal>
            <div className="sec-head sec-head--dark">
              <div>
                <p className="eyebrow">Проекты</p>
                <h2>Оборудование в деле</h2>
              </div>
              <Link className="text-link light" to="/projects">Все проекты</Link>
            </div>
          </Reveal>
          <div className="project-grid project-grid--cinema">
            {projectTeaser.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 2) * 0.05} className={i === 0 ? 'span-2' : undefined}>
                <Link to={`/projects/${p.slug}`} className={`project-card${i === 0 ? ' project-card--xl' : ''}`}>
                  <div className="project-card-media">
                    {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="project-card-body">
                    <span className="eyebrow">Кейс</span>
                    <h3>{clip(p.title, 72)}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <Reveal>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Решения</p>
              <h2>Софт и сценарии под ключ</h2>
            </div>
            <Link className="text-link" to="/solutions">Все решения</Link>
          </div>
        </Reveal>
        <div className="solution-grid">
          {solutionTeaser.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i, 3) * 0.04}>
              <Link to={`/solutions/${s.slug}`} className="solution-card">
                <h3>{s.title}</h3>
                <p>{clip(s.lead, 100)}</p>
                <span className="meta">Подробнее</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap sec finale">
        <Reveal>
          <div className="finale-copy">
            <p className="eyebrow">О компании</p>
            <h2>Производство в России. Полный цикл.</h2>
            <p>
              Более 13 лет проектируем и выпускаем сенсорные системы для музеев, банков, ритейла,
              медицины и госсектора. Собственное производство, готовый софт и сервис по стране.
            </p>
            <div className="hero-actions">
              <Link className="btn primary btn-glow" to="/about">О компании</Link>
              <Link className="btn" to="/contacts">Обсудить задачу</Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="finale-aside">
            <Link to="/areas">Области применения</Link>
            <Link to="/delivery">Доставка и сервис</Link>
            <Link to="/rent">Аренда оборудования</Link>
            <Link to="/support">Поддержка</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
