(() => {
  const select = selector => document.querySelector(selector);
  const selectAll = selector => Array.from(document.querySelectorAll(selector));

  const toggleMobileMenu = (menuButton, menu, overlay) => {
    menuButton.classList.toggle('active');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  const closeMobileMenu = (menuButton, menu, overlay) => {
    menuButton.classList.remove('active');
    menu.classList.remove('active');
    overlay.classList.remove('active');
  };

  const activateSectionLink = (sections, links) => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;

      if (window.scrollY >= sectionTop) {
        currentSectionId = section.id;
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
    });
  };

  const initScrollReveal = () => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    selectAll('.slide-up').forEach(element => observer.observe(element));
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
  };

  const initActiveLinkScroll = () => {
    const sections = selectAll('section[id]');
    const navLinks = selectAll('.nav-menu a');

    if (!sections.length || !navLinks.length) {
      return;
    }

    window.addEventListener('scroll', () => activateSectionLink(sections, navLinks), { passive: true });
    activateSectionLink(sections, navLinks);
  };

  const initLightbox = () => {
    const previewImageWrapper = select('.image-preview-wrapper');
    const previewImage = select('.content-image-preview');
    const lightbox = select('#lightbox');
    const lightboxImg = select('#lightbox-img');

    if (!previewImageWrapper || !previewImage || !lightbox || !lightboxImg) {
      return;
    }

    previewImageWrapper.addEventListener('click', () => {
      lightboxImg.src = previewImage.src;
      lightbox.classList.add('active');
    });

    lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
  };

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initMobileMenu();
    initActiveLinkScroll();
    initLightbox();
  });
})();
