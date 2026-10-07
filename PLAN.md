# План: zorgtech-site

Эталон контента: [zorgtech.com](https://zorgtech.com). Архив `zorgtech-hero` не использовать.  
Для агента: `AGENTS.md`.

## Статус
| # | Этап | Статус |
|---|------|--------|
| 1 | Данные (scrape → `src/data/`, `public/img/`) | ✅ |
| 2 | Скелет / демо (все блоки **кроме блога** в nav) | ✅ |
| 3 | Визуальный канон (эталон — главная) | ✅ |
| 4 | Раскатка на разделы | ✅ / точечная полировка |
| 5 | Полировка и деплой (+ перформанс: WebP/bake/lazy) | 🔧 полировка/SEO/bake; деплой ещё |
| 6 | Bitrix (только после ок заказчика) | ⏸ |

## Бэклог
- **Интерьерные кадры для 34 товаров** — у них в «Оборудование в интерьере» не осталось реальных фото (рендеры исключены через `src/data/gallery-renders.json`, секция скрыта). Сгенерировать кадры в обстановке по образцу студийных (Meshy, стиль = сестринские фото с эталона):
  `diamant-22-f, diamant-32-f, diamant-32-f-general, diamant-32-f-key, diamant-32-f-print, diamant-32-fe, diamant-43-f, diamant-43-f-general, diamant-43-f-print, diamant-49-f, diamant-49-f-general, diamant-49-f-print, diamant-75-f, diamant-86-f-grand, mono-19-f, mono-43-f, diamant-22-n, diamant-43-n, diamant-49-n, diamant-55-n (1 фото), diamant-22-w, diamant-32-w, diamant-32-w-print, diamant-43-w (1 фото), diamant-55-w, diamant-32-wa-pay, diamant-32-wea-pay, diamant-32-we-pay, mono-32-fa-pin, beskontaktnyy-dezinfektor-agat-5/7/9, diamant-intercon, diamant-tmedical`.

## Канон визуала
Светлая студия · циан `#2aaadd` · Plus Jakarta Sans · pill CTA.  
Токены: `src/index.css`. Стили по зонам: `src/styles/`.

## Железные правила
- Контент только с эталона — не выдумывать.
- Блог в данных есть — в демо/nav не выводить, пока не скажем.
- Стек: React + Vite + React Router + чистый CSS (без Tailwind/Next/TS без команды).
- URL/SEO при переносе в Bitrix не ломать.
