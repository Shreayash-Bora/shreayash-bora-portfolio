/* ============================================================
   SHREAYASH BORA – PORTFOLIO  |  script.js
   Full JavaScript — Navbar, Typed, Tabs, Modal, Form, etc.
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════
   1.  HELPERS
   ══════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════
   2.  NAVBAR – scroll style + hamburger + active link
   ══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  const allLinks  = $$('a', navLinks);

  /* Scroll: add .scrolled class */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
    handleBackToTop();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  /* Close mobile menu on link click */
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* Active nav link based on scroll position */
  function updateActiveLink() {
    const sections = $$('section[id]');
    let current = '';

    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.id;
      }
    });

    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
})();

/* ══════════════════════════════════════════════
   3.  BACK TO TOP BUTTON
   ══════════════════════════════════════════════ */
function handleBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════════
   4.  TYPED TEXT ANIMATION
   ══════════════════════════════════════════════ */
(function initTyped() {
  const el = $('#typed-text');
  if (!el) return;

  const phrases = [
    'BCA Student 🎓',
    'Web Developer 💻',
    'Full Stack Developer 💻',
    'Python Developer 🐍',
    'Front-end Developer 🎨',
    'DSA Enthusiast 🧩',
    'UI Enthusiast ✨',
    'Problem Solver 🧩',
    'Problem Solver 🧩',
  ];
       
    
  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 80;   // ms per character (typing)
  const DELETE_SPEED = 40;   // ms per character (deleting)
  const PAUSE_AFTER  = 2000; // ms to pause after full phrase
  const PAUSE_BEFORE = 400;  // ms to pause before next phrase

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === phrase.length) {
        // Finished typing — pause
        isPaused = true;
        setTimeout(() => {
          isPaused   = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting   = false;
        phraseIndex  = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }

  setTimeout(tick, 800);
})();

/* ══════════════════════════════════════════════
   5.  SCROLL REVEAL ANIMATIONS
   ══════════════════════════════════════════════ */
(function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  items.forEach(item => observer.observe(item));
})();

/* ══════════════════════════════════════════════
   6.  PROJECT TABS
   ══════════════════════════════════════════════ */
(function initProjectTabs() {
  const tabs     = $$('.tab-btn');
  const contents = $$('.project-tab-content');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update buttons
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update content panels
      contents.forEach(panel => {
        const isTarget = panel.id === `tab-${target}`;
        panel.classList.toggle('active', isTarget);

        // Re-trigger reveal animations inside new tab
        if (isTarget) {
          $$('.reveal', panel).forEach(el => {
            el.classList.remove('revealed');
            setTimeout(() => el.classList.add('revealed'), 60);
          });
        }
      });
    });
  });

  // Trigger reveals for default active tab on load
  const defaultPanel = $('.project-tab-content.active');
  if (defaultPanel) {
    setTimeout(() => {
      $$('.reveal', defaultPanel).forEach(el => el.classList.add('revealed'));
    }, 300);
  }
})();

/* ══════════════════════════════════════════════
   7.  CERTIFICATE MODAL
   ══════════════════════════════════════════════ */
function openCertModal(imgSrc, title) {
  const modal    = $('#cert-modal');
  const modalImg = $('#modal-cert-img');
  const modalTtl = $('#modal-cert-title');

  if (!modal) return;

  modalTtl.textContent = title || 'Certificate';
  modalImg.src = imgSrc;
  modalImg.alt = title || 'Certificate';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(event, force = false) {
  const modal = $('#cert-modal');
  if (!modal) return;

  // Close only if clicking the overlay backdrop (not the modal box)
  if (!force && event && $('#cert-modal .modal-box').contains(event.target)) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';

  // Clear image after transition
  setTimeout(() => {
    const img = $('#modal-cert-img');
    if (img) img.src = '';
  }, 300);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCertModal(null, true);
});

/* ══════════════════════════════════════════════
   8.  CONTACT FORM – JS handler (dummy simulation)
   ══════════════════════════════════════════════ */
function handleFormSubmit(event) {
  event.preventDefault();

  const form     = $('#contact-form');
  const btnText  = $('#btn-text');
  const btnLoad  = $('#btn-loading');
  const success  = $('#form-success');
  const submitBtn = $('#submit-btn');

  if (!form) return;

  // Basic validation
  const name    = $('#contact-name').value.trim();
  const email   = $('#contact-email').value.trim();
  const message = $('#contact-message').value.trim();

  if (!name || !email || !message) {
    shakeForm(form);
    return;
  }

  // Show loading state
  btnText.style.display  = 'none';
  btnLoad.style.display  = 'inline-flex';
  submitBtn.disabled     = true;

  // Simulate async (replace with EmailJS / fetch to backend)
  setTimeout(() => {
    btnText.style.display  = '';
    btnLoad.style.display  = 'none';
    submitBtn.disabled     = false;

    success.style.display = 'flex';
    form.reset();

    setTimeout(() => {
      success.style.display = 'none';
    }, 6000);
  }, 1800);
}

