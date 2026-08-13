import { useState } from 'react';
import homeBlocks from '../data/home-blocks.json';

const EMAIL = homeBlocks.leadForm?.email || 'sale@zorgtech.ru';

/** Phone + CTA inside the design-lab chapter. */
export default function DesignLabLeadForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const phone = String(new FormData(event.currentTarget).get('phone') || '').trim();
    if (!phone) return;

    const subject = encodeURIComponent('Заказ уникального оборудования');
    const body = encodeURIComponent(
      [`Телефон: ${phone}`, '', 'Источник: конструкторское бюро (главная)'].join('\n'),
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="design-lab-form-thanks" role="status">
        Спасибо. Если почта не открылась — напишите на{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> или позвоните{' '}
        <a href="tel:88005502645">8 800 550 26 45</a>.
      </p>
    );
  }

  return (
    <form className="design-lab-form" onSubmit={onSubmit}>
      <label className="design-lab-field">
        <span className="design-lab-field-label">Телефон</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          inputMode="tel"
          placeholder="+7 …"
        />
      </label>
      <button className="btn primary design-lab-submit" type="submit">
        Заказать уникальное оборудование
      </button>
    </form>
  );
}
