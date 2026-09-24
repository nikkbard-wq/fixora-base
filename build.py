from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_site"
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

NAV = [
    ("product.html", "Продукт"),
    ("purchasing.html", "Закупки"),
    ("inventory.html", "Склад"),
    ("sales.html", "Продажи"),
    ("architecture.html", "Архитектура"),
    ("extensions.html", "Расширения"),
]

def shell(title, description, page, body):
    nav = "".join(
        f'<a href="{href}" class="{"active" if page == href else ""}">{label}</a>'
        for href, label in NAV
    )
    return f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <title>{title} — FIXORA Base</title>
  <meta name="description" content="{description}">
  <link rel="stylesheet" href="styles.css">
</head>
<body data-page="{page}">
  <div class="scroll-progress" aria-hidden="true"></div>
  <header class="header">
    <a class="logo" href="index.html" aria-label="FIXORA Base">
      <span class="logo-mark">F</span>
      <span class="logo-word">FIXORA</span>
      <span class="logo-base">BASE</span>
    </a>
    <nav class="nav" aria-label="Основная навигация">{nav}</nav>
    <a class="header-cta" href="product.html">Что входит в Base</a>
    <button class="menu-button" aria-label="Открыть меню" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </header>
  <div class="mobile-nav" aria-hidden="true">
    <div class="mobile-nav-inner">
      <a href="index.html">Главная</a>
      {nav}
      <a class="mobile-cta" href="product.html">Что входит в Base</a>
    </div>
  </div>
  <main>{body}</main>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-intro">
        <a class="logo footer-logo" href="index.html">
          <span class="logo-mark">F</span><span class="logo-word">FIXORA</span><span class="logo-base">BASE</span>
        </a>
        <p>Базовая ERP-система для закупок, склада и продаж.</p>
        <div class="footer-formula">ЗАКУПКИ <span>→</span> СКЛАД <span>→</span> ПРОДАЖИ</div>
      </div>
      <div class="footer-col">
        <strong>Base</strong>
        <a href="product.html">Продукт</a>
        <a href="purchasing.html">Закупки</a>
        <a href="inventory.html">Склад</a>
        <a href="sales.html">Продажи</a>
      </div>
      <div class="footer-col">
        <strong>Платформа</strong>
        <a href="architecture.html">Архитектура</a>
        <a href="extensions.html">Расширения</a>
      </div>
      <div class="footer-col">
        <strong>Принцип</strong>
        <p>Начните с базы.<br>Подключайте только то, что нужно бизнесу.</p>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© FIXORA</span>
      <span>Base работает самостоятельно без обязательных расширений.</span>
    </div>
  </footer>
  <script src="app.js"></script>
</body>
</html>"""

home = """
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy reveal">
      <div class="kicker"><span></span> FIXORA BASE</div>
      <h1>ERP без лишнего.<br><em>Закупки → Склад → Продажи.</em></h1>
      <p>Понятная базовая система для товарного бизнеса. Управляйте товарами, контрагентами, закупками, остатками, заказами и отгрузками в одном рабочем контуре.</p>
      <div class="hero-actions">
        <a class="button primary" href="product.html">Посмотреть FIXORA Base</a>
        <a class="button secondary" href="architecture.html">Как всё связано</a>
      </div>
      <div class="hero-notes">
        <span><i></i> Самостоятельный продукт</span>
        <span><i></i> Модульная архитектура</span>
        <span><i></i> Без обязательных add-ons</span>
      </div>
    </div>
    <div class="hero-system reveal" aria-label="Структура FIXORA Base">
      <div class="system-shell">
        <div class="system-top"><span>FIXORA PLATFORM</span><b>BASE</b></div>
        <div class="system-core">
          <div class="core-label">FIXORA</div>
          <strong>BASE</strong>
          <small>товарный контур</small>
        </div>
        <div class="system-module m1"><i>01</i><b>Catalog</b><span>Товары</span></div>
        <div class="system-module m2"><i>02</i><b>Partners</b><span>Контрагенты</span></div>
        <div class="system-module m3"><i>03</i><b>Purchasing</b><span>Закупки</span></div>
        <div class="system-module m4"><i>04</i><b>Inventory</b><span>Склад</span></div>
        <div class="system-module m5"><i>05</i><b>Sales</b><span>Продажи</span></div>
        <div class="connector c1"></div><div class="connector c2"></div><div class="connector c3"></div><div class="connector c4"></div><div class="connector c5"></div>
      </div>
    </div>
  </div>
