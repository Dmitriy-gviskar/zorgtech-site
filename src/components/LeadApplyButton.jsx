import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApplyDialog from './ApplyDialog';
import homeBlocks from '../data/home-blocks.json';

const COPY = homeBlocks.leadForm || {};
const EMAIL = COPY.email || 'sale@zorgtech.ru';
const LEAD = COPY.lead || 'Перезвоним в рабочее время и поможем выбрать решение под\u00a0задачу.';

function LeadApplyForm({ source }) {
  const [note, setNote] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const company = String(data.get('company') || '').trim();
    const task = String(data.get('task') || '').trim();
    if (!name || !phone) return;

    const subject = encodeURIComponent('Заявка с сайта Zorgtech');
    const body = encodeURIComponent(
      [
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Компания: ${company || '—'}`,
        `Задача: ${task || '—'}`,
        '',
        `Источник: ${source}`,
      ].join('\n'),
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setNote(true);
  }

  if (note) {
    return (
      <p className="apply-consent" role="status">
        Откроется почтовый клиент. Если нет — напишите на{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> или позвоните{' '}
        <a href="tel:88005502645">8 800 550 26 45</a>.
      </p>
    );
  }

  return (
    <form className="apply-form" onSubmit={onSubmit}>
      <label className="apply-field">
        <span>Имя</span>
        <input name="name" type="text" autoComplete="name" required placeholder="Как к вам обращаться" />
      </label>
      <div className="apply-row">
        <label className="apply-field">
          <span>Телефон</span>
          <input name="phone" type="tel" autoComplete="tel" required inputMode="tel" placeholder="+7 …" />
        </label>
        <label className="apply-field">
          <span>Компания</span>
          <input name="company" type="text" autoComplete="organization" placeholder="Необязательно" />
        </label>
      </div>
      <label className="apply-field">
        <span>Задача</span>
        <textarea name="task" rows="3" placeholder="Пара слов о задаче — необязательно" />
      </label>
      <button className="btn primary apply-submit" type="submit">
        {COPY.submit || 'Отправить'}
      </button>
      <p className="apply-consent">
        Нажимая кнопку, вы даете согласие на обработку персональных данных.{' '}
        <Link to="/policy">Политика конфиденциальности</Link>
      </p>
    </form>
  );
}

/** CTA that opens the request popup instead of navigating to /contacts. */
export default function LeadApplyButton({ className, children, source }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open ? (
        <ApplyDialog kicker="Заявка" title="Обсудить задачу" lead={LEAD} onClose={() => setOpen(false)}>
          <LeadApplyForm source={source} />
        </ApplyDialog>
      ) : null}
    </>
  );
}