function shakeForm(form) {
  form.style.animation = 'shake 0.5s ease';
  setTimeout(() => form.style.animation = '', 500);
}

// Inject shake keyframes dynamically
(function injectShakeAnimation() {
  if (document.querySelector('#shake-style')) return;
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-6px); }
      80%    { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════════
   9.  SMOOTH SCROLL for anchor links
   ══════════════════════════════════════════════ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 72;

      window.scrollTo({
        top: target.offsetTop - navH,
        behavior: 'smooth',
      });
    });
  });
})();

/* ══════════════════════════════════════════════
   10. PROFILE IMAGE – click to "upload" (cosmetic)
   ══════════════════════════════════════════════ */
(function initAvatarClick() {
  const placeholder = $('#avatar-placeholder');
  if (!placeholder) return;

  placeholder.style.cursor = 'pointer';
  placeholder.title = 'Replace the src of #profile-img with your photo path in index.html';

  placeholder.addEventListener('click', () => {
    alert(
      '📸 To add your profile photo:\n\n' +
      '1. Place your photo in the "assets/" folder.\n' +
      '2. Name it "profile.jpg" (or update the src in index.html).\n' +
      '3. Refresh the page!'
    );
  });
})();

/* ══════════════════════════════════════════════
   11. RESUME / PAPER DOWNLOAD – graceful fallback
   ══════════════════════════════════════════════ */
(function initDownloadFallback() {
  $$('a[download]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Check if the file likely exists (starts with 'assets/')
      if (href && href.startsWith('assets/')) {
        // Attempt a HEAD request to see if file exists
        fetch(href, { method: 'HEAD' })
          .then(res => {
            if (!res.ok) {
              e.preventDefault();
              const fileName = href.split('/').pop();
              alert(
                `📄 File not found: "${fileName}"\n\n` +
                `Please place your file at:\n${href}\n\n` +
                `Then refresh the page and try again.`
              );
            }
          })
          .catch(() => {
            // Network error or file server not running — just allow browser to handle
          });
      }
    });
  });
})();

/* ══════════════════════════════════════════════
   12. SKILL CHIP – Ripple effect on hover click
   ══════════════════════════════════════════════ */
(function initSkillRipple() {
  $$('.skill-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect   = chip.getBoundingClientRect();

      ripple.style.cssText = `
        position: absolute;
        width: 80px; height: 80px;
        border-radius: 50%;
        background: rgba(124,58,237,0.35);
        transform: scale(0);
        pointer-events: none;
        animation: rippleOut 0.55s ease forwards;
        left: ${e.clientX - rect.left - 40}px;
        top:  ${e.clientY - rect.top  - 40}px;
      `;

      chip.style.position = 'relative';
      chip.style.overflow  = 'hidden';
      chip.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple animation
  if (!$('#ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `
      @keyframes rippleOut {
        to { transform: scale(3); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* ══════════════════════════════════════════════
   13. PARTICLES / STAR FIELD in hero section
   ══════════════════════════════════════════════ */
(function initStarField() {
  const hero = $('#hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.45;
  `;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx  = canvas.getContext('2d');
  let W, H, stars;
  const STAR_COUNT = 120;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.4 + 0.3,
      vx:   (Math.random() - 0.5) * 0.12,
      vy:   (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.7 + 0.3,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${s.alpha})`;
      ctx.fill();

      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ══════════════════════════════════════════════
   14. SECTION PROGRESS – thin top bar
   ══════════════════════════════════════════════ */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg,#7c3aed,#06b6d4);
    z-index: 9999;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   15. INIT on DOM Ready
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Reveal hero elements immediately
  $$('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 150 + 200);
  });

  console.log(
    '%c Shreayash Bora Portfolio\n' +
    '%c Designed & Built with ❤️\n' +
    '%c Edit index.html to update placeholders!\n',
    'color:#7c3aed;font-size:18px;font-weight:900;',
    'color:#06b6d4;font-size:13px;',
    'color:#f59e0b;font-size:11px;'
  );
});