</section>

<section class="section section-border">
  <div class="container">
    <div class="section-head reveal">
      <div><div class="eyebrow">ОСНОВА</div><h2>Пять блоков.<br>Один рабочий контур.</h2></div>
      <p>Base закрывает базовый путь товара от поставщика до клиента. Без бухгалтерии, производства, OCR и других расширений внутри ядра.</p>
    </div>
    <div class="module-grid">
      <a class="module-card reveal" href="product.html#catalog"><span class="module-index">01</span><div class="module-icon">C</div><small>CATALOG</small><h3>Товары и услуги</h3><p>Единый каталог для закупки, хранения и продажи.</p><b>Подробнее →</b></a>
      <a class="module-card reveal" href="product.html#partners"><span class="module-index">02</span><div class="module-icon">P</div><small>PARTNERS</small><h3>Контрагенты</h3><p>Клиенты и поставщики в одном справочнике без дублей.</p><b>Подробнее →</b></a>
      <a class="module-card reveal" href="purchasing.html"><span class="module-index">03</span><div class="module-icon">↙</div><small>PURCHASING</small><h3>Закупки</h3><p>Заказы поставщикам, приходы и частичные поставки.</p><b>Подробнее →</b></a>
      <a class="module-card reveal" href="inventory.html"><span class="module-index">04</span><div class="module-icon">I</div><small>INVENTORY</small><h3>Склад</h3><p>Остатки, движения, перемещения и инвентаризация.</p><b>Подробнее →</b></a>
      <a class="module-card reveal" href="sales.html"><span class="module-index">05</span><div class="module-icon">↗</div><small>SALES</small><h3>Продажи</h3><p>Заказы клиентов, резерв и отгрузки.</p><b>Подробнее →</b></a>
    </div>
  </div>
</section>

<section class="section process-section">
  <div class="container">
    <div class="section-head center reveal">
      <div><div class="eyebrow">BUSINESS FLOW</div><h2>От поставщика до клиента</h2></div>
      <p>Документы создают движения, движения создают остаток. Каждая цифра имеет источник.</p>
    </div>
    <div class="process-flow reveal">
      <div class="process-step"><span>01</span><b>Поставщик</b><small>Partner</small></div><i>→</i>
      <div class="process-step"><span>02</span><b>Закупка</b><small>Purchase</small></div><i>→</i>
      <div class="process-step"><span>03</span><b>Приход</b><small>Stock In</small></div><i>→</i>
      <div class="process-step featured"><span>04</span><b>Склад</b><small>Inventory</small></div><i>→</i>
      <div class="process-step"><span>05</span><b>Заказ</b><small>Sales Order</small></div><i>→</i>
      <div class="process-step"><span>06</span><b>Резерв</b><small>Reserve</small></div><i>→</i>
      <div class="process-step"><span>07</span><b>Отгрузка</b><small>Stock Out</small></div>
    </div>
  </div>
</section>

<section class="section dark-section">
  <div class="container principle-layout">
    <div class="principle-copy reveal">
      <div class="eyebrow light">КЛЮЧЕВОЙ ПРИНЦИП</div>
      <h2>Остаток не редактируют.<br>Его объясняют.</h2>
      <p>Физический остаток — результат подтверждённых движений. Приход увеличивает склад, отгрузка уменьшает, а инвентаризация создаёт корректирующее движение вместо переписывания истории.</p>
      <a class="text-link light-link" href="inventory.html">Как работает склад →</a>
    </div>
    <div class="stock-equation reveal">
      <div><small>Все приходы</small><strong>IN</strong></div>
      <span>−</span>
      <div><small>Все выбытия</small><strong>OUT</strong></div>
      <span>=</span>
      <div class="stock-result"><small>Текущий остаток</small><strong>STOCK</strong></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div><div class="eyebrow">ПРИНЦИПЫ</div><h2>Просто для пользователя.<br>Строго внутри.</h2></div>
      <p>FIXORA Base не заставляет бизнес изучать внутреннюю архитектуру. Пользователь работает с понятными товарами, документами, заказами и складом.</p>
    </div>
    <div class="principles-grid">
      <div class="principle reveal"><b>01</b><h3>ONE ITEM — ONE ID</h3><p>Один товар не дублируется между закупкой, складом и продажами.</p></div>
      <div class="principle reveal"><b>02</b><h3>ONE PARTNER — ONE CARD</h3><p>Компания может быть клиентом, поставщиком или сразу обоими.</p></div>
      <div class="principle reveal"><b>03</b><h3>EVERY CHANGE HAS A SOURCE</h3><p>Каждое изменение склада связано с документом-источником.</p></div>
      <div class="principle reveal"><b>04</b><h3>HISTORY IS PRESERVED</h3><p>История не переписывается молча — корректировки тоже являются движениями.</p></div>
    </div>
  </div>
