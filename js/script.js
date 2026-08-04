const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const visitCountEl = document.getElementById('visitCount');
const dateEl = document.getElementById('date');
const typedName = document.getElementById('typed-name');

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  body.classList.toggle('theme-dark', isDark);
  if (themeToggle) {
    themeToggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i> Modo claro'
      : '<i class="fa-solid fa-moon"></i> Modo oscuro';
  }
}

function toggleTheme() {
  const isDark = body.classList.toggle('theme-dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i> Modo claro'
    : '<i class="fa-solid fa-moon"></i> Modo oscuro';
}

function renderStars() {
  document.querySelectorAll('.stars').forEach((container) => {
    const unit = Number(container.dataset.unit);
    const saved = Number(localStorage.getItem(`rating-${unit}`) || 0);
    container.innerHTML = '';
    for (let i = 1; i <= 5; i += 1) {
      const btn = document.createElement('button');
      btn.className = `star-btn ${i <= saved ? '' : 'empty'}`;
      btn.textContent = '★';
      btn.setAttribute('aria-label', `Calificar unidad ${unit} con ${i} estrellas`);
      btn.addEventListener('click', () => {
        localStorage.setItem(`rating-${unit}`, String(i));
        renderStars();
      });
      container.appendChild(btn);
    }
  });
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

function toggleActionButtons() {
  document.querySelectorAll('.action-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').trim();
    const shouldHide = !href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:void(0);';
    if (shouldHide) {
      link.classList.add('is-hidden');
    }
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.16 });

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

function initVisits() {
  if (!visitCountEl) return;
  const visits = Number(localStorage.getItem('portfolio-visits') || 0) + 1;
  localStorage.setItem('portfolio-visits', String(visits));
  visitCountEl.textContent = `${visits} visitas`;
}

function handleScroll() {
  const scrollTop = window.scrollY;
  if (scrollTop > 300) backToTop?.classList.add('show');
  else backToTop?.classList.remove('show');
  document.querySelector('.topbar')?.classList.toggle('scrolled', scrollTop > 20);
}

function backToTopHandler() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (backToTop) backToTop.addEventListener('click', backToTopHandler);
window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderStars();
  updateDate();
  toggleActionButtons();
  initReveal();
  initTypingEffect();
  initVisits();
});
