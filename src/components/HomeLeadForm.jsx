import { useState } from 'react';
import Reveal from './Reveal';
import RevealTitle from './RevealTitle';
import homeBlocks from '../data/home-blocks.json';

const COPY = homeBlocks.leadForm || {
  kicker: 'Заявка',
  title: 'Оставьте заявку',
  lead: 'Перезвоним в рабочее время и поможем выбрать решение под\u00a0задачу.',
  submit: 'Отправить',
  email: 'sale@zorgtech.ru',
  note: 'Или позвоните 8 800 550 26 45 — звонок по России бесплатный.',
};

/** Compact request form for the home mid-page break — no internal scroll. */
export default function HomeLeadForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    if (!name || !phone) return;

    const subject = encodeURIComponent('Заявка с сайта Zorgtech');
    const body = encodeURIComponent(
      [`Имя: ${name}`, `Телефон: ${phone}`, `Компания: ${company || '—'}`, '', 'Источник: главная страница'].join(
        '\n',
      ),
    );
    window.location.href = `mailto:${COPY.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="home-lead" id="lead-form" aria-label={COPY.title}>
      <div className="wrap home-lead-inner">
        <RevealTitle kicker={COPY.kicker} title={COPY.title} titleClassName="home-lead-title" />
        <Reveal delay={0.08}>
          <p className="home-lead-text">{COPY.lead}</p>
        </Reveal>

        {sent ? (
          <Reveal delay={0.1}>
            <p className="home-lead-thanks" role="status">
              Спасибо. Если почтовый клиент не открылся — напишите на{' '}
              <a href={`mailto:${COPY.email}`}>{COPY.email}</a> или позвоните{' '}
              <a href="tel:88005502645">8 800 550 26 45</a>.
            </p>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form className="home-lead-form" onSubmit={onSubmit} noValidate={false}>
              <label className="home-lead-field">
                <span>Имя</span>
                <input name="name" type="text" autoComplete="name" required placeholder="Как к вам обращаться" />
              </label>
              <label className="home-lead-field">
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
              <label className="home-lead-field">
                <span>Компания</span>
                <input name="company" type="text" autoComplete="organization" placeholder="Необязательно" />
              </label>
              <button className="btn primary home-lead-submit" type="submit">
                {COPY.submit}
              </button>
            </form>
            <p className="home-lead-note">{COPY.note}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
