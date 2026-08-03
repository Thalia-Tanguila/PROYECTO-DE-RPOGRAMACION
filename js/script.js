const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const backToTop = document.getElementById('backToTop');
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.topic-card');

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('theme-dark');
    if (themeToggle) themeToggle.textContent = '☀️ Modo claro';
  } else {
    body.classList.remove('theme-dark');
    if (themeToggle) themeToggle.textContent = '🌙 Modo oscuro';
  }
}

function toggleTheme() {
  body.classList.toggle('theme-dark');
  const isDark = body.classList.contains('theme-dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo oscuro';
}

function updateClock() {
  const now = new Date();
  if (clockEl) clockEl.textContent = now.toLocaleTimeString('es-EC');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('es-EC', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
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

function openModal(content) {
  modalBody.innerHTML = content;
  modal.classList.remove('hidden');
}

function closeModalHandler() {
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
}

function attachCardActions() {
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.topic-card');
      const topic = card?.dataset.topic || 'Trabajo';
      openModal(`
        <h2>${topic}</h2>
        <p>Este espacio muestra el trabajo completo, recursos visuales y explicación detallada del tema seleccionado.</p>
        <div class="form-group">
          <label>Resumen</label>
          <textarea rows="4">Se ha preparado una presentación clara y organizada para este tema.</textarea>
        </div>
        <div class="form-group">
          <label>Adjuntar archivo</label>
          <input type="file" />
        </div>
        <div class="form-group">
          <button class="btn primary">Descargar archivos</button>
        </div>
      `);
    });
  });

  document.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.topic-card');
      const list = card?.querySelector('.custom-content-list');
      const item = document.createElement('div');
      item.className = 'note';
      item.textContent = `Nuevo contenido agregado para ${card?.dataset.topic || 'este tema'}`;
      list?.appendChild(item);
      openModal(`
        <h2>Contenido agregado</h2>
        <p>Se agregó un nuevo recurso a este tema.</p>
        <div class="form-group">
          <label>Nombre del archivo</label>
          <input type="text" value="nuevo-recurso" />
        </div>
      `);
    });
  });
}

function filterTopics() {
  const query = searchInput?.value.toLowerCase() || '';
  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? 'flex' : 'none';
  });
}

function setupParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 18)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));
  };
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(125, 201, 255, 0.8)';
      ctx.fill();
    });
    requestAnimationFrame(render);
  };
  resize();
  render();
  window.addEventListener('resize', resize);
}

function handleScroll() {
  if (window.scrollY > 300) backToTop?.classList.add('show');
  else backToTop?.classList.remove('show');
}

function backToTopHandler() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (closeModal) closeModal.addEventListener('click', closeModalHandler);
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModalHandler(); });
if (backToTop) backToTop.addEventListener('click', backToTopHandler);
if (searchInput) searchInput.addEventListener('input', filterTopics);
window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateClock();
  renderStars();
  attachCardActions();
  setupParticles();
  setInterval(updateClock, 1000);
});
