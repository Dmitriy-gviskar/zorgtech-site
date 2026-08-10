import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import { getArea, presentArea } from '../lib/data/areas.js';

export default function AreaDetailPage() {
  const { slug } = useParams();
  const area = getArea(slug);

  if (!area) {
    return (
      <div className="page">
        <h1>Раздел не найден</h1>
        <Link className="text-link" to="/areas">
          ← К областям применения
        </Link>
      </div>
    );
  }

  const copy = presentArea(area);
  const hero = copy.images[0];
  const gallery = copy.images.slice(1, 9);

  return (
    <div className="page detail-page area-detail">
      <Seo
        title={area.meta?.title || copy.title}
        description={area.meta?.description || copy.lead || ''}
        path={`/areas/${area.slug}`}
        image={area.meta?.image || hero || undefined}
      />
      <p className="crumbs">
        <Link to="/areas">Области применения</Link>
        <span aria-hidden="true"> / </span>
        {copy.title}
      </p>

      <header className="detail-hero area-hero">
        <div className="detail-hero-copy">
          <p className="chapter-kicker">Область применения</p>
          <h1>{copy.title}</h1>
          {copy.lead ? <p className="lead">{copy.lead}</p> : null}
          <div className="actions">
            <Link className="btn primary btn--lg" to="/contacts">
              Обсудить задачу
            </Link>
            <Link className="btn secondary btn--lg" to="/solutions">
              Готовые решения
            </Link>
          </div>
        </div>
        {hero ? (
          <div className="detail-hero-media" aria-hidden="true">
            <img src={assetUrl(hero)} alt="" />
          </div>
        ) : null}
      </header>

      {copy.story.length ? (
        <Reveal>
          <section className="solution-story area-story">
            {copy.story.map((p, i) => (
              <p key={p.slice(0, 48)} className={i === 0 ? 'is-lead' : undefined}>
                {p}
              </p>
            ))}
          </section>
        </Reveal>
      ) : null}

      {copy.sections.length ? (
        <div className="area-sections">
          {copy.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={Math.min(i, 4) * 0.05}>
              <section className="area-section">
                <span className="area-section-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{sec.title}</h2>
                  {sec.paragraphs?.length ? (
                    <div className="area-section-prose">
                      {sec.paragraphs.map((p) => (
                        <p key={p.slice(0, 48)}>{p}</p>
                      ))}
                    </div>
                  ) : null}
                  {sec.items?.length ? (
                    <ul className="solution-block-list">
                      {sec.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      ) : null}

      {gallery.length ? (
        <section className="solution-gallery-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Визуал</p>
            <h2>Как это выглядит</h2>
          </header>
          <div className="solution-gallery">
            {gallery.map((src) => (
              <img key={src} src={assetUrl(src)} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      ) : null}

      <div className="actions about-actions">
        <Link className="btn primary btn--lg" to="/contacts">
          Обсудить внедрение
        </Link>
        <Link className="btn secondary btn--lg" to="/areas">
          Все области
        </Link>
      </div>
    </div>
  );
}
