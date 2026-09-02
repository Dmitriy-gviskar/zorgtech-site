import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import Lightbox from '../components/Lightbox';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import {
  getProduct,
  presentProduct,
  productCover,
  productGallery,
} from '../lib/data/catalog.js';
import { getProject, presentProject, relatedProjects } from '../lib/data/projects.js';
import { paths } from '../lib/paths.js';
import NotFoundPage from './NotFoundPage';

function studioCover(product) {
  if (!product) return null;
  const gallery = productGallery(product);
  return gallery[0] || productCover(product);
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const [shot, setShot] = useState(-1);

  if (!project) return <NotFoundPage />;

  const copy = presentProject(project);
  const hero = copy.images[0];
  const gallery = copy.images.slice(1, 10);
  const shots = (hero ? [hero, ...gallery] : gallery).map((src) => assetUrl(src));
  const used = (copy.usedProducts || project.usedProducts || [])
    .map((u) => getProduct(u.slug) || u)
    .filter(Boolean);
  const more = relatedProjects(project.slug, 3).map((p) => ({
    raw: p,
    copy: presentProject(p),
  }));

  return (
    <div className="page detail-page project-detail">
      <Seo
        title={project.meta?.title || copy.title}
        description={project.meta?.description || copy.lead || copy.task || ''}
        path={paths.project(project.slug)}
        image={project.meta?.image || hero || undefined}
      />
      <p className="crumbs">
        <Link to={paths.projects}>Проекты</Link>
        <span aria-hidden="true"> / </span>
        {copy.title}
      </p>

      <header className="detail-hero project-hero">
        <div className="detail-hero-copy">
          <p className="chapter-kicker">Проект</p>
          <h1>{copy.title}</h1>
          {copy.lead ? <p className="lead">{copy.lead}</p> : null}
          <div className="actions">
            <Link className="btn primary btn--lg" to="/contacts">
              Обсудить похожий проект
            </Link>
            <Link className="btn secondary btn--lg" to={paths.projects}>
              Все проекты
            </Link>
          </div>
        </div>
        {hero ? (
          <button type="button" className="detail-hero-media gallery-zoom" onClick={() => setShot(0)} aria-label="Открыть изображение">
            <img src={assetUrl(hero)} alt="" />
          </button>
        ) : null}
      </header>

      {(copy.task || copy.solution.length) ? (
        <div className="project-split">
          {copy.task ? (
            <Reveal>
              <section className="project-panel project-panel--task">
                <p className="chapter-kicker">Задача</p>
                <h2>Что нужно было решить</h2>
                <p>{copy.task}</p>
              </section>
            </Reveal>
          ) : null}
          {copy.solution.length ? (
            <Reveal delay={0.05}>
              <section className="project-panel project-panel--solution">
                <p className="chapter-kicker">Решение</p>
                <h2>Как реализовали</h2>
                <div className="project-panel-prose">
                  {copy.solution.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}
        </div>
      ) : null}

      {copy.sections.length ? (
        <div className="solution-blocks">
          {copy.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={Math.min(i, 4) * 0.04}>
              <section className="solution-block">
                <header className="sec-head">
                  <p className="chapter-kicker">{String(i + 1).padStart(2, '0')}</p>
                  <h2>{sec.title}</h2>
                </header>
                {sec.paragraphs?.length ? (
                  <div className="solution-story solution-story--compact">
                    {sec.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </div>
                ) : null}
              </section>
            </Reveal>
          ))}
        </div>
      ) : null}

      {gallery.length ? (
        <section className="solution-gallery-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Галерея</p>
            <h2>Кадры проекта</h2>
          </header>
          <div className="solution-gallery project-gallery">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                className="solution-gallery-shot gallery-zoom"
                onClick={() => setShot(hero ? i + 1 : i)}
                aria-label="Открыть изображение"
              >
                <img src={assetUrl(src)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {shot >= 0 ? (
        <Lightbox images={shots} index={shot} onIndex={setShot} onClose={() => setShot(-1)} />
      ) : null}

      {used.length ? (
        <section className="project-used-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Оборудование</p>
            <h2>Использованные модели</h2>
          </header>
          <ul className="project-used-grid">
            {used.map((u, i) => {
              const product = getProduct(u.slug);
              const cover = product ? studioCover(product) : null;
              const copyP = product ? presentProduct(product) : null;
              return (
                <li key={u.slug}>
                  <Reveal delay={Math.min(i, 4) * 0.04}>
                    <Link to={paths.product(u.slug)} className="project-used-card">
                      <div className="project-used-media" aria-hidden="true">
                        {cover ? <img src={cover} alt="" loading="lazy" /> : null}
                      </div>
                      <div>
                        <strong>{u.title || u.slug}</strong>
                        {copyP?.slogan ? <span>{copyP.slogan}</span> : null}
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {more.length ? (
        <section className="project-more-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Ещё кейсы</p>
            <h2>Похожие проекты</h2>
          </header>
          <ul className="project-more-grid">
            {more.map(({ raw, copy: item }, i) => (
              <li key={raw.slug}>
                <Reveal delay={Math.min(i, 3) * 0.04}>
                  <Link to={paths.project(raw.slug)} className="project-more-card">
                    <div className="project-more-media" aria-hidden="true">
                      {item.images[0] ? (
                        <img src={assetUrl(item.images[0])} alt="" loading="lazy" />
                      ) : null}
                    </div>
                    <strong>{item.title}</strong>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="actions about-actions">
        <Link className="btn primary btn--lg" to="/contacts">
          Обсудить похожий проект
        </Link>
        <Link className="btn secondary btn--lg" to="/catalog">
          В каталог
        </Link>
      </div>
    </div>
  );
}