</section>

<section class="section add-on-preview">
  <div class="container addon-box reveal">
    <div>
      <div class="eyebrow">МОДУЛЬНАЯ ПЛАТФОРМА</div>
      <h2>Base — начало, а не ограничение.</h2>
      <p>Когда бизнесу понадобятся финансы, OCR, производство, WMS, доставка или интеграции — они подключаются отдельно. Base продолжает работать как стабильный фундамент.</p>
    </div>
    <div class="addon-orbit">
      <span>Finance</span><span>OCR & AI</span><span>Manufacturing</span><span>WMS</span><span>Distribution</span><span>1C</span>
      <strong>BASE</strong>
    </div>
    <a class="button secondary" href="extensions.html">Посмотреть расширения</a>
  </div>
</section>
"""

product = """
<section class="page-hero">
  <div class="container narrow reveal">
    <div class="kicker"><span></span> FIXORA BASE / PRODUCT</div>
    <h1>Всё необходимое для базового товарного учёта.</h1>
    <p>Пять связанных блоков формируют самостоятельную ERP-базу: товары, контрагенты, закупки, склад и продажи.</p>
  </div>
</section>
<section class="section compact">
  <div class="container">
    <div class="product-stack">
      <article class="product-block reveal" id="catalog">
        <div class="product-number">01</div>
        <div class="product-content"><small>CATALOG</small><h2>Один каталог для всего бизнеса</h2><p>Item может быть товаром, сырьём, материалом, комплектующим, упаковкой, готовой продукцией или услугой. Один идентификатор используется во всех процессах.</p>
          <div class="inline-flow"><span>ITEM</span><i>→</i><span>Закупки</span><i>→</i><span>Склад</span><i>→</i><span>Продажи</span></div>
          <div class="feature-list"><span>SKU и категории</span><span>Единицы измерения</span><span>Штрихкоды</span><span>НДС</span><span>Статус активности</span><span>Можно закупать / хранить / продавать</span></div>
        </div>
      </article>
      <article class="product-block reveal" id="partners">
        <div class="product-number">02</div>
        <div class="product-content"><small>PARTNERS</small><h2>Одна компания — одна карточка</h2><p>Клиенты и поставщики живут в одном справочнике. Компания может иметь обе роли, несколько договоров и несколько точек доставки без создания дублей.</p>
          <div class="partner-structure"><strong>PARTNER</strong><span>Договоры</span><span>Точки доставки</span><span>Контакты</span><span>История операций</span></div>
        </div>
      </article>
      <article class="product-block reveal">
        <div class="product-number">03</div>
        <div class="product-content"><small>PURCHASING</small><h2>Закупки и приходы</h2><p>Работайте через заказ поставщику или создавайте приход напрямую. Заказ поставщику — полезный инструмент, но не обязательное условие.</p><a class="text-link" href="purchasing.html">Открыть закупки →</a></div>
      </article>
      <article class="product-block reveal">
        <div class="product-number">04</div>
        <div class="product-content"><small>INVENTORY</small><h2>Склад и остатки</h2><p>On Hand показывает физический остаток, Reserved — резерв заказов, Available — то, что можно продать. Остаток рассчитывается из движений.</p><a class="text-link" href="inventory.html">Открыть склад →</a></div>
      </article>
      <article class="product-block reveal">
        <div class="product-number">05</div>
        <div class="product-content"><small>SALES</small><h2>Заказы и отгрузки</h2><p>Заказ клиента проверяет доступный остаток, резервирует товар и завершается отгрузкой. Поддерживаются частичные отгрузки.</p><a class="text-link" href="sales.html">Открыть продажи →</a></div>
      </article>
    </div>
  </div>
