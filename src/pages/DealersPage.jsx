import { Link } from 'react-router-dom';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import StudioHoverMedia from '../components/StudioHoverMedia';
import { assetUrl } from '../lib/data/asset.js';
import copy from '../data/dealers.json';

function accentCopy(text) {
  return String(text)
    .split(/(25%)/)
    .map((part, i) => (part === '25%' ? <em key={i}>{part}</em> : part));
}

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

function DealersForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    const city = String(data.get('city') || '').trim();
    if (!name || !phone) return;

    const subject = encodeURIComponent('Заявка в дилерскую сеть Zorgtech');
    const body = encodeURIComponent(
      [
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Компания: ${company || '—'}`,
        `Регион: ${city || '—'}`,
        '',
        'Источник: страница дилеров',
      ].join('\n'),
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
    <form className="dealers-form" onSubmit={onSubmit}>
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
        {copy.cta.submit}
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
          <p className="dealers-hero-lead">{accentCopy(copy.hero.lead)}</p>
          <p className="dealers-hero-note">{copy.hero.note}</p>
          <div className="actions">
            <a className="btn primary btn--lg" href="#dealer-form">
              {copy.hero.cta}
            </a>
            <Link className="btn secondary btn--lg" to="/dealers/portal">
              {copy.cabinet.loginCta}
            </Link>
            <a className="btn secondary btn--lg" href={copy.contacts.phone.href}>
              {copy.contacts.phone.label}
            </a>
          </div>
        </div>
        <div className="dealers-hero-stage" aria-hidden="true">
          <StudioHoverMedia cover={copy.hero.media} />
        </div>
      </header>

      <section className="dealers-proof">
        <Reveal>
          <figure className="dealers-proof-media">
            <img src={assetUrl(copy.proof.media)} alt="" />
          </figure>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="dealers-proof-copy">
            <p className="chapter-kicker">{copy.proof.kicker}</p>
            <p className="dealers-status">{copy.status}</p>
            <p className="dealers-intro">{copy.intro}</p>
          </div>
        </Reveal>
      </section>

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
                  <div className="dealers-sphere-media" aria-hidden="true">
                    {item.image ? <img src={assetUrl(item.image)} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="dealers-sphere-copy">
                    <strong>{item.title}</strong>
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="dealers-section dealers-stats dealers-band">
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

      <section className="dealers-section dealers-band dealers-apply" id="dealer-form">
        <Reveal>
          <header className="sec-head">
            <p className="chapter-kicker">{copy.form.kicker}</p>
            <h2>{copy.cta.title}</h2>
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
