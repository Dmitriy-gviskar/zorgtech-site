import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { assetUrl, getProduct, productCover, productGallery } from '../lib/data';

function studioShot(product, preferIndex = 0) {
  const gallery = productGallery(product);
  return gallery[preferIndex] || gallery[0] || productCover(product);
}

const SLIDES = [
  {
    slug: 'diamant-32-fe',
    kicker: 'Флагманская модель',
    tag: 'Премиальный дизайн и стекло',
    label: 'Diamant 32 FE',
  },
  {
    slug: 'diamant-55-n',
    kicker: 'Сенсорный стол',
    tag: 'Максимальный экран в металле',
    label: 'Diamant 55 N',
  },
  {
    slug: 'diamant-46-f-outdoor',
    kicker: 'Уличное исполнение',
    tag: 'Всепогодный терминал',
    label: 'Diamant 46 F Outdoor',
  },
]
  .map((item) => {
    const product = getProduct(item.slug);
    if (!product) return null;
    return {
      ...item,
      product,
      src: studioShot(product, 0),
      title: product.title || item.label,
    };
  })
  .filter(Boolean);

const INTERVAL_MS = 6500;

export default function HomeHero() {
  const heroRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index] || SLIDES[0];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (paused || SLIDES.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, index]);

  if (!slide) return null;

  const go = (next) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      className="hero hero--cinema"
      ref={heroRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <motion.div className="hero-stage" style={{ y: mediaY, scale: mediaScale }} aria-hidden="true">
        <div className="hero-stage-bg" />
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.slug}
            className="hero-stage-product"
            src={assetUrl(slide.src)}
            alt=""
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div className="hero-stage-veil" />
        <div className="hero-stage-floor" />
      </motion.div>

      <motion.div className="hero-copy" style={{ opacity: copyOpacity }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.slug}
            className="hero-copy-inner"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero-brand-mark">ZORGTECH</p>
            <p className="hero-kicker">{slide.kicker}</p>
            <h1 className="hero-product-name">{slide.title}</h1>
            <p className="hero-lead">{slide.tag}</p>
            <div className="hero-actions">
              <Link className="btn ghost btn--lg" to={`/product/${slide.product.slug}`}>
                Подробнее →
              </Link>
              <Link className="btn primary btn--lg" to="/catalog">
                В каталог →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <nav className="hero-rail" aria-label="Модели в hero">
        {SLIDES.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            className={`hero-rail-btn${i === index ? ' is-active' : ''}`}
            onClick={() => setIndex(i)}
            aria-current={i === index ? 'true' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="hero-arrows" aria-hidden="false">
        <button type="button" className="hero-arrow" onClick={() => go(index - 1)} aria-label="Предыдущий слайд">
          ‹
        </button>
        <button type="button" className="hero-arrow" onClick={() => go(index + 1)} aria-label="Следующий слайд">
          ›
        </button>
      </div>

      <div className="hero-progress" aria-hidden="true">
        <i key={slide.slug} style={{ animationDuration: `${INTERVAL_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
      </div>
    </section>
  );
}
