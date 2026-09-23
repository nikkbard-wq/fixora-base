(function(){
  const current=document.body.dataset.page||'';
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  $$('.nav-links [data-key]').forEach(a=>a.classList.toggle('active',a.dataset.key===current));

  const mobile=$('.mobile-menu-btn');
  const menu=$('.nav-links');
  function closeMenu(){if(!menu||!mobile)return;menu.classList.remove('mobile-open');mobile.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open');}
  if(mobile&&menu){
    mobile.setAttribute('aria-expanded','false');
    mobile.addEventListener('click',()=>{
      const opening=!menu.classList.contains('mobile-open');
      menu.classList.toggle('mobile-open',opening);mobile.setAttribute('aria-expanded',String(opening));document.body.classList.toggle('nav-open',opening);
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  }

  $$('.table').forEach(table=>{
    const heads=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{if(!cell.dataset.label&&heads[i])cell.dataset.label=heads[i];}));
  });

  $$('[data-filter]').forEach(el=>el.addEventListener('click',()=>{const table=el.closest('.ui-panel')?.querySelector('tbody');if(!table)return;[...table.children].forEach((r,i)=>r.style.display=i%2===0?'table-row':'none');el.textContent='Фильтр применён';}));
  $$('[data-sort]').forEach(el=>el.addEventListener('click',()=>{const tbody=el.closest('table')?.querySelector('tbody');if(!tbody)return;[...tbody.children].reverse().forEach(r=>tbody.appendChild(r));}));

  $$('.clickable').forEach(el=>{el.setAttribute('tabindex','0');el.setAttribute('role','button');});
})();
