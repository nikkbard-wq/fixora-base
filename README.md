# FIXORA Base Product Website

Современный многостраничный Product Website + интерактивное Demo для FIXORA Base.

## Что внутри

- 15 продуктовых страниц
- Catalog / Partners / Purchasing / Inventory / Sales
- интерактивные business-flow схемы
- responsive layout
- simulated frontend Demo
- GitHub Pages deployment

## Локальный запуск

Можно открыть `index.html` напрямую или запустить локальный сервер:

```bash
python3 -m http.server 8080
```

Затем открыть `http://localhost:8080`.

## GitHub Pages

Публикация выполняется автоматически через workflow `.github/workflows/pages.yml`.

Сборка:
1. восстанавливает генератор сайта;
2. создаёт все страницы в `_site`;
3. добавляет CSS и JavaScript;
4. публикует `_site` через GitHub Pages.

Все показатели и контрагенты на сайте являются демонстрационными.

## Premium UI

Сайт использует единый premium FIXORA visual layer: улучшенная типографика, навигация, карточки, таблицы, responsive states, микро-анимации и UX интерактивного Demo.
