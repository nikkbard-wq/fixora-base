(function(){
  const STORAGE_KEY='fixoraBaseDemoV12';
  const steps=[
    ['Создать товар','catalog'],
    ['Создать поставщика','partners'],
    ['Сделать приход','buy'],
    ['Увидеть товар на складе','stock'],
    ['Создать клиента','partners'],
    ['Создать заказ','sell'],
    ['Зарезервировать товар','sell'],
    ['Сделать отгрузку','sell'],
    ['Увидеть новый остаток','stock']
  ];
  const initial={step:0,items:248,partners:62,onHand:650,reserved:0,itemCreated:false,supplier:false,receipt:false,client:false,order:false,reservedDone:false,shipped:false,itemName:'Демо-товар',itemSku:'DEM-001',supplierName:'Демо-поставщик SRL',clientName:'Демо-клиент SRL'};
  let state=loadState();
  const panels={dash:'Главная',catalog:'Товары',partners:'Контрагенты',buy:'Закупки',stock:'Склад',sell:'Продажи',settings:'Настройки'};
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  let currentPanel='dash';
  let modalType=null;

  function loadState(){
    try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return saved?{...initial,...saved}:{...initial};}
    catch(e){return {...initial};}
  }
  function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){}}

  const toast=(msg)=>{
    const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._timer);toast._timer=setTimeout(()=>t.classList.remove('show'),1900);
  };

  function setPanel(id){
    if(!panels[id]) return;
    currentPanel=id;
    $$('.demo-panel').forEach(p=>p.classList.toggle('active',p.id===id));
    $$('.demo-menu [data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));
    const more=$('#mobileMoreTrigger');
    if(more) more.classList.toggle('active',['catalog','partners','settings'].includes(id));
    $('#panelTitle').textContent=panels[id];
    closeMore();
    if(id==='stock'&&state.receipt&&state.step===3){state.step=4;saveState();render();toast('Остаток обновлён после прихода');}
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function rowCells(cells){return cells.map(([label,value])=>`<td data-label="${label}">${value}</td>`).join('');}

  function ensureDynamicRows(){
    if(state.itemCreated && !$('#demoItemCreated')){
      $('#demoItems').insertAdjacentHTML('afterbegin',`<tr id="demoItemCreated">${rowCells([['Товар',escapeHtml(state.itemName)],['Артикул',escapeHtml(state.itemSku)],['Ед.','кг'],['Остаток','0'],['Статус','<span class="badge b-success">Активен</span>']])}</tr>`);
    }
    if(state.supplier && !$('#demoSupplierCreated')){
      $('#demoPartners').insertAdjacentHTML('afterbegin',`<tr id="demoSupplierCreated">${rowCells([['Компания',escapeHtml(state.supplierName)],['Роль','Поставщик'],['IDNO','1000000000001'],['Статус','<span class="badge b-success">Активен</span>']])}</tr>`);
    }
    if(state.client && !$('#demoClientCreated')){
      $('#demoPartners').insertAdjacentHTML('afterbegin',`<tr id="demoClientCreated">${rowCells([['Компания',escapeHtml(state.clientName)],['Роль','Клиент'],['IDNO','1000000000002'],['Статус','<span class="badge b-success">Активен</span>']])}</tr>`);
    }
    if(state.receipt && !$('#demoReceiptMove')){
      $('#stockMoves').insertAdjacentHTML('afterbegin',`<tr id="demoReceiptMove">${rowCells([['Тип','<span class="movement movement-in">Приход</span>'],['Источник','PR-DEMO-001'],['Количество','+500 кг'],['Результат',state.onHand+' кг']])}</tr>`);
      $('#ops').insertAdjacentHTML('afterbegin',`<tr id="demoReceiptOp">${rowCells([['Время','Сейчас'],['Операция','Приход'],['Документ','PR-DEMO-001'],['Количество','+500 кг'],['Статус','<span class="badge b-success">Проведено</span>']])}</tr>`);
    }
    if(state.shipped && !$('#demoShipmentMove')){
      $('#stockMoves').insertAdjacentHTML('afterbegin',`<tr id="demoShipmentMove">${rowCells([['Тип','<span class="movement movement-out">Расход</span>'],['Источник','SH-DEMO-001'],['Количество','−200 кг'],['Результат',state.onHand+' кг']])}</tr>`);
      $('#ops').insertAdjacentHTML('afterbegin',`<tr id="demoShipmentOp">${rowCells([['Время','Сейчас'],['Операция','Отгрузка'],['Документ','SH-DEMO-001'],['Количество','−200 кг'],['Статус','<span class="badge b-success">Проведено</span>']])}</tr>`);
    }
  }

  function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  function renderGuide(){
    const g=$('#guideSteps');if(!g)return;
    g.innerHTML=steps.map((s,i)=>{
      const done=i<state.step;const current=i===state.step&&state.step<steps.length;
      return `<button class="guide-step ${done?'done':''} ${current?'current':''}" data-guide-panel="${s[1]}"><span class="step-n">${done?'✓':i+1}</span><span class="txt"><b>${s[0]}</b>${current?'<em>Текущий шаг</em>':done?'<em>Готово</em>':''}</span><span class="guide-arrow">›</span></button>`;
    }).join('');
    $$('[data-guide-panel]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.guidePanel)));
  }

  function renderProgress(){
    const done=Math.min(state.step,steps.length);$('#progressBar').style.width=`${(done/steps.length)*100}%`;$('#progressCount').textContent=`${done} / ${steps.length}`;
    $('#currentStepTitle').textContent=state.step>=steps.length?`Сценарий завершён — новый остаток ${state.onHand} кг`:`Шаг ${state.step+1} из ${steps.length} — ${steps[state.step][0]}`;
    $('#nextStep').textContent=state.step>=steps.length?'Сценарий завершён ✓':'Следующий шаг →';
  }

  function setBtnState(sel,done,doneText){const b=$(sel);if(!b)return;b.disabled=!!done;if(done)b.textContent=doneText;}

  function render(){
    ensureDynamicRows();
    ['metricStock','stockOnHand'].forEach(id=>{const e=$('#'+id);if(e)e.textContent=state.onHand;});
    ['metricReserved','stockReserved'].forEach(id=>{const e=$('#'+id);if(e)e.textContent=state.reserved;});
    $('#stockAvailable').textContent=state.onHand-state.reserved;$('#orderAvailable').textContent=(state.onHand-state.reserved)+' кг';
    $('#metricItems').textContent=state.items;$('#metricPartners').textContent=state.partners;
    $('#receiptSupplier').value=state.supplierName;$('#orderClient').value=state.clientName;
    setBtnState('#createItem',state.itemCreated,'Товар создан ✓');setBtnState('#createSupplier',state.supplier,'Поставщик создан ✓');setBtnState('#createClient',state.client,'Клиент создан ✓');setBtnState('#postReceipt',state.receipt,'Приход проведён ✓');
    $('#receiptStatus').className='badge '+(state.receipt?'b-success':'b-draft');$('#receiptStatus').textContent=state.receipt?'Проведён':'Черновик';
    const orderStatus=$('#orderStatus');
    if(state.shipped){orderStatus.className='badge b-success';orderStatus.textContent='Отгружен';}
    else if(state.reservedDone){orderStatus.className='badge b-purple';orderStatus.textContent='Зарезервирован';}
    else if(state.order){orderStatus.className='badge b-blue';orderStatus.textContent='Подтверждён';}
    else{orderStatus.className='badge b-draft';orderStatus.textContent='Черновик';}
    $('#createOrder').disabled=state.order;$('#createOrder').textContent=state.order?'Заказ создан ✓':'Создать заказ';
    $('#reserveOrder').disabled=!state.order||state.reservedDone;$('#reserveOrder').textContent=state.reservedDone?'Зарезервировано ✓':'Зарезервировать';
    $('#shipOrder').disabled=!state.reservedDone||state.shipped;$('#shipOrder').textContent=state.shipped?'Отгружено ✓':'Отгрузить';
    renderGuide();renderProgress();
  }

  function complete(index,msg,nextPanel){state.step=Math.max(state.step,index+1);saveState();render();toast(msg);if(nextPanel)setPanel(nextPanel);}

  function openMore(){const s=$('#mobileMoreSheet'),o=$('#mobileMoreOverlay'),t=$('#mobileMoreTrigger');o.hidden=false;s.classList.add('open');s.setAttribute('aria-hidden','false');t.setAttribute('aria-expanded','true');document.body.classList.add('sheet-open');}
  function closeMore(){const s=$('#mobileMoreSheet'),o=$('#mobileMoreOverlay'),t=$('#mobileMoreTrigger');if(!s)return;s.classList.remove('open');s.setAttribute('aria-hidden','true');o.hidden=true;t.setAttribute('aria-expanded','false');document.body.classList.remove('sheet-open');}

  function modalTemplate(type){
    if(type==='item')return {kicker:'Справочник товаров',title:'Новый товар',submit:'Создать товар',body:`<div class="field"><label>Название</label><input class="input" name="name" value="Демо-товар" required></div><div class="field"><label>Артикул</label><input class="input" name="sku" value="DEM-001" required></div><div class="field"><label>Категория</label><input class="input" value="Продукты"></div><div class="field"><label>Единица измерения</label><input class="input" value="кг"></div>`};
    if(type==='supplier')return {kicker:'Контрагенты',title:'Новый поставщик',submit:'Создать поставщика',body:`<div class="field"><label>Название компании</label><input class="input" name="name" value="Демо-поставщик SRL" required></div><div class="field"><label>IDNO</label><input class="input" value="1000000000001"></div><div class="field full"><label>Роль</label><input class="input" value="Поставщик" readonly></div>`};
    return {kicker:'Контрагенты',title:'Новый клиент',submit:'Создать клиента',body:`<div class="field"><label>Название компании</label><input class="input" name="name" value="Демо-клиент SRL" required></div><div class="field"><label>IDNO</label><input class="input" value="1000000000002"></div><div class="field full"><label>Роль</label><input class="input" value="Клиент" readonly></div>`};
  }

  function openModal(type){modalType=type;const t=modalTemplate(type);$('#demoModalKicker').textContent=t.kicker;$('#demoModalTitle').textContent=t.title;$('#demoModalSubmit').textContent=t.submit;$('#demoModalBody').innerHTML=t.body;$('#demoModalBackdrop').hidden=false;$('#demoModal').classList.add('open');$('#demoModal').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>$('#demoModal input')?.focus(),20);}
  function closeModal(){modalType=null;$('#demoModal').classList.remove('open');$('#demoModal').setAttribute('aria-hidden','true');$('#demoModalBackdrop').hidden=true;document.body.classList.remove('modal-open');}

  $$('.demo-menu [data-panel]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.panel)));
  $$('[data-panel-jump]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.panelJump)));
  $('#mobileMoreTrigger').addEventListener('click',openMore);$('#mobileMoreClose').addEventListener('click',closeMore);$('#mobileMoreOverlay').addEventListener('click',closeMore);
  $$('[data-sheet-panel]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.sheetPanel)));

  $('#createItem').onclick=()=>state.itemCreated?toast('Товар уже создан'):openModal('item');
  $('#createSupplier').onclick=()=>state.supplier?toast('Поставщик уже создан'):openModal('supplier');
  $('#createClient').onclick=()=>state.client?toast('Клиент уже создан'):openModal('client');

  $('#demoModalForm').addEventListener('submit',e=>{
    e.preventDefault();const data=new FormData(e.currentTarget);const name=(data.get('name')||'').toString().trim();
    if(modalType==='item'){state.itemCreated=true;state.items++;state.itemName=name||'Демо-товар';state.itemSku=(data.get('sku')||'DEM-001').toString().trim();closeModal();complete(0,'Товар создан','partners');}
    else if(modalType==='supplier'){state.supplier=true;state.partners++;state.supplierName=name||'Демо-поставщик SRL';closeModal();complete(1,'Поставщик создан','buy');}
    else if(modalType==='client'){state.client=true;state.partners++;state.clientName=name||'Демо-клиент SRL';closeModal();complete(4,'Клиент создан','sell');}
  });
  $('#demoModalClose').onclick=closeModal;$('#demoModalCancel').onclick=closeModal;$('#demoModalBackdrop').onclick=closeModal;

  $('#postReceipt').onclick=()=>{
    if(!state.itemCreated){toast('Сначала создайте товар');setPanel('catalog');return;}
    if(!state.supplier){toast('Сначала создайте поставщика');setPanel('partners');return;}
    if(!state.receipt){state.receipt=true;state.onHand+=500;complete(2,'Приход проведён','stock');}
  };
  $('#createOrder').onclick=()=>{
    if(!state.client){toast('Сначала создайте клиента');setPanel('partners');return;}
    state.order=true;complete(5,'Заказ создан');
  };
  $('#reserveOrder').onclick=()=>{
    if(!state.order){toast('Сначала создайте заказ');return;}
    if(state.onHand-state.reserved<200){toast('Недостаточно доступного остатка');return;}
    if(!state.reservedDone){state.reservedDone=true;state.reserved=200;}complete(6,'200 кг зарезервировано');
  };
  $('#shipOrder').onclick=()=>{
    if(!state.reservedDone){toast('Сначала зарезервируйте товар');return;}
    if(!state.shipped){state.shipped=true;state.onHand-=200;state.reserved=0;complete(7,'Отгрузка проведена','stock');setTimeout(()=>{state.step=9;saveState();render();toast('Сценарий завершён: новый остаток '+state.onHand+' кг');},500);}
  };
  $('#nextStep').onclick=()=>{if(state.step>=steps.length){toast('Демо-сценарий уже завершён');return;}setPanel(steps[state.step][1]);toast('Шаг '+(state.step+1)+': '+steps[state.step][0]);};
  $('#resetDemo').onclick=()=>{try{localStorage.removeItem(STORAGE_KEY);}catch(e){}location.reload();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMore();closeModal();}});

  render();setPanel('dash');
})();