</section>
<section class="section soft-section">
  <div class="container">
    <div class="boundary-grid reveal">
      <div><div class="eyebrow">ВХОДИТ В BASE</div><h2>Чёткая граница продукта</h2></div>
      <div class="included"><span>Catalog</span><span>Partners</span><span>Purchasing</span><span>Inventory</span><span>Sales</span></div>
      <div class="excluded"><small>Подключается отдельно</small><span>Finance / Settlements</span><span>OCR & AI</span><span>1C Integration</span><span>Manufacturing</span><span>Advanced Warehouse</span><span>Distribution</span><span>Advanced Analytics</span><span>Construction</span></div>
    </div>
  </div>
</section>
"""

purchasing = """
<section class="page-hero">
  <div class="container narrow reveal"><div class="kicker"><span></span> PURCHASING</div><h1>От поставщика до прихода на склад.</h1><p>Закупка может начинаться с заказа поставщику или сразу с прихода — в зависимости от процесса бизнеса.</p></div>
</section>
<section class="section compact">
  <div class="container">
    <div class="flow-board reveal">
      <div class="flow-node"><small>01</small><b>Поставщик</b></div><i>→</i><div class="flow-node optional"><small>02 · OPTIONAL</small><b>Заказ поставщику</b></div><i>→</i><div class="flow-node active"><small>03</small><b>Приход</b></div><i>→</i><div class="flow-node"><small>04</small><b>STOCK IN</b></div><i>→</i><div class="flow-node"><small>05</small><b>Склад</b></div>
    </div>
    <div class="two-col section-gap">
      <div class="content-card reveal"><div class="eyebrow">ПРОСТОЙ СЦЕНАРИЙ</div><h2>Заказ поставщику не обязателен.</h2><p>Малый бизнес может создать новый приход сразу после получения товара. Никаких искусственных обязательных шагов.</p><div class="mini-flow"><span>Поставщик</span><i>→</i><span>Новый приход</span><i>→</i><span>Склад</span></div></div>
      <div class="content-card reveal"><div class="eyebrow">КОНТРОЛЬ</div><h2>Когда заказ нужен.</h2><p>Заказ поставщику фиксирует ожидаемый ассортимент, количество, цену и дату. При поступлении можно видеть, что получено полностью, частично или ещё ожидается.</p></div>
    </div>
  </div>
</section>
<section class="section soft-section">
  <div class="container">
    <div class="section-head reveal"><div><div class="eyebrow">ЧАСТИЧНЫЕ ПОСТАВКИ</div><h2>Один заказ.<br>Несколько приходов.</h2></div><p>Каждый приход создаёт собственное движение на склад. Заказ закрывается только когда весь согласованный объём получен или документ закрыт вручную.</p></div>
    <div class="split-quantity reveal"><div class="quantity-main"><small>PURCHASE ORDER</small><strong>1 000 кг</strong></div><i>→</i><div class="quantity-parts"><div><small>Receipt #1</small><strong>600 кг</strong></div><b>+</b><div><small>Receipt #2</small><strong>400 кг</strong></div></div><i>→</i><div class="quantity-done"><small>RECEIVED</small><strong>1 000 кг</strong></div></div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head reveal"><div><div class="eyebrow">ДОКУМЕНТ</div><h2>Что фиксирует приход</h2></div></div>
    <div class="field-grid">
      <div class="field-card reveal"><small>Контекст</small><h3>Поставщик и договор</h3><p>Кто поставил товар и по какому договору.</p></div>
      <div class="field-card reveal"><small>Куда</small><h3>Склад</h3><p>На какой склад поступает физический товар.</p></div>
      <div class="field-card reveal"><small>Источник</small><h3>Документ поставщика</h3><p>Дата и номер внешнего документа.</p></div>
      <div class="field-card reveal"><small>Строки</small><h3>Товар, количество, цена</h3><p>Фактически принятые позиции и стоимость.</p></div>
    </div>
  </div>
</section>
"""

inventory = """
<section class="page-hero">
  <div class="container narrow reveal"><div class="kicker"><span></span> INVENTORY</div><h1>Всегда понятно, что есть на складе.</h1><p>FIXORA разделяет физический остаток, резерв и доступное к продаже количество — и показывает источник каждого изменения.</p></div>
