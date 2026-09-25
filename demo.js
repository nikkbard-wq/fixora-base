(() => {
  const STORAGE_KEY = 'fixora-base-demo-v1';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const uid=(p)=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  const today=()=>new Date().toISOString().slice(0,10);
  const money=(n)=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'MDL',maximumFractionDigits:2}).format(Number(n||0));
  const qty=(n)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:3}).format(Number(n||0));
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  const seed = () => ({
    products:[
      {id:'p-fil',sku:'FIL-001',name:'Филе куриное',category:'Мясо птицы',unit:'кг',active:true},
      {id:'p-thi',sku:'THI-001',name:'Бедро куриное',category:'Мясо птицы',unit:'кг',active:true},
      {id:'p-wing',sku:'WNG-001',name:'Крыло куриное',category:'Мясо птицы',unit:'кг',active:true}
    ],
    partners:[
      {id:'s-global',name:'Global Food SRL',idno:'1024600012345',roles:['supplier'],phone:'+373 22 000 101',email:'office@globalfood.demo',active:true},
      {id:'c-kaufland',name:'Kaufland SRL',idno:'1007600038927',roles:['customer'],phone:'+373 22 000 202',email:'orders@kaufland.demo',active:true},
      {id:'c-linella',name:'Linella SRL',idno:'1003600043210',roles:['customer'],phone:'+373 22 000 303',email:'orders@linella.demo',active:true}
    ],
    receipts:[
      {id:'r-001',number:'PR-001',date:today(),partnerId:'s-global',status:'posted',lines:[
        {productId:'p-fil',qty:500,price:68},
        {productId:'p-thi',qty:300,price:49},
        {productId:'p-wing',qty:180,price:36}
      ]}
    ],
    orders:[
      {id:'o-001',number:'SO-001',date:today(),partnerId:'c-kaufland',status:'confirmed',lines:[{productId:'p-fil',qty:120,price:74}]}
    ],
    movements:[
      {id:'m-1',date:today(),type:'in',productId:'p-fil',qty:500,sourceType:'receipt',sourceId:'r-001',sourceNumber:'PR-001'},
      {id:'m-2',date:today(),type:'in',productId:'p-thi',qty:300,sourceType:'receipt',sourceId:'r-001',sourceNumber:'PR-001'},
      {id:'m-3',date:today(),type:'in',productId:'p-wing',qty:180,sourceType:'receipt',sourceId:'r-001',sourceNumber:'PR-001'}
    ],
    seq:{receipt:2,order:2}
  });

  let state = load();
  let currentView='dashboard';
  let partnerRoleFilter='all';

  function load(){
    try{
      const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      return x&&x.products&&x.partners&&x.receipts&&x.orders&&x.movements?x:seed();
    }catch{return seed()}
  }
  function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  function product(id){return state.products.find(x=>x.id===id)}
  function partner(id){return state.partners.find(x=>x.id===id)}
  function onHand(productId){return state.movements.filter(m=>m.productId===productId).reduce((a,m)=>a+(m.type==='in'?1:-1)*Number(m.qty),0)}
  function reserved(productId){return state.orders.filter(o=>o.status==='reserved').flatMap(o=>o.lines).filter(l=>l.productId===productId).reduce((a,l)=>a+Number(l.qty),0)}
  function available(productId){return onHand(productId)-reserved(productId)}
  function receiptTotal(r){return r.lines.reduce((a,l)=>a+Number(l.qty)*Number(l.price),0)}
  function orderTotal(o){return o.lines.reduce((a,l)=>a+Number(l.qty)*Number(l.price),0)}

  function toast(title,msg='',kind='success'){
    const el=document.createElement('div'); el.className='toast '+kind;
    el.innerHTML='<b>'+esc(title)+'</b>'+esc(msg);
    $('#toastStack').append(el); setTimeout(()=>el.remove(),2800);
  }

  function setView(view){
    currentView=view;
    $$('[data-view-panel]').forEach(x=>x.classList.toggle('active',x.dataset.viewPanel===view));
    $$('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
    const titles={dashboard:'Главная',products:'Товары',partners:'Контрагенты',purchasing:'Закупки',inventory:'Склад',sales:'Продажи'};
    $('#viewTitle').textContent=titles[view]||view;
    closeSide();
    renderAll();
  }

  function openSide(){$('#side').classList.add('open');$('#sideOverlay').classList.add('open')}
  function closeSide(){$('#side').classList.remove('open');$('#sideOverlay').classList.remove('open')}

  function openModal(kicker,title,body,footer){
    $('#modalKicker').textContent=kicker; $('#modalTitle').textContent=title;
    $('#modalBody').innerHTML=body; $('#modalFooter').innerHTML=footer;
    $('#modalLayer').classList.add('open'); $('#modalLayer').setAttribute('aria-hidden','false');
    setTimeout(()=>$('#modal input, #modal select')?.focus(),20);
  }
  function closeModal(){$('#modalLayer').classList.remove('open');$('#modalLayer').setAttribute('aria-hidden','true')}
  $$('[data-close-modal]').forEach(x=>x.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

  function statusHtml(status){
    const labels={active:'Активен',posted:'Проведён',confirmed:'Подтверждён',reserved:'Зарезервирован',shipped:'Отгружен',draft:'Черновик'};
    return '<span class="status '+status+'">'+(labels[status]||status)+'</span>';
  }
  function roleHtml(roles){return '<div class="role-pills">'+roles.map(r=>'<span>'+(r==='supplier'?'Поставщик':'Клиент')+'</span>').join('')+'</div>'}

  function renderDashboard(){
    $('#kpiProducts').textContent=state.products.filter(x=>x.active).length;
    $('#kpiPartners').textContent=state.partners.filter(x=>x.active).length;
    $('#kpiReceipts').textContent=state.receipts.filter(x=>x.status==='posted').length;
    $('#kpiToShip').textContent=state.orders.filter(x=>['confirmed','reserved'].includes(x.status)).length;
    const stocks=state.products.map(p=>({p,on:onHand(p.id),res:reserved(p.id),av:available(p.id)})).filter(x=>x.on||x.res);
    $('#dashboardStock').innerHTML=stocks.length?stocks.slice(0,6).map(x=>`
      <div class="stock-row"><div><b>${esc(x.p.name)}</b><small>${esc(x.p.sku)} · ${esc(x.p.unit)}</small></div><span><small>On Hand</small><strong>${qty(x.on)}</strong></span><span><small>Reserved</small><strong>${qty(x.res)}</strong></span><span class="available"><small>Available</small><strong>${qty(x.av)}</strong></span></div>`).join(''):
      '<div class="empty"><span>▦</span><h3>Склад пуст</h3><p>Проведите первый приход.</p></div>';
    const ms=[...state.movements].reverse().slice(0,7);
    $('#dashboardMovements').innerHTML=ms.length?ms.map(m=>{
      const p=product(m.productId); return `<div class="movement-row"><div><b>${esc(p?.name||'Товар')}</b><small>${esc(m.sourceNumber)} · ${esc(m.date)}</small></div><span>${m.type==='in'?'Stock In':'Stock Out'}</span><strong class="${m.type}">${m.type==='in'?'+':'−'}${qty(m.qty)} ${esc(p?.unit||'')}</strong></div>`
    }).join(''):'<div class="empty"><span>⇄</span><h3>Движений нет</h3><p>История появится после операций.</p></div>';
  }

  function renderProducts(){
    const term=($('#productSearch')?.value||'').trim().toLowerCase();
    const rows=state.products.filter(p=>!term||p.name.toLowerCase().includes(term)||p.sku.toLowerCase().includes(term));
    $('#productsBody').innerHTML=rows.map(p=>`<tr><td><span class="cell-title">${esc(p.sku)}</span></td><td><span class="cell-title">${esc(p.name)}</span></td><td>${esc(p.category||'—')}</td><td>${esc(p.unit)}</td><td class="num">${qty(onHand(p.id))}</td><td class="num">${qty(reserved(p.id))}</td><td class="num"><b>${qty(available(p.id))}</b></td><td>${statusHtml(p.active?'active':'draft')}</td><td><button class="row-menu" data-edit-product="${p.id}">•••</button></td></tr>`).join('');
    $('#productsEmpty').classList.toggle('hidden',rows.length>0);
    $('#productCountLabel').textContent=rows.length+' из '+state.products.length;
    $('#navProductsCount').textContent=state.products.length;
    $$('[data-edit-product]').forEach(b=>b.onclick=()=>editProduct(b.dataset.editProduct));
  }

  function renderPartners(){
    const term=($('#partnerSearch')?.value||'').trim().toLowerCase();
    const rows=state.partners.filter(p=>(partnerRoleFilter==='all'||p.roles.includes(partnerRoleFilter))&&(!term||p.name.toLowerCase().includes(term)||p.idno.includes(term)));
    $('#partnersBody').innerHTML=rows.map(p=>`<tr><td><span class="cell-title">${esc(p.name)}</span><span class="cell-sub">${esc(p.email||'')}</span></td><td>${esc(p.idno||'—')}</td><td>${roleHtml(p.roles)}</td><td>${esc(p.phone||'—')}</td><td>${statusHtml(p.active?'active':'draft')}</td><td><button class="row-menu" data-edit-partner="${p.id}">•••</button></td></tr>`).join('');
    $('#partnersEmpty').classList.toggle('hidden',rows.length>0);
    $('#navPartnersCount').textContent=state.partners.length;
    $$('[data-edit-partner]').forEach(b=>b.onclick=()=>editPartner(b.dataset.editPartner));
  }

  function renderReceipts(){
    $('#receiptsBody').innerHTML=[...state.receipts].reverse().map(r=>`<tr><td><span class="cell-title">${esc(r.number)}</span></td><td>${esc(r.date)}</td><td>${esc(partner(r.partnerId)?.name||'—')}</td><td class="num">${r.lines.length}</td><td class="num"><b>${money(receiptTotal(r))}</b></td><td>${statusHtml(r.status)}</td><td><button class="row-menu" data-view-receipt="${r.id}">•••</button></td></tr>`).join('');
    $('#receiptsEmpty').classList.toggle('hidden',state.receipts.length>0);
    $('#receiptCountLabel').textContent=state.receipts.length+' документов';
    $('#navReceiptsCount').textContent=state.receipts.length;
    $$('[data-view-receipt]').forEach(b=>b.onclick=()=>viewReceipt(b.dataset.viewReceipt));
  }

  function renderInventory(){
    const rows=state.products.map(p=>({p,on:onHand(p.id),res:reserved(p.id),av:available(p.id)}));
    $('#stockBody').innerHTML=rows.map(x=>`<tr><td><span class="cell-title">${esc(x.p.sku)}</span></td><td><span class="cell-title">${esc(x.p.name)}</span></td><td>${esc(x.p.unit)}</td><td class="num">${qty(x.on)}</td><td class="num">${qty(x.res)}</td><td class="num"><b>${qty(x.av)}</b></td><td>${x.av<0?'<span class="status confirmed">Дефицит</span>':x.res>0?'<span class="status reserved">Есть резерв</span>':'<span class="status active">Доступен</span>'}</td></tr>`).join('');
    $('#stockSkuCount').textContent=rows.filter(x=>x.on>0).length;
    $('#reservedSkuCount').textContent=rows.filter(x=>x.res>0).length;
    $('#movementCount').textContent=state.movements.length;
    $('#movementsBody').innerHTML=[...state.movements].reverse().map(m=>{
      const p=product(m.productId); return `<tr><td>${esc(m.date)}</td><td>${m.type==='in'?'<span class="status active">Stock In</span>':'<span class="status confirmed">Stock Out</span>'}</td><td><span class="cell-title">${esc(p?.name||'—')}</span></td><td>${esc(m.sourceNumber||'—')}</td><td class="num"><b style="color:${m.type==='in'?'#067647':'#b42318'}">${m.type==='in'?'+':'−'}${qty(m.qty)} ${esc(p?.unit||'')}</b></td></tr>`
    }).join('');
    $('#movementsEmpty').classList.toggle('hidden',state.movements.length>0);
  }

  function renderOrders(){
    $('#ordersList').innerHTML=[...state.orders].reverse().map(o=>{
      const customer=partner(o.partnerId);
      const lines=o.lines.map(l=>{
        const p=product(l.productId); return `<div class="order-line"><div><b>${esc(p?.name||'—')}</b><small class="cell-sub">${esc(p?.sku||'')}</small></div><span>${qty(l.qty)} ${esc(p?.unit||'')}</span><span>${money(l.price)}</span><span>${money(Number(l.qty)*Number(l.price))}</span></div>`
      }).join('');
      const canReserve=o.status==='confirmed';
      const canShip=o.status==='reserved';
      return `<article class="order-card"><div class="order-head"><div><b>${esc(o.number)} · ${esc(customer?.name||'Клиент')}</b><small>${esc(o.date)} · ${o.lines.length} поз.</small></div>${statusHtml(o.status)}<div class="order-total"><strong>${money(orderTotal(o))}</strong><small>MDL</small></div></div><div class="order-body">${lines}</div><div class="order-actions"><button data-view-order="${o.id}">Открыть</button><button class="reserve" data-reserve-order="${o.id}" ${canReserve?'':'disabled'}>Зарезервировать</button><button class="ship" data-ship-order="${o.id}" ${canShip?'':'disabled'}>Отгрузить</button></div></article>`
    }).join('');
    $('#ordersEmpty').classList.toggle('hidden',state.orders.length>0);
    $('#orderCountLabel').textContent=state.orders.length+' заказов';
    $('#navOrdersCount').textContent=state.orders.length;
    $$('[data-reserve-order]').forEach(b=>b.onclick=()=>reserveOrder(b.dataset.reserveOrder));
    $$('[data-ship-order]').forEach(b=>b.onclick=()=>shipOrder(b.dataset.shipOrder));
    $$('[data-view-order]').forEach(b=>b.onclick=()=>viewOrder(b.dataset.viewOrder));
  }

  function renderAll(){
    renderDashboard(); renderProducts(); renderPartners(); renderReceipts(); renderInventory(); renderOrders();
  }

  function productForm(p={}){
    return `<form id="entityForm" class="form-grid"><div class="field"><label>SKU *</label><input name="sku" required value="${esc(p.sku||'')}"></div><div class="field"><label>Единица *</label><select name="unit"><option value="кг" ${p.unit==='кг'?'selected':''}>кг</option><option value="шт" ${p.unit==='шт'?'selected':''}>шт</option><option value="л" ${p.unit==='л'?'selected':''}>л</option><option value="уп" ${p.unit==='уп'?'selected':''}>уп</option></select></div><div class="field full"><label>Название *</label><input name="name" required value="${esc(p.name||'')}"></div><div class="field full"><label>Категория</label><input name="category" value="${esc(p.category||'')}"></div><div class="field full"><div class="check-row"><label><input type="checkbox" name="active" ${p.active!==false?'checked':''}> Активен</label></div></div></form>`
  }
  function newProduct(){openModal('CATALOG','Новый товар',productForm(),'<button class="button ghost" data-close-modal>Отмена</button><button class="button primary" id="saveEntity">Создать товар</button>');$('#modalFooter [data-close-modal]').onclick=closeModal;$('#saveEntity').onclick=()=>saveProduct()}
  function editProduct(id){const p=product(id);openModal('CATALOG','Карточка товара',productForm(p),'<button class="button ghost" data-close-modal>Закрыть</button><button class="button primary" id="saveEntity">Сохранить</button>');$('#modalFooter [data-close-modal]').onclick=closeModal;$('#saveEntity').onclick=()=>saveProduct(id)}
  function saveProduct(id){
    const f=$('#entityForm'); if(!f.reportValidity())return;
    const fd=new FormData(f), sku=fd.get('sku').trim();
    if(state.products.some(p=>p.sku.toLowerCase()===sku.toLowerCase()&&p.id!==id)){toast('SKU уже существует','Используйте уникальный SKU','error');return}
    const obj={id:id||uid('p'),sku,name:fd.get('name').trim(),category:fd.get('category').trim(),unit:fd.get('unit'),active:fd.get('active')==='on'};
    if(id)Object.assign(product(id),obj);else state.products.push(obj); save();closeModal();renderAll();toast(id?'Товар обновлён':'Товар создан',obj.name)
  }

  function partnerForm(p={}){
    const roles=p.roles||[];
    return `<form id="entityForm" class="form-grid"><div class="field full"><label>Компания *</label><input name="name" required value="${esc(p.name||'')}"></div><div class="field"><label>IDNO</label><input name="idno" value="${esc(p.idno||'')}"></div><div class="field"><label>Телефон</label><input name="phone" value="${esc(p.phone||'')}"></div><div class="field full"><label>Email</label><input name="email" type="email" value="${esc(p.email||'')}"></div><div class="field full"><label>Роль *</label><div class="check-row"><label><input type="checkbox" name="supplier" ${roles.includes('supplier')?'checked':''}> Поставщик</label><label><input type="checkbox" name="customer" ${roles.includes('customer')?'checked':''}> Клиент</label><label><input type="checkbox" name="active" ${p.active!==false?'checked':''}> Активен</label></div></div></form>`
  }
  function newPartner(){openModal('PARTNERS','Новый контрагент',partnerForm(),'<button class="button ghost" data-close-modal>Отмена</button><button class="button primary" id="saveEntity">Создать</button>');$('#modalFooter [data-close-modal]').onclick=closeModal;$('#saveEntity').onclick=()=>savePartner()}
  function editPartner(id){const p=partner(id);openModal('PARTNERS','Карточка контрагента',partnerForm(p),'<button class="button ghost" data-close-modal>Закрыть</button><button class="button primary" id="saveEntity">Сохранить</button>');$('#modalFooter [data-close-modal]').onclick=closeModal;$('#saveEntity').onclick=()=>savePartner(id)}
  function savePartner(id){
    const f=$('#entityForm');if(!f.reportValidity())return; const fd=new FormData(f); const roles=['supplier','customer'].filter(r=>fd.get(r)==='on');
    if(!roles.length){toast('Выберите роль','Контрагент должен быть поставщиком или клиентом','error');return}
    const obj={id:id||uid('partner'),name:fd.get('name').trim(),idno:fd.get('idno').trim(),phone:fd.get('phone').trim(),email:fd.get('email').trim(),roles,active:fd.get('active')==='on'};
    if(id)Object.assign(partner(id),obj);else state.partners.push(obj);save();closeModal();renderAll();toast(id?'Контрагент обновлён':'Контрагент создан',obj.name)
  }

  function linesForm(kind){
    const candidates=kind==='receipt'?state.partners.filter(p=>p.active&&p.roles.includes('supplier')):state.partners.filter(p=>p.active&&p.roles.includes('customer'));
    if(!state.products.filter(p=>p.active).length){toast('Нет товаров','Сначала создайте товар','error');setView('products');return null}
    if(!candidates.length){toast(kind==='receipt'?'Нет поставщиков':'Нет клиентов','Сначала создайте контрагента нужной роли','error');setView('partners');return null}
    const label=kind==='receipt'?'Поставщик':'Клиент';
    return `<form id="docForm"><div class="form-grid"><div class="field"><label>Дата *</label><input type="date" name="date" value="${today()}" required></div><div class="field"><label>${label} *</label><select name="partnerId" required>${candidates.map(p=>'<option value="'+p.id+'">'+esc(p.name)+'</option>').join('')}</select></div></div><div class="line-head"><b>Позиции документа</b><button type="button" class="add-line" id="addLine">+ Добавить строку</button></div><div class="doc-lines" id="docLines"></div><div class="form-note">${kind==='receipt'?'После проведения приход сразу создаст Stock In и увеличит On Hand.':'Заказ создаётся в статусе «Подтверждён». Резерв выполняется отдельным действием.'}</div></form>`
  }
  function addDocLine(defaults={}){
    const tpl=$('#lineTemplate').content.cloneNode(true), row=tpl.querySelector('.doc-line'), sel=row.querySelector('[data-line-product]');
    sel.innerHTML=state.products.filter(p=>p.active).map(p=>'<option value="'+p.id+'" '+(p.id===defaults.productId?'selected':'')+'>'+esc(p.sku)+' — '+esc(p.name)+'</option>').join('');
    row.querySelector('[data-line-qty]').value=defaults.qty||'';
    row.querySelector('[data-line-price]').value=defaults.price||'';
    row.querySelector('[data-remove-line]').onclick=()=>row.remove();
    $('#docLines').append(row)
  }
  function readDocLines(){
    return $$('.doc-line',$('#docLines')).map(r=>({productId:r.querySelector('[data-line-product]').value,qty:Number(r.querySelector('[data-line-qty]').value),price:Number(r.querySelector('[data-line-price]').value)})).filter(l=>l.productId&&l.qty>0&&l.price>=0)
  }

  function newReceipt(){
    const body=linesForm('receipt');if(!body)return;
    openModal('PURCHASING','Новый приход',body,'<button class="button ghost" data-close-modal>Отмена</button><button class="button primary" id="postReceipt">Провести приход</button>');
    $('#modalFooter [data-close-modal]').onclick=closeModal;$('#addLine').onclick=()=>addDocLine();addDocLine();
    $('#postReceipt').onclick=postReceipt
  }
  function postReceipt(){
    const f=$('#docForm');if(!f.reportValidity())return; const lines=readDocLines();if(!lines.length){toast('Добавьте позиции','Количество должно быть больше нуля','error');return}
    const fd=new FormData(f), number='PR-'+String(state.seq.receipt++).padStart(3,'0'), id=uid('r');
    const r={id,number,date:fd.get('date'),partnerId:fd.get('partnerId'),status:'posted',lines};state.receipts.push(r);
    lines.forEach(l=>state.movements.push({id:uid('m'),date:r.date,type:'in',productId:l.productId,qty:l.qty,sourceType:'receipt',sourceId:id,sourceNumber:number}));
    save();closeModal();renderAll();setView('purchasing');toast('Приход проведён',number+' · склад обновлён')
  }
  function viewReceipt(id){
    const r=state.receipts.find(x=>x.id===id); if(!r)return;
    openModal('PURCHASING',r.number,`<div class="form-note" style="margin-top:0">Поставщик: <b>${esc(partner(r.partnerId)?.name||'—')}</b> · ${esc(r.date)} · ${statusHtml(r.status)}</div><div class="table-wrap" style="margin-top:12px"><table style="min-width:0"><thead><tr><th>Товар</th><th class="num">Кол-во</th><th class="num">Цена</th><th class="num">Сумма</th></tr></thead><tbody>${r.lines.map(l=>{const p=product(l.productId);return '<tr><td>'+esc(p?.name||'—')+'</td><td class="num">'+qty(l.qty)+' '+esc(p?.unit||'')+'</td><td class="num">'+money(l.price)+'</td><td class="num"><b>'+money(l.qty*l.price)+'</b></td></tr>'}).join('')}</tbody></table></div>`,'<button class="button primary" data-close-modal>Закрыть</button>');$('#modalFooter [data-close-modal]').onclick=closeModal
  }

  function newOrder(){
    const body=linesForm('order');if(!body)return;
    openModal('SALES','Новый заказ клиента',body,'<button class="button ghost" data-close-modal>Отмена</button><button class="button primary" id="createOrder">Создать заказ</button>');
    $('#modalFooter [data-close-modal]').onclick=closeModal;$('#addLine').onclick=()=>addDocLine();addDocLine();
    $('#createOrder').onclick=createOrder
  }
  function createOrder(){
    const f=$('#docForm');if(!f.reportValidity())return;const lines=readDocLines();if(!lines.length){toast('Добавьте позиции','Количество должно быть больше нуля','error');return}
    const fd=new FormData(f), number='SO-'+String(state.seq.order++).padStart(3,'0');
    state.orders.push({id:uid('o'),number,date:fd.get('date'),partnerId:fd.get('partnerId'),status:'confirmed',lines});
    save();closeModal();renderAll();setView('sales');toast('Заказ создан',number+' · ожидает резерва')
  }
  function reserveOrder(id){
    const o=state.orders.find(x=>x.id===id);if(!o||o.status!=='confirmed')return;
    const shortages=o.lines.filter(l=>available(l.productId)<l.qty);
    if(shortages.length){toast('Недостаточно остатка',shortages.map(l=>(product(l.productId)?.name||'Товар')+': доступно '+qty(available(l.productId))).join('; '),'error');return}
    o.status='reserved';save();renderAll();toast('Товар зарезервирован',o.number+' · Available уменьшен')
  }
  function shipOrder(id){
    const o=state.orders.find(x=>x.id===id);if(!o||o.status!=='reserved')return;
    o.lines.forEach(l=>state.movements.push({id:uid('m'),date:today(),type:'out',productId:l.productId,qty:l.qty,sourceType:'shipment',sourceId:o.id,sourceNumber:'SH-'+o.number.replace('SO-','')}));
    o.status='shipped';save();renderAll();toast('Отгрузка проведена',o.number+' · On Hand уменьшен')
  }
  function viewOrder(id){
    const o=state.orders.find(x=>x.id===id);if(!o)return;
    openModal('SALES',o.number,`<div class="form-note" style="margin-top:0">Клиент: <b>${esc(partner(o.partnerId)?.name||'—')}</b> · ${esc(o.date)} · ${statusHtml(o.status)}</div><div class="table-wrap" style="margin-top:12px"><table style="min-width:0"><thead><tr><th>Товар</th><th class="num">Кол-во</th><th class="num">Цена</th><th class="num">Сумма</th></tr></thead><tbody>${o.lines.map(l=>{const p=product(l.productId);return '<tr><td>'+esc(p?.name||'—')+'</td><td class="num">'+qty(l.qty)+' '+esc(p?.unit||'')+'</td><td class="num">'+money(l.price)+'</td><td class="num"><b>'+money(l.qty*l.price)+'</b></td></tr>'}).join('')}</tbody></table></div>`,'<button class="button primary" data-close-modal>Закрыть</button>');$('#modalFooter [data-close-modal]').onclick=closeModal
  }

  $$('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
  $$('[data-jump]').forEach(b=>b.onclick=()=>setView(b.dataset.jump));
  $$('[data-action]').forEach(b=>b.onclick=()=>({newProduct,newPartner,newReceipt,newOrder}[b.dataset.action]?.()));
  $('#quickAction').onclick=()=>({dashboard:newProduct,products:newProduct,partners:newPartner,purchasing:newReceipt,sales:newOrder,inventory:newReceipt}[currentView]||newProduct)();
  $('#mobileMenu').onclick=openSide;$('#sideClose').onclick=closeSide;$('#sideOverlay').onclick=closeSide;
  $('#productSearch').addEventListener('input',renderProducts);$('#partnerSearch').addEventListener('input',renderPartners);
  $$('#partnerFilter button').forEach(b=>b.onclick=()=>{partnerRoleFilter=b.dataset.role;$$('#partnerFilter button').forEach(x=>x.classList.toggle('active',x===b));renderPartners()});
  $('#resetDemo').onclick=()=>{if(confirm('Сбросить все Demo-данные к начальному состоянию?')){state=seed();save();renderAll();setView('dashboard');toast('Demo сброшено','Начальные данные восстановлены')}};

  renderAll();
})();