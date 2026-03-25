/**
 * LIRA — Shared Navigation & Interactions
 */

// ── Nav scroll effect ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger ──
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');

toggle?.addEventListener('click', () => {
  const isOpen = toggle.classList.toggle('open');
  menu?.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
menu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle?.classList.remove('open');
    menu?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Active nav link ──
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// ── Fade-in on scroll ──
const fadeEls = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => io.observe(el));

// ── Waveform bars (dynamic) ──
document.querySelectorAll('.waveform').forEach(wf => {
  const count = parseInt(wf.dataset.bars || '12');
  for (let i = 0; i < count; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform__bar';
    const h = 10 + Math.random() * 30;
    bar.style.cssText = `height:${h}px; --dur:${0.4 + Math.random() * 0.6}s; animation-delay:${Math.random() * 0.5}s;`;
    wf.appendChild(bar);
  }
});

// ── Lira typing effect (optional hero element) ──
function typeWriter(el, text, speed = 40) {
  let i = 0;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.style.cssText = 'border-right:2px solid currentColor;margin-left:2px;animation:blink 1s step-end infinite;';
  el.appendChild(cursor);
  const interval = setInterval(() => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
    } else {
      clearInterval(interval);
      setTimeout(() => cursor.remove(), 2000);
    }
  }, speed);
}

const typerEl = document.querySelector('[data-typewriter]');
if (typerEl) {
  const text = typerEl.dataset.typewriter;
  setTimeout(() => typeWriter(typerEl, text, 35), 800);
}

// ── Nav scrolled style ──
const style = document.createElement('style');
style.textContent = `.nav.scrolled { background: rgba(10,12,20,0.97); box-shadow: 0 1px 30px rgba(0,0,0,0.4); }`;
document.head.appendChild(style);

// ── Cursor glow (hero only) ──
const heroEl = document.querySelector('.hero');
if (heroEl) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:0;
    width:400px; height:400px; border-radius:50%;
    background: radial-gradient(circle, rgba(74,158,255,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: left 0.15s ease, top 0.15s ease;
    left:-9999px; top:-9999px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ── Hero parallax on mouse move ──
const heroGrid = document.querySelector('.hero__grid');
const heroRadial = document.querySelector('.hero__radial');
if (heroGrid && heroRadial) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    heroGrid.style.transform   = `translate(${x * 0.5}px, ${y * 0.5}px)`;
    heroRadial.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  });
}

// ── Magnetic hover on hero index items ──
document.querySelectorAll('.hero__index-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.15;
    const dy = (e.clientY - cy) * 0.15;
    item.style.transform = `translateY(-4px) translate(${dx}px, ${dy}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ── Stagger fade-in with delay multiplier ──
const staggerEls = document.querySelectorAll('.card-grid .fade-in');
staggerEls.forEach((el, i) => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 120);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(el);
});