</section>
<section class="section compact">
  <div class="container">
    <div class="metric-triplet reveal">
      <div><small>ON HAND</small><strong>Физически на складе</strong><p>Всё подтверждённое количество, которое реально находится на складе.</p></div>
      <div><small>RESERVED</small><strong>Зарезервировано</strong><p>Количество, уже закреплённое за подтверждёнными заказами клиентов.</p></div>
      <div class="metric-accent"><small>AVAILABLE</small><strong>Можно продать</strong><p>Доступное количество после вычета резерва.</p></div>
    </div>
    <div class="formula reveal"><span>AVAILABLE</span><b>=</b><span>ON HAND</span><b>−</b><span>RESERVED</span></div>
  </div>
</section>
<section class="section dark-section">
  <div class="container principle-layout">
    <div class="principle-copy reveal"><div class="eyebrow light">ВАЖНЫЙ ПРИНЦИП</div><h2>Остаток нельзя изменить вручную.</h2><p>Если цифра изменилась — существует движение, которое её изменило. Это делает склад проверяемым и объяснимым.</p></div>
    <div class="movement-stack reveal"><div><b>+500 кг</b><span>Приход PR-125</span></div><div class="out"><b>−100 кг</b><span>Отгрузка SH-201</span></div><div><b>+600 кг</b><span>Приход PR-131</span></div><div class="out"><b>−150 кг</b><span>Отгрузка SH-207</span></div></div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head reveal"><div><div class="eyebrow">ДВИЖЕНИЯ</div><h2>История склада — это цепочка фактов.</h2></div><p>Каждое движение связано с исходным документом, поэтому пользователь может перейти от цифры в остатке к причине её появления.</p></div>
    <div class="warehouse-grid">
      <div class="content-card reveal"><h3>Перемещение</h3><p>Основной склад −100 кг → Склад №2 +100 кг. Общий остаток компании не меняется.</p><div class="warehouse-transfer"><span>Склад A <b>−100</b></span><i>→</i><span>Склад B <b>+100</b></span></div></div>
      <div class="content-card reveal"><h3>Инвентаризация</h3><p>Система 850 кг, фактически 842 кг. FIXORA создаёт Adjustment −8 кг и сохраняет историю.</p><div class="inventory-adjust"><span><small>Система</small><b>850</b></span><i>→</i><span class="warn"><small>Разница</small><b>−8</b></span><i>→</i><span><small>Новый остаток</small><b>842</b></span></div></div>
    </div>
  </div>
</section>
"""

sales = """
<section class="page-hero">
  <div class="container narrow reveal"><div class="kicker"><span></span> SALES</div><h1>От заказа клиента до отгрузки.</h1><p>Заказ проверяет доступный остаток, резервирует товар и превращается в фактическое выбытие только после отгрузки.</p></div>
</section>
<section class="section compact">
  <div class="container">
    <div class="flow-board reveal">
      <div class="flow-node"><small>01</small><b>Клиент</b></div><i>→</i><div class="flow-node"><small>02</small><b>Заказ</b></div><i>→</i><div class="flow-node"><small>03</small><b>Проверка остатка</b></div><i>→</i><div class="flow-node active"><small>04</small><b>Резерв</b></div><i>→</i><div class="flow-node"><small>05</small><b>Отгрузка</b></div><i>→</i><div class="flow-node"><small>06</small><b>STOCK OUT</b></div>
    </div>
  </div>
