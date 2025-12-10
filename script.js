document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    function openNav() {
      mainNav.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.addEventListener('click', onDocClick);
      window.addEventListener('resize', onWindowResize);
    }
    function closeNav() {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('resize', onWindowResize);
    }
    function toggleNav(e) {
      e.stopPropagation();
      const isOpen = mainNav.classList.contains('open');
      if (isOpen) closeNav();
      else openNav();
    }
    function onDocClick(e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    }
    function onWindowResize() {
      if (window.innerWidth > 900) {
        closeNav();
        mainNav.style.display = '';
      }
    }
    navToggle.addEventListener('click', toggleNav);
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && mainNav.classList.contains('open')) closeNav();
    });
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }
    });
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        entry.target.querySelectorAll('.skill-card').forEach(card => {
          const value = parseInt(card.dataset.value || '0', 10);
          const circle = card.querySelector('.radial-fg');
          const percentLabel = card.querySelector('.skill-percent');
          if (circle) {
            const r = 48;
            const circumference = 2 * Math.PI * r;
            const offset = circumference - (value / 100) * circumference;
            circle.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(.2,.9,.3,1)';
            circle.style.strokeDashoffset = offset;
          }
          if (percentLabel) percentLabel.textContent = value + '%';
        });

        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('[data-animate="card"]').forEach(el => revealObserver.observe(el));
  const skillsSection = document.getElementById('skills');
  if (skillsSection) revealObserver.observe(skillsSection);

  const projectData = {
    resim: {
      title: 'ResimBulmaUygulamasi',
      desc: 'Fotoğraf galerisi ve arama uygulaması — responsive galeri, arama ve filtreleme.',
      repo: 'https://github.com/ftmkarpinar/ResimBulmaUygulamasi',
      media: 'resimbulma-thumb.jpg'
    },
    doviz: {
      title: 'DovizKuruHesaplama',
      desc: 'Gerçek zamanlı döviz kuru hesaplama — API entegrasyonu ve kullanıcı dostu arayüz.',
      repo: 'https://github.com/ftmkarpinar/DovizKuruHesaplama',
      media: 'doviz-thumb.jpg'
    }
  };

  // Modal logic
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalMedia = document.getElementById('modal-media');
  const modalCode = document.getElementById('modal-code');

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalMedia.innerHTML = `<img src="${data.media}" alt="${data.title}" style="max-width:100%; border-radius:8px" loading="lazy">`;
    modalCode.href = data.repo;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const btn = modal.querySelector('.modal-close');
    if (btn) btn.focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalMedia.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-project').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.projectId));
  });
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'true' || e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Tilt + shine (mouse)
  if (!prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const media = card.querySelector('.project-media.shiny');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        if (media) {
          const shineX = (px * 120) - 20;
          media.style.setProperty('--shine-x', `${shineX}%`);
        }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // hero mockup subtle parallax
    const heroMock = document.getElementById('hero-mockup');
    if (heroMock) {
      heroMock.addEventListener('mousemove', (e) => {
        const r = heroMock.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroMock.style.transform = `translate3d(${px * 8}px, ${py * 6}px, 0) rotate(${px * 1.8}deg)`;
      });
      heroMock.addEventListener('mouseleave', () => heroMock.style.transform = '');
    }
  }

  // Contact form simple validation + simulation
  const form = document.getElementById('contact-form');
  const formNote = document.querySelector('.form-note');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();
      if (!name || !email || !message) {
        formNote.textContent = 'Lütfen tüm alanları doldurun.';
        return;
      }
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        formNote.textContent = 'Lütfen geçerli bir e-posta girin.';
        return;
      }
      formNote.textContent = 'Gönderiliyor...';
      setTimeout(() => {
        formNote.textContent = 'Mesaj gönderildi! En kısa sürede dönüş yapacağım.';
        form.reset();
      }, 900);
    });
  }
});