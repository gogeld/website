(() => {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const year = document.querySelector('[data-year]');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const updateScrollState = () => {
    const scrollTop = window.scrollY;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

    header?.classList.toggle('is-scrolled', scrollTop > 12);
    progress?.style.setProperty('--scroll', ratio.toFixed(4));
  };

  let scrollFrame;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      updateScrollState();
      scrollFrame = undefined;
    });
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  updateScrollState();
})();
