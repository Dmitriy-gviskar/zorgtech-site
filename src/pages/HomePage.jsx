import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Reveal from '../components/Reveal';
import { assetUrl, categoryList, getProduct, productCover, products, projects } from '../lib/data';

const HERO_PRODUCT = getProduct('diamant-32-fe') || getProduct('diamant-43-f') || Object.values(products)[0];

const CHAPTERS = [
  { slug: 'diamant-32-fe', kicker: 'Флагман', tone: 'dark' },
  { slug: 'diamant-55-n', kicker: 'Сенсорный стол', tone: 'light' },
  { slug: 'diamant-46-f-outdoor', kicker: 'Уличный', tone: 'dark' },
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

function modelsLabel(count) {
  const n = count || 0;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} модель`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} модели`;
  return `${n} моделей`;
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            ZORGTECH
          </motion.h1>
          <motion.p
            className="hero-product-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            {HERO_PRODUCT?.title || 'Diamant'}
          </motion.p>
          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          >
            Интерактивное оборудование полного цикла
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
          >
            {HERO_PRODUCT ? (
              <Link className="btn primary btn--lg" to={`/product/${HERO_PRODUCT.slug}`}>
                Смотреть модель
              </Link>
            ) : null}
            <Link className="btn ghost btn--lg" to="/catalog">
              Вся продукция
            </Link>
          </motion.div>
        </motion.div>

        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
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
              <h2 className="chapter-title">{chapter.product.title}</h2>
              <p className="chapter-line">{clip(chapter.product.lead, 140)}</p>
              <Link className="chapter-link" to={`/product/${chapter.product.slug}`}>
                Подробнее <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="lines">
        <div className="wrap lines-inner">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Линейки</p>
              <h2 className="home-sec-title">Оборудование по назначению</h2>
            </header>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="lines-list">
              {LINE_LINKS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/catalog/${c.slug}`}>
                    <span>{c.name}</span>
                    <em>{modelsLabel(c.productSlugs?.length)}</em>
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

      <section className="shot-on">
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

      <section className="home-cta">
        <div className="wrap home-cta-inner">
          <Reveal>
            <header className="home-sec-head">
              <p className="chapter-kicker">Компания</p>
              <h2 className="home-sec-title">Производство в России. Полный цикл.</h2>
            </header>
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