</section>
<section class="section soft-section">
  <div class="container">
    <div class="section-head reveal"><div><div class="eyebrow">РЕЗЕРВ</div><h2>Резерв не уменьшает физический склад.</h2></div><p>Он уменьшает только Available. Физический On Hand меняется лишь после фактической отгрузки.</p></div>
    <div class="reserve-story reveal">
      <div><small>ДО ЗАКАЗА</small><span><b>On Hand</b>850 кг</span><span><b>Reserved</b>0 кг</span><span class="strong"><b>Available</b>850 кг</span></div>
      <i>→</i>
      <div><small>ПОСЛЕ РЕЗЕРВА 200 КГ</small><span><b>On Hand</b>850 кг</span><span><b>Reserved</b>200 кг</span><span class="strong"><b>Available</b>650 кг</span></div>
      <i>→</i>
      <div><small>ПОСЛЕ ОТГРУЗКИ</small><span><b>On Hand</b>650 кг</span><span><b>Reserved</b>0 кг</span><span class="strong"><b>Available</b>650 кг</span></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="two-col">
      <div class="content-card reveal"><div class="eyebrow">ЧАСТИЧНЫЕ ОТГРУЗКИ</div><h2>Один заказ — несколько отгрузок.</h2><p>Заказ на 1 000 кг может быть отгружен двумя партиями: 600 кг и 400 кг. Статус отражает фактическое исполнение заказа.</p><div class="mini-flow stacked"><span>Order 1 000</span><i>→</i><span>Shipment 600</span><b>+</b><span>Shipment 400</span></div></div>
      <div class="content-card reveal"><div class="eyebrow">ЦЕНА</div><h2>Цена сохраняется в операции.</h2><p>Изменение прайса сегодня не меняет уже проведённые заказы вчера. Историческая операция хранит свою цену.</p><div class="price-timeline"><span><small>01–13</small><b>75 MDL</b></span><span class="price-special"><small>14–17</small><b>72 MDL</b></span><span><small>18 →</small><b>75 MDL</b></span></div></div>
    </div>
  </div>
</section>
"""

architecture = """
<section class="page-hero">
  <div class="container narrow reveal"><div class="kicker"><span></span> ARCHITECTURE</div><h1>Как FIXORA Base связан внутри.</h1><p>Пользователь видит простые документы. Внутри они образуют строгую цепочку данных, которая связывает закупки, склад и продажи.</p></div>
</section>
<section class="section compact">
  <div class="container">
    <div class="architecture-map reveal">
      <div class="arch-row masters"><div><small>MASTER DATA</small><b>CATALOG</b></div><span>+</span><div><small>MASTER DATA</small><b>PARTNERS</b></div></div>
      <i>↓</i>
      <div class="arch-row"><div><small>PURCHASING</small><b>PURCHASE ORDER</b></div><span>→</span><div><small>DOCUMENT</small><b>RECEIPT</b></div><span>→</span><div class="accent"><small>MOVEMENT</small><b>STOCK IN</b></div></div>
      <i>↓</i>
      <div class="arch-center"><small>INVENTORY</small><b>ON HAND · RESERVED · AVAILABLE</b></div>
      <i>↓</i>
      <div class="arch-row"><div><small>SALES</small><b>SALES ORDER</b></div><span>→</span><div><small>ALLOCATION</small><b>RESERVATION</b></div><span>→</span><div><small>DOCUMENT</small><b>SHIPMENT</b></div><span>→</span><div class="accent red"><small>MOVEMENT</small><b>STOCK OUT</b></div></div>
    </div>
  </div>
</section>
<section class="section soft-section">
  <div class="container">
    <div class="section-head reveal"><div><div class="eyebrow">TRACEABILITY</div><h2>Откуда появилась эта цифра?</h2></div><p>Base позволяет идти от остатка к движению, от движения к документу и дальше к контрагенту — и в обратную сторону.</p></div>
    <div class="trace-grid">
      <div class="trace-path reveal"><span>Остаток</span><i>→</i><span>Stock Movement</span><i>→</i><span>Receipt</span><i>→</i><span>Supplier</span></div>
      <div class="trace-path reveal"><span>Sales Order</span><i>→</i><span>Shipment</span><i>→</i><span>Stock Movement OUT</span><i>→</i><span>Inventory</span></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="platform-layers reveal">
      <div class="layer platform"><small>PLATFORM</small><b>FIXORA PLATFORM</b></div>
      <i>↓</i>
      <div class="layer base"><small>CORE PRODUCT</small><b>FIXORA BASE</b><span>Catalog · Partners · Purchasing · Inventory · Sales</span></div>
      <i>↓</i>
      <div class="layer optional"><small>OPTIONAL CAPABILITIES</small><span>Finance</span><span>OCR / AI</span><span>Manufacturing</span><span>Distribution</span><span>Advanced Warehouse</span><span>Analytics</span><span>1C</span><span>Construction</span></div>
    </div>
  </div>
