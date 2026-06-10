(() => {
  const select = selector => document.querySelector(selector);
  const selectAll = selector => Array.from(document.querySelectorAll(selector));

  const setMenuState = (isOpen, menuButton, menu, overlay) => {
    menuButton.classList.toggle('active', isOpen);
    menu.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    overlay.setAttribute('aria-hidden', String(!isOpen));
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', isOpen);
  };

  const toggleMobileMenu = (menuButton, menu, overlay) => {
    const isOpen = menu.classList.contains('active');
    setMenuState(!isOpen, menuButton, menu, overlay);
  };

  const closeMobileMenu = (menuButton, menu, overlay) => {
    setMenuState(false, menuButton, menu, overlay);
  };

  const activateSectionLink = (sections, links) => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;

      if (window.scrollY >= sectionTop) {
        currentSectionId = section.id;
      }
    });

    links.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentSectionId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const initScrollReveal = () => {
    const elements = selectAll('.slide-up');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach(element => observer.observe(element));
  };

  const initMobileMenu = () => {
    const hamburger = select('#hamburger');
    const navMenu = select('#nav-menu');
    const overlay = select('#menu-overlay');

    if (!hamburger || !navMenu || !overlay) {
      return;
    }

    hamburger.addEventListener('click', () => toggleMobileMenu(hamburger, navMenu, overlay));
    overlay.addEventListener('click', () => closeMobileMenu(hamburger, navMenu, overlay));

    selectAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => closeMobileMenu(hamburger, navMenu, overlay));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMobileMenu(hamburger, navMenu, overlay);
      }
    });
  };

  const initActiveLinkScroll = () => {
    const sections = selectAll('header[id], section[id]');
    const navLinks = selectAll('.nav-menu a');

    if (!sections.length || !navLinks.length) {
      return;
    }

    let ticking = false;

    const requestActivation = () => {
      if (ticking) {
        return;
      }

      window.requestAnimationFrame(() => {
        activateSectionLink(sections, navLinks);
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', requestActivation, { passive: true });
    window.addEventListener('resize', requestActivation);
    activateSectionLink(sections, navLinks);
  };

  const initLightbox = () => {
    const previewImageWrapper = select('.image-preview-wrapper');
    const previewImage = select('.content-image-preview');
    const lightbox = select('#lightbox');
    const lightboxImg = select('#lightbox-img');
    const closeButton = select('.lightbox-close');

    if (!previewImageWrapper || !previewImage || !lightbox || !lightboxImg || !closeButton) {
      return;
    }

    const openLightbox = () => {
      lightboxImg.src = previewImage.src;
      lightboxImg.alt = previewImage.alt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };

    previewImageWrapper.addEventListener('click', openLightbox);

    lightbox.addEventListener('click', event => {
      if (event.target === lightbox || event.target === closeButton) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
        previewImageWrapper.focus();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initMobileMenu();
    initActiveLinkScroll();
    initLightbox();
  });
})();
