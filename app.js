(() => {
  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => [...r.querySelectorAll(s)];

  const progress = q('.scroll-progress');
  const header = q('.header');
  const updateScroll = () => {
    const root = document.documentElement;
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    if (progress) progress.style.width = Math.min(100, root.scrollTop / max * 100) + '%';
    if (header) header.classList.toggle('scrolled', root.scrollTop > 16);
  };
  document.addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();

  const menuButton = q('.menu-button');
  const mobileNav = q('.mobile-nav');
  const setMenu = open => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    mobileNav.classList.toggle('open', open);
    menuButton.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const firstLink = mobileNav.querySelector('a');
      window.setTimeout(() => firstLink?.focus({preventScroll:true}), 50);
    }
  };
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
    mobileNav.addEventListener('click', e => { if (e.target === mobileNav) setMenu(false); });
    qa('a', mobileNav).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1120) setMenu(false); }, {passive:true});
  }

  const reveal = qa('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -30px'});
    reveal.forEach(el => io.observe(el));
  } else {
    reveal.forEach(el => el.classList.add('visible'));
  }

  qa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = q(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  const systemModules = qa('.system-module');
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) systemModules.forEach(module => {
    module.addEventListener('mouseenter', () => {
      systemModules.forEach(m => m.style.opacity = m === module ? '1' : '.55');
    });
    module.addEventListener('mouseleave', () => {
      systemModules.forEach(m => m.style.opacity = '1');
    });
  });
})();