</section>
"""

extensions = """
<section class="page-hero">
  <div class="container narrow reveal"><div class="kicker"><span></span> EXTENSIONS</div><h1>Начните с базы.<br>Добавляйте только нужное.</h1><p>Расширения не смешиваются с FIXORA Base и не являются обязательными. Они подключаются отдельно, когда бизнесу действительно нужна новая глубина.</p></div>
</section>
<section class="section compact">
  <div class="container">
    <div class="extension-core reveal"><div><small>STANDALONE PRODUCT</small><strong>FIXORA BASE</strong><span>Catalog · Partners · Purchasing · Inventory · Sales</span></div><b>+</b><p>ADD WHAT YOU NEED</p></div>
    <div class="extensions-grid">
      <div class="extension-card reveal"><span>01</span><small>FINANCE</small><h3>Documents & Settlements</h3><p>Платежи, взаиморасчёты, задолженности и сверка — отдельный финансовый слой.</p></div>
      <div class="extension-card reveal"><span>02</span><small>OCR & AI</small><h3>Document Intelligence</h3><p>Распознавание документов, извлечение данных, matching и validation.</p></div>
      <div class="extension-card reveal"><span>03</span><small>INTEGRATION</small><h3>1C Integration</h3><p>Синхронизация документов и справочников с существующей 1C.</p></div>
      <div class="extension-card reveal"><span>04</span><small>MANUFACTURING</small><h3>Production</h3><p>Производство, рецептуры / BOM, операции и производственная себестоимость.</p></div>
      <div class="extension-card reveal"><span>05</span><small>WAREHOUSE</small><h3>Advanced Warehouse</h3><p>Партии, сроки, серийные номера, зоны, ячейки и WMS-процессы.</p></div>
      <div class="extension-card reveal"><span>06</span><small>DISTRIBUTION</small><h3>Delivery & Agents</h3><p>Маршруты, доставка, агенты и полевые процессы.</p></div>
      <div class="extension-card reveal"><span>07</span><small>ANALYTICS</small><h3>Advanced Analytics</h3><p>Управленческие отчёты, KPI и детальная аналитика.</p></div>
      <div class="extension-card reveal"><span>08</span><small>CONSTRUCTION</small><h3>Projects & Sites</h3><p>Проекты, материалы, объекты и отраслевые затраты.</p></div>
    </div>
  </div>
</section>
<section class="section dark-section">
  <div class="container center-message reveal"><div class="eyebrow light">ГЛАВНАЯ ЛОГИКА</div><h2>Base должен быть полезен<br>даже если больше ничего не подключено.</h2><p>Расширения увеличивают возможности платформы, но не превращают базовый продукт в зависимый конструктор.</p><a class="button light-button" href="product.html">Вернуться к Base</a></div>
</section>
"""

pages = {
    "index.html": ("Базовая ERP для закупок, склада и продаж", "FIXORA Base — самостоятельная ERP-система для закупок, склада и продаж.", "index.html", home),
    "product.html": ("Продукт", "Что входит в FIXORA Base: Catalog, Partners, Purchasing, Inventory и Sales.", "product.html", product),
    "purchasing.html": ("Закупки", "Закупки и приходы в FIXORA Base.", "purchasing.html", purchasing),
    "inventory.html": ("Склад", "Остатки, движения, перемещения и инвентаризация в FIXORA Base.", "inventory.html", inventory),
    "sales.html": ("Продажи", "Заказы, резерв и отгрузки в FIXORA Base.", "sales.html", sales),
    "architecture.html": ("Архитектура", "Как связаны Catalog, Partners, Purchasing, Inventory и Sales в FIXORA Base.", "architecture.html", architecture),
    "extensions.html": ("Расширения", "Опциональные расширения FIXORA, подключаемые поверх Base.", "extensions.html", extensions),
}

for filename, (title, desc, page, body) in pages.items():
    (OUT / filename).write_text(shell(title, desc, page, body), encoding="utf-8")

shutil.copy2(ROOT / "styles.css", OUT / "styles.css")
shutil.copy2(ROOT / "app.js", OUT / "app.js")

assert len(list(OUT.glob("*.html"))) == 7
assert not (OUT / "demo.html").exists()
assert "Demo" not in "\n".join(p.read_text(encoding="utf-8") for p in OUT.glob("*.html"))
print("Built new FIXORA Base website:", len(list(OUT.glob("*.html"))), "pages")
