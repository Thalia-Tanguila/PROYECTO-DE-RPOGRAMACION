// =========================
// BTS-inspired portfolio interactions
// =========================

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const visitsEl = document.getElementById('visitCount');
const dateEl = document.getElementById('date');
const typedName = document.getElementById('typed-name');

function initTheme() {
  const saved = localStorage.getItem('bts-theme') || 'dark';
  body.classList.toggle('theme-dark', saved === 'dark');
  if (themeToggle) {
    themeToggle.innerHTML = saved === 'dark'
      ? '<i class="fa-solid fa-sun"></i> Modo claro'
      : '<i class="fa-solid fa-moon"></i> Modo oscuro';
  }
}

function toggleTheme() {
  const dark = body.classList.toggle('theme-dark');
  localStorage.setItem('bts-theme', dark ? 'dark' : 'light');
  themeToggle.innerHTML = dark
    ? '<i class="fa-solid fa-sun"></i> Modo claro'
    : '<i class="fa-solid fa-moon"></i> Modo oscuro';
}

function updateDate() {
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('es-EC', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}

function initVisits() {
  if (!visitsEl) return;
  const visits = Number(localStorage.getItem('portfolio-visits') || 0) + 1;
  localStorage.setItem('portfolio-visits', String(visits));
  visitsEl.textContent = `${visits} visitas`;
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

function initTypingEffect() {
  if (!typedName) return;
  const text = 'Thalia Tanguila';
  let index = 0;
  const type = () => {
    typedName.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      setTimeout(type, 90);
    }
  };
  type();
}

function handleScroll() {
  const scrollTop = window.scrollY;
  backToTop?.classList.toggle('show', scrollTop > 280);
}

function backToTopHandler() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createBackgroundEffects() {
  const layers = ['particle', 'spark', 'heart'];
  const count = window.innerWidth < 700 ? 30 : 70;
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('span');
    el.className = layers[i % layers.length];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 18 + 10;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (el.classList.contains('particle')) {
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.animationDelay = `${Math.random() * 8}s`;
    } else if (el.classList.contains('spark')) {
      el.style.transform = `scale(${Math.random() * 0.8 + 0.6})`;
      el.style.animationDelay = `${Math.random() * 2}s`;
    } else {
      el.textContent = '♡';
      el.style.fontSize = `${Math.random() * 10 + 16}px`;
      el.style.animationDelay = `${Math.random() * 4}s`;
    }
    document.body.appendChild(el);
  }
}

function addCursor() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  window.addEventListener('mousemove', (event) => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    ring.style.left = `${event.clientX}px`;
    ring.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('a, button, .unit-card, .work-card').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateDate();
  initVisits();
  initReveal();
  initTypingEffect();
  createBackgroundEffects();
  addCursor();
});

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (backToTop) backToTop.addEventListener('click', backToTopHandler);
