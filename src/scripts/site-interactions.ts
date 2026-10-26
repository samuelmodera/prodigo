(() => {
  const whatsapp = document.querySelector('.wa');
  const nav = document.querySelector('nav');

  const syncScrollUi = () => {
    whatsapp?.classList.toggle('is-visible', window.scrollY > 240);
    nav?.classList.toggle('is-scrolled', window.scrollY > 32);
  };

  window.addEventListener('scroll', syncScrollUi, { passive: true });
  syncScrollUi();
})();
