# AGENTS — как работать в этом репо

Короткий гайд для агента. Детали плана — в `PLAN.md`.

## Сейчас
Этап **полировка / перформанс**: канон и раскатка готовы, блог в данных есть — **в навигации не показывать**.

## Перформанс (не ломать визуал)
- Оригиналы PNG/JPG **не удалять**. WebP рядом: `npm run optimize:images` (regen/home q=92, без апскейла).
- Манифест: `src/data/media-webp.json` — `assetUrl` сам предпочитает `.webp`.
- Сырой HTML страниц: `src/data/source/*.json`. Рантайм без html: `npm run bake:content`.
- После scrape: `npm run optimize` (bake + images).

## Стек
React + Vite + React Router + чистый CSS. Без Tailwind / Next / TS без явной команды.

## Где что лежит
| Путь | Зачем |
|------|--------|
| `src/data/*.json` | scraped контент (не выдумывать) |
| `src/lib/data.js` | селекторы + `present*` (HTML → структура) |
| `src/pages/` | страницы |
| `src/styles/*.css` | стили по зонам (не один гигантский файл) |
| `public/img/` | картинки (не читать бинарники) |

## CSS — куда править
| Файл | Зона |
|------|------|
| `shell.css` | layout, header/footer, кнопки |
| `home.css` | главная |
| `catalog.css` | каталог / линейка / товар / specs |
| `lists.css` | проекты, области, общие list/detail |
| `service.css` | about / contacts / delivery / support / rent / policy |
| `solutions.css` | решения |
| `index.css` | токены (`:root`) |

`App.css` — только `@import`. Не склеивать обратно в монолит.

## Экономия контекста (обязательно)
1. **Не читай целиком** `src/styles/*.css`, `src/data/*.json`, `pages.json` html-поля.
2. Правки CSS: `rg` / чтение **±40 строк** вокруг селектора.
3. Данные: через `src/lib/data.js` и точечный `node -e` / jq по slug — не dump JSON.
4. Браузер: screenshot / короткий snapshot; не тащи полный a11y-tree.
5. Картинки в `public/img/` (особенно `blog/`) — не открывать без нужды.
6. Dev-сервер: если CSS «не применяется», проверь что смотришь **свежий** порт (часто 5174), не зависший 5173.

## Контент
Только с эталона `zorgtech.com`. `zorgtech-hero` не трогать.

## Визуал (канон)
Светлая студия, акцент циан `#2aaadd`, Plus Jakarta Sans, pill CTA. Не плодить второй визуальный язык.
