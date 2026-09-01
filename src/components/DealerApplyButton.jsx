import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import copy from '../data/dealers.json';

function DealerApplyForm({ source }) {
  const [note, setNote] = useState(false);

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
        `Источник: ${source}`,
      ].join('\n'),
    );
    window.location.href = `mailto:${copy.form.email}?subject=${subject}&body=${body}`;
    setNote(true);
  }

  if (note) {
    return (
      <p className="dealers-form-thanks" role="status">
        Откроется почтовый клиент. Если нет — напишите на{' '}
        <a href={`mailto:${copy.form.email}`}>{copy.form.email}</a> или позвоните{' '}
        <a href={copy.contacts.phone.href}>{copy.contacts.phone.label}</a>.
      </p>
    );
  }

  return (
    <form className="dealers-form dealer-apply-form" onSubmit={onSubmit}>
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
        {copy.form.submit}
      </button>
      <p className="dealers-consent">
        {copy.cta.consent}. <Link to="/policy">Политика конфиденциальности</Link>
      </p>
    </form>
  );
}

function DealerApplyDialog({ source, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return undefined;
    if (!el.open) el.showModal();
    const onCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    el.addEventListener('cancel', onCancel);
    return () => {
      el.removeEventListener('cancel', onCancel);
      if (el.open) el.close();
    };
  }, [onClose]);

  function onBackdrop(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="dealer-apply-dialog"
      aria-labelledby={titleId}
      onClick={onBackdrop}
    >
      <div className="dealer-apply-panel">
        <header className="dealer-apply-head">
          <p className="chapter-kicker">{copy.form.kicker}</p>
          <h2 id={titleId}>{copy.form.title}</h2>
          <button type="button" className="dealer-apply-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>
        <DealerApplyForm source={source} />
      </div>
    </dialog>
  );
}

export default function DealerApplyButton({ className, children, source }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open ? <DealerApplyDialog source={source} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
