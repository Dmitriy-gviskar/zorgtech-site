import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Reveal from '../components/Reveal';
import { assetUrl, categoryList, getProduct, productCover, products, projects } from '../lib/data';

const HERO_PRODUCT = getProduct('diamant-32-fe') || getProduct('diamant-43-f') || Object.values(products)[0];

const CHAPTERS = [
  { slug: 'diamant-32-fe', kicker: 'Flagship', tone: 'dark' },
  { slug: 'diamant-55-n', kicker: 'Touch table', tone: 'light' },
  { slug: 'diamant-46-f-outdoor', kicker: 'Outdoor', tone: 'dark' },
  { slug: 'apriori-22', kicker: 'Apriori', tone: 'light' },
]
  .map((item) => ({ ...item, product: getProduct(item.slug) }))
  .filter((item) => item.product);

const LINE_LINKS = ['napolnye', 'stoly', 'nastennyy', 'ulichnye', 'apriori', 'kioski-samoobsluzhivaniya']
  .map((slug) => categoryList().find((c) => c.slug === slug))
  .filter(Boolean);

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
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const projectTeaser = [...projects]
    .sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0))
    .slice(0, 3);

  return (
    <div className="home">
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-stage" style={{ y: mediaY, scale: mediaScale }} aria-hidden="true">
          <div className="hero-stage-bg" />
          {HERO_PRODUCT ? (
            <img className="hero-stage-product" src={productCover(HERO_PRODUCT)} alt="" />
          ) : null}
          <div className="hero-stage-veil" />
        </motion.div>

        <motion.div className="hero-copy" style={{ opacity: copyOpacity }}>
          <motion.h1
            className="hero-brand"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            ZORGTECH
          </motion.h1>
          <motion.p
            className="hero-product-name"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {HERO_PRODUCT?.title || 'Diamant'}
          </motion.p>
          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            Интерактивное оборудование полного цикла
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
          >
            {HERO_PRODUCT ? (
              <Link className="btn primary" to={`/product/${HERO_PRODUCT.slug}`}>
                Подробнее
              </Link>
            ) : null}
            <Link className="btn ghost" to="/catalog">
              Вся продукция
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.slug}
          className={`chapter chapter--${chapter.tone}${index % 2 ? ' chapter--flip' : ''}`}
        >
          <div className="chapter-media" aria-hidden="true">
            <img src={productCover(chapter.product)} alt="" loading="lazy" />
          </div>
          <div className="chapter-copy">
            <Reveal>
              <p className="chapter-kicker">{chapter.kicker}</p>
              <h2>{chapter.product.title}</h2>
              <p className="chapter-line">{clip(chapter.product.lead, 150)}</p>
              <Link className="chapter-link" to={`/product/${chapter.product.slug}`}>
                Подробнее
              </Link>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="lines">
        <div className="wrap lines-inner">
          <Reveal>
            <p className="chapter-kicker">Product lines</p>
            <h2>Линейки оборудования</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="lines-list">
              {LINE_LINKS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/catalog/${c.slug}`}>
                    <span>{c.name}</span>
                    <em>{c.productSlugs?.length || 0}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <Link className="chapter-link" to="/catalog">
              Весь каталог
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="shot-on">
        <div className="wrap">
          <Reveal>
            <p className="chapter-kicker">Projects</p>
            <h2>Оборудование в деле</h2>
          </Reveal>
          <div className="shot-on-grid">
            {projectTeaser.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 2) * 0.06} className={i === 0 ? 'span-2' : ''}>
                <Link to={`/projects/${p.slug}`} className={`shot-card${i === 0 ? ' shot-card--xl' : ''}`}>
                  <div className="shot-card-media">
                    {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="shot-card-body">
                    <span>Project</span>
                    <h3>{clip(p.title, 64)}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link className="chapter-link chapter-link--light" to="/projects">
              Все проекты
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="home-cta">
        <div className="wrap home-cta-inner">
          <Reveal>
            <p className="chapter-kicker">Zorgtech</p>
            <h2>Производство в России. Полный цикл.</h2>
            <p>
              Проектируем, производим и обслуживаем сенсорные системы для бизнеса, государства и образования.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/contacts">
                Обсудить задачу
              </Link>
              <Link className="btn" to="/about">
                О компании
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
