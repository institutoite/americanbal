// Utilidades de selección
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const searchInput = $('#search');
const catButtons = $$('.cat-btn');
let cards = $$('.tip-card');
const darkToggle = $('#darkModeToggle');
const scrollTopBtn = $('#scrollTop');
const exportPdfBtn = $('#exportPdfBtn');
const modeButtons = $$('.mode-btn');
const accordionItems = $$('.accordion-item');
const compareRows = $$('[data-section="table"] tbody tr');

let activeQuality = 'todos';

function filterCards() {
  const term = searchInput.value.trim().toLowerCase();
  // Filtrar tarjetas (vista cards)
  cards.forEach(card => {
    const qualities = (card.dataset.quality || '').toLowerCase().split(/\s+/).filter(Boolean);
    const text = card.textContent.toLowerCase();
    const matchesQuality = activeQuality === 'todos' || qualities.includes(activeQuality.toLowerCase());
    const matchesText = !term || text.includes(term);
    card.style.display = matchesQuality && matchesText ? '' : 'none';
  });
  // Filtrar acordeón
  accordionItems.forEach(item => {
    const qualities = (item.dataset.quality || '').toLowerCase().split(/\s+/).filter(Boolean);
    const text = item.textContent.toLowerCase();
    const matchesQuality = activeQuality === 'todos' || qualities.includes(activeQuality.toLowerCase());
    const matchesText = !term || text.includes(term);
    item.style.display = matchesQuality && matchesText ? '' : 'none';
  });
  // Filtrar tabla
  compareRows.forEach(row => {
    const qualities = (row.dataset.quality || '').toLowerCase().split(/\s+/).filter(Boolean);
    const text = row.textContent.toLowerCase();
    const matchesQuality = activeQuality === 'todos' || qualities.includes(activeQuality.toLowerCase());
    const matchesText = !term || text.includes(term);
    row.style.display = matchesQuality && matchesText ? '' : 'none';
  });
}

function setActiveQuality(q) {
  activeQuality = q;
  catButtons.forEach(btn => {
    const isActive = btn.dataset.quality === q;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  filterCards();
}

// Cambiar modo de vista
function setViewMode(mode) {
  document.body.classList.remove('mode-cards','mode-accordion','mode-table');
  document.body.classList.add(`mode-${mode}`);
  modeButtons.forEach(btn => {
    const isActive = btn.dataset.view === mode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

// Acordeón interacción
function initAccordion() {
  accordionItems.forEach(item => {
    const summary = item.querySelector('.accordion-summary');
    if (!summary) return;
    summary.setAttribute('aria-expanded', 'false');
    summary.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // Cerrar otros para comportamiento tipo acordeón
      accordionItems.forEach(i => {
        i.classList.remove('open');
        const s = i.querySelector('.accordion-summary');
        if (s) s.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        summary.setAttribute('aria-expanded', 'true');
      } else {
        summary.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Modo oscuro manual
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  localStorage.setItem('tips.dark', isDark ? '1' : '0');
}

function initDarkMode() {
  const stored = localStorage.getItem('tips.dark');
  if (stored === '1') {
    document.body.classList.add('dark-mode');
    darkToggle.setAttribute('aria-pressed', 'true');
  }
}

// Scroll top
function handleScrollTopVisibility() {
  if (window.scrollY > 280) {
    scrollTopBtn.classList.add('fixed');
  } else {
    scrollTopBtn.classList.remove('fixed');
  }
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Exportar a PDF usando impresión del navegador
function exportPDF() {
  // Opcional: asegurar vista 'cards' para mejor maquetado
  setViewMode('cards');
  // Cerrar acordeón abierto para evitar cortes
  accordionItems.forEach(i => i.classList.remove('open'));
  window.print();
}

// Eventos
searchInput.addEventListener('input', filterCards);
catButtons.forEach(btn => btn.addEventListener('click', () => setActiveQuality(btn.dataset.quality)));
modeButtons.forEach(btn => btn.addEventListener('click', () => setViewMode(btn.dataset.view)));
darkToggle.addEventListener('click', toggleDarkMode);
scrollTopBtn.addEventListener('click', scrollToTop);
window.addEventListener('scroll', handleScrollTopVisibility);
exportPdfBtn && exportPdfBtn.addEventListener('click', exportPDF);

// Inicialización
initDarkMode();
// Recolectar nuevamente por si se crean dinámicamente en el futuro
cards = $$('.tip-card');
initAccordion();
setViewMode('cards');
filterCards();
handleScrollTopVisibility();

// Accesibilidad: permitir limpiar búsqueda con Escape
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape' && searchInput.value) {
    searchInput.value = '';
    filterCards();
  }
});
