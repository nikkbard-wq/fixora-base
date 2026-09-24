# FIXORA Base Website

Полностью новый product website для FIXORA Base.

## Структура

- Главная
- Продукт
- Закупки
- Склад
- Продажи
- Архитектура
- Расширения

## FIXORA Base

Base включает:

- Catalog
- Partners
- Purchasing
- Inventory
- Sales

Base работает как самостоятельный продукт.

Finance, OCR & AI, 1C Integration, Manufacturing, Advanced Warehouse, Distribution, Advanced Analytics и Construction показаны только как отдельные подключаемые расширения.

## Сборка

```bash
python build.py
```

Готовый сайт создаётся в каталоге `_site`.

## Публикация

GitHub Pages автоматически публикует каталог `_site` через workflow:

```
.github/workflows/pages.yml
```

Сайт intentionally не содержит интерактивной симуляции ERP. Основной фокус — понятное объяснение продукта FIXORA Base, его процессов и архитектуры.
