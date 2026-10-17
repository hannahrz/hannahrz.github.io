(() => {
  'use strict';
  const root = document.documentElement;
  let language = 'en';
  try { language = localStorage.getItem('ruihan-language') === 'zh' ? 'zh' : 'en'; } catch (_) {}
  function setLanguage(next) {
    language = next;
    root.dataset.language = next;
    root.lang = next === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('.language-button').forEach(button => {
      button.textContent = next === 'zh' ? 'EN' : '中文';
      button.title = next === 'zh' ? 'Switch to English' : '切换为中文';
    });
    try { localStorage.setItem('ruihan-language', next); } catch (_) {}
  }
  setLanguage(language);
  document.querySelectorAll('.language-button').forEach(button => {
    button.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  });
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileNav.hidden) {
        mobileNav.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.focus();
      }
    });
  }
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(paper => {
      paper.hidden = button.dataset.filter !== 'all' && paper.dataset.category !== button.dataset.filter;
      if (!paper.hidden) count++;
    });
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = language === 'zh' ? `显示 ${count} 篇论文` : `${count} publications shown`;
  }));
  document.querySelectorAll('.print-button').forEach(b => b.addEventListener('click', () => window.print()));
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(a => {
          const selected = a.hash === '#' + entry.target.id;
          a.classList.toggle('active', selected);
          if (selected) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-90px 0px -60% 0px', threshold: 0});
    navLinks.forEach(a => { const section = document.querySelector(a.hash); if (section) observer.observe(section); });
  }
})();
