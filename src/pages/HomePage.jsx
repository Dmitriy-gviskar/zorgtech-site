import { Link } from 'react-router-dom';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import RevealTitle from '../components/RevealTitle';
import ChapterMediaMotion from '../components/ChapterMediaMotion';
import StudioHoverMedia from '../components/StudioHoverMedia';
import DesignCompare from '../components/DesignCompare';
import DealerApplyButton from '../components/DealerApplyButton';
import LeadApplyButton from '../components/LeadApplyButton';
import DesignLabLeadForm from '../components/DesignLabLeadForm';
import HomeLeadForm from '../components/HomeLeadForm';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import { ruCount } from '../lib/data/content-utils.js';
import { HOME_SEO } from '../lib/seo-defaults.js';
import homeCatalog from '../data/home-catalog.json';
import homeBlocks from '../data/home-blocks.json';
import projectTeasers from '../data/project-teasers.json';
import { paths } from '../lib/paths.js';

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
  return ruCount(count, 'модель', 'модели', 'моделей');
}

function StatValue({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, Number(value) || 0, {
      duration: 1.35,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <strong ref={ref}>{display}</strong>;
}

export default function HomePage() {
  return (
    <div className="home">
      <Seo {...HOME_SEO} />
      <section className="home-hero home-hero--banner" aria-label="Zorgtech — интерактивное оборудование">
        <h1 className="home-hero-sr">
          ZORGTECH — российский производитель. Интерактивное оборудование премиального качества
        </h1>
        <div className="home-hero-banner-frame">
          <img
            className="home-hero-banner"
            src={assetUrl('/img/home/hero-3units-v4.png')}
            alt=""
            width={1376}
            height={768}
            decoding="async"
            fetchPriority="high"
          />
          <div className="home-hero-hits" aria-hidden="false">
            <Link className="home-hero-hit home-hero-hit--catalog" to="/catalog">
              <span className="home-hero-sr">В каталог</span>
            </Link>
            <LeadApplyButton className="home-hero-hit home-hero-hit--lead" source="главная — hero">
              <span className="home-hero-sr">Обсудить задачу</span>
            </LeadApplyButton>
          </div>
        </div>
        <div className="home-hero-cta home-hero-cta--mobile wrap">
          <Link className="btn primary btn--lg" to="/catalog">
            В каталог →
          </Link>
          <LeadApplyButton className="btn secondary btn--lg" source="главная — hero">
            Обсудить задачу
          </LeadApplyButton>
        </div>
      </section>

      {POPULAR.length ? (
        <section className="home-popular home-popular--cinema">
          <div className="wrap">
            <header className="home-sec-head home-sec-head--row">
              <RevealTitle kicker={homeBlocks.popular.kicker} title={homeBlocks.popular.title} />
              <Link className="btn secondary" to="/catalog">
                Каталог товаров
              </Link>
            </header>
          </div>

          <Reveal>
            <Link to={paths.product(POPULAR[0].slug)} className="home-popular-hero">
              <div className="home-popular-hero-media" aria-hidden="true">
                <StudioHoverMedia cover={POPULAR[0].cover} />
              </div>
              <div className="home-popular-hero-copy">
                <p className="chapter-kicker">Флагман</p>
                <h3>{POPULAR[0].title}</h3>
                {POPULAR[0].desc ? <p>{POPULAR[0].desc}</p> : null}
                <span className="home-popular-hero-cta">
                  {POPULAR[0].price} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </Reveal>

          {POPULAR.length > 1 ? (
            <div className="wrap">
              <div className="home-popular-rail">
                {POPULAR.slice(1).map((item, i) => (
                  <Reveal key={item.slug} delay={Math.min(i, 2) * 0.05}>
                    <Link to={paths.product(item.slug)} className="home-popular-rail-card">
                      <div className="home-popular-rail-media" aria-hidden="true">
                        <StudioHoverMedia cover={item.cover} />
                      </div>
                      <div className="home-popular-rail-copy">
                        <h3>{item.title}</h3>
                        {item.desc ? <p>{clip(item.desc, 72)}</p> : null}
                        <span>{item.price}</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="lines">
        <div className="wrap lines-inner">
          <RevealTitle kicker="Линейки" title="Оборудование по назначению" />
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
            <div className="lines-foot">
              <Link className="btn primary btn--lg" to="/catalog">
                Весь каталог
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="home-stats home-stats--cinema">
        <div className="wrap home-stats-inner">
          {homeBlocks.stats.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <div className="home-stat">
                <StatValue value={item.value} />
                <span>{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-about chapter chapter--soft chapter--home">
        <div className="chapter-media chapter-media--product" aria-hidden="true">
          <ChapterMediaMotion>
            {homeBlocks.about.media ? (
              <img src={assetUrl(homeBlocks.about.media)} alt="" loading="lazy" />
            ) : null}
          </ChapterMediaMotion>
        </div>
        <div className="chapter-copy">
          <RevealTitle kicker={homeBlocks.about.kicker} title={homeBlocks.about.title} />
          <Reveal delay={0.1}>
            <ul className="home-about-list">
              {homeBlocks.about.bullets.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="chapter-actions">
              <Link className="btn primary" to={homeBlocks.about.cta.to}>
                {homeBlocks.about.cta.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <HomeLeadForm />

      <section className="home-cycle" id="home-cycle">
        <div className="home-cycle-stage">
          <ChapterMediaMotion className="home-cycle-visual-motion">
            <div
              className="home-cycle-visual"
              style={
                homeBlocks.cycle.media
                  ? { backgroundImage: `url(${assetUrl(homeBlocks.cycle.media)})` }
                  : undefined
              }
              aria-hidden="true"
            />
          </ChapterMediaMotion>
          <div className="wrap home-cycle-stage-inner">
            <RevealTitle
              kicker={homeBlocks.cycle.kicker}
              title={homeBlocks.cycle.title}
              titleClassName="home-sec-title"
            />
            <Reveal delay={0.1}>
              <p className="home-block-lead">{homeBlocks.cycle.lead}</p>
            </Reveal>
          </div>
        </div>
        <div className="wrap home-cycle-body">
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
          <Reveal className="home-section-foot">
            <Link className="chapter-link" to={homeBlocks.cycle.cta.to}>
              {homeBlocks.cycle.cta.label} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="home-ui chapter chapter--soft chapter--home chapter--flip" id="home-ui">
        <div className="chapter-media" aria-hidden="true">
          <ChapterMediaMotion>
            {homeBlocks.ui.media ? (
              <img src={assetUrl(homeBlocks.ui.media)} alt="" loading="lazy" />
            ) : null}
          </ChapterMediaMotion>
        </div>
        <div className="chapter-copy home-ui-copy">
          <RevealTitle
            kicker={homeBlocks.ui.kicker}
            title={homeBlocks.ui.title}
            titleClassName="home-sec-title home-ui-title"
          />
          <Reveal delay={0.1} className="home-ui-body">
            <p className="chapter-line home-ui-lead">{homeBlocks.ui.lead}</p>
            <div className="home-ui-capabilities">
              {homeBlocks.ui.pointsLabel ? (
                <p className="home-ui-points-label">{homeBlocks.ui.pointsLabel}</p>
              ) : null}
              <ul className="home-ui-points">
                {homeBlocks.ui.points.map((item) => (
                  <li key={item}>{item.replace(/;?\s*$/, '')}</li>
                ))}
              </ul>
            </div>
            {homeBlocks.ui.outro ? <p className="home-ui-outro">{homeBlocks.ui.outro}</p> : null}
            <div className="chapter-actions">
              <Link className="btn primary" to={homeBlocks.ui.cta.to}>
                {homeBlocks.ui.cta.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="design-lab" id="design-lab">
        <div className="design-lab-inner">
          <Reveal className="design-lab-copy-wrap">
            <div className="design-lab-copy">
              <RevealTitle
                kicker="Конструкторское бюро"
                title="Разработка оборудования с нуля под ваши задачи"
                titleClassName="home-sec-title design-lab-title"
              />
              <p className="design-lab-text">
                Наше конструкторское бюро разрабатывает уникальное оборудование строго под ваши производственные
                задачи — от эскиза до готового изделия, а затем мы производим его на собственных мощностях,
                обеспечивая полный цикл, контроль качества и точное соответствие вашим требованиям.
              </p>
              <DesignLabLeadForm />
            </div>
          </Reveal>
          <Reveal className="design-lab-media" delay={0.08}>
            <DesignCompare />
            <p className="design-lab-hint">Тяните линию: влево — чертёж, вправо — стол</p>
          </Reveal>
        </div>
      </section>

      {MUSEUM ? (
        <section className="home-museum home-museum--cinema">
          <ChapterMediaMotion className="home-museum-visual-motion">
            <div
              className="home-museum-visual"
              style={
                MUSEUM.cover
                  ? { backgroundImage: `url(${assetUrl(MUSEUM.cover)})` }
                  : undefined
              }
              aria-hidden="true"
            />
          </ChapterMediaMotion>
          <div className="wrap home-museum-panel">
            <Reveal>
              <Link className="chapter-link home-museum-all chapter-link--light" to={homeBlocks.museum.all.to}>
                {homeBlocks.museum.all.label} <span aria-hidden="true">→</span>
              </Link>
              <RevealTitle kicker={homeBlocks.museum.kicker} title={homeBlocks.museum.title} />
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
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="shot-on">
        <div className="wrap">
          <RevealTitle kicker="Проекты" title="Оборудование в деле" />
          <div className="shot-on-grid">
            {projectTeasers.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 2) * 0.06} className={i === 0 ? 'span-2' : ''}>
                <Link to={paths.project(p.slug)} className={`shot-card${i === 0 ? ' shot-card--xl' : ''}`}>
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
            <Link className="chapter-link chapter-link--light" to={paths.projects}>
              Все проекты <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {BLOG.length ? (
        <section className="home-blog">
          <div className="wrap">
            <RevealTitle kicker={homeBlocks.blog.kicker} title={homeBlocks.blog.title} />
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
            {homeBlocks.blog.all?.href ? (
              <Reveal>
                <div className="home-section-foot">
                  <a
                    className="chapter-link"
                    href={homeBlocks.blog.all.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {homeBlocks.blog.all.label || 'Все материалы'} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="home-begin">
        <div className="wrap">
          <div className="home-begin-banner">
            <div className="home-begin-copy">
              <RevealTitle kicker={homeBlocks.begin.kicker} title={homeBlocks.begin.title} />
              {homeBlocks.begin.cta ? (
                <DealerApplyButton className="btn primary" source="главная">
                  {homeBlocks.begin.cta.label}
                </DealerApplyButton>
              ) : null}
            </div>
            {homeBlocks.begin.media?.length ? (
              <div className="home-begin-stage" aria-hidden="true">
                {homeBlocks.begin.media.map((src) => (
                  <img key={src} src={assetUrl(src)} alt="" loading="lazy" />
                ))}
              </div>
            ) : null}
          </div>
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
              <span className="home-cta-line">Производство в России.</span>
              <span className="home-cta-line">Полный цикл.</span>
            </p>
            <p className="home-cta-lead">
              Проектируем, производим и обслуживаем сенсорные системы для бизнеса, государства и образования.
            </p>
            <div className="hero-actions">
              <LeadApplyButton className="btn primary btn--lg" source="главная — финальный блок">
                Обсудить задачу
              </LeadApplyButton>
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
