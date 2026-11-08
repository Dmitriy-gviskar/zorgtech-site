import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApplyDialog from './ApplyDialog';
import homeBlocks from '../data/home-blocks.json';
import { paths } from '../lib/paths.js';

const EMAIL = homeBlocks.leadForm?.email || 'sale@zorgtech.ru';

function hasListedPrice(price) {
  const value = String(price || '').trim();
  if (!value) return false;
  return !/^цена\s+по\s+запросу$/iu.test(value);
}

function PriceApplyForm({ title, slug, price, onSent }) {
  function onSubmit(event) {
    event.preventDefault();
    const phone = String(new FormData(event.currentTarget).get('phone') || '').trim();
    if (!phone) return;

    const priced = hasListedPrice(price);
    const subject = encodeURIComponent(
      priced ? `Заявка: ${title || 'модель Zorgtech'}` : `Запрос цены: ${title || 'модель Zorgtech'}`,
    );
    const body = encodeURIComponent(
      [
        `Телефон: ${phone}`,
        `Модель: ${title || '—'}`,
        `Цена: ${price || 'Цена по запросу'}`,
        slug ? `Страница: ${paths.product(slug)}` : null,
        '',
        'Источник: карточка товара',
      ]
        .filter(Boolean)
        .join('\n'),
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    onSent();
  }

  return (
    <form className="apply-form" onSubmit={onSubmit}>
      <label className="apply-field">
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
      <button className="btn primary apply-submit" type="submit">
        {hasListedPrice(price) ? 'Отправить заявку' : 'Запросить цену'}
      </button>
      <p className="apply-consent">
        Нажимая кнопку, вы даете согласие на обработку персональных данных.{' '}
        <Link to="/policy">Политика конфиденциальности</Link>
      </p>
    </form>
  );
}

/** Price CTA — opens a phone popup on every product card. */
export default function ProductPriceForm({ title, slug, price }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn primary btn--lg"
        onClick={() => {
          setSent(false);
          setOpen(true);
        }}
      >
        {price || 'Цена по запросу'}
      </button>
      {open ? (
        <ApplyDialog
          kicker="Запрос цены"
          title={title || 'Модель Zorgtech'}
          lead="Оставьте телефон — перезвоним и назовём стоимость."
          onClose={() => setOpen(false)}
        >
          {sent ? (
            <p className="apply-consent" role="status">
              Спасибо. Если почта не открылась — напишите на{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> или позвоните{' '}
              <a href="tel:88005502645">8 800 550 26 45</a>.
            </p>
          ) : (
            <PriceApplyForm
              title={title}
              slug={slug}
              price={price}
              onSent={() => setSent(true)}
            />
          )}
        </ApplyDialog>
      ) : null}
    </>
  );
}
