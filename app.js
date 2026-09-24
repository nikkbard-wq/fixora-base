(() => {
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];

  const mobileToggle=q('.mobile-toggle'), mobileMenu=q('.mobile-menu');
  if(mobileToggle&&mobileMenu) mobileToggle.addEventListener('click',()=>mobileMenu.classList.toggle('open'));

  qa('[data-flow]').forEach(flow => {
    const steps=qa('.flow-step', flow);
    steps.forEach((step,i)=>{
      step.addEventListener('mouseenter',()=>steps.forEach((s,j)=>s.classList.toggle('flow-active',j<=i)));
      step.addEventListener('mouseleave',()=>steps.forEach(s=>s.classList.remove('flow-active')));
    });
  });

  qa('[data-tabs]').forEach(tabs=>{
    qa('button',tabs).forEach(btn=>btn.addEventListener('click',()=>{
      qa('button',tabs).forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const card=tabs.closest('.partner-card');
      qa('.tab-panel',card).forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.tab));
    }));
  });

  const arch=q('[data-architecture]');
  if(arch){
    const nodes=qa('a[data-level]',arch);
    nodes.forEach(node=>{
      node.addEventListener('mouseenter',()=>{
        const level=+node.dataset.level;
        nodes.forEach(n=>n.classList.toggle('active-path',+n.dataset.level<=level));
      });
      node.addEventListener('mouseleave',()=>nodes.forEach(n=>n.classList.remove('active-path')));
    });
  }

  const productTable=q('#productTable');
  if(productTable){
    const body=q('tbody',productTable), rows=qa('tr',body), search=q('#productSearch'), status=q('#statusFilter'), sort=q('#sortStock');
    const apply=()=>{
      const term=(search.value||'').toLowerCase(), st=status.value;
      rows.forEach(r=>{
        const text=r.innerText.toLowerCase();
        const okTerm=!term||text.includes(term), okStatus=st==='all'||text.includes(st.toLowerCase());
        r.style.display=(okTerm&&okStatus)?'':'none';
      });
    };
    search.addEventListener('input',apply);status.addEventListener('change',apply);
    let desc=true;
    sort.addEventListener('click',()=>{
      const list=[...rows].sort((a,b)=>{
        const av=parseFloat(a.cells[4].innerText.replace(/[^0-9.-]/g,''))||-1;
        const bv=parseFloat(b.cells[4].innerText.replace(/[^0-9.-]/g,''))||-1;
        return desc?bv-av:av-bv;
      });
      list.forEach(r=>body.appendChild(r));desc=!desc;sort.textContent=`Остаток ${desc?'↓':'↑'}`;
    });
  }

  const demo=q('#demoApp');
  if(!demo) return;

  const state={step:0,item:false,supplier:false,receipt:false,onHand:0,client:false,order:false,reserved:0,shipped:false,activities:[]};
  const labels={dashboard:'Главная',products:'Товары',partners:'Контрагенты',purchasing:'Закупки',inventory:'Склад',sales:'Продажи',settings:'Настройки'};
  const navTo=(name)=>{
    qa('[data-demo-nav]',demo).forEach(b=>b.classList.toggle('active',b.dataset.demoNav===name));
    qa('[data-demo-panel]',demo).forEach(p=>p.classList.toggle('active',p.dataset.demoPanel===name));
    q('#demoCrumb').textContent=labels[name]||name;
    window.location.hash='demoApp';
  };
  qa('[data-demo-nav]',demo).forEach(b=>b.addEventListener('click',()=>navTo(b.dataset.demoNav)));

  const addActivity=(title,meta)=>{state.activities.unshift({title,meta});state.activities=state.activities.slice(0,6)};
  const steps=[
    {title:'Создать товар',meta:'Филе куриное · FIL-001',action:'createItem',view:'products'},
    {title:'Создать поставщика',meta:'Global Food SRL',action:'createSupplier',view:'partners'},
    {title:'Сделать приход',meta:'500 кг · PR-001',action:'createReceipt',view:'purchasing'},
    {title:'Увидеть товар на складе',meta:'On Hand становится 500 кг',action:'viewInventory',view:'inventory'},
    {title:'Создать клиента',meta:'Kaufland SRL',action:'createClient',view:'partners'},
    {title:'Создать заказ',meta:'200 кг · SO-001',action:'createOrder',view:'sales'},
    {title:'Зарезервировать товар',meta:'Reserved 200 кг',action:'reserve',view:'sales'},
    {title:'Сделать отгрузку',meta:'200 кг · SH-001',action:'ship',view:'sales'},
    {title:'Увидеть новый остаток',meta:'On Hand 300 кг · Available 300 кг',action:'finish',view:'inventory'}
  ];

  const canRun=(i)=>i===state.step;
  function render(){
    q('#kpiItems').textContent=state.item?'1':'0';
    q('#kpiOnHand').textContent=`${state.onHand} кг`;
    q('#kpiReserved').textContent=`${state.reserved} кг`;
    q('#kpiAvailable').textContent=`${state.onHand-state.reserved} кг`;
    const pct=Math.round((state.step/steps.length)*100);q('#demoProgress').textContent=`${pct}%`;
    q('.progress-ring').style.setProperty('--progress',`${pct}%`);
    q('#demoSteps').innerHTML=steps.map((s,i)=>`<div class="demo-step ${i<state.step?'done':''}"><span>${i<state.step?'✓':String(i+1).padStart(2,'0')}</span><div><b>${s.title}</b><small>${s.meta}</small></div><button ${canRun(i)?'':'disabled'} data-step-action="${i}">${i<state.step?'Готово':i===state.step?'Выполнить':'Далее'}</button></div>`).join('');
    qa('[data-step-action]',q('#demoSteps')).forEach(b=>b.addEventListener('click',()=>runStep(+b.dataset.stepAction)));
    const feed=q('#activityFeed');
    feed.innerHTML=state.activities.length?state.activities.map(a=>`<div class="activity-item"><b>${a.title}</b><small>${a.meta}</small></div>`).join(''):`<div class="empty-state"><span>⌁</span><b>Операций пока нет</b><small>Начните со шага «Создать товар».</small></div>`;
    renderPanels();
  }
  function renderPanels(){
    q('#demoProducts').innerHTML=state.item?`<div class="demo-list"><div class="demo-list-head"><span>Товар</span><span>SKU</span><span>Ед.</span><span>Статус</span></div><div class="demo-list-row"><b>Филе куриное</b><span>FIL-001</span><span>кг</span><span class="status success"><i></i>Активен</span></div></div>`:`<div class="empty-large"><span>◫</span><h3>Нет товаров</h3><p>Создайте первый товар, чтобы начать demo.</p></div>`;
    let partners=[]; if(state.supplier)partners.push(['Global Food SRL','Поставщик']); if(state.client)partners.push(['Kaufland SRL','Клиент']);
    q('#demoPartners').innerHTML=partners.length?`<div class="demo-list"><div class="demo-list-head"><span>Контрагент</span><span>Роль</span><span>Статус</span><span>Demo</span></div>${partners.map(p=>`<div class="demo-list-row"><b>${p[0]}</b><span>${p[1]}</span><span class="status success"><i></i>Активен</span><span>demo</span></div>`).join('')}</div>`:`<div class="empty-large"><span>◎</span><h3>Нет контрагентов</h3><p>Создайте поставщика или клиента.</p></div>`;
    q('#demoPurchasing').innerHTML=state.receipt?`<div class="demo-doc"><div class="demo-doc-head"><div><small>Приход</small><b>PR-001</b></div><span class="status success"><i></i>Проведён</span></div><div class="demo-list"><div class="demo-list-head"><span>Товар</span><span>Количество</span><span>Цена</span><span>Сумма</span></div><div class="demo-list-row"><b>Филе куриное</b><span>500 кг</span><span>68 MDL</span><span>34 000 MDL</span></div></div></div>`:`<div class="empty-large"><span>↙</span><h3>Нет приходов</h3><p>Проведите первый приход после создания товара и поставщика.</p></div>`;
    q('#demoInventory').innerHTML=state.receipt?`<div class="demo-stock-grid"><div class="demo-stock-card"><small>On Hand</small><strong>${state.onHand} кг</strong></div><div class="demo-stock-card"><small>Reserved</small><strong>${state.reserved} кг</strong></div><div class="demo-stock-card available"><small>Available</small><strong>${state.onHand-state.reserved} кг</strong></div></div><div style="margin-top:14px" class="demo-doc"><div class="demo-doc-head"><div><small>Товар</small><b>Филе куриное</b></div><span class="demo-tag">LIVE DEMO STATE</span></div><div class="demo-list"><div class="demo-list-head"><span>Движение</span><span>Источник</span><span>Количество</span><span>Статус</span></div><div class="demo-list-row"><b>Stock In</b><span>PR-001</span><span>+500 кг</span><span>Проведено</span></div>${state.shipped?`<div class="demo-list-row"><b>Stock Out</b><span>SH-001</span><span>−200 кг</span><span>Проведено</span></div>`:''}</div></div>`:`<div class="empty-large"><span>▦</span><h3>Склад пуст</h3><p>Остаток появится после проведения прихода.</p></div>`;
    let sales='';
    if(!state.order) sales=`<div class="empty-large"><span>↗</span><h3>Нет заказов</h3><p>Создайте клиента и первый заказ.</p></div>`;
    else sales=`<div class="demo-doc"><div class="demo-doc-head"><div><small>Заказ</small><b>SO-001 · 200 кг</b></div><span class="status ${state.shipped?'success':state.reserved?'reserved':'warning'}"><i></i>${state.shipped?'SHIPPED':state.reserved?'RESERVED':'CONFIRMED'}</span></div>${state.reserved&&!state.shipped?'<div class="demo-notice">200 кг зарезервировано. On Hand остаётся 500 кг, Available = 300 кг.</div>':''}${state.shipped?'<div class="demo-success">Отгрузка SH-001 проведена. On Hand уменьшился до 300 кг, Reserved = 0 кг.</div>':''}</div>`;
    q('#demoSales').innerHTML=sales;
  }
  function runStep(i){
    if(i!==state.step)return;
    const a=steps[i].action;
    if(a==='createItem'){state.item=true;addActivity('Создан товар FIL-001','Филе куриное · кг')}
    if(a==='createSupplier'){state.supplier=true;addActivity('Создан поставщик','Global Food SRL')}
    if(a==='createReceipt'){if(!state.item||!state.supplier)return;state.receipt=true;state.onHand=500;addActivity('Проведён приход PR-001','+500 кг · Филе куриное')}
    if(a==='viewInventory'){navTo('inventory');addActivity('Проверен остаток','On Hand 500 кг')}
    if(a==='createClient'){state.client=true;addActivity('Создан клиент','Kaufland SRL')}
    if(a==='createOrder'){if(!state.client||!state.receipt)return;state.order=true;addActivity('Создан заказ SO-001','200 кг · Kaufland SRL')}
    if(a==='reserve'){if(!state.order)return;state.reserved=200;addActivity('Товар зарезервирован','Reserved +200 кг · Available 300 кг')}
    if(a==='ship'){if(state.reserved!==200)return;state.onHand-=200;state.reserved=0;state.shipped=true;addActivity('Проведена отгрузка SH-001','−200 кг · On Hand 300 кг')}
    if(a==='finish'){navTo('inventory');addActivity('Сценарий завершён','Новый остаток: 300 кг')}
    state.step++;render();
  }
  qa('[data-demo-action]',demo).forEach(b=>b.addEventListener('click',()=>{
    const map={createItem:0,createSupplier:1,createReceipt:2,createOrder:5};
    const idx=map[b.dataset.demoAction];
    if(idx===state.step)runStep(idx);else navTo(labels[b.dataset.demoAction]||'dashboard');
  }));
  q('#resetDemo').addEventListener('click',()=>{Object.assign(state,{step:0,item:false,supplier:false,receipt:false,onHand:0,client:false,order:false,reserved:0,shipped:false,activities:[]});navTo('dashboard');render()});
  render();
})();