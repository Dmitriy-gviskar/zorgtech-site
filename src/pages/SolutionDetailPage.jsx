import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { assetUrl } from '../lib/data/asset.js';
import { getSolution, presentSolution, solutionGroupMeta } from '../lib/data/solutions.js';
import { paths } from '../lib/paths.js';
import NotFoundPage from './NotFoundPage';

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = getSolution(slug);

  if (!solution) return <NotFoundPage />;

  const copy = presentSolution(solution);
  const group = solutionGroupMeta(solution.group);
  const hero = copy.images[0];
  const gallery = copy.images.slice(1, 9);

  return (
    <div className="page detail-page solution-detail">
      <Seo
        title={solution.meta?.title || copy.title}
        description={solution.meta?.description || copy.lead || ''}
        path={paths.solution(solution.slug)}
        image={solution.meta?.image || hero || undefined}
      />
      <p className="crumbs">
        <Link to={paths.solutions}>Софт</Link>
        <span aria-hidden="true"> / </span>
        {copy.title}
      </p>

      <header className="detail-hero solution-hero">
        <div className="detail-hero-copy">
          <p className="chapter-kicker">{group.title}</p>
          <h1>{copy.title}</h1>
          {copy.lead ? <p className="lead">{copy.lead}</p> : null}
          {copy.features.length ? (
            <ul className="feature-anchors solution-feature-anchors">
              {copy.features.slice(0, 4).map((f) => (
                <li key={f}>
                  <strong>{f}</strong>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="actions">
            <Link className="btn primary btn--lg" to="/contacts">
              Запросить внедрение
            </Link>
            <Link className="btn secondary btn--lg" to={paths.solutions}>
              Весь софт
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
          <section className="solution-story">
            {copy.story.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </section>
        </Reveal>
      ) : null}

      {copy.blocks.length ? (
        <div className="solution-blocks">
          {copy.blocks.map((block, i) => (
            <Reveal key={block.title} delay={Math.min(i, 4) * 0.05}>
              <section className="solution-block">
                <header className="sec-head">
                  <p className="chapter-kicker">{String(i + 1).padStart(2, '0')}</p>
                  <h2>{block.title}</h2>
                </header>
                <ul className="solution-block-list">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      ) : null}

      {gallery.length ? (
        <section className="solution-gallery-sec">
          <header className="sec-head">
            <p className="chapter-kicker">Интерфейс</p>
            <h2>Как выглядит софт</h2>
          </header>
          <div className={`solution-gallery${gallery.length === 1 ? ' solution-gallery--solo' : ''}`}>
            {gallery.map((src) => (
              <figure key={src} className="solution-gallery-shot">
                <img src={assetUrl(src)} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <div className="actions about-actions">
        <Link className="btn primary btn--lg" to="/contacts">
          Обсудить внедрение
        </Link>
        <Link className="btn secondary btn--lg" to="/catalog">
          К каталогу
        </Link>
      </div>
    </div>
  );
}
