import { Link } from 'react-router-dom';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import StudioHoverMedia from '../components/StudioHoverMedia';
import copy from '../data/dealers.json';

function StatValue({ value, prefix = '', suffix = '' }) {
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

  return (
    <strong ref={ref}>
      {prefix}
      {display}
      {suffix}
    </strong>
  );
}

function DealersForm({ variant = 'full' }) {
  const [sent, setSent] = useState(false);
  const isCompact = variant === 'compact';

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    const city = String(data.get('city') || '').trim();
    if (!phone || (!isCompact && !name)) return;

    const subject = encodeURIComponent('Заявка в дилерскую сеть Zorgtech');
    const body = encodeURIComponent(
      [
        name ? `Имя: ${name}` : null,
        `Телефон: ${phone}`,
        company ? `Компания: ${company}` : null,
        city ? `Регион: ${city}` : null,
        '',
        'Источник: страница дилеров',
      ]
        .filter(Boolean)
        .join('\n'),
    );
    window.location.href = `mailto:${copy.form.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="dealers-form-thanks" role="status">
        Спасибо. Если почтовый клиент не открылся — напишите на{' '}
        <a href={`mailto:${copy.form.email}`}>{copy.form.email}</a> или позвоните{' '}
        <a href={copy.contacts.phone.href}>{copy.contacts.phone.label}</a>.
      </p>
    );
  }

  return (
    <form className={`dealers-form${isCompact ? ' dealers-form--compact' : ''}`} onSubmit={onSubmit}>
      {isCompact ? null : (
        <>
          <label className="dealers-field">
            <span>Имя</span>
            <input name="name" type="text" autoComplete="name" required placeholder="Как к вам обращаться" />
          </label>
          <label className="dealers-field">
            <span>Компания</span>
            <input name="company" type="text" autoComplete="organization" placeholder="Необязательно" />
          </label>
          <label className="dealers-field">
            <span>Регион</span>
            <input name="city" type="text" autoComplete="address-level1" placeholder="Город или область" />
          </label>
        </>
      )}
      <label className="dealers-field">
        <span>Телефон</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          inputMode="tel"
          placeholder="+7 …"
        />
      </label>
      <button className="btn primary btn--lg dealers-submit" type="submit">
        {isCompact ? copy.cta.submit : copy.form.submit}
      </button>
      <p className="dealers-consent">
        {copy.cta.consent}.{' '}
        <Link to="/policy">Политика конфиденциальности</Link>
      </p>
    </form>
  );
}

export default function DealersPage() {
  return (
    <div className="page dealers-page">
      <Seo title={copy.seo.title} description={copy.seo.description} path="/dealers" />

      <header className="dealers-hero">
        <div className="dealers-hero-copy">
          <p className="chapter-kicker">{copy.hero.kicker}</p>
          <h1>{copy.hero.title}</h1>
          <p className="dealers-hero-lead">{copy.hero.lead}</p>
          <p className="dealers-hero-note">{copy.hero.note}</p>
          <p className="dealers-status">{copy.status}</p>
          <div className="actions">
            <a className="btn primary btn--lg" href="#dealer-form">
              {copy.hero.cta}
            </a>
            <a className="btn secondary btn--lg" href={copy.contacts.phone.href}>
              {copy.contacts.phone.label}
            </a>
          </div>
        </div>
        <div className="dealers-hero-stage" aria-hidden="true">
          <StudioHoverMedia cover={copy.hero.media} />
        </div>
      </header>

      <Reveal>
        <p className="dealers-intro">{copy.intro}</p>
      </Reveal>

      <section className="dealers-section">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.benefits.kicker}</p>
            <h2>{copy.benefits.title}</h2>
          </header>
        </Reveal>
        <ul className="dealers-benefit-list">
          {copy.benefits.items.map((item, i) => (
            <li key={item}>
              <Reveal delay={Math.min(i, 4) * 0.04}>
                <article className="dealers-benefit">
                  <span className="dealers-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="dealers-section">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.spheres.kicker}</p>
            <h2>{copy.spheres.title}</h2>
          </header>
        </Reveal>
        <ul className="dealers-sphere-grid">
          {copy.spheres.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={Math.min(i, 5) * 0.03}>
                <Link to={item.to} className="dealers-sphere">
                  <strong>{item.title}</strong>
                  <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="dealers-section dealers-stats">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.stats.kicker}</p>
            <h2>{copy.stats.title}</h2>
          </header>
        </Reveal>
        <ul className="dealers-stat-grid">
          {copy.stats.items.map((item, i) => (
            <li key={item.label}>
              <Reveal delay={i * 0.06}>
                <article className="dealers-stat">
                  <StatValue value={item.value} prefix={item.prefix} suffix={item.suffix} />
                  <span>{item.label}</span>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="dealers-section">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.roadmap.kicker}</p>
            <h2>{copy.roadmap.title}</h2>
          </header>
        </Reveal>
        <ol className="dealers-steps">
          {copy.roadmap.steps.map((step, i) => (
            <li key={step}>
              <Reveal delay={Math.min(i, 6) * 0.04}>
                <article className="dealers-step">
                  <span className="dealers-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="dealers-section dealers-band dealers-apply" id="dealer-form">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.form.kicker}</p>
            <h2>{copy.form.title}</h2>
          </header>
        </Reveal>
        <div className="dealers-apply-grid">
          <Reveal>
            <ul className="dealers-perk-list">
              {copy.form.perks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06}>
            <DealersForm />
          </Reveal>
        </div>
      </section>

      <section className="dealers-section">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.portal.kicker}</p>
            <h2>{copy.portal.title}</h2>
          </header>
        </Reveal>
        <ul className="dealers-portal-grid">
          {copy.portal.items.map((item, i) => (
            <li key={item}>
              <Reveal delay={Math.min(i, 3) * 0.04}>
                <article className="dealers-portal-card">
                  <span className="dealers-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="dealers-section dealers-band dealers-cta">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.cta.kicker}</p>
            <h2>{copy.cta.title}</h2>
          </header>
        </Reveal>
        <Reveal delay={0.05}>
          <DealersForm variant="compact" />
        </Reveal>
      </section>

      <section className="dealers-section dealers-contacts">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.contacts.kicker}</p>
            <h2>{copy.contacts.title}</h2>
          </header>
        </Reveal>
        <div className="dealers-contact-grid">
          <Reveal>
            <a className="dealers-contact-card" href={copy.contacts.phone.href}>
              <span className="chapter-kicker">Телефон</span>
              <strong>{copy.contacts.phone.label}</strong>
              <span>{copy.contacts.phone.note}</span>
            </a>
          </Reveal>
          <Reveal delay={0.04}>
            <a className="dealers-contact-card" href={copy.contacts.email.href}>
              <span className="chapter-kicker">Электронная почта</span>
              <strong>{copy.contacts.email.label}</strong>
              <span>Отдел по работе с дилерами</span>
            </a>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="dealers-contact-card">
              <span className="chapter-kicker">{copy.contacts.office.kicker}</span>
              <strong>{copy.contacts.office.city}</strong>
              <span>{copy.contacts.office.address}</span>
            </article>
          </Reveal>
          <Reveal delay={0.12}>
            <article className="dealers-contact-card">
              <span className="chapter-kicker">{copy.contacts.production.kicker}</span>
              <strong>{copy.contacts.production.city}</strong>
              <span>{copy.contacts.production.address}</span>
            </article>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
