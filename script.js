(() => {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const year = document.querySelector('[data-year]');
  const contactForm = document.querySelector('[data-contact-form]');

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

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.95) {
        item.classList.add('is-visible');
      } else {
        revealObserver.observe(item);
      }
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (contactForm) {
    const status = contactForm.querySelector('[data-form-status]');
    const submitButton = contactForm.querySelector('[data-submit-button]');
    const submitLabel = contactForm.querySelector('[data-submit-label]');
    const defaultLabel = submitLabel?.textContent || 'Send inquiry';

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      status.textContent = '';
      status.classList.remove('is-error');
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitLabel.textContent = 'Sending…';

      const endpoint = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        const rejected = result.success === false || result.success === 'false';

        if (!response.ok || rejected) {
          throw new Error(result.message || 'Submission failed');
        }

        contactForm.reset();
        status.textContent = 'Thanks—your inquiry is on its way. I’ll follow up directly.';
      } catch (error) {
        status.textContent = 'The message could not be sent. Please try again in a moment.';
        status.classList.add('is-error');
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitLabel.textContent = defaultLabel;
      }
    });
  }

  updateScrollState();
})();
