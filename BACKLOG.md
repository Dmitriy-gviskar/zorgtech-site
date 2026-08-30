# Беклог — аудит zorgtech-site

Источник: аудит 2026-08-29, ветка `cursor/product-regen-images`.  
Правило заказчика: **SEO / блог / CHPU / meta не трогаем** (трафик ~5k/мес).

Статусы: `todo` · `doing` · `done` · `blocked` · `wont` (не трогаем)

---

## В работе / очередь сайта

| # | Задача | Сев. | Статус | Примечание |
|---|--------|------|--------|------------|
| 1 | Цены в `products.json` + витрина | critical | **done** | Все 62 → «Цена по запросу»; home-catalog уже был ок |
| 2 | Галереи: подключить `regen` к 25 однокадровым | high | **done** | UI уже через REGEN_FRAMES; JSON под Bitrix не трогаем |
| 3 | Our-boxes: обложки у 38/48 без картинок | high | **blocked** | Нет исходников скринов; на эталоне этих коробок нет. Нужны файлы/папка |
| 4 | Дилер-портал: убрать фейк-логин / выровнять копирайт | critical | todo | URL не менять |
| 5 | UX роутера: Suspense без мигания шапки + soft-404 → NotFound | high | **done** | Suspense в Layout вокруг Outlet; soft-404 → NotFoundPage |
| 6 | Формы: не врать «отправлено» после mailto; валидация телефона | high | todo | |
| 7 | Mobile: синхрон CTA / burger (721–960) | medium | todo | |

---

## Полный список находок аудита

### Critical

| ID | Находка | Статус | Почему |
|----|---------|--------|--------|
| P1 | Цены сломаны у 62/62 в JSON (`от`, `от 2`, …) | → #1 **done** | Контент витрины |
| P2 | Дилер-портал: вход без пароля (email+компания) | → #4 | UX/доверие |
| P3 | Deep links GitHub Pages не материализованы (detail URL) | todo | Демо-деплой; SEO прод не трогаем |
| P4 | Bitrix-карта: `novinka-*` / `novinki` без данных; блог 139 URL без демо-страниц | wont / later | URL/SEO/блог — не трогаем без явной команды |

### High

| ID | Находка | Статус |
|----|---------|--------|
| H1 | 38/48 our-boxes без картинок | → #3 |
| H2 | 25 продуктов с 1 кадром; regen не подключён | → #2 |
| H3 | Suspense вокруг всего роутера — мигает Layout; soft-404 без NotFound | → #5 **done** |
| H4 | 2 проекта из sitemap нет в данных; legacy `/catalog/{alias}/` без редиректа | todo (контент/редиректы демо; CHPU живые не ломать) |
| H5 | Area slug с `nbsp`: `dlya-bankov-nbsp-nbsp-…` | blocked | Менять slug = риск URL; только с 301 и явной ок |
| H6 | Mailto-формы + мгновенный «успех» | → #6 |
| H7 | OG/canonical/`VITE_SITE_URL` | wont | SEO — не трогаем |

### Medium

| ID | Находка | Статус |
|----|---------|--------|
| M1 | Блок блога на главной → живой zorgtech.com | wont / ok | Трафик; так и задумано |
| M2 | Breakpoint CTA vs burger | → #7 |
| M3 | 31/63 проектов с пустым `usedProducts` | todo | Контент, не SEO |
| M4 | A11y табов / hash под sticky header | todo | |
| M5 | Копирайт портала шире реальности | → #4 |
| M6 | LCP: lazy на above-fold; тяжёлые regen PNG | todo | После #2 |

### Low

| ID | Находка | Статус |
|----|---------|--------|
| L1 | Категория-заглушка `unique` | todo |
| L2 | NavLink `/dealers` активен на `/dealers/portal` | todo |
| L3 | Footer / mobile-nav размазаны по CSS-модулям | todo |

### Ок (не баги)

- Product↔category целые; локальные `/img/` на месте  
- CHPU `paths.js` совпадает с живым Bitrix на основных разделах  
- Алиасы `/product`, `/projects`, `/solutions`, `/areas`  
- Блог скрыт из nav (`AGENTS.md`)

---

## Заметки под Битрикс (не код демо)

- Не менять keep-URL из `docs/bitrix-url-map.csv` без редиректов  
- Цены и картинки чинить в данных до заливки в инфоблоки  
- Портал дилера — отдельная авторизация Битрикс/1С, не демо-sessionStorage  
- Slug с `nbsp` и missing projects — только через карту редиректов
