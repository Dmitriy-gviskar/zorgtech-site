import { useState } from 'react';
import homeBlocks from '../data/home-blocks.json';

const EMAIL = homeBlocks.leadForm?.email || 'sale@zorgtech.ru';

function hasListedPrice(price) {
  const value = String(price || '').trim();
  if (!value) return false;
  return !/^цена\s+по\s+запросу$/iu.test(value);
}

/** Open phone + CTA on the product hero. */
export default function ProductPriceForm({ title, slug, price }) {
  const [sent, setSent] = useState(false);
  const priced = hasListedPrice(price);
  const submitLabel = priced ? 'Отправить заявку' : 'Запросить цену';
  const subjectLabel = priced ? `Заявка: ${title || 'модель Zorgtech'}` : `Запрос цены: ${title || 'модель Zorgtech'}`;

  function onSubmit(event) {
    event.preventDefault();
    const phone = String(new FormData(event.currentTarget).get('phone') || '').trim();
    if (!phone) return;

    const subject = encodeURIComponent(subjectLabel);
    const body = encodeURIComponent(
      [
        `Телефон: ${phone}`,
        `Модель: ${title || '—'}`,
        `Цена: ${price || 'Цена по запросу'}`,
        slug ? `Страница: /product/${slug}` : null,
        '',
        'Источник: карточка товара',
      ]
        .filter(Boolean)
        .join('\n'),
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="product-price-form-thanks" role="status">
        Спасибо. Если почта не открылась — напишите на{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> или позвоните{' '}
        <a href="tel:88005502645">8 800 550 26 45</a>.
      </p>
    );
  }

  return (
    <form className="product-price-form" onSubmit={onSubmit}>
      <label className="product-price-field">
        <span className="product-price-field-label">Телефон</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          inputMode="tel"
          placeholder="+7 …"
        />
      </label>
      <button className="btn primary btn--lg product-price-submit" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
