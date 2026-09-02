import { useState } from 'react';
import { Link } from 'react-router-dom';

const EMAIL = 'support@zorgtech.ru';

const EQUIPMENT_TYPES = [
  'Интерактивный киоск',
  'Сенсорный стол',
  'Интерактивная панель',
  'Терминал самообслуживания',
  'Уличный киоск',
  'Другое',
];

/** Inline form "Обращение в сервисный центр" on the support page. */
export default function ServiceRequestForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (name) => String(data.get(name) || '').trim();
    const name = get('name');
    const phone = get('phone');
    if (!name || !phone) return;

    const subject = encodeURIComponent('Обращение в сервисный центр Zorgtech');
    const body = encodeURIComponent(
      [
        `Организация: ${get('company') || '—'}`,
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `E-mail: ${get('email') || '—'}`,
        `Адрес оборудования: ${get('address') || '—'}`,
        `Тип оборудования: ${get('equipment') || '—'}`,
        `Серийный номер: ${get('serial') || '—'}`,
        `Тип обслуживания: ${get('service') || '—'}`,
        '',
        'Описание обращения:',
        get('details') || '—',
      ].join('\n'),
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="service-request" id="service-request">
      <header className="sec-head">
        <p className="chapter-kicker">Заявка</p>
        <h2>Обращение в сервисный центр</h2>
      </header>
      <div className="service-request-panel">
        {sent ? (
          <p className="apply-consent" role="status">
            Откроется почтовый клиент — фото и видео проблемы можно приложить прямо к письму. Если
            клиент не открылся, напишите на <a href={`mailto:${EMAIL}`}>{EMAIL}</a> или позвоните{' '}
            <a href="tel:88005502645">8 800 550 26 45</a>.
          </p>
        ) : (
          <form className="apply-form" onSubmit={onSubmit}>
            <div className="apply-row">
              <label className="apply-field">
                <span>Организация</span>
                <input name="company" type="text" autoComplete="organization" placeholder="Наименование организации" />
              </label>
              <label className="apply-field">
                <span>Ваше имя</span>
                <input name="name" type="text" autoComplete="name" required placeholder="Как к вам обращаться" />
              </label>
            </div>
            <div className="apply-row">
              <label className="apply-field">
                <span>Телефон</span>
                <input name="phone" type="tel" autoComplete="tel" required inputMode="tel" placeholder="+7 …" />
              </label>
              <label className="apply-field">
                <span>E-mail</span>
                <input name="email" type="email" autoComplete="email" placeholder="Необязательно" />
              </label>
            </div>
            <label className="apply-field">
              <span>Адрес, где установлено оборудование</span>
              <input name="address" type="text" placeholder="Город, улица, объект" />
            </label>
            <div className="apply-row">
              <label className="apply-field">
                <span>Тип оборудования</span>
                <select name="equipment" defaultValue="">
                  <option value="" disabled>
                    Выбрать
                  </option>
                  {EQUIPMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="apply-field">
                <span>Серийный номер</span>
                <input name="serial" type="text" placeholder="Указан на корпусе" />
              </label>
            </div>
            <label className="apply-field">
              <span>Тип обслуживания</span>
              <select name="service" defaultValue="Гарантийное">
                <option value="Гарантийное">Гарантийное</option>
                <option value="Постгарантийное">Постгарантийное</option>
              </select>
            </label>
            <label className="apply-field">
              <span>Описание обращения</span>
              <textarea name="details" rows="4" placeholder="Что случилось с оборудованием" />
            </label>
            <button className="btn primary apply-submit" type="submit">
              Отправить заявку
            </button>
            <p className="apply-consent">
              Нажимая кнопку, вы даете согласие на обработку персональных данных.{' '}
              <Link to="/policy">Политика конфиденциальности</Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
